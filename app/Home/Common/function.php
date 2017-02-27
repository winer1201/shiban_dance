<?php

	function p($data){
		echo '<pre>';
		echo dump($data);
	}

	function loadfile($filepath,$filetype){

		$output="";

		if($filetype=="")
			$filetype = "js";
		if($filetype == "js")
		{
			$output = '<script src="'.$filepath.'.js?_v='.C('Version').'"></script>';
		}
		elseif($filetype == "css"){
			$output = '<link rel="stylesheet" href="'.$filepath.'.css?_v='.C('Version').'"/>';
		}

		echo $output;
	}

	function getareacode($str){
	
		if(!$str)
			return "";
		if(strlen($str)<8)
			return $str;
		return substr($str,0,8);
	}

	function add_querystring_var($url, $key, $value) {
		 $url=preg_replace('/(.*)(?|&)'.$key.'=[^&]+?(&)(.*)/i','$1$2$4',$url.'&');
		 $url=substr($url,0,-1);
		 if(strpos($url,'?') === false){
		  return ($url.'?'.$key.'='.$value);
		 } else {
		  return ($url.'&'.$key.'='.$value);
		 }
	}


	function _Post($url, $data = null,$config=null)
	{
		 $context = array();
		 $time_out = C('http_timeout');
		 $method = 'POST';		 

		 if(!is_array($data))
		 	$data = array();

		 ksort($data);

		 $data = http_build_query($data, '', '&');

		 $head="Content-type: application/x-www-form-urlencoded\r\n".  
               "Content-length:".strlen($data)."\r\n" .   
               "Cookie: foo=bar\r\n" .   
               "\r\n";

		 if(is_array($config)){
		 	if(isset($config["timeout"]) && $config["timeout"]!=null)
		 		$time_out = $config["timeout"];
		 	if(isset($config["method"]) && $config["method"] != null)
		 		$method = $config["method"];
		 	if(isset($config["header"]) && $config["header"] != null)
		 		$head = $config["header"];
		 }


	     $context['http'] = array
	     (   
	         'timeout'=>$time_out,
	         'method' => $method,
	         'header' =>$head,
	         'content' => is_array($data)?http_build_query($data, '', '&'):"",
	     );		 

		 return file_get_contents($url, false, stream_context_create($context));
	}

	function Http($url,$data=null,$timeout=null,$method='POST'){
		$apt = array(
			'method' => $method,
			'timeout' => $timeout
			);
		return _Post($url,$data,$apt);
	}

	/**
     * 发送HTTP请求方法，目前只支持CURL发送请求
     * @param  string $url    请求URL
     * @param  array  $param  GET参数数组
     * @param  array  $data   POST的数据，GET请求时该参数无效
     * @param  string $method 请求方法GET/POST
     * @return array          响应数据
     */
    function httpcall($url, $param='', $data = '', $method = 'GET'){
        $opts = array(
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        );

        /* 根据请求类型设置特定参数 */
        if(is_array($param))
        	$opts[CURLOPT_URL] = $url . '?' . http_build_query($param);
    	else 
    		$opts[CURLOPT_URL] = $url;

        if(strtoupper($method) == 'POST'){
            $opts[CURLOPT_POST] = 1;
            $opts[CURLOPT_POSTFIELDS] = $data;
            
            if(is_string($data)){ //发送JSON数据
                $opts[CURLOPT_HTTPHEADER] = array(
                    'Content-Type: application/json; charset=utf-8',  
                    'Content-Length: ' . strlen($data),
                );
            }
        }

        /* 初始化并执行curl请求 */
        $ch = curl_init();
        curl_setopt_array($ch, $opts);
        $data  = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        //发生错误，抛出异常
        if($error) throw new \Exception('请求发生错误：' . $error);

        return  $data;
    }

	function returnJsonData($errcode,$errdesc){
		$result['status']=$errcode;
		$result['desc']=$errdesc;
		return $result;
	}

	function initConfig($areacode){
		\Home\Lib\Utility\LogHelper::Info('function->initConfig :: $areacode - 【'.$areacode.'】');
		$list = \Home\Lib\Service\ConfigCacheService::getlist($areacode);
		C($list);
	}

	function get_url() {
		    $sys_protocal = isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == '443' ? 'https://' : 'http://';
		    $php_self = $_SERVER['PHP_SELF'] ? $_SERVER['PHP_SELF'] : $_SERVER['SCRIPT_NAME'];
		    $path_info = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
		    $relate_url = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : $php_self.(isset($_SERVER['QUERY_STRING']) ? '?'.$_SERVER['QUERY_STRING'] : $path_info);
	    return $sys_protocal.(isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '').$relate_url;
	}

    function returnErrorCode($retcode,$response){

    	if(!$response)
    		$response=new $BaseResponse();
    	if($retcode==null || !is_numeric($retcode))
    		$retcode = \Home\Lib\Utility\RetCodeUtility::SysUnknow;
    	$response->retcode=$retcode;
    	return $response;
    }
    /*
     * 获取数据key值对应value
     * add by zhangchr@20170115
     */
    function getArrayValue($array,$key){
    	if(!$array)return "";

    	if(!array_key_exists($key,$array))
    		return "";
    	return $array[$key];
    }

    //生成业务编码
	//$prefix:编码前缀
	//lenth:顺序号长度
	function createbusicode($prefix,$num,$lenth){
		$busicode='';
		$timestr =  date('Ymd', time());
		
		$num = str_pad($num,$lenth,'0',STR_PAD_LEFT);
		$busicode = $prefix.$timestr.$num;

		return $busicode;
	}
	/*
	 * 创建用户唯一标识
	 * add by zhangchr@20170118
	 */
	function createuid($id,$areaid="00")
	{
		$uid=false;
		if(!isset($id) || !$id || !is_numeric($id) || $id<=0)
			return $uid;
		$id+=10000000;

		$uid = "10".$id."00";
		return $uid;
	}
		/**
	 * 获取时间戳（毫秒级）
	 */
	function getMillisecond() {
		list($t1, $t2) = explode(' ', microtime());
		return (float)sprintf('%.0f',(floatval($t1)+floatval($t2))*1000);
	}
	/**
	 * 循环创建目录
	 */
	function mk_dir($dir, $mode = 0755) 
	{ 
		if (is_dir($dir) || @mkdir($dir,$mode)) return true; 
		if (!mk_dir(dirname($dir),$mode)) return false; 
		return @mkdir($dir,$mode); 
	} 
	/**
	 * 第一个是原串,第二个是 部份串
	 */
	function startWith($str, $needle) {
		return strpos($str, $needle) === 0;
	}

	/**
	 * 第一个是原串,第二个是 部份串
	 */
	function endWith($haystack, $needle) {   
		$length = strlen($needle);  
		if($length == 0)
			return true;  
		return (substr($haystack, -$length) === $needle);
	}

?>