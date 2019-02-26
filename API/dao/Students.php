<?php
// 约定：所有数据都经过过滤后，才会进去dao层
/****** 接口 *******
 * (1) 登陆：/account/login.php?sid=&pwd=
 * 
 */
require_once(DIR_DAO."Base.php");
Class Students extends Base{
    private $m_conn;            //数据库连接对象 
    //(*)构造函数会自动连接数据库
    public function __construct(){
        $this->m_conn = self::getInstance();
    }
    // --------- 用户登陆 ------------------
    //(*) 从统一门户登陆
    private function loginFromXMU($sid,$pwd){
        $url = Utils::$g_config["pyAddr"]."/login?sid=$sid&pwd=$pwd";
        $ret = file_get_contents($url);
        $ret = json_decode($ret,true);
        return $ret;
    }
    //(*) 从数据库中登陆.(成功返回true,失败返回false)
    private function stuExistInDB($sid){ 
        $ret=$this->createSQLAndRun("select count(*) from stu where sid='%s'",$sid);
        return $ret[0][0]>0;
    }
    //(*) 登陆,成功返回null，失败返回失败信息
    public function login($sid,$pwd){
        $ret = $this->loginFromXMU($sid,$pwd);
        if ($ret["error_code"]==0){ //成功
            // 如果用户已经存在，更新密码，否则添加用户
            if (!$this->stuExistInDB($sid))
                $this->register($sid,$pwd,$ret["data"]["student"]);
            else
                $this->updatePwd($sid,$pwd);
            return true;
        }else{
            $this->error_msg=$ret["data"];
            return false;
        }
    }
    //(*) 更新密码 (成功返回true，失败返回false)
    public function updatePwd($sid,$pwd){
        $pwd=sha1(sha1($pwd));      
        $rst = $this->createSQLAndRun("update stu set pwd='%s' where sid='%s'",$pwd,$sid);
        if ($rst==false)
          Utils::log("密码更新失败!$sql");
        return $rst;
    }
    //(*) 添加用户 (成功返回true，失败返回false)
    public function register($sid,$pwd,$student_info){
        $name=$student_info["name"]; 
        $pwd = sha1(sha1($pwd)); 
        return $this->createSQLAndRun("INSERT INTO stu (sid, name, pwd) VALUES ('%s','%s','%s')",$sid,$name,$pwd);
    }
    
    // -------- 账号信息更新与修改 --------------
    // 想法： 每次登陆都更新似乎太慢了。可以每隔几天统一更新，或者一段时间后再更新，以后实现
    //(*) 获取用户信息
    public function getStuInfo($sid){
        $rst=$this->createSQLAndRunAssoc("select sid,name,degree,grade,school from stu where sid=%s",$sid);
        return $rst;
    }
}; 
?>
