require(['zepto','Adapter_screen','myinfo/loadhead','ajax_model','LArea','tp_util','signature'],function($,adapter,load,ajax,larea,tp,sg){
	/*对屏幕进行适配*/
	adapter.adapter();
	/*获取用户信息*/
	var teamcode,data={},adressdata={};
	var userurl=config.tp_wcs_getuserinfo_url;
	ajax.getData(userurl,function(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			teamcode=res.data.teamcode;
			data.teamcode=teamcode;
			adressdata.teamcode=teamcode;
		    ajax.getData(dance_url,danceinfo,data);
		}
	},{})
	/*加载头像模块*/
	load.loadhead('head',teamcode);
	$('#myimg').attr('src',m_publicUrl+'/img/myinfo/my.png');
	$('#starimg').attr('src',m_publicUrl+'/img/star/shangtv.png');
	$('#activeimg').attr('src',m_publicUrl+'/img/myinfo/active.png');
	/*地址选择模块*/
	var area = new LArea();
	area.init({
        'trigger': '#adress', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
        'valueTo': '#code', //选择完毕后id属性输出到该位置
        'ok':function(){
        	adress($('#adress').val());
        	localStorage.setItem('danceadresscode',$('#code').val());
        },
        'keys': {
            id: 'id',
            name: 'name'
        }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
        'type': 1, //数据源类型
        'data': LAreaData //数据源
    });
    //area.value=[1,13,3];//控制初始位置，注意：该方法并不会影响到input的value
	/*获取舞队信息*/
	var dance_url=config.tp_wcs_dance_info_url;
	var info_update=config.tp_wcs_dance_update_url;
	//舞队签名和名称修改模块
	new input({id:'dancename',title:'舞队名称',ok:function(){
				var danceval=$('textarea').val();
				ajax.getData(info_update,function(res){
					//console.log(res);
					if(!res) return;
					if(res.retcode==0){
						if(danceval.length>12){
							danceval=danceval.substring(0,11)+'...';
						}
						$('#dancename').html(danceval);
					}else{
						tp.ui.alert('修改失败，请稍后再试！')
					}
				},{
					'datalist':'[{"key":"teamname","value":"'+danceval+'"}]',
					'teamcode':teamcode
				})
		}});
	new input({id:'signature',title:'舞队公告',ok:function(){
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
					'datalist':'[{"key":"signature","value":"'+signval+'"}]',
					'teamcode':teamcode
				})
		}});	
	function danceinfo(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			var info=res.data;
			ajax.add_dian(res);
			if(!info.headimgurl){
				info.headimgurl=m_publicUrl+'img/workdefault.png';
			}
			$('#head').css('background-image','url('+info.headimgurl+')');
			$('#dancename').html(info.teamname);
			if(info.signature.length>12){
				info.signature=info.signature.substring(0,11)+'...';
			}
			$('#signature').html(info.signature);
			if(info.city && info.province){
				$('#adress').val(info.province+','+info.city+','+info.district);
			}else if(info.city && !info.province){
				$('#adress').val(info.city+','+info.district);
			}else{
				$('#adress').val('请选择');
			}
		}
	}
	
	/*设置地址初始信息*/
	 function adressinit(){
   		var code=localStorage.getItem('danceadresscode');
    	if(!code) return;
    	console.log(code);
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
    /*修改地域信息提交*/
	var province,city,district;
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
		adressdata.datalist='[{"key":"province","value":"'+province+'"},{"key":"city","value":"'+city+'"},{"key":"district","value":"'+district+'"}]'
		function adressback(res){
			console.log(res);
		}
		ajax.getData(info_update,adressback,adressdata);
	}
})