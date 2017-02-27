require(['zepto', 'Adapter_screen', 'ajax_model', 'tp_util'], function ($, adapter, ajax, util) {
    /*对屏幕进行适配*/
    adapter.adapter();
    $('#dnext').tap(function () {
        next();
    });
    function next() {
        var phone = $('#phone').val();

        if (phone == "") {
            util.ui.alert("请输入手机号码！");
            return;
        }
        if (!util.checkPhone(phone)) {
            util.ui.alert("请输入正确的手机号！");
            return
        }

        var url = config.tp_wcp_forget2_url;
        url = util.appendParam(url, "phone", phone);

        util.redirectUrl(url);
    }
});