layui.define(['layer', 'element','laypage','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form(),
        chart,
        needRefresh = true,
        code,
        Fname,
        Cid,
        cn ='2011',
        mn;
    var urlConfig = sessionStorage.getItem("urlConfig");
    //载入污染源信息
    var loadData = function(){
        var id = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
        Cid = id;
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                var data = result.data;
                var qyImg =data.attachments;
                switch (data.controlLevel){
                    case "area_control":
                        data.controlLevel = '区(县)控';
                        break;
                    case "country_control":
                        data.controlLevel = '国控';
                        break;
                }
                $.each(data,function(key,value){
                    var formField = $("input[name='"+key+"']");
                    formField.val(value);
                });
                if(qyImg.length>0){
                    //企业照片
                    var qyPhotos = "";
                    for(var i in qyImg){
                        qyPhotos += "<div class='silder-main-img lay-img'> <img src='"+ qyImg[i].attachmentAddress +"' style='width: 600px;height: 400px'> </div>"
                    }
                    $(".silder-main").html(qyPhotos);
                    //图片点击
                    layer.photos({
                        photos: '.lay-img'
                        ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                    });

                    $(".js-silder").silder({
                        auto: true,//自动播放，传入任何可以转化为true的值都会自动轮播
                        speed: 20,//轮播图运动速度
                        sideCtrl: true,//是否需要侧边控制按钮
                        bottomCtrl: true,//是否需要底部控制按钮
                        defaultView: 0,//默认显示的索引
                        interval: 3000,//自动轮播的时间，以毫秒为单位，默认3000毫秒
                        activeClass: "active"//小的控制按钮激活的样式，不包括作用两边，默认active
                    });
                }else{
                    var str = '<p style="text-align: center">未上传企业照片</p>';
                    $(".silder-main").html(str);
                }
            }
        })
        loadDau(id);
    };
    //请求许可证基本信息
    var loadLicenseData = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/license/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                var data = result.data[0];
                if(data){
                    $("input[name='licenseCode']").val(data.licenseCode);
                    $("input[name='beginDate']").val(data.beginDate);
                    $("input[name='endDate']").val(data.endDate);
                    $("input[name='maxiMum']").val(data.maxiMum);
                    $("input[name='gross']").val(data.gross);
                    $("input[name='licenceType']").val(data.licenceType);
                    $("input[name='id']").val(data.id);
                    if(data.pic.length == 0){
                        var str1 = '<span>未上传正本</span>';
                        $('#zhengben').html(str1);
                        var str2 = '<span>未上传副本</span>';
                        $('#fuben').html(str2);
                    }
                    if(data.pic[1].attachmentAddress!='null'){
                        $("#pdv_pk").find(".layui-tab-item").eq(0).find("img").attr("src", data.pic[1].attachmentAddress);
                    }else{
                        var str = '<span>未上传正本</span>';
                        $('#zhengben').html(str);
                    }
                    if(data.pic[0].attachmentAddress != 'null'){
                        $("#pdv_pk").find(".layui-tab-item").eq(1).find("img").attr("src", data.pic[0].attachmentAddress);
                    }else{
                        var str = '<span>未上传副本</span>';
                        $('#fuben').html(str);
                    }
                }
            }
        })
    };
    //请求排口信息
    var loadPortData = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/discharge/port/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                var render = function(result) {
                    var arr = [],
                        str = '';
                    layui.each(result, function(index, item){
                        str = '<tr>' +
                            '<td>' + item.pageNumber + '</td>' +
                            '<td>' + item.dischargePortCode + '</td>' +
                            '<td>' + item.dischargePortName + '</td>' +
                            '<td>' + item.mode + '</td>' +
                            '<td>' + item.whereabouts + '</td>' +
                            '<td>' + item.emissionAmount + '</td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                $("#dis-port-list").html(render(result));
            }
        })
    };
    //请求实时数据
    var loadChartForSite = function(){
        var websocket = null;
        //判断当前浏览器是否支持WebSocket
        if('WebSocket' in window){
            // websocket = new WebSocket("ws://172.16.1.102:8095/websocket");
            // websocket = new WebSocket("ws://172.21.92.170:8095/websocket");
            websocket = new WebSocket("ws://172.16.1.10:8095:8095/websocket");
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
                if(code == "ez52Z01"||code == "ez52Z02"){
                    drawLine(obj.xcum);
                }else {
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
    };
    function changeChart(e) {
        switch (e){
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
        initChart();
    }
    //加载曲线图
    function initChart(){
        var date = new Date(),//当前时间
            interTimes;
        switch (cn){
            case "2011" :
                interTimes = 5*60*1000;//5min
                break;
            case "2061" :
                interTimes = 10*60*60*1000;//10h
                break;
            case "2041" :
                interTimes = 10*24*60*60*1000;//10d
                break;
        };
        interTimes=parseInt(interTimes);
        var date1 = new Date(Date.parse(date)-interTimes);
        var beginDate = changeTime(date1);
        var endDate = changeTime(date);
        var data = {
            beginDate : beginDate,
            endDate : endDate,
            enterpriseId  : Cid,
            factor : code,
            cn : cn
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
                if(result.onlineTime){
                    var time = result.onlineTime,
                        onlineData = result.onlineData.data[0].online;
                    for(i=0;i<time.length;i++){
                        arr.push([
                            time[i],
                            onlineData[i]
                        ])
                    }
                    // console.log(arr);
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
                        minTickInterval : 0.1
                        // ,plotLines: [{
                        //     value: 60,
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
                chart = new Highcharts.chart('com_chart2', option);
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
            url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/dau/query/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result){
                if(result.data){
                    var row = result.data.rows;
                    $("#select_dau").empty();
                    if(!row){
                        $("#select_dau").append("<option value='无采集仪' selected='selected'>无采集仪</option>");
                        $("#select_equip").empty().append("<option value='无采集仪' selected='selected'>无设备</option>");
                        $("#select_fac").empty().append("<option value='无采集仪' selected='selected'>无监测因子</option>");
                        $("#com_chart1").empty().html('<span>无相关监测因子</span>');
                    }else{
                        for(var i in row){
                            $("#select_dau").append("<option id='d_option1' data-mn="+row[i].mn+" value="+row[i].id+">"+row[i].aname+"</option>");
                        }
                    }
                    form.render('select');
                    mn = row[0].mn;
                    loadEquipment(row[0].id);
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
                $("#select_equip").empty();
                if(row == null){
                    $("#select_equip").append("<option value='' selected='selected'>无设备</option>");
                    $("#select_fac").empty();
                    $("#select_fac").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in row){
                        $("#select_equip").append("<option value="+row[i].id+">"+row[i].equipmentName+"</option>");
                    }
                }
                // $('#select_equip').find('option').eq(6).attr('selected', true)
                form.render('select');
                loadFactorSelect(row[0].id);
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
                // console.log(row);
                $("#select_fac").empty();
                if(row == null){
                    $("#select_fac").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in row){
                        $("#select_fac").append("<option value="+row[i].factorCode+">"+row[i].factorName+"</option>");
                    }
                }
                form.render('select');
                code=row[0].factorCode;
                Fname=row[0].factorName;
                needRefresh = true;
                initChart();
            }
        })
    };
    //数采仪select change事件
    form.on('select(select_dau)', function(data){
        loadEquipment(data.value);
    });
    //设备select change事件
    form.on('select(select_equip)', function(data){
        loadFactorSelect(data.value);
    });
    //因子select change事件
    form.on('select(select_fac)', function(data){
        console.log(data);
    });
    layer.ready(function(){
        var id = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
        console.log(id);
        $.ajax({
            url : '../../data/equipmentData.json',
            success: function (result){
                $('.pin').easypinShow({
                    data : result,
                    popover: {
                        show: true,
                        animate: true
                    }
                });
            }
        })
    });
    /*输出内容，注意顺序*/
    var obj = {
        loadData : loadData,
        loadLicenseData : loadLicenseData,
        loadPortData : loadPortData,
        loadChartForSite : loadChartForSite,
        changeChart : changeChart
    };
    exports('pollutionDataMng',obj)
})