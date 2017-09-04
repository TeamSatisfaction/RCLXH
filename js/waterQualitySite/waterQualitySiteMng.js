layui.define(['layer', 'element','layedit','form'],function (exports){
    var $ = layui.jquery,
        form = layui.form(),
        element = layui.element(),
        msTobody = $('#water_list'),
        chart,
        needRefresh = true,
        code,
        Fname,
        Cname,
        mn;
    var urlConfig = sessionStorage.getItem("urlConfig");
    //监测详情数据
    var loadChartsData = function () {
        var websocket = null;
        //判断当前浏览器是否支持WebSocket
        if('WebSocket' in window){
            websocket = new WebSocket("ws://192.168.30.238:8095/websocket");
            // websocket = new WebSocket("ws://127.0.0.1:8095/websocket");
        }
        else{
            alert('Not support websocket')
        }
        //连接发生错误的回调方法
        websocket.onerror = function(){
            setMessageInnerHTML("error");
        };
        //连接成功建立的回调方法
        websocket.onopen = function(event){
            setMessageInnerHTML("open");
        }
        //接收到消息的回调方法
        websocket.onmessage = function(event){
            setMessageInnerHTML(event.data);
        }
        //连接关闭的回调方法
        websocket.onclose = function(){
            setMessageInnerHTML("close");
        }
        //将消息显示在网页上
        function setMessageInnerHTML(innerHTML){
            var obj = JSON.parse(innerHTML);
            console.log(mn,code);
            if(obj.mn == mn){
                var dataAreas = [],
                    dataAreas = obj.dataAreas;
                for(var i in dataAreas){
                    if(dataAreas[i].xcode == code){
                        drawLine(dataAreas[i].xrtd);
                    }
                }
            }
        }
    };
    function drawLine(data) {
        console.log(Fname,Cname)
        var date = new Date();
        var seperator2 = ":";
        var x =date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        console.log(date,data);
        var newPoint = {
            x: date,
            y: data
        };
        // 第三个参数表示是否删除第一个点
        var seriesData = chart.series[0].data;
        if(seriesData.length < 12){
            chart.series[0].addPoint(newPoint, true, false);
        }else {
            chart.series[0].addPoint(newPoint, true, true);
        }
    }
    var searchCharts = function () {
        if(needRefresh || !chart){
            loadaCharts();
            needRefresh = false;
        }
        Fname =  $("#select_factor").text(),
        code = $("#select_factor").val(),
        mn =  $("#d_option")[0].getAttribute('data-mn');
        console.log(mn)
    };
    //监测详情曲线图
    var loadaCharts = function () {
        console.log(Fname,Cname)
        var option = {
            chart: {
                type : 'line'
            },
            title: {
                text: Cname
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%H:%M:%S'
                },
                labels : {
                    formatter : function () {
                        return layui.utils.dateFormat('HH:mm:ss',new Date(this.value))
                    }
                }
            },
            // tooltip: {
            //     valueSuffix: 'mg/L'
            // },
            yAxis: {
                title: {
                    text: 'mg/L'
                },
                plotLines: [{
                    value: 6.9,
                    dashStyle:'ShortDash',
                    width: 3,
                    color: 'red',
                    label: {
                        text: '报警值',
                        align: 'center',
                        style: {
                            color: 'gray'
                        }
                    }
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: Fname,
                data: [],
                marker: {
                    enabled: true
                }
            }]
        };
        chart = new Highcharts.chart('wqs_tab1_chart', option);
    };
    //小时charts
    var loadaSCharts = function () {
        var option = {
            chart: {
                type : 'line'
            },
            title: {
                text: '濑溪河流域水质自动监测站'
            },
            xAxis: {
                categories : ["12:00:00","13:00:00","14:00:00","15:00:00","16:00:00","17:00:00"]
            },
            tooltip: {
                valueSuffix: 'mg/L'
            },
            yAxis: {
                title: {
                    text: 'mg/L'
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
                data: [512,476,525,523,485,498]
            }]
        };
        Highcharts.chart('wqs_tab1_chart', option);
    };
    //日charts
    var loadaRCharts = function () {
        var option = {
            chart: {
                type : 'line'
            },
            title: {
                text: '濑溪河流域水质自动监测站'
            },
            xAxis: {
                categories : ["2017-08-17","2017-08-18","2017-08-19","2017-08-20","2017-08-21","2017-08-22"]
            },
            tooltip: {
                valueSuffix: 'mg/L'
            },
            yAxis: {
                title: {
                    text: 'mg/L'
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
                data: [4235,4352,4245,4485,4652,4253,4152]
            }]
        };
        Highcharts.chart('wqs_tab1_chart', option);
    };
    //监测站list
    var loadMSData = function (curr,cn){
        switch (cn){
            case "实时监测数据":
                cn = '2011'
                break;
            case "小时监测数据":
                cn = '2061'
                break;
            case "日监测数据":
                cn = '2041'
                break;
        }
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
                console.log(msData);
                var render = function(msData, curr) {
                    var arr = []
                        , thisData = msData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<div class="layui-colla-item">' +
                            '<h2 class="layui-colla-title list-title" data-id="'+item.baseEnterpriseId+'" data-name = "'+item.name+'" onclick="layui.waterQualitySiteMng.loadChartForSite(this,'+cn+')">' +
                            ' <span>'+(index+1)+'</span>'+
                            '<span>' + item.name + '</span></h2>' +
                            '<div class="layui-colla-content"> ' +
                            '<span>所属流域：xxxx流域<br>断面水质：Ⅲ类<br>地理位置：'+item.address+''+
                            '</span></div>'+
                            '</div>'
                        arr.push(str);
                    });
                    return arr.join('');
                };
                msTobody.html(render(msData, obj.curr));
                element.init();
                loadDau(msData[0].baseEnterpriseId,cn,msData[0].name);
                Cname = msData[0].name;
                // loadChartsData(cn,msData[0].name);
            }
        })
    };
    var loadChartForSite = function (e,cn) {
        var Eid = $(e).attr('data-id');
        Cname = $(e).attr('data-name');
        loadDau(Eid,cn);
        searchCharts();
    };
    //根据企业查询数采仪
    var loadDau = function (Eid,cn) {
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
                    $("#container").html('<h1 style="text-align: center">'+name+'</h1><span>无相关监测因子</span>');
                }else{
                    for(var i in row){
                        $("#select_dauId").append("<option id='d_option' data-mn="+row[i].mn+" value="+row[i].id+">"+row[i].aname+"</option>");
                    }
                    loadEquipment(row[0].id,cn,Eid);
                    mn = row[0].mn;
                }
                form.render('select');
            }
        })
    };
    //根据数采仪查询设备
    var loadEquipment = function (id,cn,Eid) {
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
                    loadFactor(row[0].id,cn,Eid);
                }
                form.render('select');
            }
        })
    };
    //根据设备查询因子
    var loadFactor = function (id,cn,Eid) {
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
                    $("#wqs_tab1_chart").empty();
                    $("#wqs_tab1_chart").html('<span>无相关监测因子</span>');
                }else{
                    for(var i in row){
                        $("#select_factor").append("<option value="+row[i].factorCode+">"+row[i].factorName+"</option>");
                    }
                }
                form.render('select');
                code=row[0].factorCode;
                Fname=row[0].factorName;
                needRefresh = true;
                // var text = $("#select_factor").find("option:selected").text();
                // loadChartsData(cn,name,Eid);
                loadaCharts();
            }
        })
    };
    //数采仪select change事件
    form.on('select(select_dauId)', function(data){
        loadEquipment(data.value);
    });
    //设备select change事件
    form.on('select(select_equipment)', function(data){
        loadFactor(data.value);
    });
    //日报
    var dailyWin = function () {
        var win= layer.open({
            type: 2
            ,title: '日报'
            ,content : '../../pages/waterQualitySite/dailyWin.html'
            ,btn: ['返回']
            ,btnAlign: 'c'
            ,success : function (index, layero) {

            }
        });
        layer.full(win);
    }
    var obj = {
        loadChartsData : loadChartsData,
        searchCharts : searchCharts,
        loadaCharts : loadaCharts,
        loadMSData : loadMSData,
        loadChartForSite : loadChartForSite,
        dailyWin : dailyWin,
        loadaSCharts : loadaSCharts,
        loadaRCharts : loadaRCharts
    };
    /*输出内容，注意顺序*/
    exports('waterQualitySiteMng',obj)
})