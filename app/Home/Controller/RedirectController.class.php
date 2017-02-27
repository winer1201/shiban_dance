<?php
namespace Home\Controller;
use Think\Controller;
use Home\Lib\Utility\LogHelper;
use Home\Lib\Entity\TpResponse;
use Home\Lib\Service\UserService;
class RedirectController extends BaseController {
	public function index(){
		$response = null;
		$service = null;
		$r=null;
		$url="";

		try
		{
			$response = new TpResponse();	
			$r = array(
				"backUrl"=>I('backUrl'),
				"loadtype"=>I('loadtype')
			);
			
			$service = new UserService();
			$response = $service->redirect($r);	

			if(isset($response)  &&  $response->retcode==0){
				$url=$response->data;
			}
			else
			{
				$url=C("tp_wcportal_url")."/index";
			}
		}
		catch(Exception $e)
		{
			LogHelper::Error('RedirectController->index :: $message - 【'.$e->getMessage().'】');
			$url=C("tp_wcportal_url")."/index";
		}

		redirect($url, 3, '页面跳转中...');
		//echo($url);
	}

	public function callback(){
		$response = null;
		$service = null;
		$r=null;
		$url="";

		try
		{
			$response = new TpResponse();	
			$r = array(
				"code"=>I('code'),
				"loadtype"=>I('loadtype'),
				"backUrl"=>I('backUrl')
			);
			
			$service = new UserService();
			$response = $service->callback($r);	

			if(isset($response)  &&  $response->retcode==0){
				$url=$response->data;
			}
			else
			{
				LogHelper::Debug("retcode = $response->retcode");
				$url=C("tp_wcportal_url")."/index";
			}
		}
		catch(Exception $e)
		{
			LogHelper::Error('RedirectController->callback :: $message - 【'.$e->getMessage().'】');
			$url=C("tp_wcportal_url")."/index";
		}
		redirect($url);
	}
}

?>