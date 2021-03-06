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
        if (!$this->isISBNExists($isbn)){
            return $this->createSQLAndRun("INSERT INTO book (isbn, title,subtitle, author,publisher,summary,pubdate,picture,other) 
                                            VALUES ('%s','%s','%s','%s','%s','%s' ,'%s' ,'%s', '%s')",
                                            $book_info["isbn"],
                                            $book_info["title"],
                                            $book_info["subtitle"],
                                            $book_info["author"],
                                            $book_info["publisher"],
                                            $book_info["summary"],
                                            $book_info["pubdate"],
                                            $book_info["picture"],
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

    //(*) 获取一本书的信息。
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

    // (*) 减去一本书的库存
    public function decStock($isbn){ 
        $cur_stock = $this->getStock($isbn);
        $cur_stock --;
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
                                $isbn,
                                $how_to_fetch,
                                $donator_word,
                                $status=0){
        $ret = $this->createSQLAndRun(" INSERT INTO book_donate(sid, isbn,donator_word, how_to_fetch,status) VALUES ('%s','%s','%s','%s','%s')",
                                        $sid,
                                        $isbn,
                                        $donator_word,
                                        $how_to_fetch,
                                        $status
                                        );
        return true; 
    }

    // (*) 获取用户捐书列表
    public function getDonationListBySID($sid){
        $data = $this->createSQLAndRunAssoc(
            "SELECT book_donate.*,book.* FROM book_donate,book WHERE SID = '%s' and book.isbn = book_donate.isbn",
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
    // 获取捐书列表
    public function getDonationList(){
        // 审核成功。则添加一个入库地点
        $arr_succ = $this->createSQLAndRunAssoc(
            "SELECT site.name as site_name,book_donate.*,book.title,book.author,book.publisher, book.pubdate ,stu.name,stu.phone,stu.wechat_name
                FROM stu, book_donate,book,site
                WHERE book_donate.sid =stu.sid and book.isbn = book_donate.isbn and book_donate.site_id=site.id and book_donate.status=1"
        );
        // 审核失败+待审核
        $arr_other = $this->createSQLAndRunAssoc(
            "SELECT  book_donate.*,book.title,book.author,book.publisher, book.pubdate ,stu.name,stu.phone,stu.wechat_name
                FROM stu, book_donate,book
                WHERE book_donate.sid =stu.sid and book.isbn = book_donate.isbn and book_donate.status!=1"
        );
        return array_merge($arr_other,$arr_succ);
    }
    // 查看被借了多少书
    public function getLended($isbn){
        $ret = $this->createSQLAndRun("select lended from book where isbn = '%s'",$isbn);
        if (count($ret)) 
            return intval($ret[0][0]);
        else 
            throw new Exception("getLended : 找不到isbn$isbn");
    }
    // 设置被借了多少书
    public function setLended($isbn,$lended){
        $ret = $this->createSQLAndRun(
            "update book set lended = %d where isbn = '%s'",
            $lended,
            $isbn);
            if ($this->lastAffectedRows() !=1 )
            throw new Exception("无法设置被借书数量lended isbn: $isbn, $lended");
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

        // 添加一条借书记录
        $this->createSQLAndRun(
            "INSERT INTO book_borrow(sid, isbn) VALUES ('%s','%s')",
            $sid,
            $isbn
        );
        // 借出的书数量更新
        $this->setLended($isbn,$lended+1);
        return ;
    }

    // (*) 获取用户借书列表
    public function getBorrowListBySID($sid){
        $data = $this->createSQLAndRunAssoc(
            "SELECT book_borrow.id as borrow_id,book.*,book_borrow.* FROM book_borrow,book 
                WHERE book_borrow.sid = '%s' and book.isbn = book_borrow.isbn",
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
            "returned" => $returned,
            "not_returned" => $not_return
        );
    }
    // 借了一本书且没还书，不存在则返回异常
    public function getBorrowIDNotReturn($sid,$isbn){
        $ret=$this->createSQLAndRun("select id from book_borrow 
            where sid='%s' and return_time=0 and isbn ='%s' limit 1",
           $sid,
           $isbn
        ); 
        if (count($ret)==1) return intval($ret[0][0]);
        else
          throw new Exception("当前并未借阅ISBN[$isbn]这本书");
    }
    // (*) 还一本书
    public function returnBook($sid, $isbn,$path){  
        $ret = $this-> createSQLAndRun(
            "update book_borrow set return_time = NOW(), return_image_path = '%s'
                where sid='%s' and return_time=0 and isbn ='%s'  limit 1",
                $path,
                $sid,
                $isbn
        ); 
        if ($this->lastAffectedRows() !=1){
            throw new Exception("未借书，无法还书");
        }else{
            // 被借出的书数量更新
            $lended = $this->getLended($isbn);
            $this->setLended($isbn,$lended-1);
        }
        return ;
    } 
    
    // 通过book_donate_id获取 book.id
    function getBookIDByDonateID($donate_id){
        $ret= $this->createSQLAndRun(
           "select book.id from book,book_donate where book_donate.isbn=book.isbn and book_donate.id=%d",
           $donate_id
        ); 
        return intval($ret[0][0]);
    }
    // 管理员接口
    
    public function getDonationStatus($book_donate_id){ 
        $status_old = $this->createSQLAndRun(
            "select status from book_donate where id = %d",$book_donate_id
        );
        if (count($status_old)>0)
            $status_old= $status_old[0][0];
        else
            throw new Exception("book donate id $book_donate_id 不存在");
        return intval($status_old);
    }
    // (*) 捐书审核
    public function reviewDonation($book_donate_id, $status,$site_id=0){
        // 状态值判断
        if ($status<-1 || $status>1){
            throw new Exception ("status 取值范围{-1,0,1}，分别表示不通过、等待审核、审核通过");
        } 
        $status_old = $this->getDonationStatus($book_donate_id);
        if ($status_old!=0)
            throw new Exception("之前审核过了(状态$status_old)，请勿重新提交!");

        // 更新status值和入库仓库ID
        $ret = $this->createSQLAndRun(
            "update book_donate set status = %d ,site_id=%d where id = %d",
            $status,
            $site_id,
            $book_donate_id);
            
        if ($ret ==0) throw new Exception("未知失败!");

        // 如果审核通过，则获取ISBN，加库存
        if ($status == 1){
            $isbn = $this->createSQLAndRun(
                "select book_donate.isbn from book_donate where book_donate.id =%d",
                $book_donate_id)[0][0];
            $this->incStock($isbn);
        } 
        return ;
    }
    // 
    public function getDonationSiteIDAndBookID($book_donate_id){
        $ret=$this->createSQLAndRunAssoc("SELECT book_donate.site_id as site_id,book.id as book_id
                         FROM book,book_donate WHERE book_donate.id=%d and book.isbn=book_donate.isbn",
                         $book_donate_id);
        if (count($ret)==0) throw new Exception("getDonationSiteID 失败");
        return $ret[0];
    }
    // (*) 捐书审核状态重置
    public function resetDonationStatus($book_donate_id){
        // 状态值判断
        // 原来的status  
        $status_old = $this->getDonationStatus($book_donate_id);
        if ($status_old==0){
            throw new Exception ("已经是待审核状态，无法重置");
        } 
        // 重置status值
        $ret = $this->createSQLAndRun(
            "update book_donate set status = '0' where id = %d", 
            $book_donate_id);
            
        if ($ret ==0) throw new Exception("未知失败!");

        // 若原来为审核通过，则减去一个库存
        if ($status_old == 1){
            $isbn = $this->createSQLAndRun(
                "select book_donate.isbn from book_donate where book_donate.id =%d",
                $book_donate_id)[0][0];
            $this->decStock($isbn);
        } 
        return ;
    }
    // 读取馆中图书
    public function getBooksListInLibrary(){
        $ret = $this->createSQLAndRunAssoc("select * from book");
        return $ret;
    } 
    // 读取馆中图书
    public function getBooksListInLibraryAtPage($page_id,$books_each_page){
        // 有几种图书
        $total = $this->createSQLAndRun("select count(*) from book where stock>0")[0][0];
        // 有多少本图书
        $data = $this->createSQLAndRun("select sum(stock),sum(lended) from book");
        $stocks_sum = $data[0][0];
        $lended_sum = $data[0][1];
        $pages = ceil($total/$books_each_page);
        $start_idx = ($page_id-1)*$books_each_page;
        $ret = $this->createSQLAndRunAssoc("select * from book where stock>0 limit %s,%s",$start_idx,$books_each_page);
        return array(
            "cur_page" =>$page_id,
            "books_each_page" => $books_each_page,
            "total_pages" =>$pages,
            "total_books" => $total,
            "stocks_sum" => $stocks_sum,
            "lended_sum" => $lended_sum,
            "books" =>$ret
        );
    }
    // 查看某本书被谁借走了(名字/学号/借书时间)
    public function whoBorrowTheBook($isbn){
        $ret = $this->createSQLAndRunAssoc(
            "SELECT book_borrow.id as book_borrow_id,stu.name,stu.sid,stu.phone,stu.wechat_name,book_borrow.borrow_time FROM stu,book_borrow 
              WHERE stu.sid = book_borrow.sid 
                   and book_borrow.isbn='%s'
                   and book_borrow.return_time =0",$isbn
        );
        return $ret;
    }
    // 查看某本书谁捐的
    public function whoDonateTheBook($isbn){
        $ret = $this->createSQLAndRunAssoc(
            "SELECT stu.name,
                    stu.sid,
                    book_donate.time as 'donate_time',
                    book_donate.donator_word as '捐书留言',
                    site.name as 'site_name' from stu,book_donate,site
                    where book_donate.isbn='%s' and book_donate.status=1 
                        and book_donate.sid=stu.sid and site.id=book_donate.site_id",
            $isbn
        );
        return $ret;
    }
};  
?>
