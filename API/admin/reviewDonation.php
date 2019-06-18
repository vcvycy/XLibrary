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
        $status = Utils::getParamWithFilter("status","digit");
        $b = new Books(); 
        if ($status=="1"){  //审核通过,在藏书库对应的位置库存+1
            $site_id = Utils::getParamWithFilter("site_id","digit");
            $book_id = $b->getBookIDByDonateID($book_donate_id);
            $s= new Site();
            
            // 藏书库书籍+1
            $s->incStock($site_id,$book_id);

            // 更新审核状态，图书库存，图书首次入库地点
            $b -> reviewDonation($book_donate_id,1,$site_id);
        }else
        if ($status=="-1"){  // 拒绝
            $b->reviewDonation($book_donate_id,-1);
        }else{
            throw new Exception("状态要么为1，要么为-1");
        }
        Utils::exit(0,"捐书状态设置成功!");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>