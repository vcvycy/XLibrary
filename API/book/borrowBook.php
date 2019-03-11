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
        $sid = \StuSess\getKey("sid"); 
        $b =new Books();
        $b->borrowBook($sid,$isbn);
        Utils::exit(0,"借书成功");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>