common = {
	initUrl:function(){
		var baseUrl = "";
        var siteUrl = "";
        config.tp_wcs_url = m_tp_wcs_url;
        config.tp_wcportal_url = m_tp_wcportal_url;
        /*用户基本信息获取接口*/
       	config.tp_wcs_base_userinfo_url = config.tp_wcs_url + "user/baseinfo";
       	/*获取舞队基本信息接口*/
       	config.tp_wcs_base_danceinfo_url = config.tp_wcs_url + "gcw/team_baseinfo";
        /*用户信息获取接口*/
        config.tp_wcs_getuserinfo_url = config.tp_wcs_url + "user/info";
        /*获取作品接口地址*/
        config.tp_wcs_workslist_url=config.tp_wcs_url + "video/list";
        /*获取舞队列表接口*/
       	config.tp_wcs_dancelist_url=config.tp_wcs_url + "gcw/team_list";
       	/*获取往期月度之星接口*/
       	config.tp_wcs_pre_starlist_url=config.tp_wcs_url + "mstar/past";
       	/*获取申请舞队接口地址*/
       //	config.tp_wcs_shen_dance_url=config.tp_wcs_url + "gcw/team_add";
       	/*创建舞队接口地址*/
       	config.tp_wcs_create_dance_url=config.tp_wcs_url + "gcw/team_create";
       	/*获取舞队信息接口地址*/
       	config.tp_wcs_dance_info_url=config.tp_wcs_url + "gcw/team_info";
       	/*队员退出舞队接口地址*/
       	config.tp_wcs_esc_dance_url=config.tp_wcs_url + "gcw/team_mem_exit";
       	/*获取舞队成员列表接口*/
       	config.tp_wcs_dance_mem_url=config.tp_wcs_url + "gcw/team_mem_list";
       	/*舞队换队长接口*/
       	config.tp_wcs_team_replace_url=config.tp_wcs_url + "gcw/team_mem_change";
       	/*删除舞队成员接口*/
       	config.tp_wcs_dele_member_url=config.tp_wcs_url + "gcw/team_mem_kick";
       	/*解散舞队接口*/
        config.tp_wcs_dele_dance_url=config.tp_wcs_url + "gcw/team_close";
       	/*月度之星点赞数量接口*/
       	config.tp_wcs_dian_zan_url=config.tp_wcs_url + "mstar/team_zan_list";
       	/*获取用户点赞列表*/
       	config.tp_wcs_user_zan_url=config.tp_wcs_url + "mstar/user_zan_wc_his";
       	/*删除作品接口地址*/
       	config.tp_wcs_work_del_url=config.tp_wcs_url + "video/del";
       	/*提交用户信息接口*/
       	config.tp_wcs_user_update_url=config.tp_wcs_url + "user/info_update";
       	/*提交舞队信息接口*/
       	config.tp_wcs_dance_update_url=config.tp_wcs_url + "gcw/team_update";
       	/*视频点赞接口地址*/
       	config.tp_wcs_video_zan_url=config.tp_wcs_url + "mstar/zan_wc";
       	/*舞队月度之星设置参赛作品接口*/
       	config.tp_wcs_video_join_url=config.tp_wcs_url + "video/video_setting";
       	/*获取舞队月度之星已参赛作品接口*/
       	config.tp_wcs_get_video_url = config.tp_wcs_url + "video/get_setting";
	    /*用户注册接口*/
       	config.tp_wcs_register_url = config.tp_wcs_url + "user/regist";
	    /*用户找回密码接口*/
       	config.tp_wcs_modifypwd_url = config.tp_wcs_url + "user/modifypwd";
	    /*发送短信校验码接口*/
       	config.tp_wcs_send_verifycode_url = config.tp_wcs_url + "common/send_verifycode";
		/*用户绑定（修改）手机号接口*/
		config.tp_wcs_gai_phone_url=config.tp_wcs_url + "user/bindphone";

	    //wcportal
	    /* 用户登录页面 */
       	config.tp_wcp_login_page = config.tp_wcportal_url + "user/login";
        /* 用户登录接口 */
       	config.tp_wcp_login_url = config.tp_wcportal_url + "user/doLogin";
        //退出接口
       	config.tp_wcp_logout_url = config.tp_wcportal_url + "user/logout";
        /* 用户注册页面 */
       	config.tp_wcp_register_url = config.tp_wcportal_url + "user/regist";
        /* 用户主页 */
       	config.tp_wcp_userinfo_url = config.tp_wcportal_url + "myinfo/info";
	    /* 用户找回密码页1 */
       	config.tp_wcp_forget1_url = config.tp_wcportal_url + "user/forget1";
	    /* 用户找回密码页2 */
       	config.tp_wcp_forget2_url = config.tp_wcportal_url + "user/forget2";
	    /* 作品发布接口 */
       	config.tp_wcp_publish_url = config.tp_wcportal_url + "video/publishVideo";
	    /* 个人作品页 */
       	config.tp_wcp_mywork_url = config.tp_wcportal_url + "MyDance/works?worktype=0";
	    /* 舞队作品页 */
       	config.tp_wcp_teamwork_url = config.tp_wcportal_url + "MyDance/works?worktype=1";

       	config.tp_wcp_redirect_url = config.tp_wcportal_url + "redirect/index";
       	/*用户个人信息页面*/
       	config.tp_wcp_userinfo_page = config.tp_wcportal_url + "myinfo/info";
       	/*月度之星页面*/
       	config.tp_wcp_star_page = config.tp_wcportal_url + "star/star";
       	/*活动页面*/
       	config.tp_wcp_activities_page = config.tp_wcportal_url + "activities/eggs";
       	/*关于我们*/
        config.tp_wcp_aboutus_page = config.tp_wcportal_url + "about/about";
        /*创建舞队页面*/
        config.tp_wcp_create_page = config.tp_wcportal_url + "MyDance/create";
        /*视频播放页面*/
        config.tp_wcp_videoplay_page = config.tp_wcportal_url + "MyDance/detail";
        /*舞队和个人视频作品页面*/
        config.tp_wcp_works_page = config.tp_wcportal_url + "MyDance/works";
        /*舞队信息设置页面*/
        config.tp_wcp_danceindo_page = config.tp_wcportal_url + "MyDance/set";
        /*首次申请或者创建舞队页面*/
        config.tp_wcp_oncedance_page = config.tp_wcportal_url + "MyDance/join";
        /*成员管理页面*/
        config.tp_wcp_member_page = config.tp_wcportal_url + "MyDance/member";
        /*舞队主页*/
        config.tp_wcp_danceindex_page = config.tp_wcportal_url + "MyDance/dance";
        /*申请加入舞队页面*/
        config.tp_wcp_shendance_page = config.tp_wcportal_url + "MyDance/shen";
        /*绑定手机页面*/
        config.tp_wcp_addphone_page = config.tp_wcportal_url + "myinfo/add";
        /*个人主页*/
        config.tp_wcp_myindex_page = config.tp_wcportal_url + "myinfo/index";
        /*个人信息设置页面*/
        config.tp_wcp_myset_page = config.tp_wcportal_url + "myinfo/set";
        /*输入信息页面*/
        config.tp_wcp_infoinput_page = config.tp_wcportal_url + "myinfo/input";
        /*才艺秀页面*/
        config.tp_wcp_starart_page = config.tp_wcportal_url + "star/art";
        /*我的电视节目*/
        config.tp_wcp_staronce_page = config.tp_wcportal_url + "star/once";
        /*月度之星舞队列表页*/
        config.tp_wcp_starrank_page = config.tp_wcportal_url + "star/rank";
        /*月度之星投票页面*/
        config.tp_wcp_starvote_page = config.tp_wcportal_url + "star/vote";
        /*往期月度之星列表页*/
        config.tp_wcp_starlist_page = config.tp_wcportal_url + "star/list";
        /*月度之星设置参赛作品页面*/
        config.tp_wcp_starload_page = config.tp_wcportal_url + "star/load";
	}
	
}