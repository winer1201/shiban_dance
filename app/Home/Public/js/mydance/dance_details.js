require(['zepto','Adapter_screen','ajax_model','tp_util'],function($,adapter,ajax,tp){
	/*对屏幕进行适配*/
	adapter.adapter();
	var videocode=tp.getQueryString('videocode');
	var videourl= config.tp_wcs_workslist_url;
	var videodata={
		'videocode':videocode
	};
	var userurl=config.tp_wcs_base_userinfo_url;
	var teamurl=config.tp_wcs_base_danceinfo_url;
	var dancedata={},userdata={},listdata={};
	/*获取视频列表信息*/
	function videolist(res){
		if(!res) return;
		if(res.retcode=='0'){
			ajax.add_dian(res);
			var info=res.data,html='';
			for(var i=0;i<info.length;i++){
				if(info[i].videostatus==0){
					if(!info[i].posterurl){
						info[i].posterurl=m_publicUrl+'/img/workdefault.png';
					}
					html+='<li class="li"><a href="../MyDance/detail?videocode='+info[i].videocode+'"><img src="'+info[i].posterurl+'" alt="" /></a><span>'+info[i].videoname+'</span></li>'
				}
				
			}
			$('#loadlist').html(html);
		}
	}
	/*加载个人信息*/
	function user(res){
		if(!res) return;
		if(res.retcode==0){
			ajax.add_dian(res);
			var info=res.data;
			$('#name').html(info.nickname);
			if(!info.headimgurl){
				info.headimgurl=m_publicUrl+'/img/myinfo/header.png)';
			}
			$('#head').css('background-image','url('+info.headimgurl+')');
		}
	}
	/*加载舞队信息*/
	function dance(res){
		//console.log(res);
		if(!res) return;
		if(res.retcode==0){
			ajax.add_dian(res);
			var info=res.data;
			$('#name').html(info.teamname);
			if(!info.headimgurl){
				info.headimgurl=m_publicUrl+'/img/team_default.png';
			}
			$('#head').css('background-image','url('+info.headimgurl+')');
		}
	}
	function videoplay(res){
		console.log(res);
		if(!res) return;
		if(res.retcode=='0' && res.data.length>0){
			var info=res.data[0];
			$('video').attr('src',info.fileurl);
			if(info.videotype==0){
				listdata.uid=info.owneruid;
				listdata.type=0;
				/*设置跳转地址*/
				$('#head').click(function(){
					var targeturl=  config.tp_wcp_myindex_page;
					targeturl = tp.appendParam(targeturl, 'local_id',info.owneruid);
					tp.redirectUrl(targeturl);
				})
				ajax.getData(userurl,user,userdata);
				ajax.getData(videourl,videolist,listdata);
			}else{
				listdata.type=1;
				/*设置跳转地址*/
				$('#head').click(function(){
					/*跳转舞队主页传teamcode*/
					var targeturl= config.tp_wcp_danceindex_page;
					targeturl = tp.appendParam(targeturl, 'local_id',info.owneruid);
					tp.redirectUrl(targeturl);
				})
				listdata.teamcode=info.owneruid;
				dancedata.teamcode=info.owneruid;
				ajax.getData(teamurl,dance,dancedata);
				ajax.getData(videourl,videolist,listdata);
			}
		}
	}
	ajax.getData(videourl,videoplay,videodata);
})