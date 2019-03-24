<?php
// 约定：所有数据都经过过滤后，才会进去dao层
/****** 接口 ******* 
 * 
 */
require_once(DIR_DAO."Base.php");
Class Books extends Base{
    private $m_conn;            //数据库连接对象 
    //(*)构造函数会自动连接数据库
    public function __construct(){
        $this->m_conn = self::getInstance();
    }

    // (*) 添加一本书
    public function addBook($book_info){
        $isbn = $book_info["isbn"];
        $title = $book_info["title"];
        $author = $book_info["author"];
        $publisher = $book_info["publisher"];
        if (!$this->isISBNExists($isbn)){
            return $this->createSQLAndRun("INSERT INTO book (isbn, title,subtitle, author,publisher,summary,pubdate,other) 
                                            VALUES ('%s','%s','%s','%s','%s','%s' ,'%s' , '%s')",
                                            $book_info["isbn"],
                                            $book_info["title"],
                                            $book_info["subtitle"],
                                            $book_info["author"],
                                            $book_info["publisher"],
                                            $book_info["summary"],
                                            $book_info["pubdate"],
                                            json_encode($book_info["other"])
                                        );
        }else
            throw new Exception("ISBN $isbn 已经存在库中了");
    }

    // (*) 一本书是否存在
    public function isISBNExists($isbn){ 
        $ret= $this->createSQLAndRun("select count(*) from book where isbn = '%s'",$isbn); 
        return $ret[0][0]>0;
    } 

    //(*) 获取一本书的信息
    public function getBookInfo($isbn){
        $ret = $this->createSQLAndRunAssoc("select * from book where isbn = '%s'",$isbn);
        if (count($ret)>0 && count($ret[0])>0 )
            return $ret[0];
        else
            throw new Exception("找不到 ISBN $isbn 对应的图书!"); 
    }

    
    //(*) 读取
    public function getBookID($isbn){
        $ret = $this->createSQLAndRun("select id from book where isbn = '%s'",$isbn);
        if (count($ret)>0 && count($ret[0])>0 )
            return $ret[0][0];
        else
            throw new Exception("找不到 ISBN $isbn 对应的图书!"); 
    }

    // (*) 获取库存
    public function getStock($isbn){
        $ret = $this->createSQLAndRun("select stock from book where isbn = '%s'",$isbn);
        if (count($ret)) 
            return intval($ret[0][0]);
        else 
            return 0;
    }


    // (*) 添加一本书到库中
    public function incStock($isbn){
        $cur_stock = $this->getStock($isbn);
        $cur_stock ++;
        $this->setStock($isbn,$cur_stock);
        return 0;
    }

    // 设置库存值
    public function setStock($isbn,$stock){
        $ret = $this->createSQLAndRun(
            "update book set stock = %d where isbn = '%s'",
            $stock,
            $isbn);
        if ($ret!=true) 
            throw new Exception("update 未知错误");
    }
    //(*) 捐书,提交成功返回true,失败返回false
    public function donateBook($sid,
                                $book_id,
                                $how_to_fetch,
                                $donator_word,
                                $status=0){
        $ret = $this->createSQLAndRun(" INSERT INTO book_donate(sid, book_id,donator_word, how_to_fetch,status) VALUES ('%s','%s','%s','%s','%s')",
                                        $sid,
                                        $book_id,
                                        $donator_word,
                                        $how_to_fetch,
                                        $status
                                        );
        return true; 
    }

    // (*) 捐书审核
    public function reviewDonation($book_donate_id, $status){
        // 状态值判断
        if ($status<-1 || $status>1){
            throw new Exception ("status 取值范围{-1,0,1}，分别表示不通过、等待审核、审核通过");
        }
        // 更新status值
        $ret = $this->createSQLAndRun(
            "update book_donate set status = %d where id = %d",
            $status,
            $book_donate_id);
            
        if ($ret ==0) throw new Exception("未知失败!");

        // 如果审核通过，则获取ISBN，加库存
        if ($status == 1){
            $isbn = $this->createSQLAndRun(
                "select book.isbn from book,book_donate where book_donate.id =%d and book.id = book_donate.book_id",
                $book_donate_id)[0][0];
            $this->incStock($isbn);
        } 
        return ;
    }

    // (*) 获取用户捐书列表
    public function getDonationListBySID($sid){
        $data = $this->createSQLAndRunAssoc(
            "SELECT book_donate.*,book.title,book.isbn,book.author,book.publisher FROM book_donate,book WHERE SID = '%s' and book.id = book_donate.book_id",
            $sid);
        $list_accepted = array();
        $list_failed   = array();
        $list_waiting  = array(); 
        foreach($data as $val){ 
            if ($val["status"]==0)  $list_waiting[] = $val;
            if ($val["status"]==-1) $list_failed[] = $val;
            if ($val["status"]==1)  $list_accepted[] = $val;
        }  
        return array("审核通过"=> $list_accepted,
                     "审核失败" => $list_failed,
                     "等待审核" => $list_waiting);
    }

    // 查看被借了多少书
    public function getLended($isbn){
        $ret = $this->createSQLAndRun("select lended from book where isbn = '%s'",$isbn);
        if (count($ret)) 
            return intval($ret[0][0]);
        else 
            return 0;
    }
    // 设置被借了多少书
    public function setLended($isbn,$lended){
        $ret = $this->createSQLAndRun(
            "update book set lended = %d where isbn = '%s'",
            $lended,
            $isbn);
        if ($ret!=true)
            throw new Exception("update 未知错误");
    }

    //通过ISBN获取图书ID
    public function getBookValueByISBN($isbn,$column){
        $ret = $this->createSQLAndRun("select $column from book where isbn='%s'",$isbn);
        if (count($ret)==0)
            throw new Exception("GetBookValueByISBN isbn=$isbn column= $column");
        return $ret[0][0];
    }

    //(*) 借书
    public function borrowBook($sid,$isbn){
        // 获取库存
        $cur_stock = $this->getStock($isbn);

        // 获取被借了多少书
        $lended = $this->getLended($isbn);
        if ($cur_stock<=$lended) 
            throw new Exception("库存不足!库存:$cur_stock,被借出: $lended");
        $book_id = $this->getBookID($isbn); 

        // 添加一条借书记录
        $this->createSQLAndRun(
            "INSERT INTO book_borrow(sid, book_id) VALUES ('%s',%d)",
            $sid,
            $book_id
        );
        // 借出一本书
        $this->setLended($isbn,$lended+1);
        return ;
    }

    // (*) 获取用户借书列表
    public function getBorrowListBySID($sid){
        $data = $this->createSQLAndRunAssoc(
            "SELECT book_borrow.*,book.title,book.isbn,book.author,book.publisher FROM book_borrow,book 
                WHERE SID = '%s' and book.id = book_borrow.book_id",
            $sid);
        $not_return = array();
        $returned   = array();
        foreach ($data as $item){
            if ($item["return_time"]=="0000-00-00 00:00:00")
                $not_return[] = $item;
            else
                $returned[] =$item;
        }
        return array(
            "已还书列表" => $returned,
            "未还书列表" => $not_return
        );
    }

    // (*) 还一本书
    public function returnBook($sid, $isbn){
        $book_id = $this->getBookID($isbn);
        $ret = $this-> createSQLAndRun(
            "update book_borrow set return_time = NOW() 
                where sid='%s' and return_time=0 and book_id =%d limit 1",
                $sid,
                $book_id
        );
        if ($this->lastAffectedRows() ==0){
            throw new Exception("未借书，无法还书");
        }
        return ;
    }
};  
?>
