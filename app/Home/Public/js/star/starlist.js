require(['zepto','Adapter_screen','ajax_model'],function($,adapter,ajax){
	/*对屏幕进行适配*/
	adapter.adapter();
	/*获取往期月度之星舞队列表*/
	var url=config.tp_wcs_pre_starlist_url;
	var data={},teamcode;
	function prestar(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			var html='',info=res.data;
			for(var i=0;i<info.length;i++){
				if(!info[i].headimgurl){
					info[i].headimgurl=m_publicUrl+'img/team_default.png';
				}
				html+='<li onclick="javascript:	window.location.href=../MyDance/dance?teamcode='+info[i].teamcode+'"><h2>'+info[i].date+'</h2><i></i><img src="'+info[i].posterurl+'" alt="" /><div class="rt"><dl><dt>舞队：<span>'+info[i].teamname+'</span></dt><dd>签名：<span>'+info[j].signature+'</span></dd></dl><i></i></div></li>'
			}
			$('.load').html(html);
		}
	}
	ajax.getData(url,prestar,data);
})