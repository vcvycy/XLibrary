<?php
require_once("../utils.php");
require_once(DIR_DAO."Books.php");
// 某本书是谁借走的
function main(){ 
    // 参数读取
    try{ 
        $isbn = Utils::getParamWithFilter("isbn","digit");
        $b = new Books();  
        $data = $b->whoDonateTheBook($isbn);
        Utils::exit(0,$data);
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>