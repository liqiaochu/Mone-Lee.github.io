app.js：启动文件，或者说入口文件

package.json：存储着工程的信息及模块依赖，当在dependencies中添加依赖的模块时，运行npm install，npm会检查当前目录下的package.json，并自动安装所有指定的模块。

node_modules：存放package.jspn中安装的模块，当在package.json添加依赖的模块并安装后，存放在这个文件夹下。

public：存放image、css、js等文件。

routes：存放路由文件。

views：存放视图文件或者说模板文件。

bin：存放可执行文件。

settings.js:用于保存该博客工程的配置信息，比如数据库的连接信息。
