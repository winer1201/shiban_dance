<?php
namespace Home\Lib\Utility;
use Think\Controller;
//日志打印类
abstract class LogBase {

	abstract protected function Info($content);
	
	abstract protected function Warn($content);

	abstract protected function Debug($content);

	abstract protected function Error($content);

	abstract protected function Trace($content);
}

?>