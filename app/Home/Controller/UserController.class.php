<?php
namespace Home\Controller;
use Think\Controller;
use Home\Lib\Service\UserService;
use Home\Lib\Utility\LogHelper;
use Home\Lib\Entity\TpResponse;
use Home\Lib\Utility\RetCodeUtility;
class UserController extends BaseController {
	/**
	 * 用户登录
	 * 
	 */
	public function login(){
		$this -> display('login');
	}
	/**
	 * 用户注册页面
	 */
	public function regist(){
		$this -> display('register');
	}

	public function doLogin(){
		$response = null;
		$service = null;
		$r=null;

		try
		{
			$response = new TpResponse();	
			$r = array(
				"phone"=>I('phone'),
				"pwd"=>I('pwd')
			);
			
			$service = new UserService();
			$response = $service->login($r);	
		}
		catch(Exception $e)
		{
			LogHelper::Error('UserController->doLogin :: $message - 【'.$e->getMessage().'】');
			$response->retcode = RetCodeUtility::SysError;
		}

		LogHelper::Debug("[UserController::doLogin] ".json_encode($response));
		$this->ajaxReturn($response,'json');
	}
	/**
	 * 找回密码页1
	 * add by zhangchr@20170204
	 */
	public function forget1(){
		$this -> display('forget1');
	}

	/**
	 * 找回密码页2
	 * add by zhangchr@20170204
	 */
	public function forget2(){
		$this -> display('forget2');
	}

	/**
	 * 用户退出接口
	 * add by zhangchr@20170125
	 */
	public function logout(){
		$response = null;
		$service = null;
		$r=null;

		try
		{
			$response = new TpResponse();				
			$service = new UserService();
			$response = $service->logout();	
		}
		catch(Exception $e)
		{
			LogHelper::Error('UserController->logout :: $message - 【'.$e->getMessage().'】');
			$response->retcode = RetCodeUtility::SysError;
		}

		LogHelper::Debug("[UserController::logout] ".json_encode($response));
		$this->ajaxReturn($response,'json');
	}

}

?>