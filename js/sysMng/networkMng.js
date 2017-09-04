/*
 *监测站管理
 */
layui.define(['layer','element','laypage','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        element=layui.element(),
        laypage = layui.laypage,
        form = layui.form();
    var scyTobody = $('#scy-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    //页面跳转
    var loadPage = function(url,p){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //载入联网列表
    var loadNetWorkData = function (curr) {
        // var address = $('#epAddress').val(),
            data = {
                pageNumber : curr||1,
                pageSize : 16,
                dauMap : {
                    // address : address
                }
            };
        var field = JSON.stringify(data);
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/dau/query/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            data : field,
            type: 'post',
            success: function (result) {
                var rows = result.data.rows,
                    pages = result.data.totalPage;
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var str = "";
                var render = function(rows, curr) {
                    var arr = []
                        , thisData = rows.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.aname + '</td>' +
                            '<td>' + item.ip + '</td>' +
                            '<td>' + item.mn + '</td>' +
                            '<td>' + item.address + '</td>' +
                            '<td>' + item.epName + '</td>' +
                            '<td style="text-align: center">'+
                            '<a href="#" onclick="layui.networkMng.alterEquipmentWin()" title="配置设备"><img src="../../img/mng/配置.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a href="#" onclick="" title="删除"><img src="../../img/mng/删除.png"></a>'+
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                scyTobody.html(render(rows, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo6',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr || 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadNetWorkData(obj.curr);
                        }
                    }
                })
            }
        })
    };
    var addNetworkWin = function () {
        var index = layer.open({
            title : '新增联网信息',
            type : 2,
            area : ['800px','500px'],
            content : '../../pages/sysMng/addNetworkView.html',
            btn: [ '提交','返回'],
            btnAlign: 'c',
            yes  : function (index,layero) {
                layero.find("iframe").contents().find('#netWork-save').click();
            }
        });
        layer.full(index);
    };
    form.on('submit(netWork_save)', function(data){
        var field = JSON.stringify(data.field);
        console.log(field);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/jcsjgz/dau',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            dataType : 'json',
            type : 'post',
            data : field,
            success : function (result){
                console.log(result);
                if(result.code == '1000'){
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
    //加载企业select
    function loadCompanySelect() {
        var data = {
            pageNum : 1,
            pageSize : 1000
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/enterprise/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result) {
                var list = result.data.list;
                if(list == null){
                    $("#c_select1").empty();
                    $("#c_select1").append("<option value='' selected='selected'>无企业</option>");
                }else {
                    for(var i in list){
                        $("#c_select1").append("<option value="+list[i].baseEnterpriseId+">"+list[i].name+"</option>");
                    }
                }
                form.render('select');
            }
        })
    };
    //关闭窗口
    var closeAddWin = function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    };
    //新增设备窗口
    var addEquipmentWin = function () {
        var index = layer.open({
            title : '新增设备',
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/addEquipmentView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index) {
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
        });
        layer.full(index);
    };
    //编辑设备窗口
    var alterEquipmentWin = function () {
        var index = layer.open({
            title : '编辑设备信息',
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/bindEquipmentView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index) {
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
        });
        layer.full(index);
    };
    //配置因子窗口
    var equipmentFactorWin = function () {
        var index = layer.open({
            title : '关联因子',
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/equipmentFactorView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index) {
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
        });
        layer.full(index);
    }
    var obj = {
        loadPage : loadPage,
        loadNetWorkData : loadNetWorkData,
        addNetworkWin : addNetworkWin,
        closeAddWin : closeAddWin,
        loadCompanySelect : loadCompanySelect,
        addEquipmentWin : addEquipmentWin,
        alterEquipmentWin : alterEquipmentWin,
        equipmentFactorWin : equipmentFactorWin
    };
    /*输出内容，注意顺序*/
    exports('networkMng',obj)
})