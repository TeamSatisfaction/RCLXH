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
        var aname = $('#mnName').val(),
            data = {
                pageNumber : curr||1,
                pageSize : 16,
                dauMap : {
                    aname : aname
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
                        if(item.epName == null){
                            console.log(item.epName);
                            item.epName = "";
                        }
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.aname + '</td>' +
                            '<td>' + item.ip + '</td>' +
                            '<td>' + item.mn + '</td>' +
                            '<td>' + item.address + '</td>' +
                            '<td>' + item.epName + '</td>' +
                            '<td>' + item.dischargePortName + '</td>' +
                            '<td style="text-align: center">'+
                            '<a class="auth-btn" data-authId="24" href="#" onclick="layui.networkMng.alterNetworkWin(\''+item.id+'\')" title="修改"><img src="../../img/mng/alter.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="24" href="#" onclick="layui.networkMng.bindCompanyWin(\''+item.id+'\')" title="绑定企业"><img src="../../img/mng/company.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="25" href="#" onclick="layui.networkMng.alterEquipmentWin(\''+item.id+'\')" title="配置设备"><img src="../../img/mng/configure.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="23" href="#" onclick="layui.networkMng.deleteNetWork(\''+item.id+'\')" title="删除"><img src="../../img/mng/delete.png"></a></td>'+
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                scyTobody.html(render(rows, obj.curr));
                layui.sysMng.loadAuthen();
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
    //新增数采仪
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
        // layer.full(index);
    };
    form.on('submit(netWork_save)', function(data){
        data.field.epId = '';
        var field = JSON.stringify(data.field);
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
                    layer.msg('提交成功！', {icon: 1,time:1000},function () {
                        parent.location.reload(); // 父页面刷新
                        closeWin();
                    });
                }else {
                    layer.msg('提交失败！', {icon: 2,time:2000});
                }
            }
        });
        return false;
    });
    //修改数采仪
    var alterNetworkWin = function (id) {
        var index = layer.open({
            title : '修改联网信息',
            id : id,
            type : 2,
            area : ['800px','500px'],
            content : '../../pages/sysMng/addNetworkView.html',
            btn: [ '提交','返回'],
            btnAlign: 'c',
            yes  : function (index,layero) {
                var body = layer.getChildFrame('body',index),
                    aname = body.contents().find("input[name='aname']").val(),
                    mn = body.contents().find("input[name='mn']").val(),
                    ip = body.contents().find("input[name='ip']").val(),
                    password = body.contents().find("input[name='password']").val(),
                    address = body.contents().find("input[name='address']").val();
                var data = {
                    id : id,
                    aname : aname,
                    mn : mn,
                    ip : ip,
                    password : password,
                    address : address
                };
                var field = JSON.stringify(data);
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/jcsjgz/dau',
                    headers : {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'put',
                    data : field,
                    success : function (result){
                        if(result.code == 1000){
                            layer.msg('提交成功！', {icon: 1,time:1000},function () {
                                location.reload(); // 父页面刷新
                                layer.close(index);
                            });
                        }else{
                            layer.msg(result.message, {icon: 2,time:2000});
                        }
                    }
                })
            }
        });
        // layer.full(index);
    };
    //载入数采仪详情
    var loadNetworkDetails = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id'),//规则id
            title =  $(window.parent.document).find('.layui-layer-title').text();
        if(title == '修改联网信息'){
            $.ajax({
                url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/dau/'+id+'',
                headers: {
                    Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
                },
                type: 'get',
                success: function (result) {
                    var data = result.data;
                    if(data){
                        $('.layui-form-item').find("input[name='aname']").val(data.aname);
                        $('.layui-form-item').find("input[name='mn']").val(data.mn);
                        $('.layui-form-item').find("input[name='ip']").val(data.ip);
                        $('.layui-form-item').find("input[name='password']").val(data.password);
                        $('.layui-form-item').find("input[name='address']").val(data.address);
                    }
                }
            })
        }
    };
    //绑定企业排口win
    var bindCompanyWin = function (id) {
        var index = layer.open({
            title : '绑定企业排口',
            type : 2,
            area : ['600px','350px'],
            content : '../../pages/sysMng/bindCompany.html',
            btn: [ '提交','返回'],
            btnAlign: 'c',
            yes  : function (index,layero) {
                var body = layer.getChildFrame('body',index),
                    refid = body.contents().find("select[name='dauId']").val();
                    epId = body.contents().find("select[name='epId']").val();
                var data = {
                    id : id,
                    epId : epId,
                    refid : refid
                };
                var field = JSON.stringify(data);
                $.ajax({
                    url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/dau',
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type: 'put',
                    data: field,
                    success: function (result) {
                        if(result.code == '1000'){
                            layer.msg('绑定成功！', {icon: 1,time:1000},function () {
                                layer.close(index);
                                location.reload(); // 父页面刷新
                            });
                        }else {
                            layer.msg('绑定失败！', {icon: 2,time:2000});
                        }
                    }
                })
            }
        });
    };
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
                        if(list[i].name != '荣昌区环保局'){
                            $("#c_select1").append("<option value="+list[i].baseEnterpriseId+">"+list[i].name+"</option>");
                        }
                    }
                }
                form.render('select');
            }
        })
    };
    //加载排口select
    function loadPKSelect(id) {
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/discharge/port/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                // result.dischargePortName
                $("#d_select1").empty();
                if(result.length>0){
                    for(var i in result){
                        $("#d_select1").append("<option value="+result[i].id+">"+result[i].dischargePortName+"</option>");
                    }
                }else{
                    $("#d_select1").empty();
                    $("#d_select1").append("<option value='' selected='selected'>无排口</option>");
                }
                form.render('select');
            }
        })
    };
    //企业select change事件
    form.on('select(c_select1)', function(data){
        loadPKSelect(data.value);
    });
    //删除数采仪
    var deleteNetWork = function (id) {
        layer.msg('是否确定删除该数采仪', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/jcsjgz/dau/'+id+'',
                    headers : {
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'delete',
                    success : function (result){
                        if(result.code == '1000'){
                            layer.msg('删除成功！', {icon: 1,time:1000}, function() {
                                location.reload()
                            });
                        }else{
                            layer.msg('删除失败！', {icon: 2});
                        }
                    }
                })
            }
        })
    }
    //关闭窗口
    var closeWin = function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    };
    // //新增设备窗口
    // var addEquipmentWin = function () {
    //     var index = layer.open({
    //         title : '新增设备',
    //         type : 2,
    //         moveOut: true,
    //         area : ['1000px','600px'],
    //         content : '../../pages/sysMng/addEquipmentView.html',
    //         btn: ['提交', '返回'],
    //         btnAlign: 'c',
    //         yes : function (index) {
    //             layer.msg('提交成功！', {icon: 1});
    //             layer.close(index);
    //         }
    //     });
    //     layer.full(index);
    // };
    //编辑设备窗口
    var alterEquipmentWin = function (id) {
        var index = layer.open({
            title : '编辑设备信息',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/bindEquipmentView.html',
            btn: ['返回'],
            btnAlign: 'c',
            success : function (layero,index) {
                var body = layer.getChildFrame('body', index);
            }
        });
        layer.full(index);
    };
    //载入设备
    var loadEquipmentList = function (curr) {
        console.log("1")
        var eTobody = $('#equipment-results'),
            id = $(window.parent.document).find('.layui-layer-content').attr('id');//数采仪id
        var data = {
                pageNumber : curr||1,
                pageSize : 16,
                equipmentMap : {
                    dauId : id
                }
            };
        var field = JSON.stringify(data);
        console.log(data)
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/jcsjgz/equipment/query/page',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'post',
            data : field,
            success : function (result) {
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var eData = result.data.rows,
                    pages = result.data.totalPage,
                    str = "";
                var render = function(eData, curr) {
                    var arr = [];
                    layui.each(eData, function(index, item){
                        var type = item.eaOrEb,
                            type_text;
                        if(type == "EA"){
                            type = 'power_equipment';
                            type_text = '动力设备';
                        }else{
                            type = 'wmf';
                            type_text = '仪表仪器';
                        }
                        if(item.usedDate == null){
                            item.usedDate = "";
                        }
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.equipmentCode + '</td>' +
                            '<td>' + item.equipmentName + '</td>' +
                            '<td>' + item.equipmentNo+ '</td>' +
                            '<td>' + item.productor + '</td>' +
                            '<td>' + type_text + '</td>' +
                            // '<td>' + item.classicType + '</td>' +
                            '<td>' + item.usedDate + '</td>' +
                            '<td>' + item.equipmentType + '</td>' +
                            '<td style="text-align: center"><a class="auth-btn" data-authId="44" href="#" onclick="layui.networkMng.equipmentDataWin(\''+item.id+'\')" title="详情"><img src="../../img/mng/details.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="40" href="#" onclick="layui.networkMng.alterEquipmentDataWin(\''+item.id+'\')" title="修改"><img src="../../img/mng/alter.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="47" href="#" onclick="layui.networkMng.equipmentFactorWin(\''+type+'\',\''+item.id+'\')" title="配置因子"><img src="../../img/mng/configure.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="41" href="#" onclick="layui.networkMng.deleteEquipment(\''+item.id+'\')" title="删除"><img src="../../img/mng/delete.png"></a>'+
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                eTobody.html(render(eData, obj.curr));
                // layui.sysMng.loadAuthen();
                //调用分页
                laypage({
                    cont: 'demo3',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr || 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadEquipmentList(obj.curr);
                        }
                    }
                })
            }
        })
    };
    //设备详情窗口
    var equipmentDataWin = function (id) {
        var index = layer.open({
            title : '设备详情',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/equipmentDataView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c'
        });
        layer.full(index);
    };
    //新增设备窗口
    var addEquipmentWin = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id');
        var index = layer.open({
            title : '新增设备',
            type : 2,
            moveOut: true,
            area : ['1000px','700px'],
            content : '../../pages/sysMng/addEquipmentView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index,layero) {
                layero.find("iframe").contents().find('#equipment-save').click();
            },
            success : function (layero,index) {
                var body = layer.getChildFrame('body',index);
                body.contents().find("input[name='dauId']").val(id);
            }
        });
        layer.full(index);
    };
    //修改设备窗口
    var alterEquipmentDataWin = function (id) {
        var index = layer.open({
            title : '修改设备',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/addEquipmentView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index,layero) {
                layero.find("iframe").contents().find('#equipment-save').click();
            }
        });
        layer.full(index);
    };
    //删除设备
    var deleteEquipment = function (id) {
        layer.msg('是否确定删除该设备', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/jcsjgz/equipment/'+id+'',
                    headers : {
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'delete',
                    success : function (result){
                        if(result.code == '1000'){
                            layer.msg('删除成功！', {icon: 1,time:1000}, function() {
                                location.reload()
                            });
                        }else{
                            layer.msg('删除失败！', {icon: 2});
                        }
                    }
                })
            }
        })
    };
    //配置因子窗口
    var equipmentFactorWin = function (type,id) {
        var a = [];
        a.push(type,id);
        var index = layer.open({
            title : '关联因子',
            id : a,
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/equipmentFactorView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index,layero) {
                var body = layer.getChildFrame('body',index);
                // 现在要做因子的添加
                var rightFormItem = body.contents().find(".ef-right").find('.ef-checklist').find('.layui-form-item');
                var array = [];
                rightFormItem.each(function(){
                    array.push({
                        equipmentId:id,
                        factorName :$(this).find('b').eq(0)[0].innerHTML,
                        factorCode: $(this).find('input').eq(0).val(),
                        factorType : $(this).find('select')[0].value
                    });
                });
                var field = JSON.stringify(array);
                console.log(field);
                // v01/htwl/lxh/jcsjgz/factor
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/jcsjgz/factor',
                    headers : {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'post',
                    data : field,
                    success : function (result){
                        if(result.code == 1000){
                            layer.msg('提交成功！', {icon: 1,time:1000},function () {
                                layer.close(index); //再执行关闭
                                // location.reload();
                            });
                        }else {
                            layer.msg('提交失败！', {icon: 2,time:1000});
                        }
                    }
                })
            }
        });
        layer.full(index);
    };

    var obj = {
        loadPage : loadPage,
        loadNetWorkData : loadNetWorkData,
        addNetworkWin : addNetworkWin,
        deleteNetWork : deleteNetWork,
        // closeAddWin : closeAddWin,
        alterNetworkWin : alterNetworkWin,
        loadNetworkDetails : loadNetworkDetails,
        bindCompanyWin : bindCompanyWin,
        loadCompanySelect : loadCompanySelect,
        equipmentDataWin : equipmentDataWin,
        // addEquipmentWin : addEquipmentWin,
        alterEquipmentDataWin : alterEquipmentDataWin,
        deleteEquipment : deleteEquipment,
        alterEquipmentWin : alterEquipmentWin,
        loadEquipmentList : loadEquipmentList,
        addEquipmentWin : addEquipmentWin,
        equipmentFactorWin : equipmentFactorWin
    };
    /*输出内容，注意顺序*/
    exports('networkMng',obj)
})