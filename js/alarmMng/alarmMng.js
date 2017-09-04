/*
/报警管理
 */
layui.define(['layer','element','layedit','laypage','upload','form'], function(exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        upload = layui.upload(),
        form = layui.form(),
        aTobody = $('#alarm-result');
    var access_token = sessionStorage.getItem("access_token");
    var urlConfig = sessionStorage.getItem("urlConfig");
    //当前时间
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var dealTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    //页面跳转
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //上传文件
    layui.upload({
        url : 'http://api.cqhtwl.com.cn/v01/htwl/file/upload?access_token='+access_token+'',
        // url : 'http://login.cqhtwl.com.cn/v01/htwl/file/upload?access_token='+access_token+'',
        method : 'post',
        // type : 'json',
        success: function(res){
            console.log(res);
        }
    });

    // var initTimeSelect = function () {
    //     var st = document.getElementById('startTime'),
    //         et = document.getElementById('endTime');
    //     var start = {
    //         elem: st,
    //         min: '1909-06-16 23:59:59', //设定最小日期为当前日期
    //         max: laydate.now(), //最大日期
    //         istime: true,
    //         istoday: true,
    //         choose: function (datas) {
    //             end.min = datas; //开始日选好后，重置结束日的最小日期
    //             end.start = datas; //将结束日的初始值设定为开始日
    //         }
    //     };
    //     var end = {
    //         elem: et,
    //         min: laydate.now(),
    //         max: '2099-06-16 23:59:59',
    //         istime: true,
    //         istoday: true,
    //         choose: function (datas) {
    //             start.max = datas; //结束日选好后，重置开始日的最大日期
    //         }
    //     };
    //     $(st).click(function () {laydate(start);});
    //     $(et).click(function () {laydate(end);});
    // };
    // initTimeSelect();

    //报警列表
    var loadAlarmData = function (curr,alarmType) {
        console.log(alarmType);
        switch (alarmType){
            case "在线监测报警":
                alarmType = 'detection_alarm'
                break;
            case "设备工况报警":
                alarmType = 'working_alarm'
                break;
            case "视频分析报警":
                alarmType = 'video_alarm'
                break;
        }
        var startTime = $('#startTime').val(),
            endTime = $('#endTime').val(),
            status = $('#status').val(),
            data = {
                alarmType : alarmType,
                startTime :startTime,
                endTime : endTime,
                status :status,
                pageNo : curr||1,
                pageSize : 16
            };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/query',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            data : data,
            success : function (result){
                var aData = result.list,
                    pages = result.pages,
                    str = "",
                    nums = 16; //每页出现的数据量
                //模拟渲染
                var render = function(aData, curr) {
                    var arr = []
                        , thisData = aData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        switch (item.alarmType){
                            case "detection_alarm":
                                item.alarmType = '在线监测报警'
                                break;
                            case "video_alarm":
                                item.alarmType = '视频分析报警'
                                break;
                            case "working_alarm":
                                item.alarmType = '设备工况报警'
                                break;
                        }
                       switch (item.status){
                           case "0":
                               item.status = '未处理'
                               break;
                           case "1":
                               item.status = '已处理'
                               break;
                           case "2":
                               item.status = '已处罚'
                               break;
                           case "3":
                               item.status = '已关闭'
                               break;
                       }
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.enterpriseName + '</td>' +
                            '<td>' + item.alarmTime + '</td>' +
                            '<td>' + item.ruleName + '</td>' +
                            '<td>' + item.alarmType+ '</td>' +
                            '<td>' + item.status + '</td>' +
                            // '<td style="text-align: center"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini" onclick="layui.alarmMng.alarmDetailsWin(\''+item.alarmId+'\')">详情</button></td>' +
                            '<td style="text-align: center"><a href="#" onclick="layui.alarmMng.alarmDetailsWin(\''+item.alarmId+'\')" title="详情"><img src="../../img/mng/查看详情.png"></a></td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                aTobody.html(render(aData, obj.curr));
                //调用分页
                laypage({
                    cont: 'alarm-demo',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr || 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadAlarmData(obj.curr);
                        }
                    }
                })
            }
        })
    };
    //报警详情窗口
    var  alarmDetailsWin = function (e){
        var index = layer.open({
            title : '报警详情',
            type : 2,
            id : e,
            content : '../../pages/alarmMng/alarmDataView.html',
            btn: ['返回'],
            btnAlign: 'c',
            success : function (index, layero) {
                var body = layer.getChildFrame('body', layero);
                var id = $('.layui-layer-content').attr('id');
                loadAlarmDetails(id,body);
            }
        })
        layer.full(index);
    };
    //加载报警详情
    var loadAlarmDetails = function (id,body) {
        sessionStorage.setItem("AlarmId", id);
        $.ajax({
            url : ''+urlConfig+'/v01/htwl/lxh/alrm/query/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                switch (result.alarmType){
                    case "detection_alarm":
                        result.alarmType = '在线监控报警'
                        break;
                    case "video_alarm":
                        result.alarmType = '视频报警'
                        break;
                    case "working_alarm":
                        result.alarmType = '工况报警'
                        break;
                }
                switch (result.status){
                    case "0":
                        result.status = '未处理'
                        break;
                    case "1":
                        result.status = '已处理'
                        break;
                    case "2":
                        result.status = '已处罚'
                        break;
                    case "3":
                        result.status = '已关闭'
                        break;
                }
                if(result.status != "未处理"){
                    body.contents().find(".layui-btn").addClass('layui-btn-disabled');
                    body.contents().find(".layui-btn").attr('disabled','disabled');
                }
                body.contents().find("#alarmType1").html(result.alarmType);
                body.contents().find("#alarmLevel1").html(result.alarmLevel+'级');
                body.contents().find("#alarmTime1").html(result.alarmTime);
                body.contents().find("#enterpriseName1").html(result.enterpriseName);
                body.contents().find("#remark1").html(result.remark);
                body.contents().find("#status1").html(result.status);
                var list = result.alarmLogs,
                    str = '',
                    arr = [];
                var render = function(list){
                    layui.each(list, function(index, item){
                        switch (item.operateUserLevel){
                            case "service_level":
                                item.operateUserLevel = '服务方'
                                break;
                            case "enterprise_level":
                                item.operateUserLevel = '企业方'
                                break;
                            case "service_level":
                                item.regulatory_level = '监管方'
                                break;
                        }
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>'+item.operateTime+'</td>' +
                            '<td>'+item.operateUser+'</td>' +
                            '<td>'+item.operateUserLevel+'</td>' +
                            '<td>'+item.remark+'</td>' +
                            '</tr>';
                        arr.push(str);
                    })
                    return arr.join('');
                }
                body.contents().find("#trail-result").html(render(list));
            }
        })
    };
    //上报报警窗口
    var  reportAlarmWin = function () {
        var content = $('#report_Alarm');
        layer.open({
            title : '上报报警',
            type : 1,
            area : ['600px','400px'],
            content : content,
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes: function(index){
                var alarmId = sessionStorage.getItem("AlarmId"),
                    userId = $('#select_role').val(),
                    dealRemark = $('#desc').val(),
                    attachment = 'http://static.cqhtwl.com.cn/txt/2017-07-21/756195ccdd994085b3cb91ccca00b2f8.txt';
                console.log(dealTime);
                var data = {
                    alarmId : alarmId,
                    userId : userId,
                    dealTime : dealTime,
                    dealRemark : dealRemark,
                    attachment : attachment
                };
                var field = JSON.stringify(data);
                $.ajax({
                    url: ""+urlConfig+"/v01/htwl/lxh/alrm/report",
                    headers : {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    data : field,
                    type : 'post',
                    success: function (result){
                        console.log(result);
                        if(result.resultdesc == '成功'){
                            layer.msg('提交成功！', {icon: 1});
                            layer.close(index);
                            parent.location.reload(); // 父页面刷新
                        }
                    }
                })
            }
        });
        loadRoleData();
    };
    //关闭报警窗口
    var  closeAlarmWin = function () {
        var content = $('#deal_Alarm');
        layer.open({
            title : '关闭报警',
            type : 1,
            area : ['600px','300px'],
            content : content,
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes: function(index){
                var alarmId = sessionStorage.getItem("AlarmId"),
                    dealRemark = $('#desc1').val(),
                    attachment = 'http://static.cqhtwl.com.cn/txt/2017-07-21/756195ccdd994085b3cb91ccca00b2f8.txt';
                var data = {
                    alarmId : alarmId,
                    dealTime : dealTime,
                    dealRemark : dealRemark,
                    attachment : attachment,
                    status  : '3'
                };
                var field = JSON.stringify(data);
                $.ajax({
                    url: ""+urlConfig+"/v01/htwl/lxh/alrm/deal",
                    headers : {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    data : field,
                    type : 'post',
                    success: function (result){
                        console.log(result);
                        if(result.resultdesc == '成功'){
                            layer.msg('关闭成功！', {icon: 1});
                            layer.close(index);
                            parent.location.reload(); // 父页面刷新
                        }
                    }
                })
            }
        });
    };
    //处理 报警窗口
    var  dealAlarmWin = function () {
        var content = $('#deal_Alarm');
        layer.open({
            title : '关闭报警',
            type : 1,
            area : ['600px','300px'],
            content : content,
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes: function(index){
                var alarmId = sessionStorage.getItem("AlarmId"),
                    dealRemark = $('#desc1').val(),
                    attachment = 'http://static.cqhtwl.com.cn/txt/2017-07-21/756195ccdd994085b3cb91ccca00b2f8.txt';
                var data = {
                    alarmId : alarmId,
                    dealTime : dealTime,
                    dealRemark : dealRemark,
                    attachment : attachment,
                    status  : '2'
                };
                var field = JSON.stringify(data);
                $.ajax({
                    url: ""+urlConfig+"/v01/htwl/lxh/alrm/deal",
                    headers : {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    data : field,
                    type : 'post',
                    success: function (result){
                        console.log(result);
                        if(result.resultdesc == '成功'){
                            layer.msg('处理成功！', {icon: 1});
                            layer.close(index);
                            parent.location.reload(); // 父页面刷新
                        }
                    }
                })
            }
        });
    };
    //角色select
    var loadRoleData = function () {
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/user/role/query',
            headers: {
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'get',
            success: function (result) {
                if(result != null){
                    // $("#select_role").empty();
                    for(var i in result){
                        $("#select_role").append("<option value="+result[i].roleId+">"+result[i].roleName+"</option>");
                    }
                }
                form.render('select');
            }
        })
    };
    //角色select点击事件
    form.on('select(select_role)', function(data){
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/user/role/'+data.value+'',
            headers: {
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'get',
            success: function (result){
                console.log(result);
                if(result != null){
                    $("#select_user").empty();
                    for(var i in result){
                        $("#select_user").append("<option value="+result[i].userId+">"+result[i].userName+"</option>");
                    }
                }
                form.render('select');
            }
        })
    });
    var loadaCharts = function () {
        var option = {
            chart: {
                type : 'line'
            },
            title: {
                text: '实时监测数据'
            },
            xAxis: {
                categories : ["22:34:01","22:34:11","22:34:21","22:34:31"]
            },
            tooltip: {
                valueSuffix: 'mg/L'
            },
            yAxis: {
                title: {
                    text: 'mg/L'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'COD',
                data: [6,6.5,6.7,5.2]
            }]
        };
        Highcharts.chart('alarmChart', option);
    };
    var obj = {
        loadPage : loadPage,
        loadAlarmData : loadAlarmData,
        alarmDetailsWin : alarmDetailsWin,
        loadAlarmDetails : loadAlarmDetails,
        reportAlarmWin : reportAlarmWin,
        closeAlarmWin : closeAlarmWin,
        dealAlarmWin : dealAlarmWin,
        loadaCharts : loadaCharts
    };
    exports('alarmMng',obj);
})