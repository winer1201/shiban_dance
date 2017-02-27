<?php
namespace Home\Controller;
use Think\Controller;
use Home\Lib\Service\FileService;
use Home\Lib\Service\VideoService;
use Home\Lib\Entity\TpResponse;
use Home\Lib\Utility\LogHelper;
class VideoController extends BaseController {
	/**
	 * 视频上传页面
	 */
    public function uploadVideo(){   
    	$this->checkUserInfo(true); 
        $this -> display('uploadpage');
    }
    /**
     * 视频发布接口
     * add by zhangchr@20170207
     */
    public function publishVideo(){
    	$response = null;
		$service = null;
		$r=null;		

		try
		{
			$response = new TpResponse();	
			$r = array(
				"videoname"=>I('videoname'),
				"filename"=>I('filename'),
				"posterdata"=>I('posterdata'),
				"filetype"=>I('filetype'),
				"uid"=>cookie("tp_cur_uid"),
				"token"=>cookie("tp_cur_token")
			);

			//LogHelper::Debug("r - ".dump($r,false));
			
			$service = new VideoService();
			$response = $service->publish($r);	
		}
		catch(Exception $e)
		{
			LogHelper::Error('VideoController->publishVideo :: $message - 【'.$e->getMessage().'】');
			$response->retcode = RetCodeUtility::SysError;
		}

		LogHelper::Debug("[VideoController::publishVideo] ".json_encode($response));
		$this->ajaxReturn($response,'json');
    }
    /**
     * 视频上传接口
     */
    public function upload(){
    	$response = null;
		$service = null;
		$r=null;
		
		try
		{
			$response = new TpResponse();	
			$r = array(
				"resumableFilename"=>I('resumableFilename'),
				"resumableIdentifier"=>I('resumableIdentifier'),
				"resumableTotalChunks"=>I('resumableTotalChunks'),
				"resumableChunkNumber"=>I('resumableChunkNumber'),
				"uid"=>cookie("tp_cur_uid"),
				"token"=>cookie("tp_cur_token")
			);
			
			$service = new FileService();
			$response = $service->saveVideo($r);	
			if($response->retcode != 0)
				send_http_status(404);	
		}
		catch(Exception $e)
		{
			LogHelper::Error('VideoController->doLogin :: $message - 【'.$e->getMessage().'】');
			send_http_status(404);
			$response->retcode = RetCodeUtility::SysError;
		}

		LogHelper::Debug("[VideoController::doLogin] ".json_encode($response));
		$this->ajaxReturn($response,'json');
    }
}
?>