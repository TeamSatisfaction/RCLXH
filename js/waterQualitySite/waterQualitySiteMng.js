layui.define(['layer', 'element','layedit', 'laydate','form'],function (exports){
    var $ = layui.jquery,
        laydate = layui.laydate,
        form = layui.form(),
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
    // var chart = new Highcharts.Chart('container', {
    //     title: {
    //         text: '监测站名称',
    //         x: -20
    //     },
    //     // subtitle: {
    //     //     text: '设备1',
    //     //     x: -20
    //     // },
    //     xAxis: {
    //         categories: []
    //     },
    //     yAxis: {
    //         title: {
    //             text: '含量 (mg/L)'
    //         },
    //         plotLines: [{
    //             value: 0,
    //             width: 1,
    //             color: '#808080'
    //         }]
    //     },
    //     tooltip: {
    //         valueSuffix: 'mg/L'
    //     },
    //     legend: {
    //         layout: 'vertical',
    //         align: 'right',
    //         verticalAlign: 'middle',
    //         borderWidth: 0
    //     },
    //     series: [{
    //         name: '总磷',
    //         data: []
    //     }]
    // });
    var loadChartsData = function (id) {
        var cn = '2011',
            // enterpriseId = id,
            // factor = $('#select_factor').val(),
            // beginDate =  $('#startTime1').val(),
            // endDate = $('#endTime1').val();
            enterpriseId = '402880935cf2264b015d064a7c180024',
            factor = 'ez63a01',
            beginDate =  '2017-05-12 00:00:00',
            endDate = '2017-05-12 23:59:59';
        console.log(enterpriseId,factor,beginDate,endDate);
        var data = {
            enterpriseId : enterpriseId,
            factor : factor,
            beginDate : beginDate,
            endDate : endDate,
            cn : cn
        };
        $.ajax({
            url : 'http://192.168.1.127:8092/v01/htwl/lxh/online',
            type : 'get',
            data : data,
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            success : function (result){
                console.log(result);
                // var data = result.onlineTime;
                var factorCode = result.onlineData.data[0].factorCode,
                    onlineTime = result.onlineTime.slice(-13,-1),
                    onlineData = result.onlineData.data[0].online.slice(-13,-1);
                console.log(data);
                loadaCharts(onlineTime,onlineData,factorCode,name)
            }
        })
    };
    var loadaCharts = function (onlineTime,onlineData,factorCode,name) {
        var option = {
            // chart: {
            // },
            title: {
                text: '重庆恒科机械制造有限公司'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                }
            },
            tooltip: {
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                }
            },
            yAxis: {
                title: {enabled: false},
                min: 0
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: factorCode,
                data: onlineData
            }]
        };
        Highcharts.chart('container', option);
    }
    var loadMSData = function (curr){
        var data = {
            // enterpriseRole : "monitoringStation_enterprise",
            pageNum : curr||1,
            pageSize : 1000
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: 'http://192.168.1.127:8092/v01/htwl/lxh/enterprise/page',
            // url: 'http://172.21.92.63:8092/v01/htwl/lxh/water/query',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result) {
                var msData = result.data.list,
                    pages = result.data.pages,
                    str = "",
                    nums = 1000; //每页出现的数据量
                var render = function(msData, curr) {
                    var arr = []
                        , thisData = msData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr data-item = "'+item.baseEnterpriseId+'" onclick="layui.waterQualitySiteMng.loadChartForSite(this)">' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.name + '</td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                msTobody.html(render(msData, obj.curr));
                loadDau(msData[2].baseEnterpriseId);
                loadChartsData(msData[2].baseEnterpriseId);
            }
        })
    };
    var loadChartForSite = function (e) {
        var id = $(e).attr('data-item');
        loadDau(id);
        loadChartsData(id);
    };
    //根据企业查询数采仪
    var loadDau = function (id) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            dauMap : {
                epId : id
            }
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: 'http://192.168.1.127:8092/v01/htwl/lxh/jcsjgz/dau/query/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result){
                var row = result.data.rows,
                    str = '';
                $("#select_dauId ").empty();
                if(row == null){
                    $("#select_dauId").append("<option value='' selected='selected'>无采集仪</option>");
                    $("#select_equipment").empty();
                    $("#select_equipment").append("<option value='' selected='selected'>无设备</option>");
                    $("#select_factor").empty();
                    $("#select_factor").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in row){
                        $("#select_dauId").append("<option value="+row[i].id+">"+row[i].aname+"</option>");
                    }
                    loadEquipment(row[0].id);
                }
                form.render('select');
            }
        })
    };
    //根据数采仪查询设备
    var loadEquipment = function (id) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            equipmentMap : {
                dauId : id
            }
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: 'http://192.168.1.127:8092/v01/htwl/lxh/jcsjgz/equipment/query/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result){
                var row = result.data.rows;
                $("#select_equipment").empty();
                if(row == null){
                    $("#select_equipment").append("<option value='' selected='selected'>无设备</option>");
                    $("#select_factor").empty();
                    $("#select_factor").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in row){
                        $("#select_equipment").append("<option value="+row[i].id+">"+row[i].equipmentName+"</option>");
                    }
                    loadFactor(row[0].id);
                }
                form.render('select');
            }
        })
    };
    //根据设备查询因子
    var loadFactor = function (id) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            factorMap : {
                equipmentId : id
            }
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: 'http://192.168.1.127:8092/v01/htwl/lxh/jcsjgz/factor/query/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result){
                // console.log(result);
                var row = result.data.rows;
                $("#select_factor").empty();
                if(row == null){
                    $("#select_factor").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in row){
                        $("#select_factor").append("<option value="+row[i].factorCode+">"+row[i].factorName+"</option>");
                    }
                }
                form.render('select');
            }
        })
    }
    var obj = {
        // chart : chart,
        loadMSData : loadMSData,
        loadChartForSite : loadChartForSite
    };
    /*输出内容，注意顺序*/
    exports('waterQualitySiteMng',obj)
})