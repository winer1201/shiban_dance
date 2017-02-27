define(['zepto'],function($){
	return{
		adapter:function(){
			/*对屏幕进行适配*/
			function resize(){
				var width=document.documentElement.clientWidth;
				//console.log(width);
				$('html').css("font-size",width/7.5);
			}
			$(window).on("resize",resize);
			resize();
		}
	}
	
})
