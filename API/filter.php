<?php
// 用户输入过滤
class Filter{ 
    //正则表达式 模式串
    static private $re_patterns=array(
        "digit" => "/^-?[\d]+$/u",
        "word" => "/^[\w]+$/u",
        "phone" =>"/^1[34578]\d{9}$/"           
    );
    // 匹配,失败则抛出异常
    static public function match($value,$type="word"){
        $value=strval($value);
        $pattern=self::$re_patterns[$type]; 
        if (!preg_match($pattern,$value)){
            throw new Exception("非法参数：$value ");
        }
    } 
}
?>