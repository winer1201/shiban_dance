require(['zepto', 'Adapter_screen', 'ajax_model', 'tp_util'], function ($, adapter, ajax, util) {
    /*对屏幕进行适配*/
    adapter.adapter();
    $('#dsubmit').tap(function () {
        submit();
    });
    $('#dsend').tap(function () {
        sendcode();
    });
    var phone = util.getQueryString("phone");
    function submit() {
        if (phone == "" || !util.checkPhone(phone)) {
            util.ui.alert("手机号错误，请重新设置！");
            return;
        }

        var verifycode = $('#verifycode').val();
        var pwd = $('#pwd').val();

        if (verifycode == "") {
            util.ui.alert("请输入验证码！");
            return;
        }

        if (verifycode.length != 4) {
            util.ui.alert("验证码长度错误！");
            return;
        }

        if (pwd == "") {
            util.ui.alert("请输入登陆密码！");
            return;
        }

         var pwdL = pwd.length;
        if (pwdL < 6 || pwdL > 16) {
            util.ui.alert("请输入6-16位密码！");
            return;
        }

        var url = config.tp_wcs_modifypwd_url;
        var data = {};
        data.username = phone;
        data.password = pwd;
        data.verifycode = verifycode;

        ajax.getData(url, function (res) {
            console.log(res);
            if (!res) return;
            if (res.retcode != 0) {
                if (res.retcode == 201039) {
                    util.ui.alert("验证码错误！");
                    return;
                }
                if (res.retcode == 201040) {
                    util.ui.alert("验证码超时！");
                    return;
                }
                util.ui.alert("操作失败！[" + res.retcode + "]")
                return;
            }

            util.ui.alert("操作成功！", function () {
                var login_url = config.tp_wcp_login_page;
                var user_url = config.tp_wcp_userinfo_url;
                login_url = util.appendParam(login_url, "backurl", user_url);
                util.redirectUrl(login_url);
            });
        }, data);
    }

    var is_waiting = false;
    var num_waiting = 90;

    function sendcode() {
        if (is_waiting) return;

        var url = config.tp_wcs_send_verifycode_url;

        if (phone == "" || !util.checkPhone(phone)) {
            util.ui.alert("手机号错误，请重新设置！");
            return;
        }

        var data = {};
        data.phone = phone;
        data.verifysource = 1;

        ajax.getData(url, function (res) {
            console.log(res);
            if (!res) return;
            if (res.retcode != 0) {
                util.ui.alert("效验码发送失败！[" + res.retcode + "]")
                return;
            }

            $('#verifycode').val("");

            waiting();
        }, data);
    }

    function waiting() {
        if (num_waiting <= 0) {
            num_waiting = 90;
            is_waiting = false;
            $('#dsend').css("background-color", "#0bae18");
            $('#fcode').text("获取验证码");
        }
        else {
            num_waiting--;
            is_waiting = true;
            $('#dsend').css("background-color", "#808080");
            $('#fcode').text(num_waiting + "秒后重试");

            setTimeout(waiting, 1000);
        }
    }
});