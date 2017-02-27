require(['zepto','Adapter_screen','ajax_model'],function($,adapter,ajax){
	/*对屏幕进行适配*/
	adapter.adapter();
	/*获取月度之星舞队列表*/
	var starlist=config.tp_wcs_dancelist_url;
	/*获取舞队点赞数量*/
	var zan_num=config.tp_wcs_dian_zan_url;
	var data={};
	var arr='',shu=[];
	function dancelist(res){
		console.log(res);
		if(!res) return;
		if(res.retcode=='0'){
			var info=res.data,html='';
			for(var i=0;i<info.length;i++){
				if(!info[i].posterurl){
					info[i].posterurl=m_publicUrl+'/img/workdefault.png';
				}
				arr+=info[i].teamcode+',';
				shu[i]=info[i].teamcode;
				html+='<li class="clear"><div class="lf" teamcode="'+info[i].teamcode+'"><a href="../MyDance/dance?teamcode='+info[i].teamcode+'"><img src="'+info[i].posterurl+'" alt="" /></a></div><div class="rt"><p class="music">舞队：<span>'+info[i].teamname+'</span></p><p class="dance">签名：<span>'+info[i].signature+'</span></p><p class="vote">已有<span class="piao"></span>票</p><dl class="zan"><dt class="dianzan" teamcode="'+info[i].teamcode+'"><a href="../star/vote?teamcode='+info[i].teamcode+'"><img src="'+m_publicUrl+'/img/star/vote.png" alt="" /></a></dt><dd class="touvote">去投票</dd></dl></div></li>'
			}
			$('#rank_load').html(html);
			console.log(arr.substring(0,arr.length-1))
			var zandata={
				'datalist':arr.substring(0,arr.length-1)
			}
			ajax.getData(zan_num,zan,zandata);
		}
	}
	ajax.getData(starlist,dancelist,data);
	function zan(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			var info=res.data;
			for(var t=0;t<info.length;t++){
				for(var w=0;w<info.length;w++){
					if(shu[t]==info[w].teamcode){
						$('.piao').eq(t).html(info[w].zannumber);
					}
				}
			}
			
		}
		
	}
})