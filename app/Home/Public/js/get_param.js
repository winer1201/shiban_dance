define(function(){
	return{
		getQueryString: function (name) {
	        var sResult = "";
	        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	        var r = window.location.search.substr(1).match(reg);
	        if (r != null) sResult = unescape(r[2]);
	        if (sResult == null || sResult == undefined && sResult == "undefined")
	            sResult = "";
	        return sResult;
   		}
	}
})
