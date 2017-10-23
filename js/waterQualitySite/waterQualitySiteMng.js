layui.define(['layer', 'element','layedit','form'],function (exports){
    var $ = layui.jquery,
        form = layui.form(),
        element = layui.element(),
        msTobody = $('#water_list'),
        chart,
        needRefresh = true,
        code,
        Fname,
        Cid,
        Cname,
        mn,
        cn;
    var urlConfig = sessionStorage.getItem("urlConfig");
    //监测详情数据
    var loadChartsData = function () {
        var websocket = null;
        //判断当前浏览器是否支持WebSocket
        if('WebSocket' in window){
            // websocket = new WebSocket("ws://172.16.1.10:8095/websocket");
            websocket = new WebSocket("ws://113.204.228.66:8095/websocket");
            // websocket = new WebSocket("ws://172.21.92.170:8095/websocket");
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
                drawLine(obj.xrtd);
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
    /*曲线图-添加实时点位*/
    function drawLine(data) {
        var date = new Date();
        var time = changeTime(date);
        var newPoint = [
            time, data
        ];
        // 第三个参数表示是否删除第一个点
        if(chart){
            var seriesData = chart.series[0].data;
            if(seriesData.length < 12){
                chart.series[0].addPoint(newPoint, true, false);
            }else {
                chart.series[0].addPoint(newPoint, true, true);
            }
        }
    }
    //加载曲线图
    var loadaCharts = function(){
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
                    if(cn == '2011'){
                    if(result.onlineTime){
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
                    chart = new Highcharts.chart('wqs_tab1_chart', option);
                }else{
                    console.log(result);
                    if(result.onlineData.data[0].online){
                        var data = result.onlineData.data[0].online;
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
                                categories : result.onlineTime
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
                                data: data
                            }]
                        };
                        Highcharts.chart('wqs_tab1_chart', option);
                    }
                }
            }
        })
    };
    //监测站list
    var loadMSData = function (curr,title){
        switch (title){
            case "实时监测数据":
                title = '2011'
                break;
            case "小时监测数据":
                title = '2061'
                break;
            case "日监测数据":
                title = '2041'
                break;
        }
        cn = title;
        var data = {
            enterpriseRole : 'monitoringStation_enterprise',//监测站
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
                        str = '<div class="layui-colla-item">' +
                            '<h2 class="layui-colla-title list-title" data-id="'+item.baseEnterpriseId+'" data-name = "'+item.name+'" onclick="layui.waterQualitySiteMng.loadChartForSite(this,'+cn+')">' +
                            ' <span>'+(index+1)+'</span>'+
                            '<span>' + item.name + '</span></h2>' +
                            '<div class="layui-colla-content"> ' +
                            '<span>所属流域：濑溪河流域<br>断面水质：Ⅲ类<br>地理位置：'+item.address+''+
                            '</span></div>'+
                            '</div>'
                        arr.push(str);
                    });
                    return arr.join('');
                };
                msTobody.html(render(msData, obj.curr));
                element.init();
                Cid = msData[0].baseEnterpriseId;
                Cname = msData[0].name;
                loadDau();
                $('.wqs_tab1_statsTitle').html(Cname);
                loadfactordetailss();
            }
        })
    };
    var loadChartForSite = function (e) {
        Cid = $(e).attr('data-id');
        Cname = $(e).attr('data-name');
        $('.wqs_tab1_statsTitle').html(Cname);
        Fname='无监测因子';
        loadDau();
    };
    //根据企业查询数采仪
    var loadDau = function () {
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
                $("#select_dauId ").empty();
                console.log(row)
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
                        console.log(row[i].aname);
                        $("#select_dauId").append("<option id='d_option' data-mn="+row[i].mn+" value="+row[i].id+">"+row[i].aname+"</option>");
                    }
                    loadEquipment(row[0].id);
                    mn = row[0].mn;
                }
                form.render('select');
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
                    code=row[0].factorCode;
                    Fname=row[0].factorName;
                    loadaCharts();
                }
                form.render('select');
                needRefresh = true;
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
    };
    //详情
    var detailsWin = function () {
        console.log(cn)
        var title,
            url;
        switch (cn){
            case "2011":
                title = '实时监测'
                break;
            case "2061":
                title = '日监测'
                break;
            case "2041":
                title = '月监测'
                break;
        }
        if(cn == '2011'){
            url = '../../pages/publicMng/factorDetails.html'
        }else if(cn == '2061'){
            url = '../../pages/publicMng/factorDayDetails.html'
        }else if(cn == '2041'){
            url = '../../pages/publicMng/factorMonthDetails.html'
        }
        var win= layer.open({
            type: 2
            ,id : Cid
            ,title: title+'详情'
            ,content : url
            ,btn: ['返回']
            ,btnAlign: 'c'
            ,zIndex : 1000
        });
        layer.full(win);
    };
    var loadfactordetailss = function () {
        var title = $("#getType").find("li.layui-this")[0].innerHTML;
        $("#head1").empty();
        $("#head2").empty();
        console.log($("#head1"))
        if(title == '实时监测数据') {
            console.log(Cid)
            var date = new Date(),//当前时间
                interTimes = 10 * 60 * 1000;
            interTimes = parseInt(interTimes);
            var date1 = new Date(Date.parse(date) - interTimes);
            var beginDate = changeTime(date1);
            var endDate = changeTime(date);
            var cn = "2011";
            $("#dayDetails").hide();
            $("#monthDetails").hide();
            var colsNum1 = $("#head1");
            var headstr = '<th rowspan="2">序号</th> <th rowspan="2">时间</th>';
            colsNum1.append(headstr);
        }else if(title == '小时监测数据'){
            var date = $('input[name=beginDate1]').val();
            var beginDate = date + ' 00:00:00',
                endDate = date + ' 24:00:00';
            var cn = "2061";
            $("#dayDetails").show();
            $("#monthDetails").hide();
            var colsNum1 = $("#head1");
            var headstr = '<th rowspan="2">序号</th> <th rowspan="2">时间</th>';
            colsNum1.append(headstr);
        }else if(title == '日监测数据'){
            var date = $('input[name=beginDate2]').val();
            var year = date.split("-");
            var beginDate = date + '-01',
                endDate = date + '-'+new Date(year[0],year[1],0).getDate();
            var cn = "2041";
            $("#monthDetails").show();
            $("#dayDetails").hide();
            var colsNum1 = $("#head1");
            var headstr = '<th rowspan="2">序号</th> <th rowspan="2">时间</th>';
            colsNum1.append(headstr);
        }
        var data = {
            enterpriseId : Cid,
            cn : cn,
            beginDate : beginDate,
            endDate : endDate
            // beginDate : '2017-10-14 09:40:00',
            // endDate : '2017-10-14 10:00:00'
        };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/online/monitor',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
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
                // var headstr = '<th rowspan="2">序号</th> <th rowspan="2">时间</th>';
                // colsNum1.append(headstr);
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
                            item.factorName = "浊度(FNU)";
                            break;
                        case "PH" :
                            item.factorName = "PH(无量纲)";
                            break;
                        case "电导率" :
                            item.factorName = "电导率(μS/cm)";
                            break;
                        case "溶解氧" :
                            item.factorName = "溶解氧(NTU)";
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
        // var data = {
        //     enterpriseId : Cid,
        //     cn : cn,
        //     beginDate : beginDate,
        //     endDate : endDate
        //     // beginDate : '2017-10-14 09:40:00',
        //     // endDate : '2017-10-14 10:00:00'
        // };
        // $.ajax({
        //     url :''+urlConfig+'/v01/htwl/lxh/online/monitor',
        //     headers : {
        //         Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
        //     },
        //     type : 'get',
        //     data : data,
        //     success : function (result){
        //         var head1,
        //             head2,
        //             str = '';
        //         var colsNum1 = $("#head1");
        //         var colsNum2 = $("#head2");
        //         var tbodyData = {};
        //         layui.each(result,function (index,item){
        //             switch (item.factorName){
        //                 case "COD" :
        //                     item.factorName = "COD(mg/L)";
        //                     break;
        //                 case "总磷" :
        //                     item.factorName = "总磷(mg/L)";
        //                     break;
        //                 case "高锰酸盐" :
        //                     item.factorName = "高锰酸盐(mg/L)";
        //                     break;
        //                 case "氨氮" :
        //                     item.factorName = "氨氮(mg/L)";
        //                     break;
        //                 case "生物毒性" :
        //                     item.factorName = "生物毒性(%)";
        //                     break;
        //                 case "温度" :
        //                     item.factorName = "温度(℃)";
        //                     break;
        //                 case "浊度" :
        //                     item.factorName = "浊度(FNU)";
        //                     break;
        //                 case "电导率" :
        //                     item.factorName = "电导率(us/cm)";
        //                     break;
        //                 case "PH" :
        //                     item.factorName = "PH(无量纲)";
        //                     break;
        //                 case "溶解氧" :
        //                     item.factorName = "溶解氧(mg/L)";
        //                     break;
        //             };
        //             head1 = '<th colspan="2" data-code="'+item.factorCode+'">'+item.factorName+'</th>';
        //             colsNum1.append(head1);
        //             head2 = '<th>实测值</th>'+
        //                 '<th>阈值</th>';
        //             colsNum2.append(head2);
        //             //onlineData 整理数据
        //             layui.each(item.onlineData,function (dataIndex,dataItem){
        //                 if(!tbodyData.hasOwnProperty(dataItem.dataTime)){   //如果没有该时间则新增字段
        //                     tbodyData[dataItem.dataTime] = [];
        //                 }
        //                 if(item.oneThreshold){                              //放阈值
        //                     var comparison = (item.oneConditionsName === "大于"?"≤":(item.oneConditionsName === "小于"?"≥":"="));   //阈值1
        //                     var comparisonAlt = (item.oneConditionsName === "大于"?">":(item.oneConditionsName === "小于"?"<":"==")); //阈值1判断符
        //                     var comparison1 = item.twoThreshold?(item.twoConditionsName === "大于"?"≤":(item.twoConditionsName === "小于"?"≥":"=")):null; //阈值2
        //                     var comparison1Alt = item.twoThreshold?(item.twoConditionsName === "大于"?">":(item.twoConditionsName === "小于"?"<":"==")):null;//阈值2判断符
        //
        //                     var isOver = eval(dataItem.val+comparisonAlt+item.oneThreshold+(comparison1Alt?('||'+dataItem.val+comparison1Alt+item.twoThreshold):''));//判断是否超出阈值
        //                     tbodyData[dataItem.dataTime].push(isOver?('<font color="red">'+dataItem.val+'</font>'):dataItem.val);    //放value
        //                     tbodyData[dataItem.dataTime].push(comparison + item.oneThreshold + (comparison1?('或'+comparison1+item.twoThreshold):''));
        //                 }else {
        //                     tbodyData[dataItem.dataTime].push(dataItem.val);    //放value
        //                     tbodyData[dataItem.dataTime].push('-');        //没有阈值，放null占格子
        //                 }
        //             });
        //         });
        //         var i = 1;
        //         for(var dataTime in tbodyData){
        //             var ta = dataTime.split(''),    //可以用正则代替，我不会
        //                 time = ta[0]+ta[1]+ta[2]+ta[3]+'-'+ta[4]+ta[5]+'-'+ta[6]+ta[7]+' '+ta[8]+ta[9]+':'+ta[10]+ta[11]+':'+ta[12]+ta[13];
        //             str += '<tr>' + '<td>'+i+'</td>';                               //序号
        //             str += '<td style="white-space: nowrap">'+time+'</td>';         //时间
        //             for( var j = 0; j < tbodyData[dataTime].length; j++){           //因子
        //                 str += '<td>'+tbodyData[dataTime][j]+'</td>';
        //             }
        //             str += '</tr>';
        //             i++;    //序号增加
        //         }
        //         $('#jiance-list').html(str);
        //     }
        // })
    };
    //当前时间
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var dealTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    //初始化时间1
    var setTime1 = function () {
        var eTime =  date.getFullYear() + seperator1 + month + seperator1 + strDate;
        $('input[name=beginDate1]').val(eTime);
        var eTime1 =  date.getFullYear() + seperator1 + month;
        $('input[name=beginDate2]').val(eTime1);
        // loadfactordetailss()
    };
    //初始化时间2
    // var setTime2 = function () {
    //     var eTime =  date.getFullYear() + seperator1 + month;
    //     $('input[name=beginDate2').val(eTime);
    //     loadfactordetailss()
    // };
    var obj = {
        loadChartsData : loadChartsData,
        loadaCharts : loadaCharts,
        loadMSData : loadMSData,
        loadChartForSite : loadChartForSite,
        dailyWin : dailyWin,
        detailsWin : detailsWin,
        loadfactordetailss : loadfactordetailss,
        setTime1 : setTime1
        // setTime2 : setTime2
    };
    /*输出内容，注意顺序*/
    exports('waterQualitySiteMng',obj)
})