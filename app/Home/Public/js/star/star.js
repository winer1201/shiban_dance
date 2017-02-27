require(['zepto','swiper','Adapter_screen','ajax_model'],function($,swiper,adapter,ajax){
	/*对屏幕进行适配*/
	adapter.adapter();
	/*swiper控件*/
	var mySwiper = new Swiper ('.swiper-container', {
	    // Optional parameters
	    direction: 'horizontal',
	    loop:true,
	    speed:1500,
	    autoplay:200,
	    // If we need pagination
	    pagination: '.swiper-pagination',
	})
	$('#starimg').attr('src',m_publicUrl+'/img/star/tvshang.png');
	$('#myimg').attr('src',m_publicUrl+'/img/index/header.png');
	$('#activeimg').attr('src',m_publicUrl+'/img/myinfo/active.png');
	  /*获取竞选月度之星的舞队列表*/
	var url=config.tp_wcs_dancelist_url;
	/*才艺生活秀作品地址*/
	var arturl=config.tp_wcs_workslist_url;
	var artdata={
		type:'3'
	};
	var data={
		offset:'0',
		account:'3'
	};
	function art(res){
		//console.log(res);
		if(!res) return;
		if(res.retcode==0){
			ajax.add_dian(res);
			var info=res.data,html='',index=0;
			for(var i=0;i<info.length;i++){
				if(info[i].videostatus==0){
					if(index<3){
						if(!info[i].posterurl){
							info[i].posterurl=m_publicUrl+'/img/workdefault.png';
						}
						html+='<li class="li" videocode="'+info[i].videocode+'"><a href="../MyDance/detail?videocode='+info[i].videocode+'"><img src="'+info[i].posterurl+'" alt="" /></a><span>'+info[i].videoname+'</span></li>'
					}else{
						break;
					}
					index++;
				}
				
			}
			$('#art_list').html(html);
		}
	}
	function starlist(res){
		//console.log(res);
		if(!res) return;
		if(res.retcode=='0' && res.data.length>0){
			ajax.add_dian(res);
			var info=res.data,html='';
			for(var i=0;i<info.length;i++){
				if(!info[i].posterurl){
					info[i].posterurl=m_publicUrl+'/img/workdefault.png';
				}
				html+='<li class="li" teamcode="'+info[i].teamcode+'"><a href="../star/rank"><img src="'+info[i].posterurl+'" alt="" /></a><span>'+info[i].teamname+'</span></li>'
			}
			$('#star_load').html(html);
		}
	}
	ajax.getData(url,starlist,data);
	ajax.getData(arturl,art,artdata);
})