<?php
namespace Home\Lib\Entity;

use Think\Controller;
use \Home\Lib\Utility\RetCodeUtility;

class TpResponse  {

	public $retcode=0;
	public $description="";
	public $data=null;

	public function __construct(){
		$this->retcode=RetCodeUtility::SysUnknow;
	}
}




?>