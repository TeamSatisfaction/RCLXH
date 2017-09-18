/**
 * Created by HNCG on 2017/7/3.
 */

layui.define(['layer','element'], function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var $ = layui.jquery,
        element = layui.element();

    function hideSidebar() {
        $(".side").find("li").find("a").find(".layui-nav-more").show();
        $(".side").animate({width : "70"}, 200, function () {
            $(".side").find("li").find("a").find("cite").hide();
        } );
        $(".side").find(".layui-nav").animate({width : "70"}, 200 );
        $(".layui-body").animate({width : $(".layui-body")+130, marginLeft: -130}, 200 );
    }
    function showSidebar() {
        $(".side").find("li").find("a").find("cite").show();
        $(".side").animate({width : "200"}, 200 );
        $(".side").find(".layui-nav").animate({width : "200"}, 200 );
        $(".layui-body").animate({width : $(".layui-body")-130, marginLeft: 0}, 200 );
    }

    /*方法*/
    var init = function () {
        /*标题栏时间*/
        setInterval(
            'document.getElementById("time").innerHTML = layui.utils.dateFormat("yy年MM月dd日 HH:mm:ss EEE");',
            100);
        /*加载首页*/
        loadPage('pages/map/map.html');

        $(".side-hider").click(function () {
            $(this).toggleClass("off");
            $(this).hasClass("off")?hideSidebar():showSidebar();
        })
    };
    
    var loadPage = function (url) {
        if(url.indexOf('sysMngView')!=-1){
            $("#index_frame").hide()
        }else{
            $("#index_frame").show()
        }
        $("#index_frame").attr("src", url);
        //左侧目录
        // $(".side").find("li").each(function () {
        //     if($(this).find("a").attr("onclick").indexOf(url.substring(url.lastIndexOf('/'), url.length)) != -1){
        //         $(this).addClass("layui-this").siblings().removeClass("layui-this");
        //     }
        // })
    };
    /*菜单管理*/
    var menuMng = function () {

    }
    /*输出内容，注意顺序*/
    var obj = {
        init : init,
        loadPage : loadPage,
        menuMng : menuMng
    };
    //输出test接口
    exports('index', obj);

});