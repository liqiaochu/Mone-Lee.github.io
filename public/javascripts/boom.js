


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