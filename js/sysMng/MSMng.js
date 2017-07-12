/*
*监测站管理
*/
layui.define(['layer','element','laypage','layedit', 'laydate'],function (exports){
    var $ = layui.jquery,
        laypage = layui.laypage;
    //页面跳转
    var loadPage = function(url,objectid){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
        $(parent).find("#companyNav").removeClass('layui-show');
        $(parent).find("#MSNav").addClass('layui-show');
    };
    var obj = {
        loadPage : loadPage
    }
    /*输出内容，注意顺序*/
    exports('MSMng',obj)
})