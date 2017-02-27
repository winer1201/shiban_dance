require(['zepto','Adapter_screen','ajax_model'],function($,adapter,ajax){
	/*对屏幕进行适配*/
	adapter.adapter();
	var art_url=config.tp_wcs_workslist_url;
	var data={'type':'3'};
	function art(res){
		//console.log(res);
		if(!res) return;
		if(res.retcode==0){
			var info=res.data,html='',list='';
			ajax.add_dian(res);
			for(var i=0;i<info.length;i++){
				if(!info[i].posterurl){
					info[i].posterurl=m_publicUrl+'img/workdefault.png';
				}
				html+='<dl><dt class="dt" videocode="'+info[i].videocode+'" onclick="javascript:window.location.href=../MyDance/detail?videocode='+info[i].videocode+'"><img src="'+info[i].posterurl+'" alt="" /><i style="background-image: url(__PUBLIC__/img/index/play.png);"></i></dt><dd>'+info[i].videoname+'</dd></dl>';
			}
			$('.loadlist').html(html);
		}
	}
	ajax.getData(art_url,art,data);
})