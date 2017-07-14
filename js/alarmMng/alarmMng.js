/*
/报警管理
 */
layui.define(['layer','laydate','element','layedit'], function(exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage;
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    var obj = {
        loadPage : loadPage
    };
    exports('alarmMng',obj);
})