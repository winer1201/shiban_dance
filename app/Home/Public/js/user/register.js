require(['zepto', 'Adapter_screen', 'ajax_model', 'tp_util'], function ($, adapter, ajax, util) {
    /*对屏幕进行适配*/
    adapter.adapter();
    $('#dregist').tap(function () {
        regist();
    });
    $('#dsend').tap(function () {
        sendcode();
    });
    var is_waiting = false;
    var num_waiting = 90;
    function regist() {
        var phone = $('#phone').val();
        var verifycode = $('#verifycode').val();
        var pwd = $('#pwd').val();

        if (phone == "") {
            util.ui.alert("请输入手机号码！");
            return;
        }
        if (!util.checkPhone(phone)) {
            util.ui.alert("请输入正确的手机号！");
            return
        }

        if (verifycode == "") {
            util.ui.alert("请输入验证码！");
            return;
        }

        if (verifycode.length !=4) {
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

        var data = {};
        data.username = phone;
        data.password = pwd;
        data.logintype = 0;
        data.verifycode = verifycode;

        var url = config.tp_wcs_register_url;


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
                util.ui.alert("注册失败！[" + res.retcode + "]")
                return;
            }

            util.ui.alert("注册成功！", function () {
                util.goback();
            });
        }, data);

    }

    function sendcode() {
        if (is_waiting) return;
        var phone = $('#phone').val();

        var url = config.tp_wcs_send_verifycode_url;

        if (phone == "") {
            util.ui.alert("请输入手机号码！");
            return;
        }
        if (!util.checkPhone(phone)) {
            util.ui.alert("请输入正确的手机号！");
            return
        }

        var data = {};
        data.phone = phone;
        data.verifysource = 0;

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
        if(num_waiting<=0)
        {
            num_waiting = 90;
            is_waiting = false;
            $('#dsend').css("background-color", "#0bae18");
            $('#fcode').text("获取验证码");
        }
        else {
            num_waiting--;
            is_waiting = true;
            $('#dsend').css("background-color", "#808080");
            $('#fcode').text(num_waiting+"秒后重试");

            setTimeout(waiting, 1000);
        }
    }
});