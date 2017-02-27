require(['zepto','Adapter_screen','ajax_model','tp_util'],function($,adapter,ajax,tp){
	/*对屏幕进行适配*/
	adapter.adapter();
	$('#edite').click(function(){
		$('.mask').css('display','block');
		$('.setzuo').css('display','block');
	})
	$('.mask').click(function(){
		$('.mask').css('display','none');
		$('.setzuo').css('display','none');
	})
	$('#delete').click(function(){
		//alert(1);
		if($('#main').children().length==0){
			tp.ui.alert('没有可编辑的作品！');
			return;
		}
		$('.mask').css('display','none');
		$('.yuan').css('display','block');
		$('.setzuo').css('display','none');
	})
	/*加载作品信息*/
	var workurl=config.tp_wcs_workslist_url;
	var type=tp.getQueryString('worktype');
	var teamcode,memtype;
	var temp,yuanid;
	var deleurl=config.tp_wcs_work_del_url;
	var userinfo=config.tp_wcs_getuserinfo_url;
	var alldata=[],successdata=[],loaddata=[],faildata=[];
	/*获取个人信息*/
	ajax.getData(userinfo,function(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			teamcode=res.data.teamcode;
			memtype=res.data.memtype;
			check(teamcode,memtype)
		}
	},{})
	/*第一次进入加载数据*/
	function dancework(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			ajax.add_dian(res);
			var info=res.data,html='';
			for(var j=0;j<info.length;j++){
				if(!info[j].posterurl){
					info[j].posterurl=m_publicUrl+'/img/workdefault.png';
				}
				/*存储全部数据*/
				alldata[j]=info[j];
				/*存储其他数据*/
				if(info[j].videostatus==0){
					successdata[successdata.length]=info[j];
				}else if(info[j].videostatus==1){
					loaddata[loaddata.length]=info[j];
				}else{
					faildata[faildata.length]=info[j];
				}
				html+='<dl><dt videocode="'+info[j].videocode+'"><a href="../MyDance/detail?videocode='+info[j].videocode+'"><img src="'+info[j].posterurl+'" alt="" /></a><i></i><span videocode="'+info[j].videocode+'" id="yuan'+j+'"class="yuan"><em></em></span></dt><dd class="music">舞曲：<span>'+info[j].videoname+'</span></dd></dl>'
			}
			$('#main').html(html);
			
		}
	}
	function delwork(res){
		console.log(res);
		if(res.retcode=='0'){
			$('.yuan').css('display','none');
			var num=yuanid.substring(4);
			$('dl').eq(num).remove();
			tp.ui.alert("删除成功！")
		}else{
			tp.ui.alert("删除失败，请稍后再试！");
			$('#'+yuanid).children().eq(0).css('display','none');
		}
	}
	function check(teamcode,memtype){
		if(type==1){
			$('#worktype').html('舞队作品');
			var dancedata={
				'teamcode':teamcode,
				'type':'1',
				'videostatus':'99'
			}
			ajax.getData(workurl,dancework,dancedata);
			/*判断是否队长*/
			if(memtype=='1'){
				$('#edite').css('display','block');
			}
			/*舞队删除作品*/
			$('#main').on('click','.yuan',function(){
				$(this).children().eq(0).css('display','block');
				$('.mask').css('display','block');
				$('.sure').css('display','block');
				temp=$(this).attr('videocode');
				yuanid=$(this).attr('id');
			})
			$('#esc').click(function(){
				$('.sure').css('display','none');
				$('.mask').css('display','none');
				$('#'+yuanid).css('display','none');
			})
			$('#yes').click(function(){
				$('.sure').css('display','none');
				$('.mask').css('display','none');
				var deldata={
					'videocode':temp,
					'teamcode':teamcode,
					'type':'1'
				}
				
				ajax.getData(deleurl,delwork,deldata);
			})
		}
		/*个人作品编辑*/
		if(type==0){
			$('#worktype').html('我的作品');
			$('#edite').css('display','block');
			var mydata={
				'type':0,
				'videostatus':'99'
			};
			ajax.getData(workurl,dancework,mydata);
			/*个人删除作品*/
			$('#main').on('click','.yuan',function(){
				$(this).children().eq(0).css('display','block');
				$('.mask').css('display','block');
				$('.sure').css('display','block');
				temp=$(this).attr('videocode');
				yuanid=$(this).attr('id');
			})
			$('#esc').click(function(){
				$('.sure').css('display','none');
				$('.mask').css('display','none');
				$('#'+yuanid).css('display','none');
			})
			$('#yes').click(function(){
				$('.sure').css('display','none');
				$('.mask').css('display','none');
				$('#'+yuanid).css('display','none');
				var deldata={
					'videocode':temp,
					'type':'0'
				}
				ajax.getData(deleurl,delwork,deldata);
			})
		}
	}	
	/*导航栏点击切换数据*/
	function navload(data){
		var navhtml='',info=data;
		for(var k=0;k<data.length;k++){
			navhtml+='<dl><dt videocode="'+info[k].videocode+'"><a href="../MyDance/detail"><img src="'+info[k].posterurl+'" alt="" /></a><i></i><span videocode="'+info[k].videocode+'" id="yuan'+k+'"class="yuan"><em></em></span></dt><dd class="music">舞曲：<span>'+info[k].videoname+'</span></dd></dl>'
		}
		$('#main').html(navhtml);
	}
	var index;
	for(var i=0;i<$('nav').children().length;i++){
		$('nav').children().eq(i).click(function(){
			for(var g=0;g<$('nav').children().length;g++){
				$('nav').children().eq(g)[0].className='';
			}
			index=$(this).index();
			$(this)[0].className='active';
			if(index==0){
				navload(alldata);
			}else if(index==1){
				navload(successdata);
			}else if(index==2){
				navload(loaddata);
			}else{
				navload(faildata);
			}
		})
	}
})