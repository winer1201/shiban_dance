<?php
namespace Home\Lib\Service;
use Think\Controller;

//配置项相关业务处理类
class ConfigService {
	private static $config_flag="_config_list";
	public function getConfigList($request){
		if(!$request)return false;

		$areacode = "";
		$configtype = "";
		$configkey="";

		if(array_key_exists('areacode',$request))
			$areacode = $request['areacode'];
		if(array_key_exists('configtype',$request))
			$configtype = $request['configtype'];
		if(array_key_exists('configkey',$request))
			$configkey=$request['configkey'];

		if($areacode == null || $areacode == "")
			return false;

		$sqlfilter = " areacode = '".$areacode."' ";

		if($configtype != "" && is_numeric($configtype))
			$sqlfilter .= " and configtype = " . $configtype;

		if($configkey!="")
			$sqlfilter .= " and configkey =' " . $configkey."'";

		$db = M('systemconfiguration','sys_','db_csmsdb');
		$list =  $db->where($sqlfilter)->field('configkey,configvalue')->select();

		return $list;
	}



	public function RestConfigList($request){
		//$list = null;
		$list = $this -> getConfigList($request);
		if(!$list || count($list) <=0) return;

		$cc = array(
			'tp_cbs_url' =>'11',
			'tp_tps_url'=>'',
			'tp_pms_url'=>'',
			'tp_ls_url'=>'',
			'tp_tvportal_url'=>'',
			'cyber_tvportal_id'=>'',
			'cyber_tenantid'=>'',
			'cyber_epg_id'=>'',
			);
		p($this -> $config_flag);
		$dd= C('','config_list');
		p($dd['TP_TPS_URL']);

		p($cc['tp_cbs_url']);

		foreach ($list as $config) {
			switch ($config['configkey']) {
				case 'tp_cbs_url':					
				case 'tp_tps_url':
				case 'tp_pms_url':
				case 'tp_ls_url':
				case 'tp_tvportal_url':
				case 'cyber_tvportal_id':
				case 'cyber_tenantid':
				case 'cyber_epg_id':
					$cc[$config['configkey']] = $config['configvalue'];
					//$this -> ResetConfig($config);
					break;
				default:
					break;
			}
		}
		p('tp_cbs_url' . $cc['tp_cbs_url']);
p($cc);
		C($cc,'config_list');
		p('dd');
		$dd= C('','config_list');
		p($dd['TP_TPS_URL']);
	}

	public function ResetConfig($config){
		if(!$config)return;

		$configkey = $config['configkey'];
		$configvalue = $config['configvalue'];

		if(!$configkey) return;
		if($configvalue == null) $configvalue="";

		p('key - ['.$configkey.'] , value - ['.$configvalue.']');

		C($configkey,$configvalue);
	}
}

?>