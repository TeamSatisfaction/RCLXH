/*
*监测站管理
*/
layui.define(['layer','element','laypage','layedit', 'laydate'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        element=layui.element(),
        laypage = layui.laypage;
    //页面跳转
    var loadPage = function(url,p){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    var addMSWin = function () {
        layer.open({
            title : '新增监控站',
            type : 2,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/addMsView.html',
            btn: ['提交', '关闭'],
            btnAlign: 'c',
            yes : function (index) {
                layer.msg('提交成功！', {icon: 1})
                layer.close(index);
            }
        })
    };
    var obj = {
        loadPage : loadPage,
        addMSWin : addMSWin
    }
    /*输出内容，注意顺序*/
    exports('MSMng',obj)
})