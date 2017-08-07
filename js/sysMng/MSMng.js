/*
*监测站管理
*/
layui.define(['layer','element','laypage','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        element=layui.element(),
        laypage = layui.laypage,
        form = layui.form(),
        msTobody = $('#ms-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    //页面跳转
    var loadPage = function(url,p){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //载入监测站列表
    var loadMSData = function (curr) {
        var site = $('#MSName').val(),
            data = {
                name : site,
                pageNum : curr||1,
                pageSize : 16
            };
        var field = JSON.stringify(data);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/page',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'post',
            data : field,
            success : function (result){
                console.log(result)
                var msData = result.data.list,
                    pages = result.data.pages,
                    str = "",
                    nums = 16; //每页出现的数据量
                //模拟渲染
                var render = function(msData, curr) {
                    var arr = []
                        , thisData = msData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.name + '</td>' +
                            '<td>' + item.address + '</td>' +
                            '<td>' + item.head + '</td>' +
                            '<td>' + item.headPhone+ '</td>' +
                            '<td>' + item.lon + '</td>' +
                            '<td>' + item.lat + '</td>' +
                            // '<td><a href="#"><i class="layui-icon">&#xe63c;</i></a>' +
                            // '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe620;</i></a>' +
                            // '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe640;</i></a></td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                msTobody.html(render(msData, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo2',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr || 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadMSData(obj.curr);
                        }
                    }
                })
            }
        })
    };
    var addMSWin = function () {
        layer.open({
            title : '新增监控站',
            type : 2,
            area : ['800px','500px'],
            content : '../../pages/sysMng/addMsView.html',
            btn: [ '提交','返回'],
            btnAlign: 'c',
            success: function(layero,index){
                form.render();
                //表单验证
                // form.verify({
                //     threshold : function (value) {
                //         if(!new RegExp("^(([1-9])|(1[0-9])|(2[0-4]))$").test(value)){
                //             return '只能输入1~24的整数';
                //         }
                //     }
                // });
            },
            yes  : function (index,layero) {
                layero.find("iframe").contents().find('#ms-save').click();
            }
        })
    };
    //form表单提交
    form.on('submit(formDemo)', function(data){
        var field = JSON.stringify(data.field);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/water/add',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            dataType : 'json',
            type : 'post',
            data : field,
            success : function (result){
                if(result.resultdesc == '成功'){
                    layer.msg('提交成功！', {icon: 1});
                    parent.location.reload(); // 父页面刷新
                    closeAddWin();
                }else {
                    layer.msg('提交失败！', {icon: 2});
                }
            }
        });
        return false;
    });
    //关闭窗口
    // var closeAddWin = function () {
    //     var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    //     parent.layer.close(index); //再执行关闭
    // };
    // var saveMSData = function () {
    //     form.on('submit(formDemo)', function(data){
    //         console.log(data);
    //     });
    //     layer.msg('提交成功！', {icon: 1});
    //     loadMSData();
    // }
    var obj = {
        loadPage : loadPage,
        loadMSData : loadMSData,
        addMSWin : addMSWin
    };
    /*输出内容，注意顺序*/
    exports('MSMng',obj)
})