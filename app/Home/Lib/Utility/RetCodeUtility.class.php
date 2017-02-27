<?php
namespace Home\Lib\Utility;

class RetCodeUtility {

/*
 * 成功
 */
public const Success=0;
/*
 * 未知错误
 */
public const SysUnknow=211000;
/*
 * 错误接口
 */
public const FailInterface=211001;
/*
 * 参数错误
 */
public const FailLackArgs=211002;
/*
 * 系统异常
 */
public const SysError=211003;

/*
 * 用户未登陆
 */
public const UnLogin=211100;

/*
 * 文件不存在
 */
public const FileNotExists=211101;
}

?>