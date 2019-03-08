<?php
require_once("../utils.php");
require_once(DIR_DAO."Students.php");
// 学生账号登陆
function main(){ 
    // 参数读取
    try{
        $sid = Utils::getParamWithFilter("sid","digit");
        $pwd = Utils::getParamWithFilter("pwd");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    } 
    // 登陆
    $stu= new Students();
    if ($stu->login($sid,$pwd)){
        \StuSess\login($sid);         //设置session值
        Utils::exit(0,"登陆成功!");
    }else{
        Utils::exit(-1,$stu->error_msg);
    }
}
/********* ***************/
main();
?>