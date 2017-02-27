require(['zepto','Adapter_screen','ajax_model','tp_util'],function($,adapter,ajax,tp){
	/*对屏幕进行适配*/
	adapter.adapter();
	/*用ajax模块加载舞队和用户信息*/
	var userinfo=config.tp_wcs_getuserinfo_url;
	var url=config.tp_wcs_dance_info_url;
	var teamcode=tp.getQueryString('teamcode');
	var data={'teamcode':teamcode},userdata={};
    ajax.getData(userinfo,user,userdata);	
	/*处理用户信息*/
	function user(res){
		if(!res) return;
		if(res.retcode==0){
			var info=res.data;
			if(info.teamcode==teamcode){
				$('.set').css('display','block');
				if(info.memtype==0){
					$('.set').attr('href','../MyDance/member');
				}else{
					$('.set').attr('href','../MyDance/set');
				}
			}
		}
	}
	function danceinfo(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			var info=res.data;
			$('#dancename').html(info.teamname+'舞队');
			/*舞队公告*/
			$('#signature').html(info.signature);
			if(!info.headimgurl){
				info.headimgurl=m_publicUrl+'img/index/head.png'
			}
			$('.head').css('background-image','url('+info.headimgurl)+')';
		}
	}
	ajax.getData(url,danceinfo,data);
	/*加载舞队视频列表*/
	var urlwork= config.tp_wcs_workslist_url;
	var workdata={
		'teamcode':teamcode,
		'type':'1'
	};
	function worklist(res){
		console.log(res);
		if(!res) return;
		var info=res.data;
		if(res.retcode==0){
			var htmlwork='';
			for(var n=0;n<info.length;n++){
				if(info[n].videostatus==0){
					if(!info[n].posterurl){
						info[n].posterurl=m_publicUrl+'/img/workdefault.png';
					}
					htmlwork+='<li class="li"videocode="'+info[n].videocode+'"><i></i><em></em><a href="../MyDance/detail?videocode='+info[n].videocode+'"><img src="'+info[n].posterurl+'" alt="" /></a><span>'+info[n].videoname+'</span></li>'
				}
				
			}
			$('#workload').html(htmlwork);
		}	
	}
	ajax.getData(urlwork,worklist,workdata);
})