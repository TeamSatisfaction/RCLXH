layui.define(['layer', 'element','layedit', 'laydate'],function (exports){
    var $ = layui.jquery,
        laydate = layui.laydate;
        // layer = layui.layer,
    var start = {
        istime: true
        ,format: 'YYYY-MM-DD hh:mm:ss'
        ,issure: true
    };
    var end = {
        istime: true
        ,format: 'YYYY-MM-DD hh:mm:ss'
        ,issure: true
    };
    document.getElementById('startTime1').onclick = function(){
        start.elem = this;
        laydate(start);
    };
    document.getElementById('endTime1').onclick = function(){
        end.elem = this;
        laydate(end);
    };
    $('#startTime1').val(laydate.now(0, "YYYY/MM/DD 00:00:00"));
    $('#endTime1').val(laydate.now(0, "YYYY/MM/DD hh:mm:ss"));
    var chart = new Highcharts.Chart('container', {
        title: {
            text: '监测站名称',
            x: -20
        },
        subtitle: {
            text: '设备1',
            x: -20
        },
        xAxis: {
            categories: ['18:16:00', '18:16:30', '18:17:00', '18:17:30', '18:18:00', '18:18:30', '18:19:00', '18:19:30', '18:20:00', '18:20:30', '18:21:30', '18:22:00']
        },
        yAxis: {
            title: {
                text: '含量 (mg/L)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: 'mg/L'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: '总磷',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }]
    });
    var obj = {
        chart : chart
    };
    /*输出内容，注意顺序*/
    exports('waterQualitySiteMng',obj)
})