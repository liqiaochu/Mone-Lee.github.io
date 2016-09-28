window.onload=function(){
	//html
	var canvasH=document.getElementById("canvasH");
	plotScore(canvasH,85,"#BD0000");
	//html5
	var canvasH5=document.getElementById("canvasH5");
	plotScore(canvasH5,45,"#ff7900");
	//css
	var canvasC=document.getElementById("canvasC");
	plotScore(canvasC,80,"#d5ec15");
	//css3
	var canvasC3=document.getElementById("canvasC3");
	plotScore(canvasC3,68,"#41980E");
	//javascript
	var canvasJS=document.getElementById("canvasJS");
	plotScore(canvasJS,40,"#773a8c");
	//jquery
	var canvasJQ=document.getElementById("canvasJQ");
	plotScore(canvasJQ,58,"#1AAFD0");

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
}

function plotScore(canvas,score,color){
	var context = canvas.getContext("2d");
	var print=(score/100)*350;

	//绘制刻度线
	context.lineWidth=34;
	context.strokeStyle=color;
	context.moveTo(0,17);
	context.lineTo(print,17);
	context.stroke();

	context.beginPath();
	context.strokeStyle="#eeeeee";
	context.moveTo(print,17);
	context.lineTo(350,17);
	context.stroke();

	//把数值写在刻度位置
	context.fillStyle="#000";
	context.font="italic 14px Arial";
	context.textBaseline='top';

	context.fillText(score+"%",315,10);
}