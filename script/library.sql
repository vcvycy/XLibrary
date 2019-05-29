-- SQL数据库初始化 --
-- (1)要将数据库设为非严格模式,进入mysql，执行set global sql_mode='';重启后就失效了。
-- (2)mysql默认编码是latin，要改成utf-8
-- (3) 约定: 所有都是小写字母;不用外键;
-- 1、建库
DROP DATABASE IF EXISTS xlibrary;
CREATE DATABASE xlibrary;
USE xlibrary;
-- 2、建表
-- (*) 图书表
create table book(
  id    int auto_increment not null primary key,
  isbn       varchar(32),
  title  varchar(256),              -- 书名
  subtitle  varchar(256),           -- 书名
  author     varchar(256),          -- json数组，多个作者
  publisher  varchar(128),          -- 出版社
  summary    longtext,
  pubdate    varchar(16), 
  picture    VARCHAR(1024),         -- 图片
  other longtext,
  stock  int DEFAULT 0 ,             -- 库存 
  lended int DEFAULT 0               -- 借出了多少本
);  
-- (*) 学生表
create table stu(
  sid   varchar(32),  -- 学号
  name  varchar(64),  -- 姓名
  pwd   varchar(64),   -- 密码. 通过两次sha1加密,防止网上查表爆出简单密码。
  head_image varchar(256), -- 头像地址
  wechat_name VARCHAR(64), -- 微信
  openid varchar(256),
  phone varchar(16),    -- 手机号
  degree varchar(16),   -- 本科生,研究生,博士生
  grade  varchar(8),    -- 一年级,二年级,...
  school varchar(64),    -- 学院
  other longtext
);
-- (*) 管理员
create table su(
  id   int auto_increment not null primary key,
  usr  varchar(64),  --  姓名
  pwd   varchar(64)   -- 密码
);
-- (*) 捐赠的图书(谁在某个时间捐赠了什么书)
create table book_donate(
   id   int auto_increment not null primary key,
   time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
   sid  varchar(32),                                 -- 学生ID
   isbn varchar(32),                                      -- 图书ID
   donator_word varchar(128),
   how_to_fetch varchar(256),                        -- 如何取书
   status int  -- 0表示等待审核，1表示审核通过，-1表示审核不通过                               -- 是否已经捐入库中，由管理员来设置
);

-- (*) 图书借还
create table book_borrow(
  id        int auto_increment not null primary key,
  sid       VARCHAR(32),
  isbn      varchar(32),
  --  借书时间/还书时间(null 表示还未归还)
  borrow_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  return_time timestamp default '0000-00-00 00:00:00',
  return_image_path varchar(256)  -- 还书
);   

-- (*) 评论
create table message(
  id        int auto_increment not null primary key,
  time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP , 
  type      varchar(8),             -- type=book 表示在某本书下的评论 type=sys表示系统消息，
  book_id   int,
  from_id   int
);

-- 数据库默认东西
INSERT INTO `su`( `usr`, `pwd`) VALUES ('admin','admin')