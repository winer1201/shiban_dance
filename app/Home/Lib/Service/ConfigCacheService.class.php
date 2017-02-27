<?php
namespace Home\Lib\Service;
use Think\Controller;

//配置项相关业务处理类
class ConfigCacheService {
	public static function get($key,$areacode){
		if(!$key || $key == "")
			return "";
		if(!$areacode || $areacode == "")
			return "";

		$list = self::getlist($areacode);
		if(!$list || count($list)<=0)		
			return "";
		if(!array_key_exists($key,$list))
			return "";

		return $list[strtoupper($key)];
	}

	public static function getlist($areacode){
		if(!$areacode || $areacode == "")
			return false;
		$path = self::getCachePath($areacode);

		$list = F($path);
		
		if(!$list || count($list)<=0){
			self::init($areacode);//初始化
			$list = F($path);
		}
		if(!$list)
			$list = array();
		return $list;
	}

	public static function RestConfigList($request){
		if(!$request)
			return;
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
			return;

		if($configkey == "")//批量更新
		{
			self::init($areacode);
		}		
		else//更新单个配置
		{
			self::init($areacode);//配置较少，每次都全量更新
		}	
	}

	private static function init($areacode){
		\Home\Lib\Utility\LogHelper::Info('ConfigCacheService->init :: $areacode - 【'.$areacode.'】');
		if(!$areacode || $areacode == "")
			return ;

		$request = array('areacode' => $areacode,'configtype' =>0 );
		$obj = new \Home\Lib\Service\ConfigService();
		$dblist = $obj -> getConfigList($request); 
		$path = self::getCachePath($areacode);

		if(!$dblist ) return;
		$list = array();
		foreach ($dblist as $config) {
			$list[$config['configkey']] = $config['configvalue'];
		}

		F($path,$list);	
	}

	private static function initconfig($areacode,$configkey){
		\Home\Lib\Utility\LogHelper::Info('ConfigCacheService->initconfig :: $areacode - 【'.$areacode.'】 , $configkey - 【'.$configkey.'】');
		if(!$areacode || $areacode == "")
			return ;
		if(!$configkey || $configkey=="")
			return;

		$path = self::getCachePath($areacode);
		$list = F($path);
		if(!$list || count($list)<=0)
		{
			self::init($areacode);
			return;
		}
		$request = array('areacode' => $areacode,'configkey' =>$configkey );
		$obj = new \Home\Lib\Service\ConfigService();
		$dblist = $obj -> getConfigList($request); 
		if(!$dblist || count($dblist)<=0 ) return;
		
		$config = $dblist[0];
		$list[$configkey] = $config['configvalue'];

		F($path,$list);	
	}

	private static function getCachePath($areacode){
		return 'config/'.$areacode.'_sysconfig';
	}

}




?>