<?php
require_once("../utils.php");
require_once(DIR_DAO."Books.php");
// 添加一本数到数据表 book中
function main(){ 
    // 参数读取
    try{
        $isbn = Utils::getParamWithFilter("isbn","digit");
        $b = new Books(); 
        if (!$b->isISBNExists($isbn)){        
            $book_info = Utils::getBookInfoByISBN($isbn); 
            $b->addBook($book_info);
        }
        $data = $b->getBookInfo($isbn);
        Utils::exit(0,$data);
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>