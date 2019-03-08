<?php
require_once("utils.php");
$isbn = Utils::getParamWithFilter("isbn","digit"); 
if ($isbn!=null){ 
   $pyAddr=Utils::$g_config["pyAddr"]; 
   $url="$pyAddr/isbn/$isbn"; 
   echo file_get_contents($url);
}
else
   Utils::exit(-1,"参数isbn不存在")
?>