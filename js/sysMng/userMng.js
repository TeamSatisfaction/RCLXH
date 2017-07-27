/*
/用户管理
 */
layui.define(['layer','element','laypage', 'laydate','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form(),
        uTobody = $('#user-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
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
            url :''+urlConfig+'/v01/htwl/lxh/user',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            dataType : 'json',
            type : 'post',
            data : field,
            success : function (result){
                if(result.message == ''){
                    //closeAddWin();
                    layer.msg('提交成功！', {icon: 1});
                    //$(parent).find("#index_frame").location.reload();
                    parent.location.reload(); // 父页面刷新
                    closeAddWin();
                }else {
                    layer.msg(result.message, {icon: 2});
                }
            }
        });
        return false;
    });
    //加载用户列表
    var loadUserData = function (curr) {
        var name = $('#uName').val(),
            data = {
                pageNumber : curr||1,
                pageSize : 16,
                epMap : {
                    realName : name,
                    epId : '2c9180875bd26a21015bd75bbcc80040'
                }
            };
        var field = JSON.stringify(data);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/user/page',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            dataType : 'json',
            type : 'post',
            data : field,
            success : function (result){
                console.log(result);
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var uData = result.data.rows,
                    pages = result.data.totalPage,
                    str = "";
                var render = function(uData, curr) {
                    var arr = []
                        , thisData = uData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.realName + '</td>' +
                            '<td>' + item.phone + '</td>' +
                            '<td>' + item.createUser+ '</td>' +
                            '<td>' + item.createTime + '</td>' +
                            '<td>' + item.status + '</td>' +
                            // '<td><a href="#"><i class="layui-icon">&#xe63c;</i></a>' +
                            // '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe620;</i></a>' +
                            // '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe640;</i></a></td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                uTobody.html(render(uData, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo1',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr || 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadUserData(obj.curr);
                        }
                    }
                })
            }
        })
    };
    var obj = {
        loadPage : loadPage,
        addUserWin : addUserWin,
        closeAddWin : closeAddWin,
        loadUserData : loadUserData
    };
    /*输出内容，注意顺序*/
    exports('userMng',obj)
})