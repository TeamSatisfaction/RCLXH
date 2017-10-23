/**
 * Created by M4 on 2017/7/5.
 */
layui.define(['layer', 'element', 'layedit','form'], function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var $ = layui.jquery,
        form = layui.form(),
        chart,
        needRefresh = true,
        code,
        Fname,
        Cid,
        Cname,
        mn;
    var urlConfig = sessionStorage.getItem("urlConfig");
    layui.link('../../css/style.css');
    /*加载JS模块*/
    layui.extend({ //设定模块别名
        mapUtils : 'map/mapUtils'
    });
    /*要USE*/
    /*USE完以后才能调用, 模块的初始化方法都放在这里的function里面*/
    layui.use([
        'mapUtils'
    ],function () {
        pageInit();
    });

    function pageInit() {
        // layui.mapUtils.addPoint( new esri.geometry.Point(105.5779702660,29.4048578414, new esri.SpatialReference(4326)), "monistation", false, "123")
    }

    function btnClick() {
        layui.mapUtils.addRandomPoint();
    }

    function loadPage(url) {
        window.parent.layui.index.loadPage(url)
    }

    function close() {
        // $(".mapStats").animate({left:-560},300)
        $(".mapStats").find(".layui-tab-content").slideToggle();
        $(".mapStats_close").toggleClass("rotate");
    }

    /*滚动报警信息*/
    function alarmNewsScroll() {
        var ul_container = $(".mapStats_alarmNews"),
            ul = ul_container.find("ul"),
            li = ul.find("li"),
            num = li.length,
            height = 25,
            offsetHeight = 0;

        setInterval(function () {
            offsetHeight += height*3;
            if(offsetHeight >= num*height){
                offsetHeight = 0;
            }
            ul.animate({marginTop: (0-offsetHeight)+'px'});
        }, 2000)
    };
    alarmNewsScroll();

    /*3D饼图*/
    function draw3dPie(chartId) {
        var option = {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 60,
                    beta: 0
                },
                backgroundColor: 'rgba(0,0,0,0)'
            },
            credits: {enabled: false},
            title: {text: '2017年6月地表水统计情况'},
            tooltip: {pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'},
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 20,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    },
                    size: '200%'
                }
            },
            series: [{
                type: 'pie',
                name: '水质级别占比',
                data: [
                    ['Ⅰ类',   45.0],
                    ['Ⅱ类',   26.8],
                    ['Ⅲ类',   26.8],
                    ['Ⅳ类',   8.5],
                    ['Ⅴ类',   6.2],
                    ['Ⅵ类',   0.7]
                ]
            }]
        };
        Highcharts.chart('mapStats_3dPie', option);
    }
    draw3dPie();
    //请求实时数据
    var loadChartForSite = function(){
        var websocket = null;
        //判断当前浏览器是否支持WebSocket
        if('WebSocket' in window){
            // websocket = new WebSocket("ws://172.16.1.102:8095/websocket");
            websocket = new WebSocket("ws://113.204.228.66:8095/websocket");
            // websocket = new WebSocket("ws://172.16.1.10:8095/websocket");
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
            if(obj.mn == mn&&obj.xcode == code){
                if(code == "ez52Z01"){
                    console.log(obj)
                    drawLine(obj.xcum);
                }else {
                    console.log(obj)
                    drawLine(obj.xrtd);
                }
            }
        }
    };
    //转换时间格式
    function changeTime(date) {
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1,
            strDate = date.getDate(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        var time = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + minutes
            + seperator2 + seconds;
        return time;
    }
    //加载曲线图
    function initChart(){
        var date = new Date();//当前时间
        var interTimes = 5*60*1000;
        interTimes=parseInt(interTimes);
        var date1 = new Date(Date.parse(date)-interTimes);//提前5min时间
        var beginDate = changeTime(date1);
        var endDate = changeTime(date);
        var data = {
            beginDate : beginDate,
            endDate : endDate,
            enterpriseId  : Cid,
            factor : code,
            cn : 2011
        };
        var unit;
        switch (Fname){
            case "COD" :
                unit = "mg/L";
                break;
            case "总磷" :
                unit = "mg/L";
                break;
            case "高锰酸盐" :
                unit = "mg/L";
                break;
            case "氨氮" :
                unit = "mg/L";
                break;
            case "生物毒性" :
                unit = "%";
                break;
            case "温度" :
                unit = "℃";
                break;
            case "浊度" :
                unit = "FNU";
                break;
            case "电导率" :
                unit = "us/cm";
                break;
            case "溶解氧" :
                unit = "mg/L";
                break;
        };
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/online',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'get',
            data: data,
            success: function (result) {
                var arr = [],
                    i;
                if(result.onlineData != null){
                    var time = result.onlineTime,
                        onlineData = result.onlineData.data[0].online;
                    for(i=0;i<time.length;i++){
                        arr.push([
                            time[i],
                            onlineData[i]
                        ])
                    }
                }
                var option = {
                    chart: {
                        type: 'spline',
                        backgroundColor: 'rgba(0,0,0,0)'
                    },
                    title: {
                        text: Fname
                    },
                    credits : {
                        enabled: false
                    },
                    xAxis: {
                        type: 'category',
                        dateTimeLabelFormats: {
                            day: '%H:%M:%S'
                        },
                        labels : {
                            formatter : function () {
                                return layui.utils.dateFormat('HH:mm:ss',new Date(this.value))
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: unit,
                            style : {
                                color: '#000000'
                            }
                        },
                        labels : {
                            style : {
                                color: '#000000'
                            }
                        },
                        minTickInterval : 0.1
                        // ,plotLines: [{
                        //     value: 26.6,
                        //     dashStyle:'ShortDash',
                        //     width: 3,
                        //     color: 'red',
                        //     label: {
                        //         text: '阈值',
                        //         align: 'center',
                        //         style: {
                        //             color: 'gray'
                        //         }
                        //     }
                        // }]
                    },
                    tooltip: {
                        valueSuffix: unit
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: Fname,
                        data: arr,
                        marker: {
                            enabled: true
                        }
                    }]
                };
                chart = new Highcharts.chart('mapStats_Line', option);
            }
        })
    }
    /*曲线图-添加实时点位*/
    function drawLine(data) {
        var date = new Date();
        var time = changeTime(date);
        var newPoint = [
            time, data
        ];
        // 第三个参数表示是否删除第一个点
        var seriesData = chart.series[0].data;
        if(seriesData.length < 12){
            chart.series[0].addPoint(newPoint, true, false);
        }else {
            chart.series[0].addPoint(newPoint, true, true);
        }
    }

    /*新报警提示*/
    function showNotification() {
        $(".notification").slideDown();
        setTimeout('layui.map.closeNotification()', 20000)
    }
    function closeNotification() {
        $(".notification").slideUp();
    }
    setInterval('layui.map.showNotification()', 10000);

    //企业select
    function loadCompanySelect() {
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/enterprise/all',
            headers: {
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'get',
            success: function (result) {
                console.log(result)
                $("#c_select").empty();
                if(result == null){
                    $("#c_select").append("<option value='' selected='selected'>无企业</option>");
                }else {
                    for(var i in result){
                        if(result[i].mn){
                            $("#c_select").append("<option value="+result[i].base_enterprise_id+">"+result[i].name+"</option>");
                        }
                    }
                }
                form.render('select');
                loadDauSelect(result[0].base_enterprise_id,result[0].name);
                Cname = result[0].name;
                Cid = result[0].base_enterprise_id;
                $('.mapStats_statsTitle').html(Cname);
            }
        })
    };
    //根据企业查询数采仪
    function loadDauSelect(Cid){
        Cname = $("#c_select").find("option:selected").text();
        $('.mapStats_statsTitle').html(Cname);
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            dauMap : {
                epId : Cid
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
            success: function (result) {
                // console.log(result)
                if(result.data){
                    var row = result.data.rows;
                    $("#d_select ").empty();
                    if (row == null) {
                        $("#d_select").append("<option value='' selected='selected'>无数采仪</option>");
                        $("#e_select").empty();
                        $("#e_select").append("<option value='' selected='selected'>无设备</option>");
                        $("#f_select").empty();
                        $("#f_select").append("<option value='' selected='selected'>无监测因子</option>");
                        code = '';
                        Fname = '无监测因子';
                        mn = '';
                        initChart();
                    } else {
                        // $("#d_select").append("<option value='' selected='selected'>选择数采仪</option>");
                        for (var i in row) {
                            $("#d_select").append("<option id='d_option' data-mn=" + row[i].mn + " value=" + row[i].id + ">" + row[i].aname + "</option>");
                        }
                        mn = row[0].mn;
                        loadEquipment(row[0].id, mn);
                    }
                    form.render('select');
                }else{
                    $("#d_select ").empty();
                    $("#d_select").append("<option value='' selected='selected'>无数采仪</option>");
                    $("#e_select").empty();
                    $("#e_select").append("<option value='' selected='selected'>无设备</option>");
                    $("#f_select").empty();
                    $("#f_select").append("<option value='' selected='selected'>无监测因子</option>");
                    code = '';
                    Fname = '无监测因子';
                    mn = '';
                    initChart();
                    form.render('select');
                }
            }
        })
    };
    //根据数采仪查询设备
    var loadEquipment = function (Did) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            equipmentMap : {
                dauId : Did
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
                $("#e_select").empty();
                if(row == null){
                    $("#e_select").append("<option value='' selected='selected'>无设备</option>");
                    $("#f_select").empty();
                    $("#f_select").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    var arry = [];
                    for(var i in row){
                        if(row[i].eaOrEb == 'EB'){
                            $("#e_select").append("<option value="+row[i].id+">"+row[i].equipmentName+"</option>");
                            arry.push(row[i].id);
                        }
                    }
                    if(arry.length>0){
                        loadFactorSelect(arry[0]);
                    }else{
                        $("#e_select").append("<option value='' selected='selected'>无设备</option>");
                        $("#f_select").empty();
                        $("#f_select").append("<option value='' selected='selected'>无监测因子</option>");
                    }

                }
                form.render('select');
            }
        })
    };
    //根据设备查询因子select
    function loadFactorSelect(Fid) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            factorMap : {
                equipmentId : Fid
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
                $("#f_select").empty();
                if(row == null){
                    $("#f_select").append("<option value='' selected='selected'>无监测因子</option>");
                    Fname = '无监测因子';
                }else{
                    for(var i in row){
                        $("#f_select").append("<option value="+row[i].factorCode+">"+row[i].factorName+"</option>");
                    }
                    code=row[0].factorCode;
                    Fname=row[0].factorName;
                }
                form.render('select');
                needRefresh = true;
                initChart();
            }
        })
    };
    //企业select change事件
    form.on('select(c_select)', function(data){
        Cid = data.value;
        loadDauSelect(Cid);
    });
    //数采仪select change事件
    form.on('select(d_select)', function(data){
        loadEquipment(data.value);
    });
    //设备select change事件
    form.on('select(e_select)', function(data){
        // var Fid = data.value;
        loadFactorSelect(data.value);
        // var data1 = {
        //     pageNumber : 1,
        //     pageSize : 1000,
        //     factorMap : {
        //         equipmentId : Fid
        //     }
        // };
        // var field = JSON.stringify(data1);
        // $.ajax({
        //     url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/factor/query/page',
        //     headers: {
        //         'Content-type': 'application/json;charset=UTF-8',
        //         Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
        //     },
        //     type: 'post',
        //     data: field,
        //     success: function (result){
        //         var row = result.data.rows;
        //         $("#f_select").empty();
        //         if(row == null){
        //             $("#f_select").append("<option value='' selected='selected'>无监测因子</option>");
        //             Fname = '无监测因子';
        //         }else{
        //             for(var i in row){
        //                 $("#f_select").append("<option value="+row[i].factorCode+">"+row[i].factorName+"</option>");
        //             }
        //             code=row[0].factorCode;
        //             Fname=row[0].factorName;
        //         }
        //         form.render('select');
        //         needRefresh = true;
        //         initChart();
        //     }
        // })
    });
    //报警信息
    function loadAlardata() {
        var data = {
            pageNo : 1,
            pageSize : 10000
        };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/query',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            data : data,
            success : function (result){
                console.log(result);
            }
        })
    }
    //环境统计list
    function loadMonthlydata() {
        var myDate = new Date(),
            year = myDate.getFullYear(),
            currMonth = myDate.getMonth(), //获取当前月份(0-11,0代表1月)
            currQuarter = Math.floor( ( currMonth % 3 == 0 ? ( currMonth / 3 ) : ( currMonth / 3 + 1 ) ) ),
            beginDate = '',
            endDate = '';
        switch (currQuarter){
            case 1:
                beginDate = year+'-01-01 00:00:00',
                endDate = year+'-03-31 23:59:59'
                break;
            case 2:
                beginDate = year+'-04-01 00:00:00',
                endDate = year+'-06-30 23:59:59'
                break;
            case 3:
                beginDate = year+'-07-01 00:00:00',
                endDate = year+'-09-30 23:59:59'
                break;
            case 4:
                beginDate = year+'-10-01 00:00:00',
                endDate = year+'-12-31 23:59:59'
                break;
        }
        var data = {
            beginDate : beginDate,
            endDate : endDate
        };
        var str = '';
        var m_tobody = $('#monthly_result');
        var m_title = $('#m_title');
        m_title.html('2017年荣昌区濑溪河流域第'+currQuarter+'季度环境统计数据');
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/online/monthly',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            data : data,
            success : function (result){
                if(result.resultdesc == "暂时没有mn企业"){
                    result.e207I = 0;
                    result.e202B = 0;
                    result.e203F = 0;
                    result.e208J = 0;
                    result.e206C = 0;
                    result.e211M = 0;
                    result.e210L = 0;
                }
                str = '<tr><td>六价铬</td><td>mg/L</td><td>'+result.e207I+'</td></tr>' +
                    '<tr><td>COD</td><td>mg/L</td><td>'+result.e202B+'</td></tr>' +
                    '<tr><td>氨氮</td><td>mg/L</td><td>'+result.e203F+'</td></tr>' +
                    '<tr><td>总镍</td><td>mg/L</td><td>'+result.e208J+'</td></tr>' +
                    '<tr><td>PH</td><td>PH</td><td>'+result.e206C+'</td></tr>' +
                    '<tr><td>高锰酸盐</td><td>mg/L</td><td>'+result.e211M+'</td></tr>' +
                    '<tr><td>水温</td><td>℃</td><td>'+result.e210L+'</td></tr>';
                m_tobody.html(str);
            }
        })
    };
    var loadAlarmData = function () {
        var data1 = {
            alarmType : 'detection_alarm',
            pageNo : 1,
            pageSize : 9999
        };
        var data2 = {
            alarmType : 'working_alarm',
            pageNo : 1,
            pageSize : 9999
        };
        var data3 = {
            alarmType : 'video_alarm',
            pageNo : 1,
            pageSize : 9999
        };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/query',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            data : data1,
            success : function (result) {
                console.log(result);
                var data = result.list;
                console.log(data.length);
                var str = '<span>'+data[0].alarmTime+'</span>' +
                    '<span>'+data[0].enterpriseName+'</span>' +
                    '<span>'+data[0].remark+'</span>' ;
                $("#alarm-list1").html(str);
                $('#detection_alarm_num').html(data.length);
            }
        })
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/query',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            data : data2,
            success : function (result) {
                console.log(result);
                var data = result.list;
                console.log(data.length);
                if(data.length > 1){
                    var str = '<span>'+data[0].alarmTime+'</span>' +
                        '<span>'+data[0].enterpriseName+'</span>' +
                        '<span>'+data[0].remark+'</span>' ;
                    $("#alarm-list2").html(str);
                }
                $('#working_alarm_num').html(data.length);
            }
        })
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/alrm/query',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            data : data3,
            success : function (result) {
                console.log(result);
                var data = result.list;
                console.log(data.length);
                if(data.length > 1){
                    var str = '<span>'+data[0].alarmTime+'</span>' +
                        '<span>'+data[0].enterpriseName+'</span>' +
                        '<span>'+data[0].remark+'</span>' ;
                    $("#alarm-list3").html(str);
                }
                $('#video_alarm_num').html(data.length);
            }
        })
    };
    //输出test接口
    exports('map', {
        btnClick : btnClick,
        loadPage: loadPage,
        close: close,
        showNotification:showNotification,
        closeNotification:closeNotification,
        // searchCharts : searchCharts,
        loadChartForSite : loadChartForSite,
        loadCompanySelect : loadCompanySelect,
        loadDauSelect:loadDauSelect,
        loadFactorSelect : loadFactorSelect,
        loadAlardata : loadAlardata,
        loadMonthlydata : loadMonthlydata,
        loadAlarmData : loadAlarmData
    });

});