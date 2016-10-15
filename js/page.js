function boomIn(){
	/**
	 * 弹出联系方式
	 */
	var contactMe=document.getElementById("contactMe");
	var overlay=document.getElementById("overlay");
	var contactContent=document.getElementById("contactContent");
	overlay.className="";		
	contactContent.className="";	
}
function boomOut(){
	/**
	 * 关闭弹出联系方式
	 */
	var contactMe=document.getElementById("contactMe");
	var overlay=document.getElementById("overlay");
	var closeButton=document.getElementById("closeButton");
	overlay.className="hide";
	contactContent.className="hide";
}



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
	}

	//一般情况下，允许别人在使用我们开发的插件时修改一些默认的属性变量以达到不同的实现效果
	//例如：我们开发一个全屏切换的插件，默认情况下为竖直变换，但允许用户使用是改为水平切换
	$.fn.myPlugin.defaults={
		direction:'vertical',	//默认情况下为竖直变换
		...
		...
	}

	//使DOM元素调用插件方法实现效果
	$(function(){
		$('DOM元素').myPlugin();
	})

})(jQuery);