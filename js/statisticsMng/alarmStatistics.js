/**
 * Created by Administrator on 2017/8/18.
 */
layui.define(['layer','element','layedit','laypage','form'], function(exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form(),
        aTobody = $('#alarm-result');
    //页面跳转
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //月报警趋势图
    var loadaCharts = function (onlineTime,onlineData,text) {
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
                categories : ['3月','4月','5月','6月','7月']
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
                data: [128,95,117,161,201]
            },{
                name: '视频分析',
                data: [60,42,45,75,50]
            },{
                name: '设备工况',
                data: [14,24,17,20,18]
            }]
        };
        Highcharts.chart('alarm_chart', option);
    };
    var loadPie = function () {
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
                data: [
                    ['在线监测',40],
                    ['视频分析',40],
                    ['设备工况',20]
                ]
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
    var obj = {
        loadPage : loadPage,
        loadaCharts : loadaCharts,
        loadPie : loadPie,
        alarmListWin : alarmListWin
    };
    /*输出内容，注意顺序*/
    exports('alarmStatistics',obj)
})