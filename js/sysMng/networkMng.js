/*
 *监测站管理
 */
layui.define(['layer','element','laypage', 'laydate','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        element=layui.element(),
        laypage = layui.laypage,
        form = layui.form();
    //页面跳转
    var loadPage = function(url,p){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };

    var addNetworkWin = function () {
        layer.open({
            title : '新增联网信息',
            type : 2,
            area : ['800px','500px'],
            content : '../../pages/sysMng/addNetworkView.html'
        })
    };
    //关闭窗口
    var closeAddWin = function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    };

    var obj = {
        loadPage : loadPage,
        addNetworkWin : addNetworkWin,
        closeAddWin : closeAddWin
    };
    /*输出内容，注意顺序*/
    exports('networkMng',obj)
})