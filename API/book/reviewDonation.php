<?php
require_once("../utils.php");
require_once(DIR_DAO."Books.php");

// 图书审核
function main(){ 
    // 参数读取
    try{
        \StuSess\isLoginOrThrowException(); // 改为管理员审核 
        $book_donate_id = Utils::getParamWithFilter("book_donate_id","digit");
        $status = Utils::getParamWithFilter("status","digit");
        $b = new Books(); 
        $b -> reviewDonation($book_donate_id,$status);
        Utils::exit(0,"捐书状态设置成功!");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>