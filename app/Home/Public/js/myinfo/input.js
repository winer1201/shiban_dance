require(['zepto','Adapter_screen','ajax_model','tp_util'],function($,adapter,ajax,tp){
	/*调用屏幕适配模块*/
	adapter.adapter();
	/*btn点击事件确定当前输入时签名还是昵称*/
	var url=config.tp_wcs_user_update_url;
	var danceinfo=config.tp_wcs_dance_info_url;
	var userinfo=config.tp_wcs_getuserinfo_url;
	var danceurl=config.tp_wcs_dance_update_url;
	var txttype=tp.getQueryString('txttype')
	var value,teamcode,dancedata={},data={},teamdata={},nickvalue,signature,dancename,dancesignature;
	/*获取用户信息*/
	ajax.getData(userinfo,function(res){
		//console.log(res);
		if(!res) return;
		if(res.retcode==0){
			teamcode=res.data.teamcode;
			dancedata.teamcode=teamcode;
			nickvalue=res.data.nickname;
			signature=res.data.signature;
			teamdata.teamcode=teamcode;
			ajax.getData(danceinfo,function(res){
				//console.log(res);
				if(!res) return;
				if(res.retcode==0){
					dancename=res.data.teamname;
					dancesignature=res.data.signature;
					if(txttype=='2'){
						$('textarea').attr('maxlength','80');
						$('textarea').html(signature);
					}else if(txttype=='1'){
						$('textarea').html(nickvalue);
					}else if(txttype=='3'){
						$('textarea').html(dancename);
					}else{
						$('textarea').html(dancesignature);
					}
				}
			},teamdata)
		}
	},{})
	function xiuinfo(res){
		console.log(res);
		if(!res) return;
		if(res.retcode=='0'){
			window.location.href='../myinfo/set';
		}
	}
	function xiudance(res){
		console.log(res);
		if(!res) return;
		if(res.retcode=='0'){
			window.location.href='../MyDance/set?teamcode='+teamcode+'';
		}
	}
	$('#btn').click(function(){
		value=$('textarea').val();
		console.log(value)
		if(!value) return;
		if(txttype=='1'){
			data.datalist='[{"key":"nickname","value":"'+value+'"}]';
			ajax.getData(url,xiuinfo,data);
		}else if(txttype=='2'){
			data.datalist='[{"key":"signature","value":"'+value+'"}]';
			ajax.getData(url,xiuinfo,data);
		}else if(txttype=='3'){
			dancedata.datalist='[{"key":"teamname","value":"'+value+'"}]';
			ajax.getData(danceurl,xiudance,dancedata);
		}else{
			dancedata.datalist='[{"key":"signature","value":"'+value+'"}]';
			ajax.getData(danceurl,xiudance,dancedata);
		}
		
	})
	
	
})
