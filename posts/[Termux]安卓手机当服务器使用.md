# 安卓手机当服务器使用 [Termux] [ROOT]

日期：2024/11/27

旧手机当网页web服务器，把Apache2 PHP phpMyAdmin MariaDB装进手机，可以访问PHP页面，通过phpMyAdmin访问数据库。适合有ROOT权限的手机。

### 下面开始安装 Termux APP，部署web运行环境
前提准备：
 - 已经root的安卓手机
 - (没有root可以尝试解锁BL，刷入适合你手机的TWRP Recovery，再通过twrp刷入magisk，最后使用magisk进行ROOT授权)

下载 Termux APP
 - (推荐Google Play商店下载，或者GitHub)



## 第一步：前置部署
安装 `tsu` `vim` `apache2` `php` `php-fpm` `php-apache` `phpmyadmin` `mariadb`

- 更新可用软件包

``` shell
pkg upgrade
```

- 安装所有软件包

``` shell
pkg install tsu vim apache2 php php-fpm php-apache phpmyadmin mariadb
```

在安装过程中需要确认安装，按"Y"回车。

## 第二步：配置环境

创建共享目录，方便Termux和Android的文件共享

``` shell
termux-setup-storage
```

### Apache
修改Apache配置文件  httpd.conf

``` shell
vim /data/data/com.termux/files/usr/etc/apache2/httpd.conf
```

进入vim编辑器后：按 'i' 进入编辑模式。esc退出编辑。退出编辑后按 ':’ 进入命令模式。 ':q' 退出vim编辑器。 ':exit' 保存后退出。更多用法菜鸟教程Linux vi/vim

``` shell
52|  Listen 80  #修改80端口

66|  LoadModule mpm_prefork_module...  #去掉开头的井号"#"

67|  #LoadModule mpm_worker_module... #在开头加上井号 "#"

#在162行下方新增代码。

162|  LoadModule php_module /data/data/com.termux/files/usr/libexec/apache2/libphp.so  

231|  Require all granted  #将 denied 修改为 granted

246|  DocumentRoot "/storage/emulated/0/htdocs"   #将这行代码中的路径替换成/storage/emulated/0/，这是你手机的主目录，可以随意指定

247|  <Directory "/storage/emulated/0/htdocs" >  #这行跟上一行的路径一样即可

#在261行下方新增代码。
261|  <IfModule php_module>
262|      php_flag magic_quotes_gpc Off
263|      php_flag track_vars On
264|      php_flag register_globals Off
265|      php_value include_pach .
266|  </IfModule>

286|  DirectoryIndex index.php index.php3 index.html index.htm  #新增php,php3,htm后缀

#在423行下方新增代码。
423|  AddType application/x-httpd-php .php
424|  AddType application/x-httpd-php .php3
```

保存httpd.conf后退出vim

运行 `sudo httpd` 启动apache服务

浏览器打开 `localhost` 访问。 

`sudo httpd -k stop` 用于停止apache服务


### MySql
新开Termux会话，执行 `nohup mysqld &` 或者直接执行 `mysqld` 运行数据库服务。


### phpMyAdmin
修改phpmyadmin配置文件 config.inc.php

``` shell
vim /data/data/com.termux/files/usr/etc/phpmyadmin/config.inc.php
```

修改代码

``` shell
30|  $cfg["Server"][$i]["host"] = '127.0.0.1'  #将localhost 改为 127.0.0.1 以建立TCP连接
32|  $cfg["Server"][$i]["AllowNoPassword"] =true  #将 false 改为 true 以允许空密码登录
```

保存config.inc.php后退出vim

浏览器打开 `localhost/phpmyadmin` 访问。

新增phpmyadmin账户时将主机名的 `%` 改成 `127.0.0.1`

安装程序时数据库地址填写 `127.0.0.1`
PHP
修改php配置 php.ini

php配置文件在 /data/data/com.termux/files/usr/lib/php.ini

``` shell
vim /data/data/com.termux/files/usr/lib/php.ini
```

如果文件不存在执行下面代码

``` shell
cp /data/data/com.termux/files/usr/share/doc/php/php.ini-production /data/data/com.termux/files/usr/lib/php.ini 
```

按需求修改即可。

## END

先执行 `sudo httpd` 启动Apache服务再新开会话执行 `nohup mysqld &` 启动mysql服务
