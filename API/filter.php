<?php
// 用户输入过滤
class Filter{ 
    //正则表达式 模式串
    static private $re_patterns=array(
        "digit" => "/^-?[\d]+$/u",
        "word" => "/^[\w]+$/u"              
    );
    // 匹配,失败则抛出异常
    static public function match($value,$type="word"){
        $value=strval($value);
        $pattern=self::$re_patterns[$type]; 
        if (!preg_match($pattern,$value)){
            throw new Exception("值$value 无法通过正则匹配$pattern,请修改参数值");
        }
    } 
}
?>