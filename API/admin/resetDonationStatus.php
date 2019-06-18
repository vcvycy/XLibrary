<?php
require_once("../utils.php");
require_once(DIR_DAO."Books.php");
require_once(DIR_DAO."Site.php");

// 图书审核
function main(){ 
    // 参数读取
    try{
        \AdminSess\isLoginOrThrowException(); // 改为管理员审核 
        $book_donate_id = Utils::getParamWithFilter("book_donate_id","digit"); 
        $b = new Books(); 
        $old_status= $b->getDonationStatus($book_donate_id);
        if ($old_status==1){
            $data= $b->getDonationSiteIDAndBookID($book_donate_id); 
            $s=new Site();
            $s->decStock($data["site_id"],$data["book_id"]);
        }
        $b -> resetDonationStatus($book_donate_id);
        Utils::exit(0,"重置状态成功，当前状态为:待审核");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>