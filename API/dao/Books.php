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
};  
?>
