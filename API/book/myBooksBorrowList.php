<?php
require_once("../utils.php");
require_once(DIR_DAO."Books.php");
// 捐赠一本书 (如果书不在数据库中，则从豆瓣抓数据放入数据库)
// 
function main(){ 
    // 参数读取
    try{
        \StuSess\isLoginOrThrowException(); 
        $b = new Books(); 
        $sid = \StuSess\getKey("sid");
        $data = $b->getBorrowListBySID($sid);
        Utils::exit(0,$data);
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>