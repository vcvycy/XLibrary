<?php
require_once("../utils.php");
require_once(DIR_DAO."Books.php");
// 捐赠一本书 (如果书不在数据库中，则从豆瓣抓数据放入数据库)
// 
function main(){ 
    // 参数读取
    try{
        \StuSess\isLoginOrThrowException(); 
        $isbn = Utils::getParamWithFilter("isbn","digit");
        $donator_word = Utils::getParamWithFilter("donator_word");
        $how_to_fetch = Utils::getParamWithFilter("how_to_fetch");
        $b = new Books(); 
        // 如果书不在数据库中，取豆瓣爬
        if (!$b->isISBNExists($isbn)){ 
            $book_info = Utils::getBookInfoByISBN($isbn); 
            $b->addBook($book_info);
        }
        $sid = \StuSess\getKey("sid");
        //$book_id = $b->getBookID($isbn); 
        // 添加入数据库中
        if ($b->donateBook($sid,$isbn,$how_to_fetch,$donator_word))
            Utils::exit(0,"信息提交成功，请等待管理员审核~");
        else
            Utils::exit(-1,"提交失败，请检查参数，或联系管理员~");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>