##开发jQuery插件的基本步骤
作者：*李梦仪*       
时间：*2016-10-15 15:19*

在进行开发jQuery插件前，首先要了解一些知识：

**1、闭包**

1.1、闭包的作用：
 · 避免全局依赖
 · 避免第三方破坏
 · 兼容jQuery操作符'$'和jQuery
	
1.2、闭包的形式
``` javascript
	(function(arg){...})(param)
```
相当于定义了一个参数为arg的匿名函数(`function(arg){...}`)，并且将`param`作为参数来调用这个匿名函数。
>在调用函数`function(arg){...}`时，是在函数后面写上括号和实参`(param)`的，而由于操作符的优先级，函数本身也需要用括号`(function(arg){...})`。

`(function($){...})(jQuery)`是一样的，之所以只在形参使用$，是为了不与其他库冲突，所以实参用jQuery。

另外，`(function($){...})(jQuery)`用来定义一些需要预先定义好的函数，用来存放开发插件的代码，执行其中的代码时DOM不一定存在。而`$(function(){...})`则是用来在DOM加载完成之后运行/执行那些预先定义好的函数，用来存放操作DOM对象的代码，执行其中代码时DOM对象已存在。

**2、jQuery插件的开发方式**

2.1、类级别组件开发

即给jQuery命名空间下添加新的全局函数，也称为静态方法。
``` javascript
	jQuery.myPlugin = function(){
		// do something
	}
```
例：$.Ajax()、$.extend()

2.2、对象级别组件开发

即**挂在jQuery原型下**的方法，这样通过选择器获取的jQuery对象实例也能共享该方法，也称为动态方法。
``` javascript
	$.fn.myPlugin = function(){		//这里$.fn === $.prototype
		// do something
	}
```
例：addClass()，attr()等，都需要创建实例来调用

**3、链式调用**

使用例子：`$('div').next().addClass(...)...`
与上面介绍对象级别组件开发`$.fn.myPlugin = function(){...}`组合的实现：
``` javascript
	$.fn.myPlugin = function(){
		return this.each(function(){
			// do something
		})
	}
```
其中，`return this`返回当前对象，来维护插件的链式调用；而`each`循环实现每个元素的访问。

**4、单例模式**

使用单例模式是为了只生成一个实例，可以避免过多的实例不好管理，比如一个人售票还好，再多一个人售票就会产生进程之间的一系列问题。
``` javascript
1	$.fn.myPlugin = function(){
2		var me = this,
3			instance = me.data('myPlugin');
4
5		//如果实例存在则不再重新创建实例
6		//利用data()方法来存放插件对象的实例
7		if(!instance){
8			me.data('myPlugin',(instance = new myPlugin()));
9		}
10	}
```
其中，data()方法向被选元素附加数据(第8行)，或者从被选元素获取数据(第3行)。

**5、开发jQuery插件**

基本结构为：
```javascript
(function($){

	//定义插件myPlugin
	var myPlugin = (function(){
		//定义每个实例对象各自特有的属性和方法
		function myPlugin(element,options){...}

		//定义所有实例对象共有的属性和方法
		myPlugin.prototype={...}

		return myPlugin;
	})();

	//使myPlugin能被通过选择器获取的jQuery对象实例使用，并实现链式调用
	$.fn.myPlugin=function(options){
		return this.each(function(){
			var me = this,
				instance = me.data('myPlugin');

			if(!instance){
				me.data('myPlugin',(instance = new myPlugin()));
			}

		})
	};

	//一般情况下，允许别人在使用我们开发的插件时修改一些默认的属性变量以达到不同的实现效果
	//例如：我们开发一个全屏切换的插件，默认情况下为竖直变换，但允许用户使用是改为水平切换
	$.fn.myPlugin.defaults={
		direction:'vertical',	//默认情况下为竖直变换
		...
		...
	};

	//使DOM元素调用插件方法实现效果
	$(function(){
		$('DOM元素').myPlugin();
	});

})(jQuery);
```

一个[全屏切换插件](https://github.com/Mone-Lee/pageSwitch)的例子。


以上为个人见解，望指教。