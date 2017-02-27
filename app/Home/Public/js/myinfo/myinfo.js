require(['zepto','Adapter_screen','myinfo/loadhead','ajax_model','tp_util'],function($,adapter,load,ajax,tp){
	/*对屏幕进行适配*/
	adapter.adapter();
	/*加载上传头像模块*/
	//load.loadhead('load');
	/*获取用户信息调用ajax模块*/
	var getuser_url= config.tp_wcs_getuserinfo_url;
	var exiturl=config.tp_wcp_logout_url;
	var data={},exitdata={};
	$('#myimg').attr('src',m_publicUrl+'/img/myinfo/my.png');
	$('#starimg').attr('src',m_publicUrl+'/img/star/shangtv.png');
	$('#activeimg').attr('src',m_publicUrl+'/img/myinfo/active.png');
	function info(res){
		console.log(res);
		if(res.retcode==0){
			var info=res.data;
			//昵称
			if(info.nickname){
				$('#nick').html(info.nickname);
			}else{
				$('#nick').html('未命名');
			}
			//签名
			if(info.signature){
				$('#sign').html(info.signature);
			}else{
				$('#sign').html('签名：');
			}
			//头像
			if(info.headimgurl){
				$('#load').css('background-image','url('+info.headimgurl+')');
			}else{
				$('#load').css('background-image','url('+m_publicUrl+'/img/myinfo/header.png)');
			}
			/*判断是否有舞队，没有舞队跳到创建舞队页，有的话跳到我的舞队*/
			if(info.teamcode){
				$('#tiao').attr('href','../MyDance/dance?teamcode='+info.teamcode+'');
				$('#works').attr('href','../MyDance/works?worktype=1');
			}else{
				$('#tiao').attr('href','../MyDance/join');
				$('#works').click(function(){
					$('.sure').css('display','block');
				})
				$('#sure_btn').click(function(){
					$('.sure').css('display','none');
					window.location.href='../MyDance/join';
				})
				$('#esc').click(function(){
					$('.sure').css('display','none');
				})
			}
			$('#works').attr('teamcode',info.teamcode);
		}
		
	}
	function exituser(res){
		//console.log(res);
		if(!res) return;
		if(res.retcode==0){
			window.location.href='../myinfo/info';
		}
	}
	/*判断是否登录*/
	if(m_cur_uid){
		ajax.getData(getuser_url,info,data);
		$('#exit').css('display','block');
	}else{
		$('#login').css('display','block');
		$('.info').css('display','none');
		$('#works').attr('href','../user/login');
		$('#tiao').attr('href','../user/login');
		$('#load').css('background-image','url('+m_publicUrl+'/img/myinfo/header.png');
	}
	/*退出事件*/
	$('#exit').click(function(){
		 tp.ui.confirm('确定退出登录吗？',function(){
		 	ajax.getData(exiturl,exituser,exitdata);
		 },function(){
		 	
		 })
	})
})