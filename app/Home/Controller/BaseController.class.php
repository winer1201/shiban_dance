<?php
namespace Home\Controller;
use Think\Controller;
use Home\Lib\Utility\ConstUtility;
use Home\Lib\Utility\LogHelper;
use Home\Lib\Service\UserService;
class BaseController extends Controller {
    public function __construct(){
        parent::__construct();
        $this->formatResolution();

        ConstUtility::format();

        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        header('Access-Control-Allow-Methods: GET, POST, PUT');
    }
    
    public function formatResolution (){  
        $uid = I('uid');
        $token = I('token');
        $unionid = cookie('unionid');
        $openid = cookie('openid');
        
        //\Home\Lib\Utility\LogHelper::Info('BaseController->formatResolution :: user_session - 【'.$user_session.'】 $areacode - 【'.$areacode.'】');
        //initConfig($areacode);

        if(!isset($unionid) || !$unionid)
            $unionid="";
        if(!isset($openid) || !$openid)
            $openid="";

        $this ->uid = $uid;
        $this ->token = $token;
        $this ->unionid = $unionid;
        $this ->openid = $openid;

    	$this ->tp_wcs_url = C("tp_wcs_url");
    	$this ->tp_wcportal_url = C("tp_wcportal_url");

        $this->cur_uid="";
        $this->cur_token="";
    }
    /**
     * 检查用户会话信息
     * @param=redirect:是否做自动跳转，默认处理
     */
    public function checkUserInfo($redirect=true){
        $uid=cookie("tp_cur_uid");
        $token=cookie("tp_cur_token");
        $expiredtime=cookie("tp_cur_expiredtime");
        $time_now=date('Y-m-d H:i:s',time());


        LogHelper::Debug("tp_cur_uid - [$uid] , tp_cur_token - [$token] , tp_cur_expiredtime - [$expiredtime]");

        $service = new UserService();
        $response = $service->checkToken(array("uid"=>$uid,"token"=>$token));

        if(!$response || $response->retcode !==0){
            if($redirect===true)
                $this->redirect("user/login");
            return false;
        }
        else
        {
            $this->cur_uid=$uid;
            $this->cur_token=$token;
            $this->expiredtime=$expiredtime;

            return true;
        }
        /*
        if(isset($uid) && $uid !=null && $uid !="" && $expiredtime>$time_now)
        {
            
            $this->cur_uid=$uid;
            $this->cur_token=$token;
            $this->expiredtime=$expiredtime;

            return true;
        }
        else{
            //LogHelper::Info("[Base::checkUserInfo] 身份验证失败，临时跳过处理.");
            //return true;
            if($redirect===true)
                $this->redirect("user/login");
        }
        */
    }
}


?>