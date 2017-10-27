/**
 * Created by Administrator on 2017/9/20.
 */
layui.define(['layer', 'element','laypage','form'],function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form();
    var urlConfig = sessionStorage.getItem("urlConfig");
    var urlConfig1 = sessionStorage.getItem("urlConfig1");
    var Authorization = sessionStorage.getItem("Authorization");
    //报警规则select
    form.on('select(alarmRule)', function(data){
        loadAlarmRuleList();
    });
    //遮罩
    function ityzl_SHOW_LOAD_LAYER(){
        return layer.msg('加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false,offset: '0px', time:100000}) ;
    }
    //加载报警规则列表
    var loadAlarmRuleList = function (curr) {
        var ruleTobody = $("#rule-result"),
            type = $('#alarmRule').val(),
            text = $('#alarmRule').find("option:selected").text(),
            id = $(window.parent.document).find('.layui-layer-content').attr('id'),//企业id
            url = '',
            col = '',
            head = '',
            i;
        if(type == 'online_alarm_rule'||type == 'poly_online_alarm_rule'){
            var data = {
                epId : id,
                pageNo : curr||1,
                pageSize : 16
            };
            col  = '<col width="60">'+
                '<col width="350">'+
                '<col>'+
                '<col width="100">'+
                '<col width="120">'+
                '<col width="100">';
            head = '<tr>'+
                '<th>序号</th>'+
                '<th>规则名称</th>'+
                '<th>仪表名称</th>'+
                '<th>设备类型</th>'+
                '<th>监测因子</th>'+
                '<th style="text-align: center">操作</th>'+
                '</tr>';
            $("#rule-col").html(col);
            $("#rule-head").html(head);
            if(type == 'online_alarm_rule'){
                url = ''+urlConfig1+'/v02/htwl/alarm/rule/online'
            }else if(type == 'poly_online_alarm_rule'){
                url = ''+urlConfig1+'/v02/htwl/aggregation/alarm/rule/online'
            }
            $.ajax({
                url :url,
                type : 'get',
                data : data,
                beforeSend: function () {
                    i = ityzl_SHOW_LOAD_LAYER();
                },
                success : function (result){
                    layer.close(i);
                    layer.msg('加载完成！',{time: 1000,offset: '10px'});
                    var list = result.list,
                        str = "",
                        nums = 16; //每页出现的数据量
                    var render = function(list, curr){
                        var arr = []
                            , thisData = list.concat().splice(curr * nums - nums, nums);
                        layui.each(thisData, function(index, item) {
                            var ruleName='';
                            $.ajax({
                                url :''+urlConfig+'/v01/htwl/lxh/alrm/report/time/'+item.id+'',
                                headers : {
                                    Authorization:Authorization
                                },
                                async: false,
                                type: 'get',
                                success: function (result) {
                                    if(result.length>0){
                                        ruleName = result[0].threeLevelKey;
                                        // console.log(ruleName)
                                    }
                                }
                            });
                            str = '<tr>' +
                                '<td>'+(index+1)+'</td>' +
                                '<td>' + ruleName + '</td>' +
                                '<td>' + item.fourthLayerEncodingName + '</td>' +
                                '<td>' + item.firstLayerEncodingName + '</td>' +
                                '<td>' + item.thirdLayerEncodingName+ '</td>' +
                                '<td style="text-align: center">' +
                                '<a href="#" onclick="layui.onlineAlarmRuleMng.alterAlarmRuleWin(\''+item.id+'\')" title="编辑"><img src="../../img/mng/alter.png"></a>' +
                                '&nbsp;&nbsp;&nbsp;<a href="#" onclick="layui.onlineAlarmRuleMng.deleteAlarmRule(\''+item.id+'\')" title="删除"><img src="../../img/mng/delete.png"item.id></a></td>' +
                                '</tr>';
                            arr.push(str);
                        })
                        return arr.join('');
                    }
                    ruleTobody.html(render(list, obj.curr));
                }
            })
        }else if(type == 'licence_alarm_rule'||type == 'biggest_alarm_rule'||type == 'total_alarm_rule'){
            var data = {
                enterpriseId : id,
                pageNo : curr||1,
                pageSize : 16
            };
            col  = '<col width="60">'+
                '<col width="200">'+
                '<col width="150">'+
                '<col>'+
                '<col width="100">';
            head = '<tr>'+
                '<th>序号</th>'+
                '<th>规则类型</th>'+
                '<th>触发条件</th>'+
                '<th>报警规则描述</th>'+
                '<th style="text-align: center">操作</th>'+
                '</tr>';
            $("#rule-col").html(col);
            $("#rule-head").html(head);
            if(type == 'licence_alarm_rule'){
                url = ''+urlConfig1+'/v02/htwl/alarm/rule/license';
            }else if(type == 'biggest_alarm_rule'){
                url = ''+urlConfig1+'/v02/htwl/alarm/rule/sewage/biggest'
            }else if(type == 'total_alarm_rule'){
                url = ''+urlConfig1+'/v02/htwl/alarm/rule/sewage/total'
            }
            $.ajax({
                url :url,
                type : 'get',
                data : data,
                success : function (result){
                    console.log(result);
                    var list = result.list,
                        str = "",
                        nums = 16; //每页出现的数据量
                    var render = function(list, curr){
                        var arr = []
                            , thisData = list.concat().splice(curr * nums - nums, nums);
                        layui.each(thisData, function(index, item) {
                            str = '<tr>' +
                                '<td>'+(index+1)+'</td>' +
                                '<td>' + text + '</td>' +
                                '<td>'+item.rules+'</td>' +
                                '<td>'+item.remark+'</td>' +
                                '<td style="text-align: center">' +
                                '<a href="#" onclick="layui.onlineAlarmRuleMng.alterAlarmRuleWin(\''+item.id+'\')" title="编辑"><img src="../../img/mng/alter.png"></a>' +
                                '&nbsp;&nbsp;&nbsp;<a href="#" onclick="layui.onlineAlarmRuleMng.deleteAlarmRule(\''+item.id+'\')" title="删除"><img src="../../img/mng/delete.png"item.id></a></td>' +
                                '</tr>';
                            arr.push(str);
                        })
                        return arr.join('');
                    }
                    ruleTobody.html(render(list, obj.curr));
                }
            })
        }
    };
    //新增规则
    var addAlarmRuleWin = function () {
        var type = $('#alarmRule').val(),
            id = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
        if(type == 'online_alarm_rule'){
            layer.open({
                title :'新增在线报警规则',
                id : id,
                type : 2,
                moveOut: true,
                area : ['1000px','600px'],
                content : '../../pages/alarmMng/onlineAlarmRule.html',
                btn: [ '提交','返回'],
                btnAlign: 'c',
                yes  : function (index,layero) {
                    var body = layer.getChildFrame('body',index),
                        first_layer_encoding_name = body.contents().find("select[name='first_layer_encoding_name']").find("option:selected").text(),
                        first_layer_encoding_type = body.contents().find("select[name='first_layer_encoding_name']").val(),
                        second_layer_encoding_name = body.contents().find("select[name='second_layer_encoding_name']").find("option:selected").text(),
                        second_layer_encoding_type = body.contents().find("select[name='second_layer_encoding_name']").val(),
                        third_layer_encoding_name = body.contents().find("select[name='third_layer_encoding_name']").find("option:selected").text(),
                        third_layer_encoding_type = body.contents().find("select[name='third_layer_encoding_name']").val(),
                        fourth_layer_encoding_name = body.contents().find("select[name='fourth_layer_encoding_name']").find("option:selected").text(),
                        fourth_layer_encoding_type = body.contents().find("select[name='fourth_layer_encoding_name']").val(),
                        one_conditions_name = body.contents().find("select[name='one_conditions_name']").find("option:selected").text(),
                        one_condition_key = body.contents().find("select[name='one_conditions_name']").val(),
                        one_threshold = body.contents().find("input[name='one_threshold']").val(),
                        two_conditions_name = body.contents().find("select[name='two_conditions_name']").find("option:selected").text(),
                        two_conditions_key = body.contents().find("select[name='two_conditions_name']").val(),
                        two_threshold = body.contents().find("input[name='two_threshold']").val(),
                        is_contain = body.contents().find("input[name='is_contain']:checked").val(),
                        threeLevelKey = body.contents().find("input[name='threeLevelKey']").val();
                    var data = {
                        epId : id,
                        firstLayerEncodingName : first_layer_encoding_name,
                        firstLayerEncodingType : first_layer_encoding_type,
                        secondLayerEncodingName : second_layer_encoding_name,
                        secondLayerEncodingType : second_layer_encoding_type,
                        thirdLayerEncodingName : third_layer_encoding_name,
                        thirdLayerEncodingType : third_layer_encoding_type,
                        fourthLayerEncodingName : fourth_layer_encoding_name,
                        fourthLayerEncodingType : fourth_layer_encoding_type,
                        oneConditionsName : one_conditions_name,
                        oneConditionKey : one_condition_key,
                        oneThreshold : one_threshold,
                        twoConditionsName : two_conditions_name,
                        twoConditionKey : two_conditions_key,
                        twoThreshold : two_threshold,
                        isContain : is_contain
                    };
                    $.ajax({
                        url :''+urlConfig1+'/v02/htwl/alarm/rule/online',
                        headers : {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        type : 'post',
                        data : data,
                        success : function (result){
                            if(result.code == '1000'){
                                layer.msg('新增成功！', {icon: 1,time:1000}, function() {
                                    layer.close(index); //再执行关闭
                                    loadAlarmRuleList();
                                    addAlarmRuleTime(result.param.id,threeLevelKey);
                                });
                            }
                        },
                        error: function(result) {
                            var message = result.responseJSON.errors[0].defaultMessage;
                            layer.msg(message, {icon: 2,time:1000});
                        }
                    })
                }
            })
        }else if(type == 'poly_online_alarm_rule'){
            layer.open({
                title :'新增聚合在线报警规则',
                id : id,
                type : 2,
                moveOut: true,
                area : ['1000px','600px'],
                content : '../../pages/alarmMng/polyOnlineAlarmRule.html',
                btn: [ '提交','返回'],
                btnAlign: 'c',
                yes  : function (index,layero) {
                    var body = layer.getChildFrame('body',index),
                        first_layer_encoding_name = body.contents().find("select[name='first_layer_encoding_name']").find("option:selected").text(),
                        first_layer_encoding_type = body.contents().find("select[name='first_layer_encoding_name']").val(),
                        second_layer_encoding_name = body.contents().find("select[name='second_layer_encoding_name']").find("option:selected").text(),
                        second_layer_encoding_type = body.contents().find("select[name='second_layer_encoding_name']").val(),
                        third_layer_encoding_name = body.contents().find("select[name='third_layer_encoding_name']").find("option:selected").text(),
                        third_layer_encoding_type = body.contents().find("select[name='third_layer_encoding_name']").val(),
                        fourth_layer_encoding_name = body.contents().find("select[name='fourth_layer_encoding_name']").find("option:selected").text(),
                        fourth_layer_encoding_type = body.contents().find("select[name='fourth_layer_encoding_name']").val(),

                        start_time = body.contents().find("input[name='start_time']").val(),
                        end_time = body.contents().find("input[name='end_time']").val(),
                        conditions_name = body.contents().find("select[name='conditions_name']").find("option:selected").text(),
                        condition_key = body.contents().find("select[name='conditions_name']").val(),
                        aggregation_name = body.contents().find("select[name='aggregation_name']").find("option:selected").text(),
                        aggregation_value = body.contents().find("select[name='aggregation_name']").val(),
                        calculation_name = body.contents().find("select[name='calculation_name']").find("option:selected").text(),
                        calculation_value = body.contents().find("input[name='calculation_value']").val(),

                        threeLevelKey = body.contents().find("input[name='threeLevelKey']").val();
                    var data = {
                        epId : id,
                        firstLayerEncodingName : first_layer_encoding_name,
                        firstLayerEncodingType : first_layer_encoding_type,
                        secondLayerEncodingName : second_layer_encoding_name,
                        secondLayerEncodingType : second_layer_encoding_type,
                        thirdLayerEncodingName : third_layer_encoding_name,
                        thirdLayerEncodingType : third_layer_encoding_type,
                        fourthLayerEncodingName : fourth_layer_encoding_name,
                        fourthLayerEncodingType : fourth_layer_encoding_type,
                        startTime : start_time,
                        endTime : end_time,
                        aggregationName : aggregation_name,
                        aggregationValue : aggregation_value,
                        calculationName : calculation_name,
                        calculationValue : calculation_value,
                        conditionsName : conditions_name,
                        conditionKey : condition_key
                    };
                    $.ajax({
                        url :''+urlConfig1+'/v02/htwl/aggregation/alarm/rule/online',
                        headers : {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        type : 'post',
                        data : data,
                        success : function (result){
                            if(result.code == '1000'){
                                layer.msg('新增成功！', {icon: 1,time:1000}, function() {
                                    layer.close(index); //再执行关闭
                                    loadAlarmRuleList();
                                    addAlarmRuleTime(result.param.id,threeLevelKey);
                                    // location.reload();
                                });
                            }
                        },
                        error: function(result) {
                            var message = result.responseJSON.errors[0].defaultMessage;
                            layer.msg(message, {icon: 2,time:1000});
                        }
                    })
                }
            })
        }else if(type == 'licence_alarm_rule'||type == 'biggest_alarm_rule'||type == 'total_alarm_rule'){
            var url,title;
            if(type == 'licence_alarm_rule'){
                url='' + urlConfig1 + '/v02/htwl/alarm/rule/license';
                title='新增许可证报警规则';
            }else if(type == 'biggest_alarm_rule'){
                url='' + urlConfig1 + '/v02/htwl/alarm/rule/sewage/biggest';
                title='新增排污最大流量报警规则';
            }else if(type == 'total_alarm_rule'){
                url='' + urlConfig1 + '/v02/htwl/alarm/rule/sewage/total';
                title='新增排污总量报警规则';
            }
            layer.open({
                title :title,
                id : id,
                type : 2,
                moveOut: true,
                area : ['1000px','300px'],
                content : '../../pages/alarmMng/licenceAlarmRule.html',
                btn: [ '提交','返回'],
                btnAlign: 'c',
                yes  : function (index,layero) {
                    var body = layer.getChildFrame('body',index),
                        rulesType = body.contents().find("#rulesType").val(),
                        rules = body.contents().find("#rules").val(),
                        remark = body.contents().find("#remark").val();
                    var data = {
                        enterpriseId : id,
                        rulesType : rulesType,
                        rules : rules,
                        isDel : "0",
                        remark : remark
                    };
                    $.ajax({
                        url: url,
                        headers: {
                           Authorization:Authorization
                        },
                        data : data,
                        type: 'post',
                        success: function (result) {
                            console.log(result);
                            if(result.code == "1000"){
                                layer.msg('新增规则成功！',{icon:1,time:1000},function () {
                                    // layer.close();
                                    layer.close(index); //再执行关闭
                                    loadAlarmRuleList();
                                    addAlarmRuleTime(result.param.id,remark)
                                })
                            }
                        },
                        error: function(result) {
                            var message = result.responseJSON.errors[0].defaultMessage;
                            layer.msg(message, {icon: 2,time:1000});
                        }
                    })
                }
            })
        }
    };
    //新增上报时间
    var addAlarmRuleTime = function (id,threeLevelKey) {
        layer.open({
            title :'新增报警时间',
            type : 2,
            moveOut: true,
            area : ['1000px','500px'],
            content : '../../pages/alarmMng/alarmRuleTime.html',
            btn: [ '提交'],
            btnAlign: 'c',
            cancel: function(index, layero){
                return false;
            },
            yes  : function (index,layero) {
                var body = layer.getChildFrame('body',index);
                var threeLevelTime = body.contents().find("input[name='threeLevelTime']").val();
                var d={
                    refid : id,
                    threeLevelKey : threeLevelKey
                };
                body.contents().find("form").find('input,select').each(function(){
                    d[this.name]=this.value
                });
                if(threeLevelTime == ""){
                    d.threeLevelType = '1';
                    d.threeLevelTime = "999999999";
                }
                var field = JSON.stringify(d);
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/alrm/report/time',
                    headers : {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization:Authorization
                    },
                    type : 'post',
                    data : field,
                    success : function (result){
                        console.log(result)
                        if(result.resultcode == "2"){
                            layer.msg('新增成功！', {icon: 1,time:1000}, function() {
                                layer.close(index); //再执行关闭
                            });
                        }else{
                            layer.msg('新增失败！', {icon: 2,time:1000}, function() {
                                $.ajax({
                                    url :''+urlConfig1+'/v02/htwl/alarm/rule/online/'+id+'',
                                    type : 'delete',
                                    success : function (result){
                                        loadAlarmRuleList();
                                    }
                                })
                                layer.close(index); //再执行关闭
                            });
                        }
                    }
                })
            }
        })
    };
    //角色select
    var loadRoleSelect = function () {
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/user/role/query',
            headers: {
               Authorization:Authorization
            },
            type: 'get',
            success: function (result) {
                if(result == null){
                    // $("#f_select").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in result){
                        $("select[name='oneLevelType']").append("<option value="+result[i].roleId+">"+result[i].roleName+"</option>");
                        $("select[name='twoLevelType']").append("<option value="+result[i].roleId+">"+result[i].roleName+"</option>");
                        $("select[name='threeLevelType']").append("<option value="+result[i].roleId+">"+result[i].roleName+"</option>");
                    }
                }
                form.render('select');
                loadUpTime();
            }
        })
    };
    //设备select
    var loadEquipmentSelect = function () {
        $.ajax({
            url: '' + urlConfig + '/v01/htwl/lxh/jcsjgz/all/equipment',
            headers: {
               Authorization:Authorization
            },
            type: 'get',
            success: function (result) {
                var data = result.data;
                if(data == null){
                    // $("#f_select").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in data){
                        $("#fourth_layer_encoding_name").append("<option value="+data[i].dicKey+">"+data[i].dicName+"</option>");
                    }
                }
                form.render('select');
                loadAlarmRuleDetails();
            }
        })
    };
    //因子select
    var loadFactorSelect = function () {
        $.ajax({
            url: '' + urlConfig + '/v01/htwl/lxh/jcsjgz/all/factor',
            headers: {
               Authorization:Authorization
            },
            type: 'get',
            success: function (result) {
                var data = result.data;
                if(data == null){
                    // $("#f_select").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in data){
                        $("#third_layer_encoding_name").append("<option value="+data[i].dicKey+">"+data[i].dicName+"</option>");
                    }
                }
                form.render('select');
                loadAlarmRuleDetails();
            }
        })
    };
    //修改规则
    var alterAlarmRuleWin = function (id) {
        var type = $('#alarmRule').val();
        if(type ==  'online_alarm_rule') {
            layer.open({
                title: '修改在线报警规则',
                type: 2,
                id: id,
                moveOut: true,
                area: ['1000px', '600px'],
                content: '../../pages/alarmMng/alterOnlineAlarmRule.html',
                btn: ['提交', '返回'],
                btnAlign: 'c',
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body', index),
                        first_layer_encoding_name = body.contents().find("select[name='first_layer_encoding_name']").find("option:selected").text(),
                        first_layer_encoding_type = body.contents().find("select[name='first_layer_encoding_name']").val(),
                        second_layer_encoding_name = body.contents().find("select[name='second_layer_encoding_name']").find("option:selected").text(),
                        second_layer_encoding_type = body.contents().find("select[name='second_layer_encoding_name']").val(),
                        third_layer_encoding_name = body.contents().find("select[name='third_layer_encoding_name']").find("option:selected").text(),
                        third_layer_encoding_type = body.contents().find("select[name='third_layer_encoding_name']").val(),
                        fourth_layer_encoding_name = body.contents().find("select[name='fourth_layer_encoding_name']").find("option:selected").text(),
                        fourth_layer_encoding_type = body.contents().find("select[name='fourth_layer_encoding_name']").val(),
                        one_conditions_name = body.contents().find("select[name='one_conditions_name']").find("option:selected").text(),
                        one_condition_key = body.contents().find("select[name='one_conditions_name']").val(),
                        one_threshold = body.contents().find("input[name='one_threshold']").val(),
                        two_conditions_name = body.contents().find("select[name='two_conditions_name']").find("option:selected").text(),
                        two_conditions_key = body.contents().find("select[name='two_conditions_name']").val(),
                        two_threshold = body.contents().find("input[name='two_threshold']").val(),
                        is_contain = body.contents().find("input[name='is_contain']:checked").val();
                    var data = {
                        id: id,
                        firstLayerEncodingName: first_layer_encoding_name,
                        firstLayerEncodingType: first_layer_encoding_type,
                        secondLayerEncodingName: second_layer_encoding_name,
                        secondLayerEncodingType: second_layer_encoding_type,
                        thirdLayerEncodingName: third_layer_encoding_name,
                        thirdLayerEncodingType: third_layer_encoding_type,
                        fourthLayerEncodingName: fourth_layer_encoding_name,
                        fourthLayerEncodingType: fourth_layer_encoding_type,
                        oneConditionsName: one_conditions_name,
                        oneConditionKey: one_condition_key,
                        oneThreshold: one_threshold,
                        twoConditionsName: two_conditions_name,
                        twoConditionKey: two_conditions_key,
                        twoThreshold: two_threshold,
                        isContain: is_contain
                    };
                    var threeLevelTime = body.contents().find("input[name='threeLevelTime']").val();
                    var threeLevelKey = body.contents().find("input[name='threeLevelKey']").val();
                    var tId = body.contents().find("input[name='id']").val(),
                        type;
                    var d={
                        refid : id,
                        threeLevelKey : threeLevelKey
                    };
                    if(tId != ''){
                        d.id = tId;
                        type = "put"
                    }else{
                        type = "post"
                    }
                    body.contents().find("form").find('input,select').each(function(){
                        d[this.name]=this.value
                    });
                    if(threeLevelTime == ""){
                        d.threeLevelType = '1';
                        d.threeLevelTime = "999999999";
                    }
                    var field = JSON.stringify(d);
                    $.ajax({
                        url: ''+urlConfig1+'/v02/htwl/alarm/rule/online',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        type: 'put',
                        data: data,
                        success: function (result) {
                            if (result.code == '1000') {
                                layer.msg('修改规则成功！', {icon: 1, time: 1000}, function () {
                                    loadAlarmRuleList();
                                    $.ajax({
                                        url :''+urlConfig+'/v01/htwl/lxh/alrm/report/time',
                                        headers : {
                                            'Content-type': 'application/json;charset=UTF-8',
                                            Authorization:Authorization
                                        },
                                        type : type,
                                        data : field,
                                        success : function (result){
                                            console.log(result)
                                            if(result.resultcode == "2"){
                                                layer.msg('修改上报时间成功！', {icon: 1,time:1000}, function() {
                                                    layer.close(index); //再执行关闭
                                                });
                                            }else{
                                                layer.msg('修改上报时间失败！', {icon: 2,time:1000}, function() {
                                                    layer.close(index); //再执行关闭
                                                });
                                            }
                                        }
                                    })
                                });
                            }
                        },
                        error: function (result) {
                            var message = result.responseJSON.errors[0].defaultMessage;
                            layer.msg(message, {icon: 2, time: 1000});
                        }
                    })
                }
            })
        }else if(type == 'poly_online_alarm_rule') {
            layer.open({
                title: '修改聚合在线报警规则',
                type: 2,
                id: id,
                moveOut: true,
                area: ['1000px', '600px'],
                content: '../../pages/alarmMng/alterPolyOnlineAlarmRule.html',
                btn: ['提交', '返回'],
                btnAlign: 'c',
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body', index),
                        first_layer_encoding_name = body.contents().find("select[name='first_layer_encoding_name']").find("option:selected").text(),
                        first_layer_encoding_type = body.contents().find("select[name='first_layer_encoding_name']").val(),
                        second_layer_encoding_name = body.contents().find("select[name='second_layer_encoding_name']").find("option:selected").text(),
                        second_layer_encoding_type = body.contents().find("select[name='second_layer_encoding_name']").val(),
                        third_layer_encoding_name = body.contents().find("select[name='third_layer_encoding_name']").find("option:selected").text(),
                        third_layer_encoding_type = body.contents().find("select[name='third_layer_encoding_name']").val(),
                        fourth_layer_encoding_name = body.contents().find("select[name='fourth_layer_encoding_name']").find("option:selected").text(),
                        fourth_layer_encoding_type = body.contents().find("select[name='fourth_layer_encoding_name']").val(),

                        start_time = body.contents().find("input[name='start_time']").val(),
                        end_time = body.contents().find("input[name='end_time']").val(),
                        conditions_name = body.contents().find("select[name='conditions_name']").find("option:selected").text(),
                        condition_key = body.contents().find("select[name='conditions_name']").val(),
                        aggregation_name = body.contents().find("select[name='aggregation_name']").find("option:selected").text(),
                        aggregation_value = body.contents().find("select[name='aggregation_name']").val(),
                        calculation_name = body.contents().find("select[name='calculation_name']").find("option:selected").text(),
                        calculation_value = body.contents().find("input[name='calculation_value']").val();

                    var threeLevelTime = body.contents().find("input[name='threeLevelTime']").val();
                    var threeLevelKey = body.contents().find("input[name='threeLevelKey']").val();
                    var tId = body.contents().find("input[name='id']").val(),
                        type;
                    var d={
                        refid : id,
                        threeLevelKey : threeLevelKey
                    };
                    if(tId != ''){
                        d.id = tId;
                        type = "put"
                    }else{
                        type = "post"
                    }
                    body.contents().find("form").find('input,select').each(function(){
                        d[this.name]=this.value
                    });
                    if(threeLevelTime == ""){
                        d.threeLevelType = '1';
                        d.threeLevelTime = "999999999";
                    }
                    var field = JSON.stringify(d);
                    var data = {
                        id: id,
                        firstLayerEncodingName: first_layer_encoding_name,
                        firstLayerEncodingType: first_layer_encoding_type,
                        secondLayerEncodingName: second_layer_encoding_name,
                        secondLayerEncodingType: second_layer_encoding_type,
                        thirdLayerEncodingName: third_layer_encoding_name,
                        thirdLayerEncodingType: third_layer_encoding_type,
                        fourthLayerEncodingName: fourth_layer_encoding_name,
                        fourthLayerEncodingType: fourth_layer_encoding_type,
                        startTime: start_time,
                        endTime: end_time,
                        aggregationName: aggregation_name,
                        aggregationValue: aggregation_value,
                        calculationName: calculation_name,
                        calculationValue: calculation_value,
                        conditionsName: conditions_name,
                        conditionKey: condition_key
                    };
                    $.ajax({
                        url: '' + urlConfig1 + '/v02/htwl/aggregation/alarm/rule/online',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        type: 'put',
                        data: data,
                        success: function (result) {
                            if (result.code == '1000') {
                                layer.msg('修改规则成功！', {icon: 1, time: 1000}, function () {
                                    loadAlarmRuleList();
                                    $.ajax({
                                        url :''+urlConfig+'/v01/htwl/lxh/alrm/report/time',
                                        headers : {
                                            'Content-type': 'application/json;charset=UTF-8',
                                            Authorization:Authorization
                                        },
                                        type : type,
                                        data : field,
                                        success : function (result){
                                            console.log(result)
                                            if(result.resultcode == "2"){
                                                layer.msg('修改上报时间成功！', {icon: 1,time:1000}, function() {
                                                    layer.close(index); //再执行关闭
                                                });
                                            }else{
                                                layer.msg('修改上报时间失败！', {icon: 2,time:1000}, function() {
                                                    layer.close(index); //再执行关闭
                                                });
                                            }
                                        }
                                    })
                                });
                            }
                        },
                        error: function (result) {
                            var message = result.responseJSON.errors[0].defaultMessage;
                            layer.msg(message, {icon: 2, time: 1000});
                        }
                    })
                }
            })
        }else if(type == 'licence_alarm_rule'||type == 'biggest_alarm_rule'||type == 'total_alarm_rule'){
            var url,title;
            if(type == 'licence_alarm_rule'){
                url='' + urlConfig1 + '/v02/htwl/alarm/rule/license';
                title='修改许可证报警规则';
            }else if(type == 'biggest_alarm_rule'){
                url='' + urlConfig1 + '/v02/htwl/alarm/rule/sewage/biggest';
                title='修改排污最大流量报警规则';
            }else if(type == 'total_alarm_rule'){
                url='' + urlConfig1 + '/v02/htwl/alarm/rule/sewage/total';
                title='修改排污总量报警规则';
            }
            layer.open({
                title: title,
                type: 2,
                id: id,
                moveOut: true,
                area: ['1000px', '600px'],
                content: '../../pages/alarmMng/alterLicenceAlarmRule.html',
                btn: ['提交', '返回'],
                btnAlign: 'c',
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body', index);
                    var threeLevelTime = body.contents().find("input[name='threeLevelTime']").val();
                    var tId = body.contents().find("input[name='id']").val(),
                        type;
                    var data1={id : id},
                        data2={id : id};
                    if(tId != ''){
                        data2.id = tId;
                        type = "put"
                    }else{
                        type = "post"
                    }
                    body.contents().find("form").find("#basicData").find('input,select,textarea').each(function(){
                        data1[this.name]=this.value
                    });
                    body.contents().find("form").find("#upTime").find('input,select').each(function(){
                        data2[this.name]=this.value
                    });
                    if(threeLevelTime == ""){
                        data2.threeLevelType = '1';
                        data2.threeLevelTime = "999999999";
                    }
                    var field = JSON.stringify(data2);
                    console.log(data1,data2)
                    $.ajax({
                        url:url,
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        type: 'put',
                        data: data1,
                        success: function (result) {
                            if (result.code == '1000') {
                                layer.msg('修改规则成功！', {icon: 1, time: 1000}, function () {
                                    loadAlarmRuleList();
                                    $.ajax({
                                        url :''+urlConfig+'/v01/htwl/lxh/alrm/report/time',
                                        headers : {
                                            'Content-type': 'application/json;charset=UTF-8',
                                            Authorization:Authorization
                                        },
                                        type : type,
                                        data : field,
                                        success : function (result){
                                            console.log(result)
                                            if(result.resultcode == "2"){
                                                layer.msg('修改上报时间成功！', {icon: 1,time:1000}, function() {
                                                    layer.close(index); //再执行关闭
                                                });
                                            }else{
                                                layer.msg('修改上报时间失败！', {icon: 2,time:1000}, function() {
                                                    layer.close(index); //再执行关闭
                                                });
                                            }
                                        }
                                    })
                                });
                            }
                        },
                        error: function (result) {
                            var message = result.responseJSON.errors[0].defaultMessage;
                            layer.msg(message, {icon: 2, time: 1000});
                        }
                    })
                }
            })
        }
    };
    //编辑载入规则详情
    var loadAlarmRuleDetails = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id'),//规则id
            title =  $(window.parent.document).find('.layui-layer-title').text();
        if(title == '修改在线报警规则'){
            $.ajax({
                url :''+urlConfig1+'/v02/htwl/alarm/rule/online/'+id+'',
                type: 'get',
                success: function (result) {
                    $('#first_layer_encoding_name').children("option").each(function(){
                        if (this.text == result.firstLayerEncodingName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#second_layer_encoding_name').children("option").each(function(){
                        if (this.text == result.secondLayerEncodingName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#fourth_layer_encoding_name').children("option").each(function(){
                        if (this.text == result.fourthLayerEncodingName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#third_layer_encoding_name').children("option").each(function(){
                        if (this.text == result.thirdLayerEncodingName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#one_conditions_name').children("option").each(function(){
                        if (this.text == result.oneConditionsName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#two_conditions_name').children("option").each(function(){
                        if (this.text == result.twoConditionsName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $("input[name='is_contain'][value='"+result.isContain+"']").prop("checked",true);
                    $('#one_threshold').val(result.oneThreshold);
                    $('#two_threshold').val(result.twoThreshold);
                    form.render();
                }
            })
        }else if(title == '修改聚合在线报警规则'){
            $.ajax({
                url :''+urlConfig1+'/v02/htwl/aggregation/alarm/rule/online/'+id+'',
                type: 'get',
                success : function (result) {
                    $('#first_layer_encoding_name').children("option").each(function(){
                        if (this.text == result.firstLayerEncodingName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#second_layer_encoding_name').children("option").each(function(){
                        if (this.text == result.secondLayerEncodingName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#fourth_layer_encoding_name').children("option").each(function(){
                        if (this.text == result.fourthLayerEncodingName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#third_layer_encoding_name').children("option").each(function(){
                        if (this.text == result.thirdLayerEncodingName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#start_time').val(result.startTime);
                    $('#end_time').val(result.endTime);
                    $('#conditions_name').children("option").each(function(){
                        if (this.text == result.conditionsName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#aggregation_name').children("option").each(function(){
                        if (this.text == result.aggregationName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#calculation_name').children("option").each(function(){
                        if (this.text == result.calculationName) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('#calculation_value').val(result.calculationValue);
                    form.render('select');
                }
            })
        }else if(title == '修改许可证报警规则'||title == '修改排污最大流量报警规则'||title == '修改排污总量报警规则'){
            var url;
            if(title == '修改许可证报警规则'){
                url = ''+urlConfig1+'/v02/htwl/alarm/rule/license/'+id+'';
            }else if(title == '修改排污最大流量报警规则'){
                url = ''+urlConfig1+'/v02/htwl/alarm/rule/sewage/biggest/'+id+'';
            }else if(title == '修改排污总量报警规则'){
                url = ''+urlConfig1+'/v02/htwl/alarm/rule/sewage/total/'+id+'';
            }
            $.ajax({
                url :url,
                type: 'get',
                success : function (result) {
                    var data = result.data;
                    $('#rules').val(data.rules);
                    $('#remark').val(data.remark);
                    $('#rulesType').children("option").each(function(){
                        switch (this.value){
                            case 0:
                                this.value=false;
                                break;
                            case 1:
                                this.value=true;
                                break;
                        }
                        if (this.value == data.rulesType) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    // $.each(data,function(key,value){
                    //     var formField = $("[name='"+key+"']");
                    //     if(formField[0] !== undefined){
                    //         var fieldTagName = formField[0].tagName.toLowerCase();
                    //         if(fieldTagName == 'input'){
                    //             formField.val(value);
                    //         }else if(fieldTagName == 'select'){
                    //             formField.children("option").each(function () {
                    //                 if(this.value == value){
                    //                     this.setAttribute("selected","selected");
                    //                 }
                    //                 form.render('select');
                    //             })
                    //         }
                    //     }
                    // });
                }
            })
        }
    };
    //载入上报时间
    var loadUpTime = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id');//规则id
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/report/time/'+id+'',
            headers : {
                Authorization:Authorization
            },
            type: 'get',
            success: function (result) {
                var data = result[0];
                console.log(result)
                if(data){
                    $('select[name=oneLevelType]').children("option").each(function(){
                        if (this.value == data.oneLevelType) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('select[name=twoLevelType]').children("option").each(function(){
                        if (this.value == data.twoLevelType) {
                            this.setAttribute("selected","selected");
                        }
                    });
                    $('[name=oneLevelTime]').val(data.oneLevelTime);
                    $('[name=twoLevelTime]').val(data.twoLevelTime);
                    $('[name=threeLevelKey]').val(data.threeLevelKey);
                    $('[name=id]').val(data.id);
                    if(data.threeLevelTime != 999999999){
                        $('select[name=threeLevelType]').children("option").each(function(){
                            if (this.value == data.threeLevelType) {
                                this.setAttribute("selected","selected");
                            }
                        });
                        $('[name=threeLevelTime]').val(data.threeLevelTime);
                    }
                    form.render('select');
                }
            }
        })
    }
    //删除规则
    var deleteAlarmRule = function (id) {
        var text = $('#alarmRule').find("option:selected").text(),
            url;
        if(text == "在线报警规则"){
            url =''+urlConfig1+'/v02/htwl/alarm/rule/online/'+id+'';
        }else if(text == "聚合在线报警规则"){
           url =''+urlConfig1+'/v02/htwl/aggregation/alarm/rule/online/'+id+'';
        }else if(text == "许可证报警规则"){
            url =''+urlConfig1+'/v02/htwl/alarm/rule/license/'+id+'';
        }
        layer.msg('是否确定删除该规则', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url :url,
                    type : 'delete',
                    success : function (result){
                        layer.msg('删除成功！', {icon: 1,time:1000}, function() {
                            loadAlarmRuleList();
                        });
                    }
                })
            },
            error: function(result) {
                layer.msg('删除失败！', {icon: 2,time:2000});
            }
        });
    };
    var obj = {
        loadAlarmRuleList : loadAlarmRuleList,
        addAlarmRuleWin : addAlarmRuleWin,
        loadRoleSelect : loadRoleSelect,
        loadEquipmentSelect : loadEquipmentSelect,
        loadFactorSelect : loadFactorSelect,
        alterAlarmRuleWin : alterAlarmRuleWin,
        loadAlarmRuleDetails : loadAlarmRuleDetails,
        deleteAlarmRule : deleteAlarmRule,
        loadUpTime : loadUpTime,
        addAlarmRuleTime : addAlarmRuleTime
    };
    exports('onlineAlarmRuleMng',obj)
})