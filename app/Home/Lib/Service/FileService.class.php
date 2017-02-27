<?php
namespace Home\Lib\Service;

use Think\Controller;
use Home\Lib\Utility\LogHelper;
use Home\Lib\Entity\TpResponse;
use Home\Lib\Utility\RetCodeUtility;
use Home\Lib\Utility\ConstUtility;

//文件操作业务处理类
class FileService 
{
	/**
	 * 文件上传的临时文件存放目录
	 */
	private $upload_tmp_dir="";
	private $upload_video_dir="";
	/**
	 * 构造函数
	 */
	public function __construct(){
        $this->upload_tmp_dir = $_SERVER['DOCUMENT_ROOT'].C("upload_tmp");
        $this->upload_video_dir = $_SERVER['DOCUMENT_ROOT'].C("upload_video");
    }
	/**
	 * 上传视频保存文件方法
	 * add by zhangchr@20170207
	 */
	public function saveVideo($r)
	{
		if(!IS_POST){
			$this->responseError("非法请求！");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}

		$response = new TpResponse();		
		if(!isset($r) 
			|| !isset($r['resumableFilename']) || !isset($r['resumableIdentifier']) 
			|| !isset($r['resumableTotalChunks']) || !isset($r['resumableChunkNumber']))
		{
			$this->responseError("arg error");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}			

		$filename=getArrayValue($r,'resumableFilename');
		$identifier=getArrayValue($r,'resumableIdentifier');
		$totalChunks=getArrayValue($r,'resumableTotalChunks');
		$chunkNumber=getArrayValue($r,'resumableChunkNumber');
		$uid=getArrayValue($r,'uid');

		if(!isset($uid) || empty($uid)){
			LogHelper::Error("[FileService::saveVideo] uid not exists.");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}

		if(!isset($filename) || empty($filename))
		{
			LogHelper::Error("[FileService::saveVideo] filename not exists.");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}

		if(!isset($identifier) || empty($identifier))
		{
			LogHelper::Error("[FileService::saveVideo] identifier not exists.");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}

		if(!isset($totalChunks) || !is_numeric($totalChunks))
		{
			LogHelper::Error("[FileService::saveVideo] totalChunks not right - [$totalChunks].");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}

		if(!isset($chunkNumber) || !is_numeric($chunkNumber))
		{
			LogHelper::Error("[FileService::saveVideo] chunkNumber not rihgt - [$chunkNumber].");
			return returnErrorCode(RetCodeUtility::FailLackArgs,$response);
		}

		LogHelper::Debug("upload_tmp_dir - ".$this->upload_tmp_dir);
		//mk dir
		$mr = $this->mkuserdir($r);
		LogHelper::Debug("upload_tmp_dir , mr - $mr, tmp_dir - ".$this->upload_tmp_dir);
		//copy data
		$tmp_name = $_FILES["file"]["tmp_name"];
		$this->renameChunk($tmp_name,$chunkNumber,$identifier,$uid);
		//merge chunk
		$this->tryAssembleFile($r);		

		$response->retcode=RetCodeUtility::Success;
		return $response;
    }
    /**
     * 文件合并处理
     */
    private function tryAssembleFile($r){
    	if(!$this->allChunksAreHere($r))
    		return;
    	$filename=getArrayValue($r,'resumableFilename');
    	//$filepath=__ROOT__.$filename;
    	$path = $this->consolidateFile($r);
    	$this->renameFile($path,$filename);

    	$this->deleteChunks($r);
    }

    /**
     * 临时文件是否已经创建完毕
     */
    private function allChunksAreHere($r){
		$identifier=getArrayValue($r,'resumableIdentifier');
		$totalChunks=getArrayValue($r,'resumableTotalChunks');

		for($i=1;$i<=$totalChunks;$i++){
			if(!$this->chunkIsHere($i,$identifier))return false;
		}
		return true;
    }
    /**
     * 删除临时文件
     */
    private function deleteChunks($r){
    	$identifier=getArrayValue($r,'resumableIdentifier');
    	$totalChunks=getArrayValue($r,'resumableTotalChunks');

		for($i=1;$i<=$totalChunks;$i++){
			$chunkFileName=$this->getChunkFileName($i,$identifier);
			@unlink($chunkFileName); 
		}
    }

    private function chunkIsHere($chunknumber,$identifier){
    	$filename = $this->getChunkFileName($chunknumber,$identifier);
    	return file_exists($filename);
    }

    private function getChunkFileName($chunkNumber,$identifier){   	
    	return $this->upload_tmp_dir.$identifier."_".$chunkNumber;
    }

    private function getFilePath($r){
    	$identifier=getArrayValue($r,'resumableIdentifier');
    	return $this->upload_tmp_dir.$identifier;
    }
    /**
     * 创建文件，并合并临时文件至该文件
     */
    private function consolidateFile($r){
    	$identifier=getArrayValue($r,'resumableIdentifier');
    	$totalChunks=getArrayValue($r,'resumableTotalChunks');

    	$path = $this->getFilePath($r);
    	$destFile = fopen($path, "w");
    	
    	for($i=1;$i<=$totalChunks;$i++){
    		$chunkFileName=$this->getChunkFileName($i,$identifier);

    		$sourceFile = fopen($chunkFileName, "r");
    		$data=fread($sourceFile,filesize($chunkFileName));
    		fwrite($destFile,$data);

    		fclose($sourceFile);
    	}
    	fclose($destFile);

    	return $path;
    }
    /**
     * 更改文件名称
     */
    private function renameFile($sourceName,$targetName){
    	$realFileName = $this->upload_tmp_dir.$targetName;
    	if(file_exists($realFileName))
    		@unlink($realFileName);

    	rename($sourceName,$realFileName);
    	return $targetName;
    }
    /**
     * 更改上传的临时文件名为Chunk文件名
     */
    private function renameChunk($generatedFileName,$chunkNumber,$identifier){
    	$chunkFileName=$this->getChunkFileName($chunkNumber,$identifier);
    	
    	if(file_exists($chunkFileName))unlink($chunkFileName);
    	$mr = move_uploaded_file($generatedFileName,$chunkFileName);
    }
    /**
     * 创建用户临时文件目录
     */
    private function mkuserdir($r){
    	$uid=getArrayValue($r,'uid');
    	$path=$this->upload_tmp_dir.$uid."/";
    	$mr = false;
    	if(!is_dir($path))
    		$mr = mk_dir($path);
    	$this->upload_tmp_dir = $path;
    	return $mr;
    }


    private function responseError($msg="upload failed."){
    	header('HTTP/1.1 404 '.$msg);
    	header('Status:404 '.$msg);
    	exit;
    }
}

?>