/*柱状图组件类*/
var componentBar=function(name,cfg){
	var component=new componentBase(name,cfg);

	$.each(cfg.data,function(index,item){
		var line=$('<div class="line clearfix">');
		var title=$('<h2 id="heading'+item[0]+'"></h2>');
		var rate=$('<div class="rate">');
		var per=$('<div class="per">');
		var wrap=$('<div class="wrap">');

		title.text(item[0]);
		title.css('backgroundColor',item[1]);
		
		
		if(item[3]){
			var bgStyle='';
			bgStyle='style="background-color:'+item[3]+'"';
		}

		width=(item[2]*100 >>0 ) +'%';
		rate.css('width',width);
		rate.html('<div id="'+item[0]+'" class="bar" '+bgStyle+' >')
		per.text(width);
		wrap.append(rate).append(per)
		line.append(title).append(wrap);

		component.append(line);

	})

	return component;
}