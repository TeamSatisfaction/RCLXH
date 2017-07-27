/**
 * Created by HNCG on 2017/7/3.
 */

layui.define(['layer','element'], function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var $ = layui.jquery,
        element = layui.element();
    /*方法*/
    var init = function () {
        /*标题栏时间*/
        setInterval(
            'document.getElementById("time").innerHTML = layui.utils.dateFormat("yy年MM月dd日 HH:mm:ss EEE");',
            100);
        /*加载首页*/
        loadPage('pages/map/map.html')
    };
    
    var loadPage = function (url) {
        if(url.indexOf('sysMngView')!=-1){
            $("#index_frame").hide()
        }
        $("#index_frame").attr("src", url);
        //左侧目录
        // $(".side").find("li").each(function () {
        //     if($(this).find("a").attr("onclick").indexOf(url.substring(url.lastIndexOf('/'), url.length)) != -1){
        //         $(this).addClass("layui-this").siblings().removeClass("layui-this");
        //     }
        // })
    };
    //导航栏点击
    // element.on('nav(left_menu)', function(elem){
    //     console.log(elem.text()); //得到当前点击的DOM对象
    //     var company_tab = $('#company_tab');
    //     console.log(company_tab);
    // });

    /*输出内容，注意顺序*/
    var obj = {
        init : init,
        loadPage : loadPage
    };
    //输出test接口
    exports('index', obj);

});