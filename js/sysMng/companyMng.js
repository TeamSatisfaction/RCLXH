/*
/企业管理ctrl
 */
layui.define(['layer', 'element','laypage','form','upload'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form(),
        cTobody = $('#company-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //加载企业列表
    var loadCompanyData = function (curr) {
        var name = $('#name').val(),
            data = {
                name : name,
                pageNum : curr||1,
                pageSize : 16
                // enterpriseRole : 'production_enterprise',
                // areaCode : '500000-500153'
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
                            '<td><a href="#" onclick="layui.companyMng.detailCompanyWin()" title="详情"><img src="../../img/mng/查看详情.png"></a>'+
                            '&nbsp;&nbsp;<a href="#" onclick="layui.companyMng.detailCompanyWin()" title="修改"><img src="../../img/mng/修改.png"></a>'+
                            '&nbsp;&nbsp;<a href="#" onclick="layui.companyMng.alarmRuleList(\''+item.baseEnterpriseId+'\')" title="报警规则"><img src="../../img/mng/修改.png"></a>'+
                            '&nbsp;&nbsp;<a href="#" onclick="layui.companyMng.deleteCompany()" title="删除"><img src="../../img/mng/修改.png"></a>'+
                            // '&nbsp;&nbsp;<a href="#"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini" onclick="layui.companyMng.alarmRuleList(\''+item.baseEnterpriseId+'\')">规则</button></a>' +
                            // '&nbsp;&nbsp;<a href="#"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini" onclick="layui.companyMng.deleteCompany()">删除</button></a></td>'+
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
            formData = new FormData();
        /*遍历*/
        $(thumbs).find('.thumb').each(function () {
            formData.append($(this).index().toString(), $(this).find("input")[0].files[0]);
            urls.push($(this).find("input").val());
        });
        console.log(urls);
        /*formData打印不出来的，需要有接口才能测试*/
        console.log(formData);
    };
    var addCompanyWin = function () {
        var win = layer.open({
            title : '新增企业',
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/sysMng/addCompanyView.html',
            btn: ['提交', '关闭'],
            btnAlign: 'c',
            yes : function (index) {
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
        });
        layer.full(win);
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
            ,btn: ['提交', '关闭'] //只是为了演示
            ,yes: function(){
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
            ,zIndex: layer.zIndex //重点1
            ,success: function(layero){
                layer.setTop(layero); //重点2
            }
        })
    };
    /*查看排口信息*/
    var lookPk = function () {
        var pk_win =  $('#pk_window');
        pk_win.find('input').attr('disabled', 'disabled');
        pk_win.find('.thumb-input').hide();
        layer.open({
            type: 1
            ,title: '查看排口'
            ,area: ['800px']
            ,shade: 0.3
            ,content: pk_win
            ,btnAlign: 'c'
            ,btn: ['关闭'] //只是为了演示
        })
    };
    //企业详情
    var detailCompanyWin = function () {
        var index = layer.open({
            title : '企业详情',
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/sysMng/companyDataView.html',
            btn: [ '返回'],
            btnAlign: 'c'
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
                    console.log(data.field);
                    data.field.id = id;
                    console.log(data.field);
                    var field = JSON.stringify(data.field);
                    console.log(field);
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
                                closeAddWin();
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
    var closeAddWin = function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    };
    //根据企业查询数采仪
    var loadDau = function (id) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            dauMap : {
                // epId : id
                epId : '402880955cede873015cee1e28ae0089'
            }
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/dau/query/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result){
                var row = result.data.rows;
                $("#select_dauId1").empty();
                if(row == null){
                    $("#select_dauId1").append("<option value='' selected='selected'>无采集仪</option>");
                    $("#select_equipment1").empty();
                    $("#select_equipment1").append("<option value='' selected='selected'>无设备</option>");
                    $("#select_factor1").empty();
                    $("#select_factor1").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in row){
                        $("#select_dauId1").append("<option value='' selected='selected'>--请选择--</option>");
                        $("#select_dauId1").append("<option row-key="+row[i]+" value="+row[i].id+">"+row[i].aname+"</option>");
                    }
                }
                form.render('select');
            }
        })
    };
    // 根据数采仪查询设备
    var loadEquipment = function (id) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            equipmentMap : {
                dauId : id
            }
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/equipment/query/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result){
                var row = result.data.rows;
                $("#select_equipment1").empty();
                if(row == null){
                    $("#select_equipment1").append("<option value='' selected='selected'>无设备</option>");
                    $("#select_factor").empty();
                    $("#select_factor").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in row){
                        $("#select_equipment1").append("<option value='' selected='selected'>--请选择--</option>");
                        $("#select_equipment1").append("<option row-key="+row[i].classicType+" value="+row[i].id+">"+row[i].equipmentName+"</option>");
                    }
                }
                form.render('select');
            }
        })
    };
    //根据设备查询因子
    var loadFactor = function (id) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            factorMap : {
                equipmentId : id
            }
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/factor/query/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result){
                var row = result.data.rows;
                if(row == null){
                    $("#select_factor1").empty();
                    $("#select_factor1").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in row){
                        $("#select_factor1").append("<option value="+row[i].factorCode+">"+row[i].factorName+"</option>");
                    }
                }
                form.render('select');
            }
        })
    };
    //数采仪select change事件
    form.on('select(select_dauId1)', function(data){
        loadEquipment(data.value);
    });
    //设备select change事件
    form.on('select(select_equipment1)', function(data){
        loadFactor(data.value);
    });

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
        loadCompanyData : loadCompanyData,
        imgSelect: imgSelect,
        imgDelete: imgDelete,
        addCompanyWin : addCompanyWin,
        addPk : addPk,
        lookPk : lookPk,
        clgyImgSelect : clgyImgSelect,
        detailCompanyWin : detailCompanyWin,
        alarmRuleList : alarmRuleList,
        loadAlarmRuleDetails : loadAlarmRuleDetails,
        addAlarmRuleWin : addAlarmRuleWin
    };
    exports('companyMng',obj)
})