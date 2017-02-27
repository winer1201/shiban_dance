<?php
namespace Home\Lib\Utility;
use Think\Controller;
//日志打印类
class LogTP extends LogBase {

	public function Info($content)
	{
		\Think\Log::record($content,'INFO');
	}
	
	public function Warn($content){
		\Think\Log::record($content,'WARN');
	}

	public function Debug($content)
	{
		\Think\Log::record($content,'DEBUG');
	}

	public function Error($content)
	{
		\Think\Log::record($content,'ERR');
	}

	public function Trace($content)
	{
		\Think\Log::record($content,'SQL');
	}
}

?>