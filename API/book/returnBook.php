<?php
require_once("../utils.php");
require_once(DIR_DAO."Books.php");
require_once(DIR_DAO."Site.php");
// 捐赠一本书 (如果书不在数据库中，则从豆瓣抓数据放入数据库)
// 
function main(){ 
    Utils::exit(-2,"当前接口不用，请用returnBookWithImage.php接口");
    // 参数读取
    try{
        \StuSess\isLoginOrThrowException(); 
        $isbn = Utils::getParamWithFilter("isbn","digit");
        $site_id = Utils::getParamWithFilter("site_id","digit");
        $sid = \StuSess\getKey("sid"); 
        $b =new Books();
        $s = new Site();
        $book_id= $b->getBookID($isbn);
        $s->incStock($site_id,$book_id);
        $b->returnBook($sid,$isbn);
        Utils::exit(0,"还书成功");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>