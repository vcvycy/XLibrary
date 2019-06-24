<?php
require_once("../utils.php"); 
require_once(DIR_DAO."Books.php");
// 获取捐书列表
// 
function main(){ 
    // 参数读取
    try{
        \AdminSess\isLoginOrThrowException(); 
        $b = new Books(); 
        $data = $b->getDonationList();  
        Utils::exit(0,$data);
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>