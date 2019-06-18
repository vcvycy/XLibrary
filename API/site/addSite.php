<?php
require_once("../utils.php");
require_once(DIR_DAO."Site.php");
// 添加一个地点
// 
function main(){ 
    // 参数读取
    try{
        \AdminSess\isLoginOrThrowException(); 
        $s = new Site();  
        $name = Utils::getParamWithFilter("name");
        $description = Utils::getParamWithFilter("description"); 
        $s->addSite($name,$description);
        Utils::exit(0,"添加成功");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    }
}
/********* ***************/
main();
?>