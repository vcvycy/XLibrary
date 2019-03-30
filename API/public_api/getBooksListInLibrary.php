<?php
require_once("../utils.php");
require_once(DIR_DAO."Books.php");
// 获取馆中图书
function main(){ 
    // 参数读取
    try{ 
        $b = new Books(); 
        $data = $b->getBooksListInLibrary();
        Utils::exit(0,$data);
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>