<?php
require_once("../utils.php");
require_once(DIR_DAO."admin.php"); 
// 学生账号登陆
function main(){ 
    // 参数读取
    try{ 
        $old_pwd = Utils::getParamWithFilter("old_pwd");
        $new_pwd = Utils::getParamWithFilter("new_pwd");
    } catch (Exception $e) {
        Utils::exit(-2,$e->getMessage());
    } 
    if ($old_pwd == $new_pwd) 
        Utils::exit(-1,"新旧密码不能一样!");
    // 登陆
    if (\AdminSess\isLogin()){
        $user =\AdminSess\getKey("user"); 
        $admin = new Admin();
        $rst=$admin->updatePwd($user,$old_pwd,$new_pwd);
        if ($rst==null){ 
            \AdminSess\logout();
            Utils::exit(0,"密码修改成功，请重新登陆");
        }else
            Utils::exit(-1,$rst);
    }else 
        Utils::exit(-1,"请先登陆再修改密码"); 
}
/********* ***************/
main();
?>