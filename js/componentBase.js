/*基本图文组件*/
var componentBase=function(name,cfg){
	var cfg=cfg||{};
	// var id=('component_'+Math.random().replace('.','_'));

	//把当前的组件类型添加到样式表中进行标记
	var cls=' component_'+cfg.type;
	var component=$('<div class="component component_name_'+name+cls+'">');

	cfg.text&&component.text(cfg.text);
	cfg.width&&component.width(cfg.width);
	cfg.height&&component.height(cfg.height);

	cfg.css&&component.css(cfg.css);

	if(cfg.center===true){
		component.css({
			marginLeft:(cfg.width/2*-1)+'px',
			left:'50%'
		})
	}

	component.on('onLoad',function(){
		component.addClass(cls+"_load").removeClass(cls+"_leave");
		cfg.animateIn&&component.animate(cfg.animateIn);
		return false;
	})

	component.on("onLeave",function(){
		component.addClass(cls+"_leave").removeClass(cls+"_load");
		cfg.animateOut&&component.animate(cfg.animateOut);
		return false;
	})

	return component;
}