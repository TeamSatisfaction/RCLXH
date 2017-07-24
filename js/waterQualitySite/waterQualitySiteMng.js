layui.define(['layer', 'element','layedit', 'laydate','form'],function (exports){
    var $ = layui.jquery,
        laydate = layui.laydate,
        form = layui.form(),
        msTobody = $('#ms-result1');
    var urlConfig = sessionStorage.getItem("urlConfig");
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
    var loadChartsData = function (id,name) {
        var cn = '2011',
            // enterpriseId = id,
            // factor = $('#select_factor').val(),
            // beginDate =  $('#startTime1').val(),
            // endDate = $('#endTime1').val();
            enterpriseId = '402880935cf2264b015d064a7c180024',
            factor = 'ez63a01',
            text = $("#select_factor").find("option:selected").text(),
            beginDate =  '2017-05-12 00:00:00',
            endDate = '2017-05-12 23:59:59';
        var data = {
            enterpriseId : enterpriseId,
            factor : factor,
            beginDate : beginDate,
            endDate : endDate,
            cn : cn
        };
        $.ajax({
            url : ''+urlConfig+'/v01/htwl/lxh/online',
            type : 'get',
            data : data,
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            success : function (result){
                var factorCode = result.onlineData.data[0].factorCode,
                    onlineTime = result.onlineTime.slice(-13,-1),
                    onlineData = result.onlineData.data[0].online.slice(-13,-1);
                console.log(onlineTime);
                console.log(onlineData);
                loadaCharts(onlineTime,onlineData,factorCode,name,text)
            }
        })
    };
    var loadaCharts = function (onlineTime,onlineData,factorCode,name,text) {
        var option = {
            chart: {
                type : 'line'
            },
            title: {
                text: name
            },
            xAxis: {
                categories : onlineTime
            },
            tooltip: {
                valueSuffix: 'mg/L'
            },
            yAxis: {
                title: {
                    text: 'mg/L'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: text,
                data: onlineData
            }]
        };
        Highcharts.chart('container', option);
    }
    var loadMSData = function (curr){
        var data = {
            // enterpriseRole : 'monitoringStation_enterprise',//监测站
            pageNum : curr||1,
            pageSize : 1000
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/enterprise/page',
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
                        str = '<tr data-id = "'+item.baseEnterpriseId+'" data-name = "'+item.name+'" onclick="layui.waterQualitySiteMng.loadChartForSite(this)">' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.name + '</td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                msTobody.html(render(msData, obj.curr));
                loadDau(msData[0].baseEnterpriseId);
                loadChartsData(msData[0].baseEnterpriseId,msData[0].name);
            }
        })
    };
    var loadChartForSite = function (e) {
        var Eid = $(e).attr('data-id'),
            name = $(e).attr('data-name');
        // var text = $("#select_factor").find("option:selected").text();
        loadDau(Eid,name);
        // loadChartsData(id,name,text);
    };
    //根据企业查询数采仪
    var loadDau = function (Eid,name) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            dauMap : {
                epId : Eid
            }
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/dau/query/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result){
                var row = result.data.rows;
                $("#select_dauId ").empty();
                if(row == null){
                    $("#select_dauId").append("<option value='' selected='selected'>无采集仪</option>");
                    $("#select_equipment").empty();
                    $("#select_equipment").append("<option value='' selected='selected'>无设备</option>");
                    $("#select_factor").empty();
                    $("#select_factor").append("<option value='' selected='selected'>无监测因子</option>");
                    $("#container").empty();
                    $("#container").html('<span>无相关监测因子</span>');
                }else{
                    for(var i in row){
                        $("#select_dauId").append("<option value="+row[i].id+">"+row[i].aname+"</option>");
                    }
                    loadEquipment(row[0].id,Eid,name);
                }
                form.render('select');
            }
        })
    };
    //根据数采仪查询设备
    var loadEquipment = function (id,Eid,name) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            equipmentMap : {
                dauId : id
            }
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/equipment/query/page',
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
                    $("#container").empty();
                    $("#container").html('<span>无相关监测因子</span>');
                }else{
                    for(var i in row){
                        $("#select_equipment").append("<option value="+row[i].id+">"+row[i].equipmentName+"</option>");
                    }
                    loadFactor(row[0].id,Eid,name);
                }
                form.render('select');
            }
        })
    };
    //根据设备查询因子
    var loadFactor = function (id,Eid,name) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            factorMap : {
                equipmentId : id
            }
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/factor/query/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result){
                var row = result.data.rows;
                $("#select_factor").empty();
                if(row == null){
                    $("#select_factor").append("<option value='' selected='selected'>无监测因子</option>");
                    $("#container").empty();
                    $("#container").html('<span>无相关监测因子</span>');
                }else{
                    for(var i in row){
                        $("#select_factor").append("<option value="+row[i].factorCode+">"+row[i].factorName+"</option>");
                    }
                }
                form.render('select');
                // var text = $("#select_factor").find("option:selected").text();
                loadChartsData(Eid,name);
            }
        })
    };
    //数采仪select change事件
    form.on('select(select_dauId)', function(data){
        console.log("1");
        loadEquipment(data.value);
    });
    //设备select change事件
    form.on('select(select_equipment)', function(data){
        console.log("2");
        loadFactor(data.value);
    });
    var obj = {
        // chart : chart,
        loadMSData : loadMSData,
        loadChartForSite : loadChartForSite
    };
    /*输出内容，注意顺序*/
    exports('waterQualitySiteMng',obj)
})