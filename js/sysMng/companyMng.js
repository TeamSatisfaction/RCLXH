/*
/企业管理ctrl
 */
layui.define(['layer', 'element','laypage','form','upload'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form(),
        // upload = layui.upload,
        cTobody = $('#company-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //加载企业列表
    var loadCompanyList = function (curr) {
        var name = $('#name').val(),
            data = {
                name : name,
                pageNum : curr||1,
                pageSize : 16,
                enterpriseRole : 'production_enterprise',
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
            success : function (result) {
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var cData = result.data.list,
                     pages = result.data.pages,
                     str = "";
                //模拟渲染
                var render = function(cData, curr) {
                    var arr = []
                        , thisData = cData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.name + '</td>' +
                            '<td>' + item.address + '</td>' +
                            '<td>' + item.head+ '</td>' +
                            '<td>' + item.headPhone + '</td>' +
                            '<td style="text-align: center"><a href="#" onclick="layui.companyMng.detailCompanyWin(\''+item.baseEnterpriseId+'\')" title="详情"><img src="../../img/mng/details.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a href="#" onclick="layui.companyMng.alterCompanyWin(\''+item.baseEnterpriseId+'\')" title="编辑"><img src="../../img/mng/alter.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a href="#" onclick="layui.companyMng.alarmRuleList(\''+item.baseEnterpriseId+'\')" title="报警规则"><img src="../../img/mng/configure.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a href="#" onclick="layui.companyMng.deleteCompanyData(\''+item.baseEnterpriseId+'\')" title="删除"><img src="../../img/mng/delete.png"></a>'+
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                cTobody.html(render(cData, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo1',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr || 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadCompanyData(obj.curr);
                        }
                    }
                })
            }
        })
    };
    /*选择图片*/
    var imgSelect = function (input) {
        /*创建图片路径*/
        var src = window.URL.createObjectURL(input.files[0]),
            thumb =  $(input).parent(".thumb"),
            thisContent = thumb[0].outerHTML;
        /*写HTML*/
        var str =
                '<img src="' + src + '"> ' +
                '<i class="layui-icon" onclick="layui.companyMng.imgDelete(this);">&#x1007;</i> ' ;

        $(input).removeAttr("onchange").hide();
        thumb.find("img").remove();
        thumb.removeClass("thumb-input").prepend(str).show();
        thumb.after(thisContent);
        getImgSelection(input);
    };
    /*移除选择的图片*/
    var imgDelete = function (i) {
        var thumb = $(i).parent(".thumb");
        thumb.remove();
    };

    /*处理工艺的图片事件*/
    var clgyImgSelect = function (input) {
        /*创建图片路径*/
        var src = window.URL.createObjectURL(input.files[0]),
            thumb =  $(input).parent(".thumb"),
            thisContent = thumb[0].outerHTML;
        /*写HTML*/
        var str =
            '<img src="' + src + '"> ' +
            '<i class="layui-icon" onclick="layui.companyMng.imgDelete(this);">&#x1007;</i> '+
            '<div>' + ($(".clgy_item").find("input[name='gylx']").val()) + '</div>';    //工艺类型
        $(input).removeAttr("onchange").hide();
        thumb.find("img").remove();
        thumb.removeClass("thumb-input").prepend(str).show();
        thumb.after(thisContent);
        //重新定义上传按钮的事件
        // $('#clgy_upload').off("click").click(function () {
        //     $(".clgy_photos").find(".thumb-input").find("input").click()
        // });
        getImgSelection(input);
    };
    //定义上传按钮事件
    $('#clgy_upload').click(function () {
        $(".clgy_photos").find(".thumb-input").find("input").click()
    });

    /*获取所有图片的方法
    * urls: 图片的本地路径，若为C://fakepath/ 是被浏览器保护了
    * formData: 文件转为formData格式，在非IE浏览器可以用ajax的POST上传formData中文件
    * 		type: 'POST',           //必须是post
    * 		data: formData,         //参数为formData
    * 		contentType: false,  	//必要
    * 		processData: false,  	//必要，防止ajax处理文件流
    * */
    var getImgSelection = function (input) {
        var thumbs = $(input).parents(".photo-area").find(".thumbs"),
            urls = [],
            formData = new FormData(),
            name = thumbs.find("input")[0].name,
            str = '';
        console.log(name);
        /*遍历*/
        $(thumbs).find('.thumb').each(function () {
            formData.append($(this).index().toString(), $(this).find("input")[0].files[0]);
            urls.push($(this).find("input").val());
        });
        /*formData打印不出来的，需要有接口才能测试*/
        $.ajax({
            url : 'http://39.108.112.173:9001/v01/htwl/file/upload',
            type: 'POST',           //必须是post
            data: formData,         //参数为formData
            contentType: false,  	//必要
            processData: false,  	//必要，防止ajax处理文件流
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            success : function (result){
                var data = result.data;
                for(var i = 0;i<data.length;i++){
                    console.log(data.length);
                    if(data.length == 1){
                        str = data[i].uri
                    }else{
                        str += data[i].uri+ ",";
                    }
                }
               $('.layui-form-item').find("input[name='attach']").val(str);
                console.log(str)
            }
        })
    };
    //新增企业信息
    var addCompanyWin = function () {
        var win = layer.open({
            title : '新增企业',
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/sysMng/addCompanyView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index,layero) {
                layero.find("iframe").contents().find('#company-save').click();
            }
        });
        layer.full(win);
    };
    //form表单提交
    form.on('submit(company-save)',function (data) {
        data.field.areaCode = "500000-500153";
        data.field.buildStatus = "123";
        data.field.expectDate = "123";
        data.field.orgCode = "production_enterprise";
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
                console.log(result);
                var  frameindex= parent.layer.getFrameIndex(window.name);
                if(result.code == '1000'){
                    parent.layer.close(frameindex);
                    parent.location.reload(); // 父页面刷新
                    layer.msg('提交成功！', {icon: 1});
                    // parent.layer.msg('提交成功', { icon: 1, shade: 0.4, time: 1000 });
                }else{
                    layer.msg(result.message, {icon: 2});
                }
            }
        });
        return false;
    });
    //删除企业信息
    var deleteCompanyData = function (id) {
        layer.msg('是否确定删除该企业', {
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
                            layer.close(index);
                            location.reload(); // 页面刷新
                            layer.msg('删除成功', { icon: 1, shade: 0.4, time: 1000 });
                        }else {
                            layer.msg(result.resultdesc, {icon: 2});
                        }
                    }
                })
            }
        });
    }
    // 编辑企业信息
    var alterCompanyWin = function (id) {
        var win = layer.open({
            title : '编辑企业信息',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/sysMng/alterCompanyView.html',
            btn: [ '返回'],
            btnAlign: 'c',
            success: function(layero,index){
                var body = layer.getChildFrame('body', index);
                var id = $('.layui-layer-content').attr('id');
                loadCompanyData(id,body);
                loadLicenseData(id,body);
                loadPortData(id,body);
            }
        });
        layer.full(win);
    };
    //编辑许可证信息
    form.on('submit(Licence-save)',function (data) {
        var id = $('.layui-form-item').find("input[name='id']").val();//许可证id
        var Cid = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
        data.field.enterpriseId = Cid;
        var field = JSON.stringify(data.field);
        if(id == ""){
            $.ajax({
                url :''+urlConfig+'/v01/htwl/lxh/enterprise/license',
                headers : {
                    'Content-type': 'application/json;charset=UTF-8',
                    Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                },
                dataType : 'json',
                type : 'post',
                data : field,
                success : function (result){
                    if(result.code == '1000'){
                        // parent.layer.close(frameindex);
                        // parent.location.reload(); // 父页面刷新
                        layer.msg('提交成功！', {icon: 1});
                    }else{
                        layer.msg(result.message, {icon: 2});
                    }
                }
            })
        }else{
            $.ajax({
                url :''+urlConfig+'/v01/htwl/lxh/enterprise/license',
                headers : {
                    'Content-type': 'application/json;charset=UTF-8',
                    Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                },
                dataType : 'json',
                type : 'put',
                data : field,
                success : function (result){
                    if(result.code == '1000'){
                        // parent.layer.close(frameindex);
                        // parent.location.reload(); // 父页面刷新
                        layer.msg('提交成功！', {icon: 1});
                    }else{
                        layer.msg(result.message, {icon: 2});
                    }
                }
            })
        }
    });
    //请求企业基本信息
    var loadCompanyData = function(id,body){
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                var data = result.data;
                switch (data.controlLevel){
                    case "area_control":
                        data.controlLevel = '区(县)控'
                        break;
                }
                body.contents().find("input[name='name']").val(data.name);
                body.contents().find("input[name='legalRepresentative']").val(data.legalRepresentative);
                body.contents().find("input[name='head']").val(data.head);
                body.contents().find("input[name='headPhone']").val(data.headPhone);
                body.contents().find("input[name='orgCode']").val(data.orgCode);
                body.contents().find("input[name='controlLevel']").val(data.controlLevel);
                body.contents().find("input[name='envHead']").val(data.envHead);
                body.contents().find("input[name='envHeadPhone']").val(data.envHeadPhone);
                body.contents().find("input[name='processing']").val(data.processing);
                body.contents().find("input[name='riverBasin']").val(data.riverBasin);
                body.contents().find("input[name='lon']").val(data.lon);
                body.contents().find("input[name='lat']").val(data.lat);
                body.contents().find("input[name='address']").val(data.address);
                console.log(body.contents().find("select[name='controlLevel']"));
                body.contents().find("select[name='controlLevel']").children("option").each(function(){
                    if (this.text == data.controlLevel) {
                        this.setAttribute("selected","selected");
                    }
                });
            }
        })
    };
    //请求许可证基本信息
    var loadLicenseData = function (id,body) {
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/license/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                var data = result.data[0];
                if(data){
                    body.contents().find("input[name='licenseCode']").val(data.licenseCode);
                    body.contents().find("input[name='beginDate']").val(data.beginDate);
                    body.contents().find("input[name='endDate']").val(data.endDate);
                    body.contents().find("input[name='maxiMum']").val(data.maxiMum);
                    body.contents().find("input[name='gross']").val(data.gross);
                    body.contents().find("input[name='licenceType']").val(data.licenceType);
                    body.contents().find("input[name='id']").val(data.id);
                }
            }
        })
    };
    //请求排口信息
    var loadPortData = function (id,body) {
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/discharge/port/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                var render = function(result) {
                    var arr = [],
                        str = '';
                    layui.each(result, function(index, item){
                        str = '<tr>' +
                            '<td>' + item.pageNumber + '</td>' +
                            '<td>' + item.dischargePortCode + '</td>' +
                            '<td>' + item.dischargePortName + '</td>' +
                            '<td>' + item.mode + '</td>' +
                            '<td>' + item.whereabouts + '</td>' +
                            '<td>' + item.emissionAmount + '</td>' +
                            '<td style="text-align: center">'+
                            // '<a href="#" onclick="layui.companyMng.lookPk(\''+item.id+'\')" title="详情"><img src="../../img/mng/details.png"></a>'+
                            '<a href="#" onclick="layui.companyMng.deletePK(\''+item.id+'\')" title="删除"><img src="../../img/mng/delete.png"></a></td>'+
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                body.contents().find("#dis-port-list").html(render(result));
            }
        })
    };
    /*新增排口*/
    var addPk = function () {
        var pk_win =  $('#pk_window');
        pk_win.find('input').attr('disabled', false);
        pk_win.find('.thumb-input').show();
        layer.open({
            type: 1
            ,title: '新增排口'
            ,area: ['800px']
            ,shade: 0.3
            ,content: pk_win
            ,btnAlign: 'c'
            ,btn: ['提交', '返回'] //只是为了演示
            ,yes: function(index,layero){
                // layero.find("iframe").contents().find('#company-save').click();
                $("#pk-save").click();
            }
            ,zIndex: layer.zIndex //重点1
            // ,success: function(layero){
            //     layer.setTop(layero); //重点2
            // }
        })
    };
    form.on('submit(pk-save)',function (data) {
        var Cid = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
        data.field.refid = Cid;
        var field = JSON.stringify(data.field);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/discharge/port',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'post',
            data : field,
            success : function (result){
                console.log(result);
                layer.msg('新增成功！', {icon: 1,time:1000}, function() {
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭
                    parent.location.reload();
                });
            }
        })
    });
    /*查看排口信息*/
    // var lookPk = function (id) {
    //     var pk_win =  $('#pk_window');
    //     pk_win.find('input').attr('disabled', 'disabled');
    //     pk_win.find('.thumb-input').hide();
    //     layer.open({
    //         type: 1
    //         ,title: '查看排口'
    //         ,area: ['800px']
    //         ,shade: 0.3
    //         ,content: pk_win
    //         ,btnAlign: 'c'
    //         ,btn: ['关闭']
    //         ,success: function(layero,index){
    //             loadPKData(id);
    //         }
    //     })
    // };
    /*删除排口*/
    var deletePK = function (id) {
        layer.msg('是否确定删除该排口', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/enterprise/discharge/port/'+id+'',
                    headers : {
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'delete',
                    success : function (result){
                        if(result.resultcode == '2'){
                            layer.msg('删除成功！', {icon: 1,time:2000}, function() {
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
    //企业详情
    var detailCompanyWin = function (id) {
        var index = layer.open({
            title : '企业详情',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/sysMng/companyDataView.html',
            btn: [ '返回'],
            btnAlign: 'c',
            success: function(layero, index){
                var body = layer.getChildFrame('body', index);
                var id = $('.layui-layer-content').attr('id');
                loadCompanyData(id,body);
            }
        });
        layer.full(index);
    };
    //企业规则列表
    var alarmRuleList = function (id) {
        sessionStorage.setItem("company_id", id);
        var index = layer.open({
            title : '报警规则',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/sysMng/alarmRuleList.html',
            btn: [ '返回'],
            btnAlign: 'c',
            success : function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var id = $('.layui-layer-content').attr('id');
                loadAlarmRuleDetails(id,body,'1');
            }
        });
        layer.full(index);
    };
    //加载报警规则列表
    var loadAlarmRuleDetails = function (id,body,curr) {
        var ruleTobody = body.contents().find("#rule-result");
        var data = {
            refId : id,
            pageNo : curr||1,
            pageSize : 16
        };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/rule/query',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            data : data,
            success : function (result){
                var list = result.list,
                    str = "",
                    nums = 16; //每页出现的数据量
                var render = function(list, curr){
                    var arr = []
                        , thisData = list.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item) {
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.ruleName + '</td>' +
                            '<td>' + item.sensorEquipmentName + '</td>' +
                            '<td>' + item.equipmentName + '</td>' +
                            '<td>' + item.sensorName+ '</td>' +
                            '<td style="text-align: center"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini">详情</button></td>' +
                            '</tr>';
                        arr.push(str);
                    })
                    return arr.join('');
                }
                ruleTobody.html(render(list, obj.curr));
            }
        })
    };
    //新增规则
    var addAlarmRuleWin = function () {
        var id = sessionStorage.getItem("company_id");
        var rule_form =  $('#rule_form');
        layer.open({
            title : '新增报警规则',
            type : 1,
            id : id,
            moveOut: true,
            area : ['1000px','700px'],
            content : rule_form,
            btn: [ '提交','返回'],
            btnAlign: 'c',
            success: function(layero,index){
                loadDau(id);
                form.render();
                form.verify({
                    threshold : function (value) {
                        if(!new RegExp("^(([1-9])|(1[0-9])|(2[0-4]))$").test(value)){
                            return '只能输入1~24的整数';
                        }
                    }
                });
                form.on('submit(save)', function(data){
                    data.field.id = id;
                    var field = JSON.stringify(data.field);
                    $.ajax({
                        url :''+urlConfig+'/v01/htwl/lxh/alrm/rule/add',
                        headers : {
                            'Content-type': 'application/json;charset=UTF-8',
                            Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                        },
                        dataType : 'json',
                        type : 'post',
                        data : field,
                        success : function (result){
                            console.log(result);
                            if(result.code == '2'){
                                layer.msg('提交成功！', {icon: 1});
                                parent.location.reload(); // 父页面刷新
                                closeWin();
                            }else {
                                layer.msg('提交失败！', {icon: 2});
                            }
                        }
                    });
                    return false;
                });
            },
            yes  : function (index,layero) {
                layero.find('.icon-save').click();
            }
        });
    };
    //关闭窗口
    var closeWin = function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    };
    /*在线监测*/
    $(".company-online-monitor").find(".layui-btn-group").find(".layui-btn").click(function () {
        var btn = $(this);
        if(!btn.hasClass("active")){
            btn.addClass("active").siblings().removeClass("active");
        }
        console.log(getActiveBtn($(".company-online-monitor").find(".layui-btn-group")[0]));
    });
    /*获取按钮组选中的值*/
    var getActiveBtn = function (btngroup) {
        var value;
        $(btngroup).find(".layui-btn").each(function(){
            if($(this).hasClass("active")){
               value = $(this).text();
            }
        });
        return value;
    };
    /*输出内容，注意顺序*/
    var obj = {
        loadPage : loadPage,
        loadCompanyList : loadCompanyList,
        imgSelect: imgSelect,
        imgDelete: imgDelete,
        addCompanyWin : addCompanyWin,
        deleteCompanyData : deleteCompanyData,
        alterCompanyWin : alterCompanyWin,
        loadCompanyData : loadCompanyData,
        addPk : addPk,
        // lookPk : lookPk,
        deletePK : deletePK,
        clgyImgSelect : clgyImgSelect,
        detailCompanyWin : detailCompanyWin,
        alarmRuleList : alarmRuleList,
        loadAlarmRuleDetails : loadAlarmRuleDetails,
        addAlarmRuleWin : addAlarmRuleWin,
        closeWin : closeWin
    };
    exports('companyMng',obj)
})