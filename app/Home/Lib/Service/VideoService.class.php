<?php
namespace Home\Lib\Service;

use Think\Controller;
use Home\Lib\Utility\LogHelper;
use Home\Lib\Entity\TpResponse;
use Home\Lib\Utility\RetCodeUtility;
use Home\Lib\Utility\ConstUtility;

//视频业务处理类
class VideoService 
{
	/**
	 * 作品发布
	 * add by zhangchr@20170207
	 */
	public function publish($r){
		$response = new TpResponse();		

		$uid=getArrayValue($r,'uid');
		$token=getArrayValue($r,'token');
		$videoname=getArrayValue($r,'videoname');
		$filename=getArrayValue($r,'filename');
		$posterdata=getArrayValue($r,'posterdata');
		$filetype=getArrayValue($r,'filetype');

		if(!isset($uid) || empty($uid)){
			LogHelper::Error("[VideoService::publish] uid not exists.");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}

		if(!isset($videoname) || empty($videoname)){
			LogHelper::Error("[VideoService::publish] videoname not exists.");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}

		if(!isset($filename) || empty($filename)){
			LogHelper::Error("[VideoService::publish] filename not exists.");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}

		if(!is_numeric($filetype) || ($filetype != 0 && $filetype !=1)){
			LogHelper::Error("[VideoService::publish] filetype must be 0 or 1.");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}

		if(!isset($posterdata) || empty($posterdata)){
			//LogHelper::Error("[VideoService::publish] uid not exists.");
			//return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
			$posterdata='';
		}

		if(!startWith($posterdata,"http") && strlen($posterdata)<50)
			$posterdata="";

		//rename 
		//更改文件名为随机名称
		$suffix="";
		$newname=$uid.getMillisecond();
		$arr = explode('.', $filename);
		if(isset($arr) && is_array($arr))
			$suffix=end($arr);

		$newname .= ".".$suffix;
		$upload_tmp = $_SERVER['DOCUMENT_ROOT'].C("upload_tmp");
		$upload_video = $_SERVER['DOCUMENT_ROOT'].C("upload_video");
		$upload_img = $_SERVER['DOCUMENT_ROOT'].C("upload_img");

		//save poster
		if(strlen($posterdata)>0 && !startWith($posterdata,"http")){
			if(!is_dir($upload_img))
				mk_dir($upload_img);
			$poster_name = getMillisecond();
			$poster_name = $uid.$poster_name.".jpg";
			$poster_path = $upload_img.$poster_name;
			$poster_url=C("tp_wcportal_url").C("upload_img").$poster_name;

			LogHelper::Debug("poster_path - $poster_path , poster_url - $poster_url");
			$img = base64_decode($posterdata);
			if(isset($img)){
				$a = file_put_contents($poster_path, $img);//返回的是字节数
				LogHelper::Debug("a-$a");
				$posterdata = $poster_path;
			}			
		}

		if(!is_dir($upload_video))
			mk_dir($upload_video);

		$filename=$upload_tmp.$uid."/".$filename;
		$newfile = $upload_video.$newname;
		$playurl=C("tp_wcportal_url").C("upload_video").$newname;

		LogHelper::Debug("playurl - $playurl");

		//检查文件是否存在
		if(!file_exists($filename)){
			LogHelper::Error("[VideoService::publish] file not exists . [$filename]");
			return returnErrorCode(RetCodeUtility::FileNotExists,$response);
		}

		if(file_exists($newfile))unlink($newfile);

		//move file		
		LogHelper::Debug("before rename , soure - $filename , target - $newfile");
		rename($filename,$newfile);

		//save db
		$url = ConstUtility::$TP_WCS_VideoUpload_URL;
		$param=array(
			"uid"=>$uid,
			"token"=>$token,
			"posterurl"=>$poster_url,
			"videoname"=>$videoname,
			"introduce"=>"",
			"type"=>$filetype,
			"fileurl"=>$playurl);
		$url .= "?" . http_build_query($param);
		LogHelper::Debug("url - $url");

		$data_json = httpcall($url);
		$obj = json_decode($data_json, true);
		LogHelper::Debug("data_json - $data_json");

		$retcode=RetCodeUtility::SysUnknow;
		if(is_array($obj) && isset($obj["retcode"])){
			$retcode=$obj["retcode"];
		}
		$response->retcode=$retcode;
		return $response;
	}

}


?>