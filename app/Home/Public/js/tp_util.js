define(['zepto','tp_dialog'], function ($,d) {
   function tputil(){}
  
   tputil.getQueryString=function(name) {
        var sResult = "";
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) sResult = unescape(r[2]);
        if (sResult == null || sResult == undefined && sResult == "undefined")
            sResult = "";
        return sResult;
    }
   tputil.redirectUrl = function (url) {
        url = this.appendParam(url, "_v", this.getRandom());
        window.location.href = url;
    }
   tputil.getRandom = function() {
        var dom = Math.random();
        dom = dom * 100000;
        dom = Math.floor(dom);
        return dom;
   }
   tputil.checkPhone=function(phone){
       var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
       if (reg.test(phone)) {
           return true;
       } else {
           return false;
       };
   }
   tputil.appendParam = function(url, paramName, paramValue) {
        if (!url) return "";
        if (url.indexOf("?") >= 0)
            url += "&";
        else
            url += "?";
        url += paramName + "=" + paramValue;
        return url;
    }

   tputil.goback = function() {
        window.history.back();
   }

   tputil.ui = {}
   
   tputil.ui.alert = function (msg, callback) {
       tputil.ui.alertD({
           content: msg,
           ok: callback
       });
   }

   tputil.ui.alertD = function (options) {
       if (!options)
           options = {};
       if (!options.title)
           options.title = null;

       if (!options.content)
           options.content = "";
       if (!options.ok) 
           options.ok = function () { }
       
       d.showDialog(options);
   }

   tputil.ui.confirm = function (msg, okCallback,cancelCallback) {    
       tputil.ui.confirmD({
           content: msg,
           okText: "确认",
           cancelText: "取消",
           ok: okCallback,
           cancel: cancelCallback
       });
   }

   tputil.ui.confirmD = function (options) {
       if (!options)
           options = {};
       if (!options.title)
           options.title = null;

       if (!options.content)
           options.content = "";

       if (!options.ok)
           options.ok = function () { }

       if (!options.cancel)
           options.cancel = function () { }

       d.showDialog(options);
   }

   tputil.loading = {}

    return tputil;
});