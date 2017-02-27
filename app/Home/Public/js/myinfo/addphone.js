require(['zepto','Adapter_screen','tp_util','ajax_model'],function($,adapter,tp,ajax){
	/*对屏幕进行适配*/
	adapter.adapter();
	var userinfo=config.tp_wcs_getuserinfo_url;
	var codeurl=config.tp_wcs_send_verifycode_url;
	var isnum=true,phonenum,time=90,infocun,codedata={},passval,subdata={};
	/*更改(绑定)手机号接口*/
	var submiturl=config.tp_wcs_gai_phone_url;
	function user(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			infocun=res.data.phone;
		}
	}
	ajax.getData(userinfo,user,{})
	function codetime(){
		isnum=false;
		var timer=setInterval(function(){
			if(time>0){
				time=time-1;
				$('.time').html('重新发送'+time+'s');
			}else{
				clearInterval(timer);
				$('.time').html('重新发送');
				isnum=true;
				time=90;
			}
		},1000)	
	}
	$('.time').click(function(){
		if($('#number').val()==''){
			tp.ui.alert('请输入手机号！');
			$('#number').val('');
			return;
		}
		var flag=tp.checkPhone($('#number').val());
		if(!flag){
			tp.ui.alert('请输入正确的手机号！');
			$('#number').val('');
			return;
		}
		phonenum=$('#number').val();
		codedata.phone=phonenum;
		codedata.verifysource=2;
		codedata.extendtag='{"token":"'+m_token+'","uid":"'+m_cur_uid+'"}';
		function sendcode(res){
			console.log(res);
			if (!res) return;
			if(res.retcode!=0){
				tp.ui.alert("验证码发送失败!");
			}else{
				tp.ui.alert("验证码发送成功!");
				codetime();
			}
		}
		if(isnum){
			ajax.getData(codeurl,sendcode,codedata);
		}
	})
	$('.sure').click(function(){
		if($('#number').val()==''){
			tp.ui.alert('请输入手机号！');
			return;
		}
		if(!tp.checkPhone($('#number').val())){
			tp.ui.alert('请输入正确的手机号！');
			$('#number').val('');
			return;
		}
		if($('#code').val()==''){
			tp.ui.alert('请输入验证码！');
			return;
		}
		if($('#code').val().length!=4){
			tp.ui.alert('验证码长度为4位！');
			$('#code').val('');
			return;
		}
		
		passval=$('#pass').val();
		if(passval==''){
			tp.ui.alert('请输入密码！');
			return;
		}
		if(passval.length>16 || passval.length<6){
			tp.ui.alert('请输入6到16位密码！');
			return;
		}
		var conval=$('#confirm').val();
		if(conval==''){
			tp.ui.alert('请再次输入密码！')
			return;
		}
		if(conval!=passval){
			tp.ui.alert('两次密码输入不一致,请确认后再输入!');
			$('#confirm').val('');
			return;
		}
		subdata.phone=$('#number').val();
		subdata.verifycode=$('#code').val();
		subdata.password=$('#pass').val();
		/*提交修改*/
	 	ajax.getData(submiturl,function(res){
		 	if(!res) return;
			if (res.retcode != 0) {
	            if (res.retcode == 201039) {
	                tp.ui.alert("验证码错误！");
	                return;
	            }
	            if (res.retcode == 201040) {
	                tp.ui.alert("验证码超时！");
	                return;
	            }
	            tp.ui.alert("绑定失败！[" + res.retcode + "]");
	            	return;
	       }
			if(!infocun){
				tp.ui.alert("绑定成功！", function () {
                	var seturl= config.tp_wcp_myset_page;
               		 tp.redirectUrl(seturl);
            	});
			}else{
				tp.ui.alert("修改绑定手机号成功！", function () {
                	var seturl= config.tp_wcp_myset_page;
               		tp.redirectUrl(seturl);
            	});
			}
            
        },subdata);
	})	
})