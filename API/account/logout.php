<?php
require_once("../utils.php");
// 学生账号登出
function main(){ 
    if (\StuSess\isLogin()){
        \StuSess\logout();
        Utils::exit(0,"登出成功");
    }else{
        Utils::exit(-1,"账号未登录，无法登出");
    } 
}
main();
?>