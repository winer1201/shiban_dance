define(['zepto','get_param'],function($,param){
	return {
		getRandom:function(){
	        var dom = Math.random();
	       		dom = dom * 100000;
	      		dom = Math.floor(dom);
	        	return dom;
   		},
   		/*getparam:function(){
   				var uid=param.getQueryString('uid');
				var token=param.getQueryString('token');
				return {
					'uid':uid,
					'token':token
				}
   		},*/
		getData : function(url,callback,obj){
			var num=this.getRandom();
			obj._v=num;
			//var can=this.getparam();
			if(obj){
				if(!obj.uid){
				    obj.uid = m_cur_uid;
				}
				obj.token=m_token;
				//obj.uid=can.uid;
				//obj.token=can.token
			}else{
				obj='';
			}
			$.ajax({
				url:url,
				type:'post',
				data:obj,
				dataType:"json",
				success:function(res){
					//console.log(res);
					callback(res)
				}
			
			})
		},
		add_dian:function(res){
			if(res.data instanceof Array){
				for(var i=0;i<res.data.length;i++){
					if(!res.data[i].teamname){
						res.data[i].teamname='';
					}else{
						if(res.data[i].teamname.length>12){
							res.data[i].teamname=res.data[i].teamname.substring(0,11)+'...';
						}
					}
					if(!res.data[i].nickname){
						res.data[i].nickname='';
					}else{
						if(res.data[i].nickname.length>12){
							res.data[i].nickname=res.data[i].nickname.substring(0,11)+'...';
						}
					}
					if(!res.data[i].signature){
						res.data[i].signature='';
					}else{
						if(res.data[i].signature.length>30){
							res.data[i].signature=res.data[i].signature.substring(0,29)+'...';
						}
					}
					if(!res.data[i].videoname){
						res.data[i].videoname='';
					}else{
						if(res.data[i].videoname.length>12){
							res.data[i].videoname=res.data[i].videoname.substring(0,11)+'...';
						}
					}
				}
				return res;
			}
			if(res.data && typeof res.data=='object'){
				if(!res.data.teamname){
					res.data.teamname='';
				}else{
					if(res.data.teamname.length>12){
						res.data.teamname=res.data.teamname.substring(0,11)+'...';
					}
				}
				if(!res.data.nickname){
					res.data.nickname='';
				}else{
					if(res.data.nickname.length>12){
						res.data.nickname=res.data.nickname.substring(0,11)+'...';
					}
				}
				if(!res.data.signature){
					res.data.signature='';
				}else{
					if(res.data.signature.length>30){
						res.data.signature=res.data.signature.substring(0,29)+'...';
					}
				}
				if(!res.data.videoname){
					res.data.videoname='';
				}else{
					if(res.data.videoname.length>12){
						res.data.videoname=res.data.videoname.substring(0,11)+'...';
					}
				}
				return res;
			}
		}
	}	
})