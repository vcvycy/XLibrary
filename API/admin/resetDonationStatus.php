<?php
require_once("../utils.php");
require_once(DIR_DAO."Books.php");

// 图书审核
function main(){ 
    // 参数读取
    try{
        \AdminSess\isLoginOrThrowException(); // 改为管理员审核 
        $book_donate_id = Utils::getParamWithFilter("book_donate_id","digit"); 
        $b = new Books(); 
        $b -> resetDonationStatus($book_donate_id);
        Utils::exit(0,"重置状态成功，当前状态为:待审核");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>