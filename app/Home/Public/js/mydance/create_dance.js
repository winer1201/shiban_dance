require(['zepto','Adapter_screen','myinfo/loadhead','ajax_model','tp_util','LArea'],function($,Adapter,load,ajax,tp,larea){
	/*对屏幕进行适配*/
	Adapter.adapter();
	/*载入上传头像模块*/
	var headimgurl=load.createdance('load'),phonenum='';
	/*载入地址模块*/
	var area = new LArea();
	area.init({
        'trigger': '#adress', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
        'valueTo': '#code', //选择完毕后id属性输出到该位置
        'keys': {
            id: 'id',
            name: 'name'
        }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
        'type': 1, //数据源类型
        'data': LAreaData //数据源
    });
	/*ajax模块调用创建舞队*/
	var url=config.tp_wcs_create_dance_url;
	//var codeurl = config.tp_wcs_send_verifycode_url;
	//var checkurl=config.tp_wcs_checkcode_url;
		function create(res){
			console.log(res);
			if(res.retcode==0){
				//localStorage.setItem('teamcode',); 
				var targeturl= config.tp_wcp_danceindex_page;
				var targeturl= config.tp_wcp_danceindex_page;
					targeturl = tp.appendParam(targeturl, 'teamcode',res.data.teamcode);
					tp.redirectUrl(targeturl);
			}
		}
		/*function checkMobile(str) {
			var re = /^1\d{10}$/
		    if (!re.test(str)) {
		        tp.ui.alert("请输入正确的手机号",function(){
		        	$('#phone').val('');
		   	 	})
		    }     
		}*/
		/*$('#phone').blur(function(){
			phonenum=$('#phone').val();
			checkMobile(phonenum);
		})*/
		var data,teamname,city,province,district,street,posterurl,time=90,flag=true,code;
		/*$('#code').click(function(){
			if($('#phone').val()==''){
				tp.ui.alert('请输入手机号！',function(){
				});
				return;
			}
			if(flag){
				flag=false;
				var timer=setInterval(function(){
					if(time>0){
						time=time-1;
						$('#code').html('重新发送'+time+'s');
					}else{
						clearInterval(timer);
						$('#code').html('重新发送');
						flag=true;
						time=90;
					}
					
				},1000)
				phonenum=$('#phone').val();
				ajax.getData(codeurl,function(res){
					console.log(res);
					if (!res) return;
		            if (res.retcode != 0) {
		                tp.ui.alert("验证码发送失败！[" + res.retcode + "]")
		                return;
		            }else{
		            	tp.ui.alert("验证码已发送！")
		            }
				},{'phone':phonenum,'verifysource':'4'})
			}
		})*/
		$('#dancename').blur(function(){
			teamname=$('#dancename').val();
			if(teamname==''){
				tp.ui.alert('请输入舞队名称！');
			}
		})
		$('#sure').click(function(){
			teamname=$('#dancename').val();
			var val=$('#adress').val();
			var num=val.indexOf(',');
			var first=val.substring(0,num);
			val=val.substring(num+1);
			var numtwo=val.indexOf(',');
			if(numtwo==-1){
				var second=val;
				city=first;
				district=second;
			}else{
				var second=val.substring(0,numtwo);
				var thrid=val.substring(numtwo+1);
				province=first;
				city=second;
				district=thrid;
			}
			if(!province){
				province='';
			}
			headimgurl=$('#load').css('background-image');
			if(headimgurl){
				headimgurl=headimgurl.substring(5,headimgurl.length-2);
			}else{
				headimgurl='';
			}
			if(teamname && city && district){
				/*ajax.getData(checkurl,function(res){
					console.log(res);
				},{'phone':phonenum,'checknumber':code})*/
				data={
					'teamname':teamname,
					'city':city,
					'province':province,
					'district':district,
					'headimgurl':headimgurl
				}
				ajax.getData(url,create,data);
			}else{
				tp.ui.alert('请将信息补全后再试！');
			}
		})
})