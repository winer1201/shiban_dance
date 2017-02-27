define(['zepto'],function($){
	window.input=(function(){
			var isLock = false;
			var signature=function(options){
				this.settings =$.extend({},signature.defaults, options);
        		this.init();
			};
			signature.prototype={
				init:function(){
					var _this=this;
					if(!this.settings.id) return;
					if(!this.settings.title) return;
					document.getElementById(this.settings.id).addEventListener('click',function(){
						_this.create();
						if(_this.settings.lock){
							_this.lock();
						}
					})
					
				},
				lock:function(){
					if (isLock) return;
		            this.locker = $('<div>').css({ 'zIndex': this.settings.index }).addClass('signature-mask');
		            this.locker.appendTo('body');
		            setTimeout(function(){
		            	 $('.signature-mask').addClass('signature-mask-active');
		            },200)
		            isLock = true;
				},
				//创建元素标签
				create:function(){
					var dom=$('<div class="signature-wrap"></div>');
					var html='<p>'+this.settings.title+'</p><textarea name="txt" wrap="hard" autofocus="autofocus"></textarea><span class="signature-yes">'+this.settings.okText+'</span><span class="signature-esc">'+this.settings.cancelText+'</span>'
					dom.html(html);
					dom.prependTo('body');
					this.show();
					 // 设置ok按钮
		            if ($.isFunction(this.settings.ok)) {
		                this.ok();
		            }
		            // 设置cancel按钮
		            if ($.isFunction(this.settings.cancel)) {
		                this.cancel();
		            }
		            setTimeout(function(){
		            	 $('.signature-wrap').addClass('signature-wrap-active');
		            },200)
		           
				},
				show:function(){
					if($('#'+this.settings.id).html()){
						$('textarea').html($('#'+this.settings.id).html());
					}
				},
				ok:function(){
					var _this = this;
		            $('.signature-yes').on("click",function(){
		                var okCallback = _this.settings.ok();
		                if (okCallback == undefined || okCallback){
		                    _this.close();
		                }
		            })
				},
				cancel:function(){
					var _this = this;
		            $('.signature-esc').on("click", function () {
		                var okCallback = _this.settings.cancel();
		                if (okCallback == undefined || okCallback){
		                    _this.close();
		                }
		            })
				},
				close:function(){
					$('.signature-wrap').removeClass('signature-wrap-active');
					setTimeout(function(){
						$('.signature-wrap').remove();
					},1000)
            		this.unLock();
				},
				unLock:function(){
					if (this.settings.lock) {
		                if (isLock) {
		                	$('.signature-mask').removeClass('signature-mask-active');
		                	setTimeout(function(){
		                		$('.signature-mask').remove();
		                	},1000)
		                    isLock = false;
		                }
	            	}
				}
			}
			signature.defaults={
				id:'',
				title:'',
				index:'9999',
				 // 确定按钮回调函数
		        ok:function(){},
		        // 取消按钮回调函数
		        cancel: function(){},
		        // 确定按钮文字
		        okText: '确定',
		        // 取消按钮文字
		        cancelText: '取消',
		        // 自动关闭时间(毫秒)
		        time: null,
		        // 是否锁屏
		        lock: true,
			}
			return signature;
		})()
})
