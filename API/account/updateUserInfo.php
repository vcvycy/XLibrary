<?php
require_once("../utils.php");
require_once(DIR_DAO."Students.php");
// 获取当前登陆的学生信息
function main(){  
    // 登陆
    try{ 
        $school = Utils::getParamWithFilter("school");
        $degree = Utils::getParamWithFilter("degree");
        $wechat_name = Utils::getParamWithFilter("wechat_name");
        $phone = Utils::getParamWithFilter("phone","phone");
        $grade = Utils::getParamWithFilter("grade");
        $other = Utils::getParamWithFilter("other");
        
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    } 
    $stu= new Students();
    if (\StuSess\isLogin()){
        $sid=\StuSess\getKey("sid");
        \StuSess\setKey("dbinfo",$stu->updateStuInfo($sid,$school,$degree,$wechat_name,$phone,$grade,$other)); 
        $info=$stu->getStuInfo($sid); 
        Utils::exit(0,$info); 
    }else
        Utils::exit(-1,"请先登录");
}
/********* ***************/
main();
?>