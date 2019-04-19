<?php
require_once("../utils.php");
require_once(DIR_DAO."Students.php");
// 获取当前登陆的学生信息
function main(){  
    // 登陆
    $stu= new Students();
    if (\StuSess\isLogin()){
        $sid=\StuSess\getKey("sid");
        \StuSess\setKey("dbinfo",$stu->getStuInfo($sid));
        $data=array("sess"=> $_SESSION);
        Utils::exit(0,$data);
    }else
        Utils::exit(-1,"请先登录");
}
/********* ***************/
main();
?>