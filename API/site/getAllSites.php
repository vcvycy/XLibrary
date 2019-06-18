<?php
require_once("../utils.php");
require_once(DIR_DAO."Site.php");
// 添加一个地点
// 
function main(){ 
    // 参数读取
    try{ 
        $s = new Site();   
        $data=$s->getSites();  
        Utils::exit(0,$data);
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>