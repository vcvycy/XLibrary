# Library

#### 项目介绍
一个简单的借书系统 http://47.112.120.4/

#### 软件架构
软件架构说明


#### 安装教程

1.  启动python服务
    python3 ./API/py_service/StartService.py
2.  数据库脚本
        ./script/library.sql
    数据库配置:
        见:./API/utils.php 中$g_config["db"]
3.  api 文档：
    https://documenter.getpostman.com/view/6886443/S11RLG5y
4. 注意查看log.txt是否有写权限，upload是否有写权限；book_retrieval(linuxe:use_unicode:true,chatset:utf8)
