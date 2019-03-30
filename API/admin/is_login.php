<?php
require_once("../utils.php"); 
function main(){  
    // 登陆 
    if (\AdminSess\isLogin()){ 
        Utils::exit(0,"已登录");
    }else
        Utils::exit(-1,"未登录");
}
/********* ***************/
main();
?>