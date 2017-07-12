/*
*监测站管理
*/
layui.define(['layer','element','laypage','layedit', 'laydate'],function (exports){
    var $ = layui.jquery,
        element=layui.element(),
        laypage = layui.laypage;
    //页面跳转
    var loadPage = function(url,p){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    var obj = {
        loadPage : loadPage
    }
    /*输出内容，注意顺序*/
    exports('MSMng',obj)
})