require(['zepto','Adapter_screen','ajax_model','tp_util'],function($,Adapter,ajax,tp){
	//var local_id=localStorage.getItem('local_id');
	var local_id=tp.getQueryString('local_id');
	/*调用屏幕适配模块*/
	Adapter.adapter();
	$('#myimg').attr('src',m_publicUrl+'/img/index/header.png');
	$('#starimg').attr('src',m_publicUrl+'/img/myinfo/star.png');
	$('#activeimg').attr('src',m_publicUrl+'/img/myinfo/active.png');
	/*调用ajax模块加载*/
	/*加载用户信息*/
	var getuser_url= config.tp_wcs_getuserinfo_url;
	var data={};
	if(local_id){
		data.uid=local_id;
	}
	function info(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			ajax.add_dian(res);
			var info=res.data;
			if(info.headimgurl){
				$('#head').css('background-image','url('+info.headimgurl+')');
			}else{
				$('#head').css('background-image','url('+m_publicUrl+'/img/myinfo/header.png)');
			}
			$('#nick').html(info.nickname);
			if(info.signature){
				$('#signature').html(info.signature);
			}else{
				$('#signature').html('');
			}
			if(info.teamname){
				$('#dance').html(info.teamname);
			}else{
				$('#dance').html('');
			}
		}
	}
	ajax.getData(getuser_url,info,data);
	/*获取视频列表信息*/
	var urllist= config.tp_wcs_workslist_url;
	//console.log(urllist)
	var datalist={
		'type':'0',
	}
	function list(res){
		//console.log(res);
		if(res.retcode=='0'){
			ajax.add_dian(res);
			var html='',info=res.data;
			for(var i=0;i<info.length;i++){
				if(info[i].videostatus==0){
					if(!info[i].posterurl){
						info[i].posterurl=m_publicUrl+'/img/workdefault.png'
					}
					html+='<li class="li"  local_id="'+ local_id+'"><i></i><em></em><a href="../MyDance/detail?videocode='+info[i].videocode+'"><img src="'+info[i].posterurl+'" alt="" /></a><span>'+info[i].videoname+'</span></li>';
				}
			}
			$('#video_list').html(html);
		}
	}
	ajax.getData(urllist,list,datalist);
	/*点击视频为视频播放页存储videocode*/
	//$('#video_list').on('click','.li',function(){
		//localStorage.setItem('videocode',$(this).attr('videocode'));
		/*var targeturl=config.tp_wcs_url+'MyDance';
		tp.appendParam();*/
		 
	//})
})