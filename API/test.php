<?php
    require_once("utils.php"); 
    function main(){ 
        require_once(DIR_DAO."Students.php"); 
        $a=new Students(); 
        $a->createSQLAndRun("select * from stu where id=%s and name='%s'",12312,"dkf--sdjf..sj");
        die("");
        //$a->loginFromXMU("23020161153315","1591147")
        if ($a->login("23020161153315","159147")){
            echo "登陆成功";
        }else{
            echo $a->error_msg;
        }
    }
    main();
?>