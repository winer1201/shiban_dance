require(['zepto', 'Adapter_screen', 'ajax_model','tp_util'], function ($, adapter, ajax,util) {
    /*对屏幕进行适配*/
    adapter.adapter();
    var backurl = util.getQueryString("backurl");
    $('#dregist').tap(function () {
        //util.ui.alert("注册！", function () {
        //    //alert("注册event");
        //});
        regist();
    });
    $('#dlogin').tap(function () {
        //util.ui.confirm({
        //    content: "确定登陆？！",
        //    okText: "是",
        //    cancelText:"否",
        //    ok: function ()
        //    {
        //        //alert("确定");
        //    },
        //    cancel: function () {
        //        //alert("取消");
        //    }
        //});
        login();
    });
    $('#dlogin_wc').tap(function () {
        dlogin_wc();
    });
    $('#dlogout').tap(function () {
        logout();
    });

    function regist() {
        var url = config.tp_wcp_register_url;
        util.redirectUrl(url);
    }

    function login() {
        var phone = $('#phone').val();
        var pwd = $('#pwd').val();

        var data = {};
        data.phone = phone;
        data.pwd = pwd;

        var url = config.tp_wcp_login_url;

        if (phone == "") {
            util.ui.alert("请输入手机号码！");
            return;
        }

        if (pwd == "") {
            util.ui.alert("请输入登陆密码！");
            return;
        }

        if (!util.checkPhone(phone)) {
            util.ui.alert("请输入正确的手机号！");
            return
        }
        var pwdL=pwd.length;
        if (pwdL < 6 || pwdL > 16) {
            util.ui.alert("请输入6-16位密码！");
            return;
        }


        ajax.getData(url, function (res) {
            console.log(res);
            if (!res) return;
            if (res.retcode != 0) {
                util.ui.alert("手机号或密码错误！[" + res.retcode + "]")
                $('#pwd').val("");
                return;
            }

            if (!backurl || backurl == "")
                backurl = config.tp_wcp_userinfo_url;

            util.redirectUrl(backurl);
           
        }, data);
    }

    function dlogin_wc() {
        if (!backurl || backurl == "")
            backurl = config.tp_wcp_userinfo_url;

        var url = config.tp_wcp_redirect_url;
        url = util.appendParam(url, 'loadtype', "login");
        url = util.appendParam(url, 'backUrl', backurl);

        util.redirectUrl(url);
    }
    function logout() {
        var url = config.tp_wcp_logout_url;

        ajax.getData(url, function (res) {
            console.log(res);
            if (!res) return;
            if (res.retcode != 0) {
                alert(res.retcode);
                return;
            }
            //util.redirectUrl(backUrl);

            alert("success");
        }, {});
    }
});