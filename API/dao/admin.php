<?php
// 约定：所有数据都经过过滤后，才会进去dao层
/****** 接口 *******
 * (1) 登陆：/account/login.php?sid=&pwd=
 * 
 */
require_once(DIR_DAO."Base.php");
Class Admin extends Base{
    private $m_conn;            //数据库连接对象 
    //(*)构造函数会自动连接数据库
    public function __construct(){
        $this->m_conn = self::getInstance();
    } 
    //(*) 管理员登陆
    public function login($sid,$pwd){ 
        $ret=$this->createSQLAndRun("select count(*) from su where usr='%s' and pwd = '%s'",$sid,$pwd); 
        return intval($ret[0][0])!=0;
    }

    //(*) 更新密码 (成功返回true，失败返回false)
    public function updatePwd($user,$old_pwd,$new_pwd){ 
        $rst = $this->createSQLAndRun("update su set pwd='%s' where usr='%s' and pwd='%s'",$new_pwd,$user,$old_pwd);
        if ($this->lastAffectedRows()==0)
            return "更新失败：可能是密码输入有误";
        return null;
    }
}; 
?>
