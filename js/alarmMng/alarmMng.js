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
    var urlConfig = sessionStorage.getItem("urlConfig");
    var Authorization = sessionStorage.getItem("Authorization");
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
        url : ' http://172.16.1.20:9564/v01/htwl/file/upload',
        elem: '#s-alarm',
        headers : {
            Authorization:Authorization
        },
        method : 'post',
        success: function(res){
            console.log(res);
            return false;
        }
    });
    /*上传图片*/
    var imgSelect = function (input) {
        var formData = new FormData();
        formData.append(input.value, input.files[0]);
        /*formData打印不出来的，需要有接口才能测试*/
        $.ajax({
            url : ' http://172.16.1.20:9564/v01/htwl/file/upload',
            type: 'POST',           //必须是post
            data: formData,         //参数为formData
            contentType: false,  	//必要
            processData: false,  	//必要，防止ajax处理文件流
            headers : {
                Authorization:Authorization
            },
            success : function (result){
                $("input[name=nonefiles]").val(result[0].fileUrl);
                // console.log($("#files"))
            }
        })
    };
    //初始化时间
    var setTime = function () {
        var sTime = date.getFullYear()+"-01-01",
            eTime =  date.getFullYear() + seperator1 + month + seperator1 + strDate;
        $('#startTime').val(sTime);
        $('#endTime').val(eTime);
    };
    setTime();
    //报警列表
    var loadAlarmData = function (curr,alarmType) {
        if(!alarmType){
            alarmType = $('#getType').find('.layui-this')[0].innerHTML;
        }
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
            case "其他报警":
                alarmType = 'other_alarm'
                break;
        }
        var startTime = $('#startTime').val(),
            endTime = $('#endTime').val(),
            status = $('#status').val(),
            data = {
                alarmType : alarmType,
                startTime :startTime + "00:00:00",
                entTime : endTime + "23:59:59",
                status :status,
                pageNo : curr||1,
                pageSize : 16
            };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/query',
            headers : {
                Authorization:Authorization
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
                        var remark = item.remark,
                            res = remark.replace(/\[.*?\]/g,''),
                            res1 = res.replace(/\{|}/g,'');
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
                            '<td>' + res1 + '</td>' +
                            '<td>' + item.alarmType+ '</td>' +
                            '<td>' + item.status + '</td>' +
                            // '<td style="text-align: center"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini" onclick="layui.alarmMng.alarmDetailsWin(\''+item.alarmId+'\')">详情</button></td>' +
                            '<td style="text-align: center"><a href="#" onclick="layui.alarmMng.alarmDetailsWin(\''+item.alarmId+'\')" title="详情"><img src="../../img/mng/details.png"></a></td>' +
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
            btnAlign: 'c'
        })
        layer.full(index);
    };
    //加载报警详情
    var loadAlarmDetails = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id');//报警id
        sessionStorage.setItem("AlarmId", id);
        $.ajax({
            url : ''+urlConfig+'/v01/htwl/lxh/alrm/query/'+id+'',
            headers : {
                Authorization:Authorization
            },
            type : 'get',
            success : function (result){
                console.log(result)
                var remark = result.remark,
                    res = remark.replace(/\[.*?\]/g,''),
                    res1 = res.replace(/\{|}/g,'');
                switch (result.alarmType){
                    case "detection_alarm":
                        result.alarmType = '在线监控报警'
                        break;
                    case "video_alarm":
                        result.alarmType = '视频分析报警'
                        break;
                    case "working_alarm":
                        result.alarmType = '设备工况报警'
                        break;
                    case "working_alarm":
                        result.alarmType = '其他报警'
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
                    $(".layui-btn").addClass('layui-btn-disabled');
                    $(".layui-btn").attr('disabled','disabled');
                }
                $("#alarmType1").html(result.alarmType);
                $("#alarmLevel1").html(result.alarmLevel+'级');
                $("#alarmTime1").html(result.alarmTime);
                $("#enterpriseName1").html(result.enterpriseName);
                $("#remark1").html(res1);
                $("#status1").html(result.status);
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
                $("#trail-result").html(render(list));
                if( result.alarmType == '在线监控报警'){
                    var pattern = /\[(.+?)\]/g,
                        pattern1 = /\{(.+?)\}/g;
                    var remark = result.remark,
                        e = remark.match(pattern)[0],
                        e1 = remark.match(pattern1)[0];
                    var code = e.replace(/\[|]/g,''), //因子code
                        codeName = e1.replace(/\{|}/g,'');
                    console.log(codeName,code)
                    var time = result.alarmTime;
                    var interTimes = 2*60*1000;
                    interTimes=parseInt(interTimes);
                    var atime = Date.parse(new Date(time));
                    var date1 = new Date(atime-interTimes); //前2分钟
                    var date2 = new Date(atime+interTimes);//后2分钟
                    var beginDate = changeTime(date1);
                    var endDate = changeTime(date2);
                    var data = {
                        beginDate : beginDate,
                        endDate : endDate,
                        enterpriseId  : result.enterpriseId,
                        factor : code,
                        cn : 2011
                    };
                    $.ajax({
                        url: ''+urlConfig+'/v01/htwl/lxh/online',
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8',
                           Authorization:Authorization
                        },
                        type: 'get',
                        data: data,
                        success: function (result) {
                            var arr = [],
                                i;
                            if(result.onlineData != null){
                                var time = result.onlineTime,
                                    onlineData = result.onlineData.data[0].online;
                                for(i=0;i<time.length;i++){
                                    arr.push([
                                        time[i],
                                        onlineData[i]
                                    ])
                                }
                            }
                            loadaCharts(code,codeName,arr);
                        }
                    })
                }else if(result.alarmType = '视频报警'){
                    var qyImg = [{
                        "url":"../../img/data/002.png"
                    },{
                        "url":"../../img/data/001.png"
                    }
                    ];
                    //设备照片
                    var qyPhotos = "";
                    for(var i in qyImg){
                        qyPhotos += "<div class='silder-main-img lay-img'> <img src='"+ qyImg[i].url +"' style='width: 600px;height: 240px'> </div>"
                    }
                    $(".silder-main").html(qyPhotos);
                    //图片点击
                    layer.photos({
                        photos: '.lay-img'
                        ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                    });

                    $(".js-silder").silder({
                        auto: true,//自动播放，传入任何可以转化为true的值都会自动轮播
                        speed: 20,//轮播图运动速度
                        sideCtrl: true,//是否需要侧边控制按钮
                        bottomCtrl: true,//是否需要底部控制按钮
                        defaultView: 0,//默认显示的索引
                        interval: 3000,//自动轮播的时间，以毫秒为单位，默认3000毫秒
                        activeClass: "active"//小的控制按钮激活的样式，不包括作用两边，默认active
                    });
                }
            }
        })
    };
    //转换时间格式
    function changeTime(date) {
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1,
            strDate = date.getDate(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        var time = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + minutes
            + seperator2 + seconds;
        return time;
    }
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
                    roleId = $('#select_role').val(),
                    dealRemark = $('#desc').val(),
                    attachment = $("input[name=nonefiles]").val();
                    // attachment = 'http://static.cqhtwl.com.cn/txt/2017-07-21/756195ccdd994085b3cb91ccca00b2f8.txt';
                console.log(dealTime);
                var data = {
                    alarmId : alarmId,
                    roleId : roleId,
                    dealTime : dealTime,
                    dealRemark : dealRemark,
                    attachment : attachment
                };
                var field = JSON.stringify(data);
                $.ajax({
                    url: ""+urlConfig+"/v01/htwl/lxh/alrm/report",
                    // url: "http://172.21.92.236:8095/v01/htwl/lxh/alrm/report",
                    headers : {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization:Authorization
                    },
                    data : field,
                    type : 'post',
                    success: function (result){
                        console.log(result);
                        if(result.resultdesc == '成功'){
                            layer.msg('提交成功！', {icon: 1,time:1000},function () {
                                layer.close(index);
                                parent.location.reload(); // 父页面刷新
                            });
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
                    attachment = $("input[name=nonefiles]").val();
                    // attachment = 'http://static.cqhtwl.com.cn/txt/2017-07-21/756195ccdd994085b3cb91ccca00b2f8.txt';
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
                        Authorization:Authorization
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
                    attachment = $("input[name=nonefiles]").val();
                    // attachment = 'http://static.cqhtwl.com.cn/txt/2017-07-21/756195ccdd994085b3cb91ccca00b2f8.txt';
                if(attachment == ''){
                    layer.msg('上传附件失败！', {icon: 2});
                }else{
                    var data = {
                        alarmId : alarmId,
                        dealTime : dealTime,
                        dealRemark : dealRemark,
                        attachment : attachment,
                        status  : '1'
                    };
                    var field = JSON.stringify(data);
                    console.log(data);
                    $.ajax({
                        url: ""+urlConfig+"/v01/htwl/lxh/alrm/deal",
                        // url: "http://172.21.92.236:8095/v01/htwl/lxh/alrm/deal",
                        headers : {
                            'Content-type': 'application/json;charset=UTF-8',
                            Authorization:Authorization
                        },
                        data : field,
                        type : 'post',
                        success: function (result){
                            console.log(result);
                            if(result.resultdesc == '成功'){
                                layer.msg('处理成功！', {icon: 1,time:1000},function () {
                                    layer.close(index);
                                    parent.location.reload(); // 父页面刷新
                                });
                            }else{
                                layer.msg('处理失败！', {icon: 2,time:1000},function () {
                                    layer.close(index);
                                    parent.location.reload(); // 父页面刷新
                                });
                            }
                        }
                    })
                }
            }
        });
    };
    //角色select
    var loadRoleData = function () {
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/user/role/query',
            headers: {
               Authorization:Authorization
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
    // //角色select点击事件
    // form.on('select(select_role)', function(data){
    //     $.ajax({
    //         url: ''+urlConfig+'/v01/htwl/lxh/user/role/'+data.value+'',
    //         headers: {
    //            Authorization:Authorization
    //         },
    //         type: 'get',
    //         success: function (result){
    //             console.log(result);
    //             $("#select_user").empty();
    //             for(var i in result){
    //                 if(result.length == 0){
    //                     $("#select_user").append("<option value='' selected='selected'>无用户</option>");
    //                 }else{
    //                     console.log(result[i].userId);
    //                     $("#select_user").append("<option value="+result[i].userId+">"+result[i].userName+"</option>");
    //                 }
    //             }
    //             form.render('select');
    //         }
    //     })
    // });
    var loadaCharts = function (code,codeName,arr) {
        var unit ;
        switch (codeName){
            case "COD" :
                unit = "mg/L";
                break;
            case "总磷" :
                unit = "mg/L";
                break;
            case "高锰酸盐" :
                unit = "mg/L";
                break;
            case "氨氮" :
                unit = "mg/L";
                break;
            case "生物毒性" :
                unit = "%";
                break;
            case "温度" :
                unit = "℃";
                break;
            case "浊度" :
                unit = "FTU";
                break;
            case "电导率" :
                unit = "μS/cm";
                break;
            case "溶解氧" :
                unit = "mg/L";
                break;
        };
        var option = {
            chart: {
                type: 'spline',
                backgroundColor: 'rgba(0,0,0,0)'
            },
            title: {
                text: codeName
            },
            credits : {
                enabled: false
            },
            xAxis: {
                type: 'category',
                dateTimeLabelFormats: {
                    day: '%H:%M:%S'
                },
                labels : {
                    formatter : function () {
                        return layui.utils.dateFormat('HH:mm:ss',new Date(this.value))
                    }
                }
            },
            yAxis: {
                title: {
                    text: unit,
                    style : {
                        color: '#000000'
                    }
                },
                labels : {
                    style : {
                        color: '#000000'
                    }
                },
                minTickInterval : 0.1
            },
            tooltip: {
                valueSuffix: unit
            },
            legend: {
                enabled: false
            },
            series: [{
                name: codeName,
                data: arr,
                marker: {
                    enabled: true
                }
            }]
        };
        var chart = new Highcharts.chart('alarmChart', option);
    };
    //获取Cookie
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    };
    layer.ready(function(){
        $("#getType").find("li").each(function () {
            $(this).hide();
        });
        var userId = getCookie("userId");
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/user/query/'+userId+'',
            headers : {
                Authorization:Authorization
            },
            type : 'get',
            success : function (msg) {
                var authList = msg.authList;
                console.log(authList)
                layui.each(authList,function (index,item) {
                    if(item.authId == "11"){
                        $("#getType").find("li:eq(0)").show();
                    }else if(item.authId == "107"){
                        $("#getType").find("li:eq(1)").show();
                    }else if(item.authId == "108"){
                        $("#getType").find("li:eq(2)").show();
                    }else if(item.authId == "109"){
                        $("#getType").find("li:eq(3)").show();
                    }
                })
                if($("#getType").find("li:eq(0)").is(":hidden")&&$("#getType").find("li:eq(1)").is(":visible")){
                    $("#getType").find("li:eq(1)").attr("class","layui-this")
                    loadAlarmData();
                }else if($("#getType").find("li:eq(0)").is(":hidden") && $("#getType").find("li:eq(1)").is(":hidden")&&$("#getType").find("li:eq(2)").is(":visible")){
                    console.log("1");
                    $("#getType").find("li:eq(2)").attr("class","layui-this")
                    loadAlarmData();
                }else if($("#getType").find("li:eq(0)").is(":hidden")&&$("#getType").find("li:eq(1)").is(":hidden")&&$("#getType").find("li:eq(2)").is(":hidden")){
                    $("#getType").find("li:eq(3)").attr("class","layui-this")
                    loadAlarmData();
                }else{
                    $("#getType").find("li:eq(0)").attr("class","layui-this")
                    loadAlarmData();
                }
            }
        })
    });
    var obj = {
        loadPage : loadPage,
        imgSelect : imgSelect,
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