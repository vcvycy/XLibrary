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
    public function addBook($douban_json){
        $isbn = $douban_json["isbn13"];
        $title = $douban_json["title"];
        $author = json_encode($douban_json["author"]);
        $publisher = $douban_json["publisher"];
        if (!$this->isISBNExists($isbn)){
            return $this->createSQLAndRun("INSERT INTO book (isbn, title, author,publisher,douban_json) 
                                            VALUES ('%s','%s','%s' ,'%s' , '%s')",
                                            $isbn,
                                            $title,
                                            $author,
                                            $publisher,
                                            json_encode($douban_json));
        }else
            throw new Exception("ISBN $isbn 已经存在库中了");
    }

    // (*) 一本书是否存在
    public function isISBNExists($isbn){ 
        $ret= $this->createSQLAndRun("select count(*) from book where isbn = '%s'",$isbn); 
        return $ret[0][0]>0;
    } 

    //(*) 获取一本书的信息
    public function getDoubanJSON($isbn){
        $ret = $this->createSQLAndRun("select douban_json from book where isbn = '%s'",$isbn);
        if (count($ret)>0 && count($ret[0])>0 )
            return json_decode($ret[0][0],true);
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
};  
?>
