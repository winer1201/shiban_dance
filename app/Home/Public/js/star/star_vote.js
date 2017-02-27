require(['zepto','Adapter_screen','ajax_model','tp_util'],function($,adapter,ajax,tp){
	/*对屏幕进行适配*/
	adapter.adapter();
	/*获取舞队信息*/
	var teamcode=tp.getQueryString('teamcode');
	var teamdata={},piaodata={},workdata={},dancework={},str='',arr=[],zan={},userdata;
	var teamurl=config.tp_wcs_dance_info_url;
	var piaonum=config.tp_wcs_dian_zan_url;
	var workurl=config.tp_wcs_get_video_url;
	var allwork=config.tp_wcs_workslist_url;
	var zanurl=config.tp_wcs_video_zan_url;
	var userurl=config.tp_wcs_user_zan_url;
	function userzan(res){
		console.log(res);
		if(!res) return;
		if(res.retcode=='0'){
			var info=res.data;
			for(var h=0;h<$('#workload').children().length;h++){
				for(var z=0;z<info.length;z++){
					if(arr[h]==info[z].videocode && teamcode==info[z].teamcode){
						$('.zan_cun').eq(h).children().eq(0).attr('src',m_publicUrl+'/img/star/yizan.png');
					}
				}
			}
		}
	}
	function teaminfo(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			ajax.add_dian(res);
			var info=res.data;
			if(!info.headimgurl){
				info.headimgurl=m_publicUrl+'img/team_default.png';
			}
			$('.head').css('background-image','url('+info.headimgurl+')');
			$('#dancename').html(info.teamname);
			$('#signature').html(info.signature);
		}
	}
	function piao(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			var info=res.data;
			$('#piao').html(info[0].zannumber);
		}
	}
	function workset(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			var info=res.data;
			for(var i=0;i<info.length;i++){
				if(info[i].auditstatus=='0'){
					str+=info[i].videocode+',';
				}
			}
			if(str){
				str=str.substring(0,str.length-1);
				dancework.videocodelist=str;
				ajax.getData(allwork,worklist,dancework)
			}
			
		}
	}
	function worklist(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			ajax.add_dian(res);
			var info=res.data,html='';
			for(var n=0;n<info.length;n++){
				if(!info[n].posterurl){
					info[n].posterurl=m_publicUrl+'img/workdefault.png';
				}
				arr[arr.length]=info[n].videocode;
				html+='<li><div class="lt" videocode="'+info[n].videocode+'"><a href="../MyDance/detail?videocode='+info[n].videocode+'"><img src="'+info[n].posterurl+'" alt="" /></a><i style="background-image:url(__PUBLIC__/img/index/play.png)"></i></div><div class="rt"><p id="videoname">'+info[n].videoname+'</p><dl id="votedl"><dt class="zan_cun" videocode="'+info[n].videocode+'"><img src="'+m_publicUrl+'/img/star/zan.png" style="height:0.59rem;"alt="" /></dt><dd>投一票</dd></dl><dl id="zhuandl"><dt><img src="'+m_publicUrl+'/img/star/zhuan.png" style="height:0.51rem;"alt="" /></dt><dd>转发</dd></dl></div></li>'
			}
			$('#workload').html(html);
			//判断用户是否投票
			ajax.getData(userurl,userzan,userdata);
		}
	}
	function dianzan(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			tp.ui.alert('点赞成功！',function(){
				
			})
		}
	}
	if(teamcode){
		/*获取舞队信息*/
		teamdata.teamcode=teamcode;
		ajax.getData(teamurl,teaminfo,teamdata);
		/*获取点赞数量*/
		piaodata.datalist=teamcode;
		ajax.getData(piaonum,piao,piaodata);
		/*获取舞队作品列表*/
		workdata.otype='1';
		workdata.teamcode=teamcode;
		ajax.getData(workurl,workset,workdata);
	}
	/*给点赞按钮添加事件*/
	$('#workload').on('click','.zan_cun',function(){
		zan.teamcode=teamcode;
		zan.videocode=$(this).attr('videocode');
		zan.unionid=m_unionid;
		if($(this).children().eq(0).attr('src')==m_publicUrl+'/img/star/zan.png'){
			$(this).children().eq(0).attr('src',m_publicUrl+'/img/star/yizan.png');
			ajax.getData(zanurl,dianzan,zan);
		}else{
			tp.ui.alert('您已经投过票了！',function(){
				
			})
		}
		
	})
})