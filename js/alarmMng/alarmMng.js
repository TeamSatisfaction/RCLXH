/*
/报警管理
 */
layui.define(['layer','laydate','element','layedit','laypage','upload'], function(exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        upload = layui.upload(),
        aTobody = $('#alarm-result');
    //页面跳转
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //上传文件
    layui.upload({
        url : 'http://api.cqhtwl.com.cn/v01/htwl/wljk/file/upload?',
        method : 'post',
        type : 'json',
        before: function(input){
            //返回的参数item，即为当前的input DOM对象
            console.log('文件上传中');
        }
        ,success: function(res){
            console.log('上传完毕');
        }
    });
    var initTimeSelect = function () {
        var st = document.getElementById('startTime'),
            et = document.getElementById('endTime');
        var start = {
            elem: st,
            min: '1909-06-16 23:59:59', //设定最小日期为当前日期
            max: laydate.now(), //最大日期
            istime: true,
            istoday: true,
            choose: function (datas) {
                end.min = datas; //开始日选好后，重置结束日的最小日期
                end.start = datas; //将结束日的初始值设定为开始日
            }
        };
        var end = {
            elem: et,
            min: laydate.now(),
            max: '2099-06-16 23:59:59',
            istime: true,
            istoday: true,
            choose: function (datas) {
                start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        $(st).click(function () {laydate(start);});
        $(et).click(function () {laydate(end);});
    };
    initTimeSelect();

    //报警列表
    var loadAlarmData = function (curr) {
        var alarmType = $('#alarmType').val(),
            startTime = $('#startTime').val(),
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
        console.log(data);
        $.ajax({
            url :'http://172.21.92.63:8092/v01/htwl/lxh/alrm/query',
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
                        if(item.alarmType == 'detection_alarm'){
                            item.alarmType = '在线监控报警'
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
                       }
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.enterpriseName + '</td>' +
                            '<td>' + item.alarmTime + '</td>' +
                            '<td>' + item.ruleName + '</td>' +
                            '<td>' + item.alarmType+ '</td>' +
                            '<td>' + item.status + '</td>' +
                            // '<td><a href="#" onclick="layui.alarmMng.loadAlarmDetails('+item.alarmId+')"><i class="layui-icon">&#xe63c;</i></a>' +
                            '<td><a href="#" onclick="layui.alarmMng.loadPage(\'pages/alarmMng/alarmDataView.html?id='+item.alarmId+'\')"><i class="layui-icon">&#xe63c;</i></a>' +
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

    //加载报警详情
    var loadAlarmDetails = function (id) {
        console.log(id);
        $.ajax({
            url : 'http://172.21.92.63:8092/v01/htwl/lxh/alrm/query/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                console.log(result);
                if(result.alarmType == 'detection_alarm'){
                    result.alarmType = '在线监控报警'
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
                }
                document.getElementById('alarmType').innerHTML = result.alarmType;
                document.getElementById('alarmLevel').innerHTML = result.alarmLevel+'级';
                document.getElementById('alarmTime').innerHTML = result.alarmTime;
                document.getElementById('enterpriseName').innerHTML = result.enterpriseName;
                document.getElementById('remark').innerHTML = result.remark;
                document.getElementById('status').innerHTML = result.status;
            }
        })
    };
    //上报报警窗口
    var  reportAlarmWin = function () {
        var content = $('#report_Alarm');
        layer.open({
            title : '上报报警',
            type : 1,
            area : ['500px','230px'],
            content : content,
            btn: ['提交', '关闭'],
            yes: function(index){
                $('#report_Alarm').on('submit', function(){
                    var formData = new FormData();
                    console.log(formData.get('attachment'));
                    $.ajax({
                        url: "http://192.168.3.222:8092/v01/htwl/lxh/alrm/report",
                        headers : {
                            'Content-type': 'application/json;charset=UTF-8',
                            Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                        },
                        data : formData,
                        type : 'post',
                        dataType: "json",
                        contentType: false,
                        processData: false,
                        success: function (data){
                            console.log(data);
                        }
                    })
                    return false;
                }).submit();
                // layer.msg('提交成功！', {icon: 1});
                // layer.close(index);
            }
        })
    }
    //上报报警
    var reportAlarm = function (id) {
        $.ajax({
            url : 'http://192.168.3.222:8092/v01/htwl/lxh/alrm/report',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'post',
            // data : {
            //     alarmId : id s
            // },
            success : function (result){
                console.log(result);
            }
        })
    };
    //处理报警
    var dealAlarm = function (id,status) {
        $.ajax({
            url : 'http://192.168.3.222:8092/v01/htwl/lxh/alrm/deal',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'post',
            data : {
                alarmId : id,
                status : status
            },
            success : function (result){
                console.log(result);
            }
        })
    };
    var obj = {
        loadPage : loadPage,
        loadAlarmData : loadAlarmData,
        loadAlarmDetails : loadAlarmDetails,
        reportAlarmWin : reportAlarmWin
    };
    exports('alarmMng',obj);
})