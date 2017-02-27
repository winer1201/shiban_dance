require(['zepto','Adapter_screen'],function($,adapter){
	/*对屏幕进行适配*/
	adapter.adapter();
	$('#starimg').attr('src',m_publicUrl+'/img/star/shangtv.png');
	$('#myimg').attr('src',m_publicUrl+'/img/index/header.png');
	$('#activeimg').attr('src',m_publicUrl+'/img/activities/eggs/huo.jpg');
})