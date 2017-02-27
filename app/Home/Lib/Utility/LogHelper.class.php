<?php
namespace Home\Lib\Utility;
use Think\Controller;
//日志打印类
class LogHelper {
	private static $LogObj = null;

	private static function Init(){
		if(self::$LogObj ==null)
		{
			\Think\Log::record('LogObj_Init========','Info');
			self::$LogObj = new LogTP();
		}
	}

	public static function Info($content)
	{
		self::Init();		
		self::$LogObj -> Info($content);
	}
	
	public static function Warn($content){
		self::Init();
		self::$LogObj -> Warn($content);
	}

	public static function Debug($content)
	{
		self::Init();
		self::$LogObj -> Debug($content);
	}

	public static function Error($content)
	{
		self::Init();
		self::$LogObj -> Error($content);
	}

	public static function Trace($content)
	{
		self::Init();
		self::$LogObj -> Trace($content);
	}
}

?>