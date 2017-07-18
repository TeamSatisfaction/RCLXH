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
            area : ['800px','650px'],
            content : '../../pages/sysMng/addUserView.html'
        })
    };
    //关闭窗口
    var closeAddWin = function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    };
    //form表单提交
    form.on('submit(formDemo)', function(data){
        var field = JSON.stringify(data.field);
        $.ajax({
            url :'http://172.21.92.77:8092/v01/htwl/lxh/water/add',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            dataType : 'json',
            type : 'post',
            data : field,
            success : function (result){
                if(result.resultdesc == '成功'){
                    //closeAddWin();
                    layer.msg('提交成功！', {icon: 1});
                    //$(parent).find("#index_frame").location.reload();
                    parent.location.reload(); // 父页面刷新
                    closeAddWin();
                }else {
                    layer.msg('提交失败！', {icon: 2});
                }
            }
        });
        return false;
    });
    var obj = {
        loadPage : loadPage,
        addUserWin : addUserWin,
        closeAddWin : closeAddWin
    };
    /*输出内容，注意顺序*/
    exports('userMng',obj)
})