layui.define(['layer', 'element','layedit', 'laydate'],function (exports){
    var $ = layui.jquery,
        laydate = layui.laydate,
        msTobody = $('#ms-result1');
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
    function loadCharts() {
        
    }
    var loadMSData = function (curr){
        var data = {
            pageNo : curr||1,
            pageSize : 16
        };
        $.ajax({
            url: 'http://192.168.1.127:8092/v01/htwl/lxh/water/query',
            // url: 'http://172.21.92.63:8092/v01/htwl/lxh/water/query',
            headers: {
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'get',
            data: data,
            success: function (result) {
                var msData = result.list,
                    pages = result.pages,
                    str = "",
                    nums = 16; //每页出现的数据量
                var render = function(msData, curr) {
                    var arr = []
                        , thisData = msData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr onclick="layui.waterQualitySiteMng.loadChartForSite(layui.jquery(this))">' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.site + '</td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                msTobody.html(render(msData, obj.curr));
            }
        })
    };
    var loadChartForSite = function (e) {
        var site = e.find('td').eq(1).html();
        console.log(site);
        loadDau(site);
    };
    //根据企业查询设备仪
    var loadDau = function (site) {
        var data = {
            // pageNumber : 1,
            // pageSize : 16,
            equipmentMap : {
                equipmentName : site
            }
        };
        $.ajax({
            url: 'http://192.168.1.127:8092/v01/htwl/lxh/water/query',
            // url: 'http://172.21.92.63:8092/v01/htwl/lxh/water/query',
            headers: {
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: data,
        })
    }
    var obj = {
        chart : chart,
        loadMSData : loadMSData,
        loadChartForSite : loadChartForSite
    };
    /*输出内容，注意顺序*/
    exports('waterQualitySiteMng',obj)
})