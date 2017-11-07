/**
 * Created by Administrator on 2017/8/18.
 */
layui.define(['layer','element','layedit','laypage','form'], function(exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form(),
        aTobody = $('#alarm-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    var Authorization = sessionStorage.getItem("Authorization");
    //页面跳转
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //载入报警统计总数
    var loadAlarmStatistics = function () {
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/statistics/total',
            headers : {
                Authorization:Authorization
            },
            type : 'get',
            success : function (result){
                $("#total").html(result.total);
                $("#closetotal").html(result.closetotal);
                $("#thisMonth").html(result.thisMonth);
                $("#untreated").html(result.untreated);
            }
        })
    };
    //获取日期的前几个月日期
    var GetPreMonthDay =  function (date,monthNum) {
        var dateArr = date.split('-');
        var year = dateArr[0]; //获取当前日期的年份
        var month = dateArr[1]; //获取当前日期的月份
        var day = dateArr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        var year2 = year;
        var month2 = parseInt(month) - monthNum;
        if (month2 <=0) {
            year2 = parseInt(year2) - parseInt(month2 / 12 == 0 ? 1 : parseInt(month2) / 12);
            month2 = 12 - (Math.abs(month2) % 12);
        }
        // var day2 = day;
        // var days2 = new Date(year2, month2, 0);
        // days2 = days2.getDate();
        // if (day2 > days2) {
        //     day2 = days2;
        // }
        if (month2 < 10) {
            month2 = '0' + month2;
        }
        var t2 = year2 + '-' + month2 + '-' + "01";
        // console.log(t2)
        return t2;
    }
    //载入报警趋势
    var loadAlarmTrend = function () {
        var date = new Date();
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        // console.log(currentdate)
        var startTime = GetPreMonthDay(currentdate,"4");
        var data = {
            startTime : startTime + "00:00:00",
            entTime  : currentdate+ "23:59:59"
        };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/statistics',
            headers : {
                Authorization:Authorization
            },
            data : data,
            type : 'get',
            success : function (result){
                // console.log(result)
                loadaCharts(result);
            }
        })
    }
    //载入报警关闭率
    var loadAlarmClose = function () {
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/close/rate',
            headers : {
                Authorization:Authorization
            },
            type : 'get',
            success : function (result){
                // console.log(result)
                loadPie(result);
            }
        })
    }
    //月报警趋势图
    var loadaCharts = function (r) {
        var categories = [],
            data1 = [],
            data2 = [],
            data3 = [];
        layui.each(r,function (index,item) {
            categories.push(item.month);
            data1.push(item.detection_alarm);
            data2.push(item.video_alarm);
            data3.push(item.working_alarm);
        })
        var option = {
            chart: {
                type : 'line'
            },
            title: {
                text: '月报警趋势图'
            },
            credits: {
                enabled: false
            },
            colors: [ '#1aadce', '#fda400', '#ff5722'],
            xAxis: {
                categories : categories
            },
            tooltip: {
                valueSuffix: '个',
                crosshairs: true,
                shared: true
            },
            yAxis: {
                title: {
                    text: '个'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: '在线监测',
                data: data1
            },{
                name: '视频分析',
                data: data2
            },{
                name: '设备工况',
                data: data3
            }]
        };
        Highcharts.chart('alarm_chart', option);
    };
    var loadPie = function (r) {
            var data = [['在线监测',r.onilneCloseRate], ['视频分析',r.videoCloseRate], ['设备工况',r.workingCloseRate]];
        var option = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            credits: {
                enabled: false
            },
            title: {
                text: '报警关闭率汇总分析图'
            },
            colors: [ '#1aadce', '#fda400', '#ff5722'],
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    },
                    showInlegend : true
                }
            },
            series: [{
                type: 'pie',
                name: '报警关闭率',
                data: data
            }]
        };
        Highcharts.chart('alarm_pie', option);
    };
    var alarmListWin = function () {
        var index = layer.open({
            title : '报警统计详情',
            type : 2,
            content : '../../pages/statisticsMng/alarmStatisticsList.html',
            btn: ['返回'],
            btnAlign: 'c',
            success : function (index, layero) {
                var body = layer.getChildFrame('body', layero);
                var id = $('.layui-layer-content').attr('id');
                // loadAlarmDetails(id,body);
            }
        })
        layer.full(index);
    };
    var loadAlarmlist = function () {
        var enterpriseName = $("input[name=name]").val(),
            curr = 1,
            nums = 16,
            str = '';
        var data = {
            enterpriseName : enterpriseName
        };
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/alrm/enterprise/statistics',
            headers : {
                Authorization:Authorization
            },
            data : data,
            type: 'get',
            success: function(data){
                console.log(data)
                var render = function(data, curr) {
                    var arr = []
                        ,gbl
                        , thisData = data.concat().splice(curr * nums - nums, nums);
                    layui.each(data, function(index, item){
                        gbl = Math.round(item.closetotal / item.count * 10000) / 100.00 + "%";
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.enterpriseName + '</td>' +
                            '<td>' + item.count + '</td>' +
                            '<td>' + item.closetotal+ '</td>' +
                            '<td>' + item.thisMonth + '</td>'+
                            '<td>' + item.untreated + '</td>'+
                            '<td>' + gbl + '</td>'+
                        '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                $('#bj-list').html(render(data, obj.curr));
            }
        })
    };
    var obj = {
        loadPage : loadPage,
        loadAlarmStatistics : loadAlarmStatistics,
        loadAlarmTrend : loadAlarmTrend,
        loadAlarmClose : loadAlarmClose,
        loadaCharts : loadaCharts,
        loadPie : loadPie,
        alarmListWin : alarmListWin,
        loadAlarmlist : loadAlarmlist
    };
    /*输出内容，注意顺序*/
    exports('alarmStatistics',obj)
})