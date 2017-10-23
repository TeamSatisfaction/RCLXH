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
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
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
    //载入报警趋势
    var loadAlarmTrend = function () {
        var data = {
            startTime : "2017-08-01 00:00:00",
            entTime  : "2017-10-20 23:59:59"
        };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/statistics',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
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
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
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
                valueSuffix: '个'
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
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
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