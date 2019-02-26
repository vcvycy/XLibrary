<?php
    require_once("../utils.php");
    require_once(DIR_DAO."Students.php"); 
    // 测试脚本
    // 登陆
    echo "登陆测试:<br>";

    $stu= new Students();
    if ($stu->login("2324","dkjsf")){
        echo ("错误!!!!!!!!!!");
    }else 
        echo "[1]错误密码测试:成功<br>";
    if ($stu->login("23020161153315","159147")){
        echo "[2]正确密码测试，成功<br>";
    }else 
        die( "无法登陆!!!!!!!!!!!!!!!!!!!"); 
    //session测试
    \StuSess\login("23020161153315");
    echo "[3]登陆成功后：当前是否登陆session判断:".(\StuSess\isLogin()?"成功":"失败")."<br>";
    // 获取登陆信息
    echo "[3.1]student info".
         json_encode($stu->getStuInfo("23020161153315"))."<br>";
    //
    \StuSess\logout();
    echo "[4]登出操作后：当前是否登陆session判断:".(\StuSess\isLogin()?"失败":"成功");

?>