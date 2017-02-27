require(['zepto','Adapter_screen','ajax_model','tp_util'],function($,adapter,ajax,tp){
	/*对屏幕进行适配*/
	adapter.adapter();
	/*调用ajax模块*/
	var url=config.tp_wcs_dancelist_url;
	/*申请舞队接口*/
	var shenurl=config.tp_wcs_shen_dance_url;
	var shen_data={}
	var data={},flag=true,shendata={};
	function dancelist(res){
		if(!res) return;
		console.log(res);
		if(res.retcode=='0'){
			ajax.add_dian(res);
			var info=res.data,html='';
			for(var i=0;i<info.length;i++){
				if(!info[i].posterurl){
					info[i].posterurl=m_publicUrl+'img/team_default.png';
				}
				html+='<dl class="clear"><dt class="dt" teamcode="'+info[i].teamcode+'"><a href="../MyDance/dance?teamcode='+info[i].teamcode+'"><img src="'+info[i].posterurl+'" alt="" /></a></dt><dd class="dance">'+info[i].teamname+'</dd><dd class="capital">签名：<span>'+info[i].signature+'</span></dd><dd class="btn" teamcode="'+info[i].teamcode+'"><a>申请加入</a></dd></dl>'
			}
			$('#list').html(html);
		}
	}
	ajax.getData(url,dancelist,data);
	/*搜索框搜索数据*/
	$('#sou_btn').click(function(){
		var teamname=$('#sou_it').val();
		if(teamname){
			var datalist={
				'teamname':teamname
			}
			ajax.getData(url,dancelist,datalist);
		}else{
			tp.ui.alert('请输入舞队名称！');
		}
	})
	/*申请加入舞队*/
	$('#list').on('click','.btn',function(){
			$(this).children().eq(0).html('等待核验');
			$(this).css('background','#B6B6B6');
		shendata.teamcode=$(this).attr('teamcode');
		//ajax.getData(shenurl,shendata)
	})
})