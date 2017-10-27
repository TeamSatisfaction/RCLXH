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
    var Authorization = sessionStorage.getItem("Authorization");
    //遮罩
    function ityzl_SHOW_LOAD_LAYER(){
        return layer.msg('加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false,offset: '0px', time:100000}) ;
    }
    //载入污染源信息
    var loadData = function(){
        var id = $(window.parent.document).find('.layui-layer-content').attr('id'),//企业id
            i;
        Cid = id;
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/'+id+'',
            headers : {
                Authorization:Authorization
            },
            type : 'get',
            beforeSend: function () {
                i = ityzl_SHOW_LOAD_LAYER();
            },
            success : function (result) {
                layer.close(i);
                layer.msg('加载完成！',{time: 1000,offset: '10px'});
                var data = result.data;
                var qyImg =data.attachments;
                switch (data.controlLevel){
                    case "area_control":
                        data.controlLevel = '区(县)控';
                        break;
                    case "country_control":
                        data.controlLevel = '国控';
                        break;
                    case "city_control":
                        data.controlLevel = '市控';
                        break;
                    case "other_control":
                        data.controlLevel = '其他';
                        break;
                }
                $.each(data,function(key,value){
                    if(key != 'industryCodes'){
                        var formField = $("input[name='"+key+"']");
                        formField.val(value);
                    }
                });
                $("input[name=industryCodes]").val(data.industrys[0].industryName+"-"+data.industrys[0].industryCode);
                if(qyImg.length>0){
                    //企业照片
                    var qyPhotos1 = "",
                        qyPhotos2 = "";
                    for(var i in qyImg){
                        if(qyImg[i].attachmentGroup == "enterprise"){
                            qyPhotos1 += "<div class='silder-main-img lay-img'> <img src='"+ qyImg[i].attachmentAddress +"' style='width: 600px;height: 400px'> </div>";
                        }else if(qyImg[i].attachmentGroup == "equipment"){
                            qyPhotos2 += "<div class='silder-main-img lay-img'> <img src='"+ qyImg[i].attachmentAddress +"' style='width: 600px;height: 400px'> </div>";
                        }
                    }
                    $("#silder1").html(qyPhotos1);
                    $("#silder2").html(qyPhotos2);
                    // $("#silder3").html(qyPhotos2);
                    //图片点击
                    layer.photos({
                        photos: '.lay-img'
                        ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                    });

                    $(".js-silder").silder({
                        auto: false,//自动播放，传入任何可以转化为true的值都会自动轮播
                        speed: 20,//轮播图运动速度
                        sideCtrl: true,//是否需要侧边控制按钮
                        bottomCtrl: true,//是否需要底部控制按钮
                        defaultView: 0,//默认显示的索引
                        interval: 3000,//自动轮播的时间，以毫秒为单位，默认3000毫秒
                        activeClass: "active"//小的控制按钮激活的样式，不包括作用两边，默认active
                    });
                }else{
                    var str = '<p style="text-align: center">未上传企业照片</p>';
                    $("#silder1").html(str);
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
                Authorization:Authorization
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
                    if(data.pic[0].attachmentAddress!='null'){
                        $("#pdv_pk").find(".layui-tab-item").eq(0).find("img").attr("src", data.pic[0].attachmentAddress);
                    }else{
                        var str = '<span>未上传正本</span>';
                        $('#zhengben').html(str);
                    }
                    if(data.pic[1].attachmentAddress != 'null'){
                        $("#pdv_pk").find(".layui-tab-item").eq(1).find("img").attr("src", data.pic[1].attachmentAddress);
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
                Authorization:Authorization
            },
            type : 'get',
            success : function (result){
                console.log(result)
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
    var loadChartForSite = function(idarry,arry){
        // if(arry){
        //     console.log(arry);
        // }
        var websocket = null;
        //判断当前浏览器是否支持WebSocket
        if('WebSocket' in window){
            // websocket = new WebSocket("ws://172.16.1.102:8095/websocket");
            websocket = new WebSocket("ws://113.204.228.66:8095/websocket");
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
            // setMessageInnerHTML("open");
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
            if(arry){
                layui.each(arry,function (index,item) {
                    if(obj.mn == item){
                        loadTechnologyList(obj,idarry);
                    }
                })
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
        loadfactordetailss();
    }
    //加载曲线图
    function initChart(){
        var date = new Date(),//当前时间
            interTimes;
        switch (cn){
            case "2011" :
                interTimes = 5*60*1000;//5min
                $("#chart_title").html("实时监测数据");
                break;
            case "2061" :
                interTimes = 10*60*60*1000;//10h
                $("#chart_title").html("小时监测数据");
                break;
            case "2041" :
                interTimes = 10*24*60*60*1000;//10d
                $("#chart_title").html("日监测数据");
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
               Authorization:Authorization
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
               Authorization:Authorization
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
               Authorization:Authorization
            },
            type: 'post',
            data: field,
            success: function (result){
                var row = result.data.rows,
                    arry = [];
                $("#select_equip").empty();
                if(row == null){
                    $("#select_equip").append("<option value='' selected='selected'>无设备</option>");
                    $("#select_fac").empty();
                    $("#select_fac").append("<option value='' selected='selected'>无监测因子</option>");
                }else{
                    for(var i in row){
                        if(row[i].eaOrEb == "EB"){
                            $("#select_equip").append("<option value="+row[i].id+">"+row[i].equipmentName+"</option>");
                            arry.push(row[i].id);
                        }
                    }
                    if(arry.length>0){
                        loadFactorSelect(arry[0]);
                    }else{
                        $("#select_equip").append("<option value='' selected='selected'>无设备</option>");
                        $("#select_fac").empty();
                        $("#select_fac").append("<option value='' selected='selected'>无监测因子</option>");
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
               Authorization:Authorization
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
    //在线监测
    var loadfactordetailss = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
        // var title = $("#getType").find("li.layui-this");
        console.log(cn)
        $("#head1").empty();
        $("#head2").empty();
        if(cn == '2011') {
            console.log(Cid)
            var date = new Date(),//当前时间
                interTimes = 10 * 60 * 1000;
            interTimes = parseInt(interTimes);
            var date1 = new Date(Date.parse(date) - interTimes);
            var beginDate = changeTime(date1);
            var endDate = changeTime(date);
            $("#dayDetails").hide();
            $("#monthDetails").hide();
            var colsNum1 = $("#head1");
            var headstr = '<th rowspan="2">序号</th> <th rowspan="2">时间</th>';
            colsNum1.append(headstr);
        }else if(cn == '2061'){
            var date = $('input[name=beginDate1]').val();
            var beginDate = date + ' 00:00:00',
                endDate = date + ' 24:00:00';
            $("#dayDetails").show();
            $("#monthDetails").hide();
            var colsNum1 = $("#head1");
            var headstr = '<th rowspan="2">序号</th> <th rowspan="2">时间</th>';
            colsNum1.append(headstr);
        }else if(cn == '2041'){
            var date = $('input[name=beginDate2]').val();
            var year = date.split("-");
            var beginDate = date + '-01',
                endDate = date + '-'+new Date(year[0],year[1],0).getDate();
            $("#monthDetails").show();
            $("#dayDetails").hide();
            var colsNum1 = $("#head1");
            var headstr = '<th rowspan="2">序号</th> <th rowspan="2">时间</th>';
            colsNum1.append(headstr);
        }
        var data = {
            enterpriseId : id,
            cn : cn,
            beginDate : beginDate,
            endDate : endDate
        };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/online/monitor',
            headers : {
                Authorization:Authorization
            },
            type : 'get',
            data : data,
            success : function (result){
                var head1,
                    head2,
                    str = '';
                var colsNum1 = $("#head1");
                var colsNum2 = $("#head2");
                var tbodyData = {};
                layui.each(result,function (index,item){
                    switch (item.factorName){
                        case "COD" :
                            item.factorName = "COD(mg/L)";
                            break;
                        case "总磷" :
                            item.factorName = "总磷(mg/L)";
                            break;
                        case "高锰酸盐" :
                            item.factorName = "高锰酸盐(mg/L)";
                            break;
                        case "氨氮" :
                            item.factorName = "氨氮(mg/L)";
                            break;
                        case "生物毒性" :
                            item.factorName = "生物毒性(%)";
                            break;
                        case "温度" :
                            item.factorName = "温度(℃)";
                            break;
                        case "浊度" :
                            item.factorName = "浊度(FTU)";
                            break;
                        case "PH" :
                            item.factorName = "PH(无量纲)";
                            break;
                        case "电导率" :
                            item.factorName = "电导率(μS/cm)";
                            break;
                        case "溶解氧" :
                            item.factorName = "溶解氧(mg/L)";
                            break;
                    };
                    head1 = '<th colspan="2" data-code="'+item.factorCode+'">'+item.factorName+'</th>';
                    colsNum1.append(head1);
                    head2 = '<th>实测值</th>'+
                        '<th>阈值</th>';
                    colsNum2.append(head2);
                    //onlineData 整理数据
                    layui.each(item.onlineData,function (dataIndex,dataItem){
                        if(!tbodyData.hasOwnProperty(dataItem.dataTime)){   //如果没有该时间则新增字段
                            tbodyData[dataItem.dataTime] = [];
                        }
                        if(item.oneThreshold){                              //放阈值
                            var comparison = (item.oneConditionsName === "大于"?"≤":(item.oneConditionsName === "小于"?"≥":"="));   //阈值1
                            var comparisonAlt = (item.oneConditionsName === "大于"?">":(item.oneConditionsName === "小于"?"<":"==")); //阈值1判断符
                            var comparison1 = item.twoThreshold?(item.twoConditionsName === "大于"?"≤":(item.twoConditionsName === "小于"?"≥":"=")):null; //阈值2
                            var comparison1Alt = item.twoThreshold?(item.twoConditionsName === "大于"?">":(item.twoConditionsName === "小于"?"<":"==")):null;//阈值2判断符

                            var isOver = eval(dataItem.val+comparisonAlt+item.oneThreshold+(comparison1Alt?('||'+dataItem.val+comparison1Alt+item.twoThreshold):''));//判断是否超出阈值
                            tbodyData[dataItem.dataTime].push(isOver?('<font color="red">'+dataItem.val+'</font>'):dataItem.val);    //放value
                            tbodyData[dataItem.dataTime].push(comparison + item.oneThreshold + (comparison1?('，'+comparison1+item.twoThreshold):''));
                        }else {
                            tbodyData[dataItem.dataTime].push(dataItem.val);    //放value
                            tbodyData[dataItem.dataTime].push('-');        //没有阈值，放null占格子
                        }
                    });
                });
                var i = 1;
                for(var dataTime in tbodyData){
                    var ta = dataTime.split(''),    //可以用正则代替，我不会
                        time = ta[0]+ta[1]+ta[2]+ta[3]+'-'+ta[4]+ta[5]+'-'+ta[6]+ta[7]+' '+ta[8]+ta[9]+':'+ta[10]+ta[11]+':'+ta[12]+ta[13];
                    str += '<tr>' + '<td>'+i+'</td>';                               //序号
                    str += '<td style="white-space: nowrap">'+time+'</td>';         //时间
                    for( var j = 0; j < tbodyData[dataTime].length; j++){           //因子
                        str += '<td>'+tbodyData[dataTime][j]+'</td>';
                    }
                    str += '</tr>';
                    i++;    //序号增加
                }
                $('#jiance-list').html(str);
            }
        })
    };
    layer.ready(function(){
        var id = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
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
               Authorization:Authorization
            },
            type: 'post',
            data: field,
            success: function (result){
                var arry = [],
                    idarry = [];
                if(result.data.rows){
                    var rows = result.data.rows;
                    layui.each(rows,function (index,item) {
                        arry.push(item.mn);
                        idarry.push(item.id);
                    })
                    loadTeList(idarry,arry);
                }
            }
        })
    });
    //设备列表
    var loadTeList = function (idarry,arry) {
        layui.each(idarry,function (index,item) {
            var data = {
                pageNumber : 1,
                pageSize : 1000,
                equipmentMap : {
                    dauId : item
                }
            };
            var field = JSON.stringify(data);
            $.ajax({
                url: '' + urlConfig + '/v01/htwl/lxh/jcsjgz/equipment/query/page',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8',
                   Authorization:Authorization
                },
                type: 'post',
                data: field,
                success: function (result) {
                    var rows1 = result.data.rows,
                        str = "",
                        arry1 = [];
                    layui.each(rows1, function(index,item){
                        if(item.eaOrEb == "EA"){
                            var data = {
                                pageNumber : 1,
                                pageSize : 1000,
                                factorMap : {
                                    equipmentId : item.id
                                }
                            };
                            var field = JSON.stringify(data);
                            $.ajax({
                                url: '' + urlConfig + '/v01/htwl/lxh/jcsjgz/factor/query/page',
                                headers: {
                                    'Content-type': 'application/json;charset=UTF-8',
                                   Authorization:Authorization
                                },
                                type: 'post',
                                data: field,
                                success: function (result) {
                                    var rows2 = result.data.rows;
                                    var code = rows2[0].factorCode.substring(rows2[0].factorCode.length-3);
                                    str += '<tr>' +
                                        '<td>'+item.equipmentName+'</td>' +
                                        '<td>'+code+'</td>' +
                                        '<td>-</td>' +
                                        '<td>-</td>' +
                                        '<td>-</td>' +
                                        '<td>-</td>' +
                                        '<td>-</td>' +
                                        '<td>异常</td>' +
                                        '</tr>';
                                    $("#list1").html(str);
                                }
                            })
                        }
                    });
                    var Prompt = "<span style='color: red'>实时数据加载中。。。。。</span>"
                    $("#Prompt").html(Prompt);
                    loadChartForSite(idarry,arry);
                }
            })
        })
        var id = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
        $.ajax({
            url : '../../data/equipmentData.json',
            success: function (result){
                var data;
                $.each(result,function (index,item) {
                    console.log(id)
                    if(item.id == id){
                        data = item.data;
                        console.log(item)
                        $('#demo_image_1').attr('src',item.img);
                        $('#demo_image_1').attr('width',item.data.demo_image_1.canvas.width);
                        $('#demo_image_1').attr('height',item.data.demo_image_1.canvas.height);
                        $('.pin').easypinShow({
                            data : data,
                            popover: {
                                show: true,
                                animate: true
                            }
                        });
                    }
                });
            }
        })
    };
    var loadTechnologyList = function (obj,idarry) {
        // console.log(obj);
        var Prompt = "<span style='color: green'>数据加载完成！</span>"
        $("#Prompt").html(Prompt);
        var dataTime = obj.dataTime,  //时间
            sensor = obj.sensor, // "72"
            equipmentType = obj.equipmentType+obj.equipmentCode, //"d02"
            xrtd = obj.xrtd, //值
            num,
            cell,
            arry = [];
        var ta = dataTime.split(''),    //可以用正则代替，我不会
            time = ta[0]+ta[1]+ta[2]+ta[3]+'-'+ta[4]+ta[5]+'-'+ta[6]+ta[7]+' '+ta[8]+ta[9]+':'+ta[10]+ta[11]+':'+ta[12]+ta[13];
        var str = "正常运行";
        $("#list1").find("tr").each(function () {
            arry.push($(this).children('td').eq(1).text())
        })
        layui.each(arry,function (index,item) {
            if(equipmentType == item){
                num = index
            }
        })
        switch (sensor){
            case "72":
                cell = 3;
                break;
            case "61":
                cell = 4;
                break;
            case "65":
                cell = 5;
                break;
            case "52":
                cell = 6;
                break;
        }
        if(num&&cell){
            //查询设备
            $("#table1")[0].rows[num].childNodes[2].innerText = time;
            $("#table1")[0].rows[num].childNodes[7].innerText = str;
            $("#table1")[0].rows[num].childNodes[cell].innerText = xrtd;
        }
    };
    /*输出内容，注意顺序*/
    var obj = {
        loadData : loadData,
        loadLicenseData : loadLicenseData,
        loadPortData : loadPortData,
        loadChartForSite : loadChartForSite,
        loadfactordetailss :  loadfactordetailss,
        changeChart : changeChart
    };
    exports('pollutionDataMng',obj)
})