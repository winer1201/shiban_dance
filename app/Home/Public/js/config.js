require.config({
	//版本号 => 日期
    urlArgs: '1.0.0.081111',
	//指定静态文件跟目录
	baseUrl : m_publicUrl + "/js/",
	//别名
	//给一个模块定义别名
	paths : {
		//会在  baseUrl 下面去查找
		zepto: m_publicUrl + "/libs/zepto.min",
		swiper: m_publicUrl + "/libs/swiper.min",
		mdater:m_publicUrl + "/libs/zepto.mdater",
		LArea: m_publicUrl + "/libs/LArea",
	},
	//兼容   把非模块化的js文件模块化
	//把不是以 define 格式的 js 做兼容处理
	shim:{
		zepto:{
			deps:[], //循环依赖
			//返回 zepto 暴露的全局对象
			exports:"$"
		},
		swiper:{
			deps:[], //循环依赖
			//返回 swiper 暴露的全局对象
			exports:"swiper"
		},
		mdater:{
			deps:[], //循环依赖
			//返回 mdater 暴露的全局对象
			exports:"mdater"
		},
		LArea:{
			deps:[], //循环依赖
			//返回 mdater 暴露的全局对象
			exports:"LArea"
		}
	}
});
