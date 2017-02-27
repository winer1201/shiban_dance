<?php
namespace Home\Lib\Utility;

class ConstUtility {
	/*
	 * wcs用户登陆接口
	 */
	public static $TP_WCS_LOGIN_URL="user/login";
	/*
	 * wcs用户自动登陆接口
	 */
	public static $TP_WCS_AUTOLOGIN_URL="user/relogin"; 
	/**
	 * wcs用户退出登录接口
	 */
	public static $TP_WCS_LOGOUT_URL="user/logout";
	/**
	 * wcs记录微信用户信息接口
	 */
	public static $TP_WCS_Visit_URL="user/visit";
	/**
	 * wcs创建视频作品接口
	 */
	public static $TP_WCS_VideoUpload_URL="video/submit";
	/**
	 * wcs用户token检查接口
	 */
	public static $TP_WCS_UserTokenCheck_Url = "user/checkToken";
	/**
	 * 微信授权回掉接口
	 */
	public static $TP_WCPortal_Redirect_Url="redirect/callback";

	/**
	 * 微信授权接口
	 */
	public static $WC_CON_OAUTH2_AUTH='https://open.weixin.qq.com/connect/oauth2/authorize';
	/**
	 * 微信appid
	 */
	public static $tvgcw_wc_appid='';
	/**
	 * 微信secret
	 */
	public static $tvgcw_wc_secret='';
	
	/**
	 * 地址初始化
	 */
	public static function format(){
		$tp_wcs_base_url = C('tp_wcs_url');
		$tp_wcportal_base_url = C('tp_wcportal_url');
		$WC_CON_OAUTH2_AUTH = C('wc_auth_url');

		self::$tvgcw_wc_appid = C('tvgcw_wc_appid');
		self::$tvgcw_wc_secret = C('tvgcw_wc_secret');
		//wcs
		self::$TP_WCS_LOGIN_URL = $tp_wcs_base_url.self::$TP_WCS_LOGIN_URL;
		self::$TP_WCS_AUTOLOGIN_URL = $tp_wcs_base_url.self::$TP_WCS_AUTOLOGIN_URL;
		self::$TP_WCS_LOGOUT_URL = $tp_wcs_base_url.self::$TP_WCS_LOGOUT_URL;
		self::$TP_WCS_Visit_URL = $tp_wcs_base_url.self::$TP_WCS_Visit_URL;
		self::$TP_WCS_VideoUpload_URL = $tp_wcs_base_url.self::$TP_WCS_VideoUpload_URL;
		self::$TP_WCS_UserTokenCheck_Url = $tp_wcs_base_url.self::$TP_WCS_UserTokenCheck_Url;	
		//wcp
		self::$TP_WCPortal_Redirect_Url = $tp_wcportal_base_url.self::$TP_WCPortal_Redirect_Url;	

	}
}

?>

