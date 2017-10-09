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
                pageSize : 16,
                enterpriseRole : 'monitoringStation_enterprise',
                areaCode : '500000-500153'
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
                            '<td style="text-align: center">'+
                            '<a class="auth-btn" data-authId="8" href="#" onclick="layui.MSMng.alterMSWin(\''+item.baseEnterpriseId+'\')" title="修改"><img src="../../img/mng/alter.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="7" href="#" onclick="layui.MSMng.deleteMS(\''+item.baseEnterpriseId+'\')" title="删除"><img src="../../img/mng/delete.png"></a>'+
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                msTobody.html(render(msData, obj.curr));
                layui.sysMng.loadAuthen();
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
            area : ['800px','550px'],
            content : '../../pages/sysMng/addMsView.html',
            btn: [ '提交','返回'],
            btnAlign: 'c',
            yes  : function (index,layero) {
                layero.find("iframe").contents().find('#ms-save').click();
            }
        })
    };
    //form表单提交
    form.on('submit(formDemo)', function(data){
        var title =  $(window.parent.document).find('.layui-layer-title').text();
        console.log(title)
        data.field.areaCode = "500000-500153";
        data.field.buildStatus = "已建成";
        data.field.expectDate = "2017";
        data.field.establishDate = '2017-9-28';
        data.field.enterpriseRole = "monitoringStation_enterprise";
        var field = JSON.stringify(data.field);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            dataType : 'json',
            type : 'post',
            data : field,
            success : function (result){
                if(result.code == 1000){
                    layer.msg('提交成功！', {icon: 1,time:1000},function () {
                        parent.location.reload(); // 父页面刷新
                        layer.close(1);
                    });
                }else {
                    layer.msg('提交失败！', {icon: 2});
                }
            }
        });
        return false;
    });
    //修改
    var alterMSWin = function (id) {
        layer.open({
            title : '修改监控站',
            id : id,
            type : 2,
            area : ['800px','500px'],
            content : '../../pages/sysMng/addMsView.html',
            btn: [ '提交','返回'],
            btnAlign: 'c',
            yes  : function (index,layero) {
                var body = layer.getChildFrame('body',index),
                    name = body.contents().find("input[name='name']").val(),
                    head = body.contents().find("input[name='head']").val(),
                    headPhone = body.contents().find("input[name='headPhone']").val(),
                    lon = body.contents().find("input[name='lon']").val(),
                    lat = body.contents().find("input[name='lat']").val(),
                    address = body.contents().find("input[name='address']").val();
                var data = {
                    name : name,
                    head : head,
                    headPhone : headPhone,
                    lon : lon,
                    lat : lat,
                    address : address,
                    baseEnterpriseId : id,
                    industryCodes : '行业类别',
                    areaCode : "500000-500153",
                    enterpriseRole : "monitoringStation_enterprise"
                };
                var field = JSON.stringify(data);
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/enterprise',
                    headers : {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'put',
                    data : field,
                    success : function (result){
                        if(result.code == 1000){
                            layer.msg('修改成功！', {icon: 1,time:1000},function () {
                                location.reload(); // 父页面刷新
                                layer.close(index);
                            });
                        }else{
                            layer.msg('修改失败！', {icon: 2});
                        }
                    }
                })
            }
        })
    };
   //载入监测站详情
    var loadMSDetails = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id'),//监测站id
            title =  $(window.parent.document).find('.layui-layer-title').text();
        if(title == '修改监控站'){
            $.ajax({
                url :''+urlConfig+'/v01/htwl/lxh/enterprise/'+id+'',
                headers : {
                    Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                },
                type : 'get',
                success : function (result){
                    console.log(result)
                    var data = result.data;
                    if(data){
                        $("input[name='name']").val(data.name);
                        $("input[name='head']").val(data.head);
                        $("input[name='headPhone']").val(data.headPhone);
                        $("input[name='lon']").val(data.lon);
                        $("input[name='lat']").val(data.lat);
                        $("input[name='address']").val(data.address);
                    }
                }
            })
        }
    };
    //删除监测站
    var deleteMS = function (id) {
        layer.msg('是否确定删除该监测站', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/enterprise/'+id+'',
                    headers : {
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'delete',
                    success : function (result){
                        if(result.code == '1000'){
                            layer.msg('删除成功', { icon: 1, shade: 0.4, time: 1000 },function () {
                                layer.close(index);
                                location.reload(); // 页面刷新
                            });
                        }else {
                            layer.msg(result.resultdesc, {icon: 2});
                        }
                    }
                })
            }
        });
    };
    var obj = {
        loadPage : loadPage,
        loadMSData : loadMSData,
        addMSWin : addMSWin,
        alterMSWin : alterMSWin,
        loadMSDetails : loadMSDetails,
        deleteMS : deleteMS
    };
    /*输出内容，注意顺序*/
    exports('MSMng',obj)
})