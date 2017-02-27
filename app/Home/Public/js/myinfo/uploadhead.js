require(['zepto', 'Adapter_screen', 'ajax_model', 'tp_util'], function ($, adapter, ajax,util) {
    /*对屏幕进行适配*/
    adapter.adapter();

    var getImgData = null;
    var URL = window.URL || window.webkitURL;
    if (!URL) {
        return;
    }

    $('#saveimg').bind('click', function () {
        //browseimg('');
        if (!getImgData) return;
        var imgData = getImgData();
        //todo
        var length = imgData.length;
        console.log(imgData);
        //$('#img_cut').attr('src', imgData);
        //$('#img_cut').css("display", "block");
        var url = config.tp_wcs_user_update_url;
        var data = {};
        data.datalist = '[{"key":"headimgurl","value":"' + imgData + '"}]';
        data.uid = m_cur_uid;
        data.token = m_token;
        //todo:
        //save
        ajax.getData(url, function (res) {
            if (!res) return;
            if (res.retcode != 0) {
                util.ui.alert("操作失败！[" + res.retcode + "]");
                return;
            }
            var infoUrl = "set";
            util.redirectUrl(infoUrl);
        }, data);
        //redirect
    });
    $('#browseFile').bind('click', function () {
        //$('#img_cut').css("display", "none");
        document.getElementById('inputImage').click();
    });
    function init() {
        $('#inputImage').change(function () {
            var files = this.files;
            var file;
            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    browseimg(blobURL);
                }
                else {
                    window.alert('Please choose an image file.');
                }
            }
            //$(inputImage).find("img").hide();
        });
    }

    function browseimg(imgUrl) {
        $('#container_node').html('');
        $.cutPhoto(
        {
            container: "container_node",
            browse_button: "inputImage",
            save_button: "saveimg",
            filters_background: imgUrl
        },
        function (cutPhotoCacheData, initStatus) {
            getImgData = cutPhotoCacheData;
            console.log("initStatus -- " + initStatus);
            //alert(length);
        });
    }
    //init();
    browseimg("");
   
    //$('#inputImage').click();
});