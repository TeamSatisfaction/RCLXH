/**
 * Created by M4 on 2017/7/5.
 */
layui.define(['layer', 'element', 'layedit','form'], function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var $ = layui.jquery,
        form = layui.form();
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
        layui.mapUtils.addPoint( new esri.geometry.Point(105.5779702660,29.4048578414, new esri.SpatialReference(4326)), "monistation", false, "123")
    }

    function btnClick() {
        layui.mapUtils.addRandomPoint();
    }

    function loadPage(url) {
        window.parent.layui.index.loadPage(url)
    }
    
    function statsSearch() {

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
    var loadChartForSite = function(code,Fname,Cname,mn){
        var websocket = null;
        //判断当前浏览器是否支持WebSocket
        if('WebSocket' in window){
            websocket = new WebSocket("ws://192.168.30.238:8095/websocket");
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
            if(obj.mn == mn){
                var dataAreas = [],
                    dataAreas = obj.dataAreas;
                for(var i in dataAreas){
                    if(dataAreas[i].xcode == code){
                        // drawLine(Fname,Cname,dataAreas[i].xrtd);
                    }
                }
            }
        }
    };
    /*曲线图*/
    function drawLine(Fname,Cname,data) {
        $('.mapStats_statsTitle').html(Cname);
        var option = {
            chart: {
                type: 'spline',
                backgroundColor: 'rgba(0,0,0,0)'
            },
            title: {
                // text: Fname
                text: "1"
            },
            // subtitle: {
            //     text: Fname,
            //     x: 20
            // },
            // xAxis: {
            //     categories : []
            //     ,labels : {
            //         style : {
            //             color: '#000000'
            //         }
            //     }
            // },
            tooltip: {
                valueSuffix: 'mg/L'
            },
            yAxis: {
                title: {
                    text: '',
                    style : {
                        color: '#000000'
                    }
                },
                labels : {
                    style : {
                        color: '#000000'
                    }
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
                enabled: false
            },
            series: [{
                // name: Fname,
                name: "1",
                data: []
            }]
        };
        var chart = new Highcharts.chart('mapStats_Line', option);
        var date = new Date();
        var seperator2 = ":";
        // var x =date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        // var newPoint = {
        //     x: x,
        //     y: data
        // };
        var newPoint = {
            x: date.getSeconds(),
            y: 62
        };
        var i = 0;
        $('#button').click(function () {
            console.log(newPoint);
            // 第三个参数表示是否删除第一个点
            chart.series[0].addPoint(newPoint, true, false);
            i += 1;
        });
        // chart.series[0].addPoint(newPoint,true,false);
    }
    // setInterval(function(){drawLine()}, 30000)
    drawLine();

    /*新报警提示*/
    // function showNotification() {
    //     $(".notification").slideDown();
    // }
    // function closeNotification() {
    //     $(".notification").slideUp();
    // }
    // setInterval('layui.map.showNotification()', 5000);

    //企业select
    function loadCompanySelect() {
        var data = {
            pageNum : 1,
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
                var list = result.data.list;
                $("#c_select").empty();
                if(list == null){
                    $("#c_select").append("<option value='' selected='selected'>无企业</option>");
                }else {
                    for(var i in list){
                        $("#c_select").append("<option value="+list[i].baseEnterpriseId+">"+list[i].name+"</option>");
                    }
                }
                form.render('select');
                loadDauSelect(list[0].baseEnterpriseId,list[0].name);
            }
        })
    };
    //根据企业查询数采仪
    function loadDauSelect(Cid,Cname){
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
            success: function (result){
                var row = result.data.rows;
                $("#d_select ").empty();
                if(row == null){
                    $("#d_select").append("<option value='' selected='selected'>无数采仪</option>");
                    $("#e_select").empty();
                    $("#e_select").append("<option value='' selected='selected'>无设备</option>");
                    $("#f_select").empty();
                    $("#f_select").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    // $("#d_select").append("<option value='' selected='selected'>选择数采仪</option>");
                    for(var i in row){
                        $("#d_select").append("<option value="+row[i].id+">"+row[i].aname+"</option>");
                    }
                }
                form.render('select');
                loadEquipment(row[0].id,Cname,row[0].mn);
            }
        })
    };
    //根据数采仪查询设备
    var loadEquipment = function (Did,Cname,mn) {
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
                    for(var i in row){
                        $("#e_select").append("<option value="+row[i].id+">"+row[i].equipmentName+"</option>");
                    }
                }
                form.render('select');
                loadFactorSelect(row[0].id,Cname,mn);
            }
        })
    };
    //根据设备查询因子select
    function loadFactorSelect(Fid,Cname,mn) {
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
                // console.log(result);
                var row = result.data.rows;
                $("#f_select").empty();
                if(row == null){
                    $("#f_select").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    // $("#f_select").append("<option value='' selected='selected'>监测因子</option>");
                    for(var i in row){
                        $("#f_select").append("<option value="+row[i].factorCode+">"+row[i].factorName+"</option>");
                    }
                }
                form.render('select');
                loadChartForSite(row[0].factorCode,row[0].factorName,Cname,mn)
            }
        })
    }
    //企业select change事件
    form.on('select(c_select)', function(data){
        loadDauSelect(data.value);
    });
    //数采仪select change事件
    form.on('select(d_select)', function(data){
        loadEquipment(data.value);
    });
    //设备select change事件
    form.on('select(e_select)', function(data){
        loadFactorSelect(data.value);
    });
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
                str = '<tr><td>六价铬</td><td></td><td>'+result.e207I+'</td></tr>' +
                    '<tr><td>COD</td><td></td><td>'+result.e202B+'</td></tr>' +
                    '<tr><td>氨氮</td><td></td><td>'+result.e203F+'</td></tr>' +
                    '<tr><td>总镍</td><td></td><td>'+result.e208J+'</td></tr>' +
                    '<tr><td>PH</td><td></td><td>'+result.e206C+'</td></tr>' +
                    '<tr><td>高锰酸盐</td><td></td><td>'+result.e211M+'</td></tr>' +
                    '<tr><td>水温</td><td></td><td>'+result.e210L+'</td></tr>';
                m_tobody.html(str);
            }
        })
    };

    //输出test接口
    exports('map', {
        btnClick : btnClick,
        loadPage: loadPage,
        close: close,
        // showNotification:showNotification,
        // closeNotification:closeNotification,
        loadChartForSite : loadChartForSite,
        loadCompanySelect : loadCompanySelect,
        loadDauSelect:loadDauSelect,
        loadFactorSelect : loadFactorSelect,
        loadMonthlydata : loadMonthlydata
    });

});