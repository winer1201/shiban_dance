<?php
namespace Home\Lib\Service;

use Think\Controller;
use Home\Lib\Utility\LogHelper;
use Home\Lib\Entity\TpResponse;
use Home\Lib\Utility\RetCodeUtility;
use Home\Lib\Utility\ConstUtility;

//用户相关业务处理类
class UserService {
	/**
	 * 用户登录接口（手机号）
	 * add by zhangchr@20170124
	 */
	public function login($r){
		$response = new TpResponse();	

		$phone =	getArrayValue($r,"phone");
		$pwd = getArrayValue($r,"pwd");
		$logintype = getArrayValue($r,"logintype");
		$wc_code=getArrayValue($r,"wc_code");

		
		if($logintype==1){
			if($wc_code==null ||  $wc_code ==""){
				LogHelper::Debug("[UserService::login] wc_code can not be null or empty.");
				$response->retcode=RetCodeUtility::FailLackArgs;
				return $response;
			}
		}
		else{
			if($phone==null ||  $phone ==""){
				LogHelper::Debug("[UserService::login] phone can not be null or empty.");
				$response->retcode=RetCodeUtility::FailLackArgs;
				return $response;
			}
			if($pwd==null ||  $pwd ==""){
				LogHelper::Debug("[UserService::login] pwd can not be null or empty.");
				$response->retcode=RetCodeUtility::FailLackArgs;
				return $response;
			}
		}

		$url = ConstUtility::$TP_WCS_LOGIN_URL;
		$param=array("username"=>$phone,"password"=>$pwd,"logintype"=>0);
		if($logintype==1)
			$param=array("wc_code"=>$wc_code,"logintype"=>1);

		$url .= "?" . http_build_query($param);

		LogHelper::Debug("url - $url");
        $data_json = httpcall($url);
        LogHelper::Debug("data_json - $data_json");
        $obj = json_decode($data_json, true);

        $retcode=RetCodeUtility::SysUnknow;
		if(is_array($obj) && isset($obj["retcode"])){
			$retcode=$obj["retcode"];
		}

		if($retcode==0){
			$token=isset($obj["data"]["token"])?$obj["data"]["token"]:"";
			$expiredtime=isset($obj["data"]["expiredtime"])?$obj["data"]["expiredtime"]:"";
			$uid=isset($obj["data"]["uid"])?$obj["data"]["uid"]:"";

			if($token=="" || $expiredtime==""||$uid=="")
				return $response;

			
			$time_now=date('Y-m-d H:i:s',time());

			$expiredtime_short=strtotime($expiredtime);
			$time_now_short = strtotime($time_now);
			$span=$expiredtime_short-$time_now_short;

			//$span=30;

			cookie('tp_cur_uid',$uid,$span);
			cookie('tp_cur_token',$token,$span);
			cookie('tp_cur_expiredtime',$expiredtime,$span);

			$response->retcode=RetCodeUtility::Success;
		}
		else{
			$response->retcode=$retcode;
		}

		return $response;
	}
	
	/**
	 * 用户退出接口
	 */
	public function logout(){
		$response = new TpResponse();	

		$uid = cookie('tp_cur_uid');
		$token = cookie('tp_cur_token');

		LogHelper::Debug("uid - $uid , token - $token");

		if(!isset($uid) || !$uid || $uid==""){
			$response->retcode=RetCodeUtility::UnLogin;
			return $response;
		}
		if(!isset($token) || !$token || $token==""){
			$response->retcode=RetCodeUtility::UnLogin;
			return $response;
		}

		$url = ConstUtility::$TP_WCS_LOGOUT_URL;

		$param=array("uid"=>$uid,"token"=>$token);
		$url .= "?" . http_build_query($param);

		LogHelper::Debug("url - $url");
        $data_json = httpcall($url);
        LogHelper::Debug("data_json - $data_json");
        $obj = json_decode($data_json, true);

        cookie(null,'tp_');
        $response->retcode=RetCodeUtility::Success;

		return $response;
	}

	public function redirect($r){
		$response = new TpResponse();	
		$backUrl = getArrayValue($r,"backUrl");
		$type = getArrayValue($r,"loadtype");
		$url=ConstUtility::$WC_CON_OAUTH2_AUTH;
		$redirectUrl="";

		if(!isset($backUrl) || !$backUrl){
			$backUrl=C("tp_wcportal_url")."/index";
		}

		if($type!="login")
			$type="visit";

		LogHelper::Debug("backUrl - $backUrl");
		$backUrl=urlencode($backUrl);
		$redirectUrl=ConstUtility::$TP_WCPortal_Redirect_Url."?loadtype=".$type."&backUrl=".$backUrl;
		LogHelper::Debug("redirectUrl - $redirectUrl");
		$redirectUrl=urlencode($redirectUrl);
		LogHelper::Debug("redirectUrl - $redirectUrl");
		$url.='?appid='.ConstUtility::$tvgcw_wc_appid.'&redirect_uri='.$redirectUrl.'&response_type=code&scope=';

		if($type=="login")//微信授权登陆
		{
			$url.='snsapi_userinfo';
		}
		else//微信分享访问
		{
			$url.='snsapi_base';
		}
		$url.='&state=123#wechat_redirect';

		LogHelper::Debug("url - $url");

		$response->retcode=RetCodeUtility::Success;
		$response->data=$url;

		return $response;
	}

	public function callback($r){
		$response=null;

		$type = getArrayValue($r,"loadtype");
		$backUrl=getArrayValue($r,"backUrl");
		$code=getArrayValue($r,"code");

		if($type=="login"){
			$data=array("wc_code"=>$code,"logintype"=>1);
			$response = $this->login($data);			
		}
		else
		{
			$response = $this->visit($code);			
		}

		if(!isset($response) || !$response)
			return new TpResponse();

		if($response->retcode != RetCodeUtility::Success)
			return $response;

		$response->data=$backUrl;
		$response->retcode=RetCodeUtility::Success;
		return $response;
	}
	/**
	 * 检查用户token是否有效
	 */
	public function checkToken($r){
		$response=new TpResponse();	

		$uid = getArrayValue($r,"uid");
		$token=getArrayValue($r,"token");

		if($uid==null || $uid==""){
			LogHelper::Error("[UserService::checkToken] uid can not be null or empty.");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}
		if($token==null || $token==""){
			LogHelper::Error("[UserService::checkToken] token can not be null or empty.");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}

		$url = ConstUtility::$TP_WCS_UserTokenCheck_Url;

		$param=array("uid"=>$uid,"token"=>$token);
		$url .= "?" . http_build_query($param);

		LogHelper::Debug("chektoken_url - $url");
        $data_json = httpcall($url);
        LogHelper::Debug("data_json - $data_json");
        $obj = json_decode($data_json, true);

        $retcode=RetCodeUtility::SysUnknow;
		if(is_array($obj) && isset($obj["retcode"])){
			$retcode=$obj["retcode"];
		}

		$response->retcode = $retcode;
		return $response;
	}
	/**
	 * 微信分享，记录用户unionid并验证有效性
	 */
	private function visit($code){
		$response=new TpResponse();

		if(!isset($code) || !$code)
			return $response;		

		$url=ConstUtility::$TP_WCS_Visit_URL;

		$param=array("wc_code"=>$code);
		$url .= "?" . http_build_query($param);

		LogHelper::Debug("url - $url");
        $data_json = httpcall($url);
        LogHelper::Debug("data_json - $data_json");
        $obj = json_decode($data_json, true);

        if(!isset($obj['retcode'])){
        	return $response;
        }

        if($obj['retcode']==RetCodeUtility::Success)
        {
        	LogHelper::Debug("obj['retcode'] is success.");
        	$unionid=isset($obj['data']['unionid'])?$obj['data']['unionid']:"";
        	$openid=isset($obj['data']['openid'])?$obj['data']['openid']:"";

        	cookie('wc_tp_unionid',$unionid);
        	cookie('wc_tp_openid',$openid);
        	$response->retcode=RetCodeUtility::Success;
        }
        
        return $response;
	}
}

?>