/*
/用户管理
 */
layui.define(['layer','element','laypage', 'laydate','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form();
    //页面跳转
    var loadPage = function(url,p){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    var addUserWin = function () {
        layer.open({
            title : '新增用户',
            type : 2,
            area : ['800px','500px'],
            content : '../../pages/sysMng/addUserView.html'
        })
    };
    //关闭窗口
    var closeAddWin = function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    };
    var obj = {
        loadPage : loadPage,
        addUserWin : addUserWin,
        closeAddWin : closeAddWin
    };
    /*输出内容，注意顺序*/
    exports('userMng',obj)
})