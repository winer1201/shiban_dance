require(['zepto','Adapter_screen','ajax_model','tp_util'],function($,adapter,ajax,tp){
	/*对屏幕进行适配*/
	adapter.adapter();
	/*调用ajax模块加载成员列表*/
	var teamcode,memtype;
	var memurl=config.tp_wcs_dance_mem_url;
	var deledance=config.tp_wcs_dele_dance_url;
	var userurl=config.tp_wcs_getuserinfo_url;
	var memdata={};
	/*获取个人信息*/
	ajax.getData(userurl,function(res){
		console.log(res);
		if(!res) return;
		if(res.retcode==0){
			teamcode=res.data.teamcode;
			memtype=res.data.memtype;
			memdata.teamcode=teamcode;
			check(memtype);
			ajax.getData(memurl,memlist,memdata);
		}
	},{})
	function memlist(res){
		console.log(res);
		if(!res) return;
		if(res.retcode=='0'){
			ajax.add_dian(res);
			var info=res.data,html='',flag=true;
			if(flag){
				for(var j=0;j<info.length;j++){
					if(info[j].memtype==1){
						if(!info[j].headimgurl){
							info[j].headimgurl='/app/Home/Public/img/member/header.png'
						}
						html='<li><div id="leader" uid="'+info[j].uid+'" class="yuan"><i class="dui"></i></div><div class="head" style="background-image:url('+info[j].headimgurl+')"></div><div class="nick"><p style="margin-top:0.345rem;color:#272727;">队长：<span>'+info[j].nickname+'</span></p><p>签名：<span>'+info[j].signature+'</span></p></div><div class="junk"></div></li>'
						flag=false;
						break;
					}
				}
			}
			for(var h=0;h<info.length;h++){
				if(h!=j){
					if(!info[h].headimgurl){
						info[h].headimgurl='/app/Home/Public/img/member/header.png'
					}
					html+='<li><div class="yuan" uid="'+info[h].uid+'"><i class="dui"></i></div><div class="head" style="background-image:url('+info[h].headimgurl+')"></div><div class="nick"><p style="margin-top:0.345rem;color:#272727;">昵称：<span>'+info[h].nickname+'</span></p><p>签名：<span>'+info[h].signature+'</span></p></div><div class="junk"></div></li>'
				}
			}
			html=html+'<li class="more"><i></i>邀请新队员加入</li>'
			$('#memlist').html(html);
			if(memtype==1 && $('#memlist').children().length!=2){
				$('.junk').css('display','block');
			}
		}
	}
	/*判断成员类型*/
	var arr=[],shu=[],change_uid;
	function check(memtype){
	if(!memtype) return;
		if(memtype==1){
			$('#header').css('display','block');
			$('#capital').click(function(){
				if($('#memlist').children().length==2){
					tp.ui.alert('请添加新成员后再试！');
					return;
				}
				$('.junk').css('display','none');
				$('.yuan').css('display','block');
			})
			$('#memlist').on('click','.yuan',function(){
				arr=[];
				change_uid=$(this).attr('uid');
				arr.push(change_uid);
				$(this).children().eq(0).css('display','block');
				$('#mask').css('display','block');
				$('#dele').html('确定换该成员为新队长？');
				$('.true').css('display','block');
			})
			$('.esc').click(function(){
				arr=[];
				$('.dui').css('display','none');
				$('#mask').css('display','none');
				$('.true').css('display','none');
			})
			$('.yes').click(function(){
				
				var huanurl=config.tp_wcs_team_replace_url;
				var change_uid=arr[0];
				var uid=$('#leader').attr('uid');
				var huandata={
					'uid':uid,
					'change_uid': change_uid,
					'teamcode':teamcode
				}
				function team(res){
					console.log(res);
					if(res.retcode=='0'){
						$('#mask').css('display','none');
						$('.true').css('display','none');
						$('.yuan').css('display','none');
						$('.junk').css('display','block');
						tp.ui.alert('换队长成功！')
					}
					
				}
				ajax.getData(huanurl,team,huandata);
			})
			$('#memlist').on('click','.junk',function(){
				shu=[];
				var junk_uid=$(this).parent().children().eq(0).attr('uid');
				shu.push(junk_uid);
				$('#mask').css('display','block');
				$('.shan').css('display','block');
			})
			$('.esc_two').click(function(){
				shu=[];
				$('#mask').css('display','none');
				$('.shan').css('display','none');
			})
			$('.yes_two').click(function(){
				$('.shan').css('display','none');
				$('#mask').css('display','none');
				var junkurl=config.tp_wcs_dele_member_url;
				var junkdata={
					'uid':$('#leader').attr('uid'),
					'teamcode':teamcode,
					'memid':shu[0]
				}
				function junk(res){
					//console.log(res);
					if(res.retcode=='0'){
						var node;
						for(var t=0;t<$('#memlist').children().length-1;t++){
							if($('li').eq(t).children().eq(0).attr('uid')==shu[0]){
								$('li').eq(t).remove();
							}
						}
					}
				}
				ajax.getData(junkurl,junk,junkdata);
			})
			/*解散舞队*/
			$('.jiesan').click(function(){
				$('#mask').css('display','block');
				$('.jie').css('display','block');
			})
			$('.esc_three').click(function(){
				$('#mask').css('display','none');
				$('.jie').css('display','none');
			})
			$('.yes_three').click(function(){
				ajax.getData(deledance,function(res){
					if(!res) return;
					if(res.retcode==0){
						$('#mask').css('display','none');
						$('.jie').css('display','none');
						//localStorage.removeItem('teamcode');
						window.location.href='../myinfo/info';
					}else{
						tp.ui.alert('退出舞队失败！')
					}
				},{
					'teamcode':teamcode,
				})
			})
		}else{
			$('.jiesan').html('退出舞队');
			$('#dele').html('确定退出该舞队？');
			$('.jiesan').click(function(){
				$('#mask').css('display','block');
				$('.true').css('display','block');
			})
			$('.esc').click(function(){
				$('#mask').css('display','none');
				$('.true').css('display','none');
			})
			$('.yes').click(function(){
				/*调用ajax模块*/
				var escurl=config.tp_wcs_esc_dance_url;
				var data={
					'teamcode':teamcode
				}
				function esc(res){
					//console.log(res);
					if (!res) return;
					if(res.retcode=='0'){
						window.location.href='../MyDance/join';
					}
				}
				ajax.getData(escurl,esc,data);
			})
		}
	}
})