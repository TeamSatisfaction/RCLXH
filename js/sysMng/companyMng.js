/*
/企业管理ctrl
 */
layui.define(['layer', 'element'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer;
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    /*输出内容，注意顺序*/
    var obj = {
        loadPage : loadPage
    };
    exports('companyMng',obj)
})