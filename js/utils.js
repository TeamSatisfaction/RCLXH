/**
 * Created by HNCG on 2017/7/4.
 */
layui.define(function(exports){


    /*时间格式化；*/
    var dateFormat = function (fmt, d) {
        if(!d) d = new Date();

        var o = {
            "M+" : d.getMonth()+1, //月份
            "d+" : d.getDate(), //日
            "h+" : d.getHours()%12 == 0 ? 12 : d.getHours()%12, //小时
            "H+" : d.getHours(), //小时
            "m+" : d.getMinutes(), //分
            "s+" : d.getSeconds(), //秒
            "q+" : Math.floor((d.getMonth()+3)/3), //季度
            "S" : d.getMilliseconds() //毫秒
        };
        var week = {
            "0" : "日",
            "1" : "一",
            "2" : "二",
            "3" : "三",
            "4" : "四",
            "5" : "五",
            "6" : "六"
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (d.getFullYear()+"").substr(2 - RegExp.$1.length));
        }
        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[d.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    };

    var loadPage = function(url){
        var $ = layui.jquery;
        $("#index_frame").attr("src", url)
    };

    var getArg = function (key) {
        var uri = decodeURI(window.location.search),
            re = new RegExp(String() + key + "=([^&?]*)", "ig");
        return ((uri.match(re)) ? (uri.match(re)[0].substr(key.length + 1)) : null);
    };
    var getUrlArg = function (url, key) {
        var uri = decodeURI(url),
            re = new RegExp(String() + key + "=([^&?]*)", "ig");
        return ((uri.match(re)) ? (uri.match(re)[0].substr(key.length + 1)) : null);
    };

    var getBtn = function () {
        var $ = layui.jquery;
        var auth_btn_list = [];

        if($('.auth-btn').length>0){
            console.log($('.auth-btn'))
            for(var i = 0; i < $('.auth-btn').length; i++){
                auth_btn_list.push($('.auth-btn').eq(i));
            }
        }
        if($(window.parent)){
            if($(window.parent.document).find('.auth-btn').length>0){
                for(var i = 0; i < $(window.parent.document).find('.auth-btn').length; i++) {
                    auth_btn_list.push($(window.parent.document).find('.auth-btn').eq(i));
                }
            }
        }
        if($('iframe').length>0) {
            for (var i = 0; i < $('iframe').length; i++) {
                if($('iframe').eq(i).find('.auth-btn').length>0){
                    auth_btn_list.push($('iframe').eq(i).find('.auth-btn'))
                }
            }
        }
        console.log(auth_btn_list)
    };

    exports('utils', {
        dateFormat: dateFormat,
        loadPage: loadPage,
        getArg : getArg,
        getUrlArg : getUrlArg,
        getBtn: getBtn
    }); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});
