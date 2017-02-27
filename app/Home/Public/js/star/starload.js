require(['zepto','Adapter_screen','ajax_model','tp_util'],function($,adapter,ajax,tp){
	/*对屏幕进行适配*/
	adapter.adapter();
	var mytype=tp.getQueryString('mytype');
	var userurl=config.tp_wcs_getuserinfo_url;
	var dancework=config.tp_wcs_workslist_url;
	var joinurl=config.tp_wcs_video_join_url;
	var videourl=config.tp_wcs_get_video_url;
	var userdata={},dancedata={},temp,flag=false,setarr=[],arr=[],arr_code='',videodata={},join_work={},dui_index=0;
	if(mytype==1){
		$('#sign').html('我的舞队月度之星');
	}else{
		$('#sign').html('我的才艺秀');
		$('#btn').css('display','block');
	}
	ajax.getData(userurl,userinfo,userdata);
	function userinfo(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			var info=res.data;
			if(mytype==1){
				videodata.teamcode=info.teamcode;
				videodata.otype=1;
				dancedata.teamcode=info.teamcode;
				join_work.teamcode=info.teamcode;
				join_work.stype=1;
				join_work.otype=1;
				dancedata.type=1;
				temp=info.memtype;
			}else{
				dancedata.type=0;
				videodata.otype=2;
				join_work.stype=0;
				join_work.otype=2;
				
			}
			ajax.getData(videourl,videoset,videodata);
		}
	}
	function videoset(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			var info=res.data;
			for(var n=0;n<info.length;n++){
				//存储已设置的视屏编码
				setarr[n]=info[n].videocode;
			}
			ajax.getData(dancework,dancelist,dancedata);
		}
	}
	function dancelist(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			var info=res.data,html='';
			for(var t=0;t<info.length;t++){
				if(!info[t].posterurl){
					info[t].posterurl=m_publicUrl+'img/workdefault.png'
				}
				if(info[t].videostatus==0){
					/*存储所有视频编码*/
					arr[arr.length]=info[t].videocode;
					info[t].submit_time=info[t].submit_time.substring(0,10);
					html+='<dl><dt><a href="../MyDance/detail?videocode='+info[t].videocode+'"><img src="'+info[t].posterurl+'" alt="" /></a><i class="yuan"><em class="dui"></em></i></dt><dd>舞曲：<span>'+info[t].videoname+'</span></dd><dd>上传：<span>'+info[t].submit_time+'</span></dd></dl>'
				}
			}
			$('.list').html(html);
			/*给已参赛作品显示按钮*/
			for(var m=0;m<arr.length;m++){
				for(var h=0;h<setarr.length;h++){
					if(arr[m].videocode==setarr[h]){
						$('.yuan').eq(m).css('display','block');
						$('.dui').eq(m).addClass('active');
					}
				}
			}
			
			danceclick();
		}
	}
	function danceclick(){
		if(temp==1 || mytype==0){
			$('.yuan').css('display','block');
			$('#btn').css('display','block');
			/*给对号按钮添加事件*/
			$('.list').on('click','.yuan',function(){
				for(var k=0;k<$('.dui').length;k++){
					if($('.dui').eq(k).hasClass('active')){
						dui_index++;
					}
				}
				if(dui_index>10){
					tp.ui.alert('最多选择10个视频参赛！')
				}else{
					 $(this).children().eq(0).toggleClass("active");
				}
				
			})
			/*参赛按钮点击事件*/
			$('#btn').click(function(){
				if($('dl').length!=0){
					for(var k=0;k<$('.dui').length;k++){
						if($('.dui').eq(k).hasClass('active')){
							arr_code+=$('dt').eq(k).attr('videocode')+',';
						}
					}
					arr_code=arr_code.substring(0,arr_code.length-1);
					//console.log(arr_code);
					if(arr_code){
						join_work.videolist=arr_code;
						ajax.getData(joinurl,videojoin,join_work)
					}
				}else{
					tp.ui.alert('请先上传作品！');
				}
			})
		}
	}
	function videojoin(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			tp.ui.alert("您已成功参赛！")
		}else{
			tp.ui.alert("参赛失败请稍后再试！")
		}
	}
	
	
})