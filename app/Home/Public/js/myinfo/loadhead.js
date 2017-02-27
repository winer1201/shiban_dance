define(['zepto','ajax_model','tp_util'],function($,ajax,tp){
	/*此模块用于上传头像*/
	return {	
		loadhead:function(dom,teamcode){
			var that=this;
			$("#file").change(function(){
				var file = new FileReader(); //读文件二进制
				if(!/image\/\w+/.test(this.files[0].type)){  
				    tp.ui.alert("请确保文件为图像类型");  
				    return false;  
				} 
				console.log(this.files[0])
				if(this.files[0].size>153600){
					tp.ui.alert("图片文件过大，请重新选取");  
				    return false;  
				}
				// 将 file 文件转换为 base64
				file.readAsDataURL(this.files[0]);
				file.onload = function(e){
					//图片的 base64
					var base64 = e.target.result;
					if(!teamcode){
						that.loadinfo(base64,dom);
					}else{
						that.loaddance(base64,teamcode,dom);	
					}
				}
			})
		},
		loadinfo:function(url,dom){
			var headurl=config.tp_wcs_user_update_url;
			var headdata={
				'datalist':'[{"key":"headimgurl","value":"'+url+'"}]'
			}
			function sethead(res){
				if(!res) return;
				console.log(res);
				if(res.retcode==0){
					$('#'+dom).css({'background-image':'url('+url+')','background-size':'100% 100%'});
				}
			}
			ajax.getData(headurl,sethead,headdata);
		},
		loaddance:function(url,teamcode,dom){
			var headurl=config.tp_wcs_dance_update_url;
			var headdata={
				'teamcode':teamcode,
				'datalist':'[{"key":"headimgurl","value":"'+url+'"}]'
			}
			function sethead(res){
				if(!res) return;
				console.log(res);
				if(res.retcode==0){
					$('#'+dom).css({'background-image':'url('+url+')','background-size':'100% 100%'});
				}
			}
			ajax.getData(headurl,sethead,headdata);
		},
		createdance:function(dom){
			$("#file").change(function(){
				var file = new FileReader(); //读文件二进制
				var reg=/image\/\w+/;
				if(!reg.test(this.files[0].type)){  
				    tp.ui.alert("请确保文件为图像类型");  
				    return false;  
				} 
				console.log(this.files[0])
				if(this.files[0].size>153600){
					tp.ui.alert("图片文件过大，请重新选取");  
				    return false;  
				}
				//console.log(file)
				// 将 file 文件转换为 base64
				file.readAsDataURL(this.files[0]);
				file.onload = function(e){
					//图片的 base64
					var base64 = e.target.result;
					$('#'+dom).css({'background-image':'url('+base64+')','background-size':'100% 100%'});
					return base64;
				}
			})
		}
	}
})
