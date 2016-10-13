window.onload=function(){
	/**
	 * 回到顶部
	 */
	var button=document.getElementById("button");
	var timer=null;
	button.onclick=function(){
		timer=setInterval(function(){
			var osTop=document.documentElement.scrollTop||document.body.scrollTop;//滚动条距顶部距离
			var ispeed=Math.floor(-osTop/6);
			//设置滚动条距离顶部的高度
			document.documentElement.scrollTop=document.body.scrollTop=osTop+ispeed;
			if(osTop==0){
				clearInterval(timer);
			}
		},30);
	};

	var cfg={
		type:'bar',
		css:{
			opacity:0,
		},
		data:[
			['HTML/CSS','#7D0E0E',.72,'#BD0000'],
			['JavaScript','#B16119',.4,'#ff7900'],
			['CSS3','#9fb10d',.65,'#d5ec15'],
			['HTML5','#3F751F',.45,'#41980E'],
			['jQuery','#580F71',.58,'#773a8c'],
		],
		animateIn:{
			opacity:1
		},
		animateOut:{
			opacity:0
		},
	};

	var component=new componentBar('Bar',cfg);
	$('.ability').append(component);

	setTimeout(function(){
		$('.component').trigger('onLoad');
	},500);

}

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