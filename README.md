# Library

#### 项目介绍
一个简单的借书系统

#### 软件架构
软件架构说明


#### 安装教程

1.  启动python服务(用于模拟 i.xmu.edu.cn 用户登陆)
    python3 ./API/py_service/StartService.py
2.  数据库脚本
        ./script/library.sql
    数据库配置:
        见:./API/utils.php 中$g_config["db"] 
#### 文档
1. 用户登陆:
   URL: /API/account/login.php
   参数:
        (1) sid : 学号
        (2) pwd : 密码
        
2. 通过isbn 获取图书信息
    URL: /API/isbn.php
    参数: isbn
    如: /API/isbn.php?isbn=9787308083256

3. 添加一本书
   /API/book/addBook.php?isbn=9787308083256