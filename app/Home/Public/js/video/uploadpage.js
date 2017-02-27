require(['zepto', 'Adapter_screen', 'ajax_model', 'tp_util', 'resumable'], function ($, adapter, ajax, util, Resumable) {
    /*对屏幕进行适配*/
    adapter.adapter();

    var userInfo = null;
    var filetype = 0;
    var upload_file = null;
    var load_event = null;

    var video, output;
    var scale = 0.4;
    var cut_time = 0;
    var cut_number = 0;
    var cut_finished = false;
    var cut_slip_time = 15;
    var max_cut_number = 5;
    var cut_Loaded = false;

    var img_selected = null;
    


    function loadUserInfo() {
        var getuser_url = config.tp_wcs_getuserinfo_url;
        var data = {};
        ajax.getData(getuser_url, function (res) {
            console.log(res);
            if (res.retcode == 0) {
                userInfo = res.data;

                try{
                    one.init();
                }
                catch (e) {
                    console.log(e.message);
                }
            }
            else {
                //util.redirectUrl(config.tp_wcp_login_page);
            }
        }, data);
    }
   
    var uone = function () {
        if (!(this instanceof uone)) {
            return new uone();
        }
        this.init = function () {
            initHeader("upload1");

            if (userInfo && userInfo.teamcode && userInfo.teamcode != "") {
                $("#duploadteam").css("display", "block");
            } else
                $('#duploadperson').css('background-color', "#0bbfd1");
           

            $('#duploadteam').click(function () {
                uploadConent(1);
            });
            $('#duploadperson').click(function () {
                uploadConent(0);
            });

            $('#bfile').change(function (e) {

                var files = this.files;
                if (files && files.length) {
                    file = files[0];
                    load_event = e;
                    two.init();
                }
                else {
                    load_event = null;
                }                
            });
            
        }

        function uploadConent(type) {
            filetype = type;
            $('#bfile').click();            
        }
    }

    var hasclick = false;
    var utwo = function () {
        if (!(this instanceof utwo)) {
            return new utwo();
        }
        var backurl = util.getQueryString("backurl");
        var filename = "";
        var self = this;

        var loadinit = false;
        var u=null;

        this.init = function () {
            initHeader("upload2");

            u = new Resumable({
                target: '/video/upload',
                chunkSize: 1 * 1024 * 1024,
                simultaneousUploads: 4,
                testChunks: false,
                throttleProgressCallbacks: 1,
            });
            u.on("fileAdded", function (file) {
                console.log("fileAdded , file - [" + file + "] ");
                u.upload();
            });
            u.on("uploadStart", uploadstart);
            u.on("fileProgress", uploading);
            u.on("complete", complete);
            u.on("fileSuccess", uploadsuccess);
            u.on("fileError", uploaderr);         

            $('#dpublish').click(function () {
                upload();
            });
            $('#dgetposter').click(function () {
                hasclick = true;
                video.play();               
            });
            cutimg();
            initVideo();
        }

        function initVideo() {
            if (!load_event) return;
            var file = load_event.target.files[0];
            var url = URL.createObjectURL(file);
            console.log(url);
            $('#video').attr('src', url);           
        }

        function cancelFullScrren(elem) {
            elem = elem || document;
            if (elem.cancelFullScrren) {
                elem.cancelFullScrren();
            } else if (elem.mozCancelFullScreen) {
                elem.mozCancelFullScreen();
            } else if (elem.webkitCancelFullScreen) {
                console.log("webkitCancelFullScreen");
                elem.webkitCancelFullScreen();
            }
        }



        function cutimg() {
            output = document.getElementById("dposter");
            video = document.getElementById("video");
            video.addEventListener('loadeddata', function () {
                if (!hasclick) return;
                alert("loadeddata  ,  video.duration = " + video.duration + " , cut_number = " + cut_number + " , max_number = " + max_cut_number);
            });

            video.addEventListener('loadedmetadata', function () {
                if (!hasclick) return;
                alert("loadedmetadata  ,  video.duration = " + video.duration + " , cut_number = " + cut_number + " , max_number = " + max_cut_number);
               
            });
            video.addEventListener('durationchange', function () {
                //cutNumber();
                //alert("durationchange  ,  video.duration = " + video.duration);
                //alert("durationchange  ,  video.duration = " + video.duration + " , cut_number = " + cut_number + " , max_number = " + max_cut_number);
                if (cut_Loaded) return;
                if (video.duration && video.duration > 1) {
                    video.currentTime = 2
                    cut_Loaded = true;

                    video.pause();
                    initContainer2();
                    cutNumber();
                    video.play();                    
                }
            });

            video.addEventListener('loadstart', function () {
                if (!hasclick) return;
                alert("loadstart  ,  video.duration = " + video.duration + " , cut_number = " + cut_number + " , max_number = " + max_cut_number);

            });

            video.addEventListener('progress', function () {
                if (!hasclick) return;
                alert("progress  ,  video.duration = " + video.duration + " , cut_number = " + cut_number + " , max_number = " + max_cut_number);

            });
            video.addEventListener('canplaythrough', function () {
                //cutNumber();
                if (!hasclick) return;
                alert("canplaythrough  ,  video.duration = " + video.duration + " , cut_number = " + cut_number + " , max_number = " + max_cut_number);

            });

            video.addEventListener('canplay', function () {
                //alert("canplay  ,  video.duration = " + video.duration + " , cut_number = " + cut_number + " , max_number = " + max_cut_number);
                //video.webkitEnterFullscreen();
                //if (!cut_Loaded) return;
                //if (cut_finished) {
                //    show_video();
                //    return;
                //}
                //captureImage();
            });

            video.addEventListener('playing', function () {
                //alert("playing  ,  video.duration = " + video.duration + " , cut_number = " + cut_number + " , max_number = " + max_cut_number);

                if (!hasclick || !cut_Loaded || cut_finished) return;
              
                if (cut_finished) {
                    //show_video();
                    return;
                }
                video.pause();
                var timer = 300;
                if (cut_number < 1) timer = 300;
                setTimeout(function () {
                    captureImage();
                }, 1000);
                
            });

            video.addEventListener('play', function () {
                if (!hasclick) return;
                //alert("play  ,  video.duration = " + video.duration + " , cut_number = " + cut_number + " , max_number = " + max_cut_number);

            });

        }

        function cutNumber() {
            var number = Math.floor(video.duration / cut_slip_time) + 1 + 1;
            if (number < max_cut_number)
                max_cut_number = number;
        }

        function sel_img(img) {
            if (img_selected) {
                img_selected.style.border = 0;
            }                
            img_selected = img;
            img_selected.style.border = "3px #d8ea7b solid";
        }

        function captureImage() {
            var canvas = document.createElement("canvas");
            canvas.width = video.videoWidth * scale;
            canvas.height = video.videoHeight * scale;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            if (cut_number > 0) {
                var img = document.createElement("img");
                img.id = "img_" + cut_number;
                img.src = canvas.toDataURL("image/jpeg");
                //console.log(img.src);
                img.addEventListener("click", function () {
                    sel_img(this);
                });;
                console.log(img.src.length);
                $(img).css("width", "1.5rem");
                $(img).css("heght", "1rem");
                output.appendChild(img);

                if (cut_number == 1)
                    sel_img(img);
            }   

            cut_number++;
            if (cut_number >= max_cut_number) {
                //alert("set cut_finished = true , cut_number = " + cut_number + " , max_cut_number = " + max_cut_number);
                cut_finished = true;
                document.getElementById("video").currentTime = 0;
                video.play();
                show_video();
                return;
            }
            if (cut_number <= 1)
                cut_time += 1;
            else
                cut_time += cut_slip_time;
            //alert("set currentTime = " + cut_time);
            document.getElementById("video").currentTime = cut_time;
            video.play();
            //hide_video();
            //setTimeout(function () {
            //    video.play();
            //}, 1000);           
         
        }

        function hide_video() {
            var img = document.createElement("img");
            var dhideimg = document.all("dhideimg");

            if (!output || !output.children || output.children.length <= 0)
                return;

            img.src = output.children[0].src;
            img.width = video.offsetWidth;
            img.height = video.offsetHeight;
            dhideimg.width = img.width;
            dhideimg.height = img.height;
            $(dhideimg).css("top", "0");

            //$(dhideimg).css("position","absolute");
            dhideimg.innerHTML = "";
            dhideimg.appendChild(img);

        }

        function show_video() {
            var dhideimg = document.all("dhideimg");
            dhideimg.innerHTML = "";
            //$(dhideimg).css("top","");
        }

        function upload() {
            var data = check();
            if (!data) return;

            if (!load_event) return;

            $('#dpublish').css("display", "none");

            //TODO:upload
            console.log("begin upload - [" + file + "]");
            var file = load_event.target.files[0];
            filename = file.name;
            u.addFile(file, load_event);

            //TODO:save
        }

        function check() {
            var data = false;
            var name = $('#vname').val();

            if (!name || name == "") {
                util.ui.alert("请输入作品名称！");
                return data;
            }

            data = {};
            data.name = name;

            return data;
        }

        function uploading(file) {
            console.log("file - [" + file + "]");
            $('.progress-bar').css({ width: Math.floor(file.progress() * 100) + '%' });
            $('.progress-percent').html(Math.floor(file.progress() * 100) + '%');
        }

        function uploadstart() {
            console.log("uploadstart");
            $('.progress').css("display", "block");
        }

        function complete() {
            console.log("complete");
        }

        function uploadsuccess(file, message) {
            console.log("upload success.file-  [" + file + "] , msg - [" + message + "]");
            //todo:publish
            publish();
        }

        function uploaderr(file, msg) {
            console.log("upload failed.file-  [" + file + "] , msg - [" + msg + "]");
        }

        function publish() {
            var url = config.tp_wcp_publish_url;
            var name = $('#vname').val();
            var info = $('#vinfo').val();
            var img_data = "";
            var data = {};

            if (img_selected) {
                img_data = img_selected.src;
                img_data = img_data.split("base64,")[1];
            }

            if (!img_data || !img_data.length || img_data.length < 20) {
                util.ui.alert("请选择海报图！");
                return;
            }

            data.filetype = filetype;
            data.posterdata = img_data;
            data.videoname = name;
            data.filename = filename;

            ajax.getData(url, function (res) {
                console.log(res);
                if (!res) return;
                if (res.retcode != 0) {
                    util.ui.alert("发布失败,请稍后重新发布！[" + res.retcode + "]")
                    return;
                }

                if (!backurl || backurl == "") {
                    if (filetype == 0)
                        backurl = config.tp_wcp_mywork_url;
                    else
                        backurl = config.tp_wcp_teamwork_url
                }

                util.redirectUrl(backurl);

            }, data);
        }
    }

    function initHeader(showid) {
        $("#upload1").css("display", "none");
        $("#upload2").css("display", "none");
        $("#" + showid).css("display", "block");
    }

    function initContainer2() {
        $("#dposter").css("height", "1.5rem");
        $("#dname").css("display", "block");
        $("#dpublish").css("display", "block");
        $("#dgetposter").css("display", "none");
    }

    var one = uone();
    var two = utwo();
    loadUserInfo();
});

