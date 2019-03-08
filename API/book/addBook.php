<?php
require_once("../utils.php");
require_once(DIR_DAO."Books.php");
// 添加一本数到数据表 book中
function main(){ 
    // 参数读取
    try{
        $isbn = Utils::getParamWithFilter("isbn","digit");
        $douban_json = Utils::getDoubanJson($isbn); 
        $b = new Books(); 
        $b->addBook($douban_json);
        Utils::exit(0,"图书添加成功");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>