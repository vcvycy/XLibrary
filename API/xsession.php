<?php 
/** session 设置函数 */
// 学生登陆 
namespace StuSess{
    function setKey($key,$val){$_SESSION["stu/".$key]=$val;}
    function getKey($key){  // 读取session key的值。不存在则返回Null。
        $key="stu/".$key; 
        return isset($_SESSION[$key])? $_SESSION[$key]:null;
    } 
    function unsetKey($key){
        $key="stu/".$key;
        if (isset($_SESSION[$key]))
          unset($_SESSION[$key]);
    }
    function login($sid,$name,$all){ //登陆
        setKey("login",true);
        setKey("sid",$sid);
        setKey("name",$name);
        setKey("dbinfo",$all);
    }
    function logout(){    // 登出
        foreach($_SESSION as $key => $value){ 
            unset($_SESSION[$key]);
        } 
    }
    function isLogin(){   // 是否登陆
        return getKey("login")==true;
    }
    function isLoginOrThrowException(){
        if (!isLogin()){ 
            throw new \Exception("用户未登陆");
        }
    }
}
// 管理员登陆
namespace AdminSess{
    function setKey($key,$val){$_SESSION["admin/".$key]=$val;}
    function getKey($key){  // 读取session key的值。不存在则返回Null。
        $key="admin/".$key; 
        return isset($_SESSION[$key])? $_SESSION[$key]:null;
    } 
    function unsetKey($key){
        $key="admin/".$key;
        if (isset($_SESSION[$key]))
          unset($_SESSION[$key]);
    }
    function login($user){ //登陆
        setKey("login",true);
        setKey("user",$user);
    }
    function logout(){    // 登出
        unsetKey("login");
    }
    function isLogin(){   // 是否登陆
        return getKey("login")==true;
    }  
}
?>