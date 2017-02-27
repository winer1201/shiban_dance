require(['zepto','Adapter_screen','mdater','ajax_model','LArea','swiper','tp_util','signature'],function($,adapter,mdater,ajax,LArea,swiper,tp,sign){
	/*调用屏幕适配模块*/
	adapter.adapter();
	/*日期控件*/
	$('#date').mdater({
		minDate : new Date(1910, 12, 13)
	});
	/*地址控件*/
	var area = new LArea();
	area.init({
        'trigger': '#adress', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
        'valueTo': '#code', //选择完毕后id属性输出到该位置
        'ok':function(){
        	adress($('#adress').val());
        	localStorage.setItem('adresscode',$('#code').val());
        },
        'keys': {
            id: 'id',
            name: 'name'
        }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
        'type': 1, //数据源类型
        'data': LAreaData //数据源
    });
    $('#myimg').attr('src',m_publicUrl+'/img/myinfo/my.png');
	$('#starimg').attr('src',m_publicUrl+'/img/star/shangtv.png');
	$('#activeimg').attr('src',m_publicUrl+'/img/myinfo/active.png');
   //area.value=[2,2288];//控制初始位置，注意：该方法并不会影响到input的value
   function adressinit(){
   		var code=localStorage.getItem('adresscode');
    	if(!code) return;
    	//console.log(code);
    	var onenum=code.indexOf(',');
    	var valueid='';
    	var arrone=code.substring(0,onenum);
    		code=code.substring(onenum+1);
    	var twonum=code.indexOf(',');
    	if(twonum==-1){
    		for(var j=0;j<LAreaData.length;j++){
    			if(LAreaData[j].id==arrone){
    				arrone=j;
    				for(var n=0;n<LAreaData[j].child.length;n++){
    					if(LAreaData[j].child[n].id==code){
    						code=n;
    						break;
    					}
    				}
    				break;
    			}
    		}
    		area.value=[arrone,code];
    	}else{
    		var arrtwo=code.substring(0,twonum);
    		code=code.substring(twonum+1);
    		for(var k=0;k<LAreaData.length;k++){
    			if(LAreaData[k].id==arrone){
    				arrone=k;
    				for(var m=0;m<LAreaData[k].child.length;m++){
    					if(LAreaData[k].child[m].id==arrtwo){
    						arrtwo=m;
    						for(var h=0;h<LAreaData[k].child[m].child.length;h++){
    							if(LAreaData[k].child[m].child[h].id==code){
    								code=h;
    								break;
    							}
    						}
    					}
    					break;
    				}
    			}
    			break;
    		}
    		area.value=[arrone,arrtwo,code];
    	}
   }
    adressinit();
   	 /*swiper控件*/
   	var mySwiper = new Swiper('.swiper-container', {
			direction : 'vertical',
			//initialSlide :2
		})
	/*选择性别*/
	$('#sex').click(function(){
		$('.sex').addClass('active');
		$('.mask').css('display','block');
		if($('#sex').html()=='女'){
			if(!$('.swiper-wrapper').hasClass('wrap_active')){
				$('.swiper-wrapper').addClass('wrap_active');
				$('.swiper-slide').eq(0).removeClass('swiper-slide-active');
				$('.swiper-slide').eq(1).addClass('swiper-slide-active');
			}
		}
	})
	$('.mask').click(function(){
		$(this).css('display','none');
		$('.sex').removeClass("active");
	})
	$('.esc').click(function(){
		$('.sex').removeClass("active");
		$('.mask').css('display','none');
	})
	/*修改性别信息提交*/
	var info_update=config.tp_wcs_user_update_url;
	var sexdata={};
	$('.yes').click(function(){
		$('.sex').removeClass("active");
		$('.mask').css('display','none');
		if($('.swiper-slide').eq(0).hasClass('swiper-slide-active')){
			sexdata={
				'datalist':'[{"key":"sex","value":"1"}]'
			}
			function sex(res){
				//console.log(res);
				if(!res) return;
				if(res.retcode==0){
					$('#sex').html('男');
				}
			}
			ajax.getData(info_update,sex,sexdata);
		}else{
			sexdata={
				'datalist':'[{"key":"sex","value":"2"}]'
			}
			function sex(res){
				console.log(res);
				if(!res) return;
				if(res.retcode==0){
					$('#sex').html('女');
				}
			}
			ajax.getData(info_update,sex,sexdata);
		}
		
	})
	//签名和昵称修改
	new input({id:'nick',title:'我的昵称',ok:function(){
				var nickval=$('textarea').val();
				ajax.getData(info_update,function(res){
					//console.log(res);
					if(!res) return;
					if(res.retcode==0){
						if(nickval.length>12){
							nickval=nickval.substring(0,11)+'...';
						}
						$('#nick').html(nickval);
					}else{
						tp.ui.alert('修改失败，请稍后再试！')
					}
				},{
					'datalist':'[{"key":"nickname","value":"'+nickval+'"}]'
				})
		}});
	new input({id:'signature',title:'我的签名',ok:function(){
				var signval=$('textarea').val();
				ajax.getData(info_update,function(res){
					//console.log(res);
					if(!res) return;
					if(res.retcode==0){
						if(signval.length>12){
							signval=signval.substring(0,11)+'...';
						}
						$('#signature').html(signval);
					}else{
						tp.ui.alert('修改失败，请稍后再试！')
					}
				},{
					'datalist':'[{"key":"signature","value":"'+signval+'"}]'
				})
	}});	
	/*修改地域信息提交*/
	var adressdata={},province,city,district;
	function adress(val){
		console.log(val);
		province='',city='',district='';
		if(!val) return;
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
		adressdata={
			'datalist':'[{"key":"province","value":"'+province+'"},{"key":"city","value":"'+city+'"},{"key":"district","value":"'+district+'"}]'
		}
		function adressback(res){
			console.log(res);
		}
		ajax.getData(info_update,adressback,adressdata);
	}
	/*出生日期信息提交*/
	var datedata={},dateval='';
	function setdate(res){
		console.log(res);
	}
	$(document).on('click','.md_ok',function(){
		setTimeout(function(){
			dateval=$('#date').val();
			console.log(dateval);
			sexdata={
				'datalist':'[{"key":"birthday","value":"'+dateval+'"}]'
			}
			ajax.getData(info_update,setdate,sexdata)
		},500)
		
	})
	/*加载获取数据ajax模块*/
	var getuser_url= config.tp_wcs_getuserinfo_url;
	var data={};
	function set(res){
		//console.log(res);
		if(!res) return;
		if(res.retcode==0){
			var info=res.data;
			if(info.headimgurl){
				$('#head').css('background-image','url('+info.headimgurl+')');
			}
			$('#nick').html(info.nickname);
			if(info.sex==1){
				$('#sex').html('男');
			}else if(info.sex==2){
				$('#sex').html('女');
			}else{
				$('#sex').html('请选择');
			}
			if(info.birthday){
				$('#date').val(info.birthday);
			}
			if(info.signature){
				if(info.signature.length>12){
					info.signature=info.signature.substring(0,11)+'...';
				}
				$('#signature').html(info.signature);
			}else{
				$('#signature').html('请输入');
			}
			if(info.phone){
				$('#phone').html(info.phone);
			}else{
				$('#phone').html('请添加');
			}
			if(info.city && info.province){
				$('#adress').val(info.province+','+info.city+','+info.district);
			}else if(info.city && !info.province){
				$('#adress').val(info.city+','+info.district);
			}else{
				$('#adress').val('请选择');
			}
		}
		
	}
	ajax.getData(getuser_url,set,data);
	$('#phone_dian').click(function(){
		var tel_val=$('#phone').val();
		var addpage=config.tp_wcp_addphone_page;
		if(tel_val==''){
			tp.redirectUrl(addpage);	
		}else{
			 tp.ui.confirm('您已经绑定手机号，是否要修改绑定的手机号?',function(){
			 	 tp.redirectUrl(addpage);
			 })
		}
		
	})
		
		
		

})