/**
 * Created by Administrator on 2017/8/18.
 */
layui.define(['layer','element','layedit','laypage','form'], function(exports) {
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
                text: '排放量（年度统计）    '
            },
            credits: {
                enabled: false
            },
            colors: [ '#1aadce', '#fda400', '#ff5722'],
            xAxis: {
                categories : ['2012年','2013年','2014年','2015年','2016年']
            },
            tooltip: {
                valueSuffix: '千克'
            },
            yAxis: {
                title: {
                    text: '千克'
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
                data: [128,95,117,161,201]
            }]
        };
        Highcharts.chart('monitor_chart', option);
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
                text: '污染源排放量百分比'
            },
            colors: [ '#1aadce', '#fda400', '#ff5722','#1AA094'],
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
                name: '污染源排放量',
                data: [
                    ['工业源',30],
                    ['集中式',30],
                    ['城镇生活源',20],
                    ['农业源',20]
                ]
            }]
        };
        Highcharts.chart('com_fac1', option);
    };
    var monitorListWin = function () {
        var index = layer.open({
            title : '污染源排放量',
            type : 2,
            content : '../../pages/statisticsMng/monitorStatisticsList.html',
            btn: ['返回'],
            btnAlign: 'c',
            success : function (index, layero) {
                var body = layer.getChildFrame('body', layero);
                var id = $('.layui-layer-content').attr('id');
                // loadAlarmDetails(id,body);
            }
        });
        layer.full(index);
    };
    var monitorListYearWin = function () {
        var index = layer.open({
            title : '年度统计',
            type : 2,
            content : '../../pages/statisticsMng/monitorStatisticsYearList.html',
            btn: ['返回'],
            btnAlign: 'c',
            success : function (index, layero) {
                var body = layer.getChildFrame('body', layero);
                var id = $('.layui-layer-content').attr('id');
                // loadAlarmDetails(id,body);
            }
        });
        layer.full(index);
    };
    var obj = {
        loadPage : loadPage,
        loadaCharts : loadaCharts,
        loadPie : loadPie,
        monitorListWin : monitorListWin,
        monitorListYearWin : monitorListYearWin
    };
    /*输出内容，注意顺序*/
    exports('monitorStatistics',obj)
})
