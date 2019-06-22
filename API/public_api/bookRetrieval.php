<?php
require_once("../utils.php"); 
// 获取馆中图书
function main(){  
    $pyAddr=Utils::$g_config["pyAddr"]; 
    $qry = Utils::getParamWithFilter("qry");  
    if ($qry=="")
        Utils::exit(-1,"不能搜索空字符串");
    $qry = urlencode($qry);        // 处理file_get_contetns url中文出错
    $url = "$pyAddr/book_retrieval/${qry}"; 
    $data = file_get_contents($url);  
    die($data);
}
/********* ***************/
main();
?>