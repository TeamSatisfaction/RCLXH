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
            websocket = new WebSocket("ws://172.16.1.10:8095/websocket");
            // websocket = new WebSocket("ws://113.204.228.66:8095/websocket");
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
        var title;
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
        var win= layer.open({
            type: 2
            ,id : Cid
            ,title: title+'详情'
            ,content : '../../pages/publicMng/factorDetails.html'
            ,btn: ['返回']
            ,btnAlign: 'c'
            ,zIndex : 1000
        });
        layer.full(win);
    };
    var loadfactordetailss = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id'),//企业id
            title =  $(window.parent.document).find('.layui-layer-title').text();
        if(title == '实时监测详情'){
            var date = new Date(),//当前时间
                interTimes = 5*60*1000;
            interTimes=parseInt(interTimes);
            var date1 = new Date(Date.parse(date)-interTimes);
            var beginDate = changeTime(date1);
            var endDate = changeTime(date);
            var data = {
                enterpriseId : id,
                beginDate : beginDate,
                endDate : endDate
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
                        str;
                    var colsNum1 = $("#head1");
                    var colsNum2 = $("#head2");
                    console.log(result)
                    layui.each(result,function (index,item){
                        head1 = '<th colspan="2" data-code="'+item.factorCode+'">'+item.factorName+'</th>';
                        colsNum1.append(head1);
                        head2 = '<th>实测值</th>'+
                            '<th>阈值</th>';
                        colsNum2.append(head2);
                    });
                    // var head1,
                    //     head2,
                    //     str;
                    // var FactorData = result.FactorData,
                    //     onlineData = result.onlineData;
                    // var colsNum1 = $("#head1");
                    // var colsNum2 = $("#head2");
                    // layui.each(FactorData,function (index,item) {
                    //     head1 = '<th colspan="2" data-code="'+item.factorCode+'">'+item.factorName+'</th>';
                    //     colsNum1.append(head1);
                    //     head2 = '<th>实测值</th>'+
                    //             '<th>阈值</th>';
                    //     colsNum2.append(head2);
                    // });
                    // var render = function(onlineData){
                    //     var arr = [];
                    //     layui.each(onlineData,function (index,item) {
                    //         str = '<tr>' +
                    //             '<td>'+(index+1)+'</td>' +
                    //             '<td>'+item.dataTime+'</td>'+
                    //             '<td></td>'+
                    //             '<td></td>'+
                    //             '<td>'+item.ez10L+'</td>'+
                    //             '<td></td>'+
                    //             '<td>'+item.ez12N+'</td>'+
                    //             '<td></td>'+
                    //             '<td>'+item.ez02B+'</td>'+
                    //             '<td></td>'+
                    //             '<td>'+item.ez11M+'</td>'+
                    //             '<td></td>'+
                    //             '<td>'+item.ez03F+'</td>'+
                    //             '<td></td>'+
                    //             '<td>'+item.ez09K+'</td>'+
                    //             '<td></td>'+
                    //             '<td>'+item.ez04G+'</td>'+
                    //             '<td></td>'+
                    //             '<td>'+item.ez06C+'</td>'+
                    //             '<td></td>'+
                    //             '<td>'+item.ez50D+'</td>'+
                    //             '<td></td>'+
                    //             '<td>'+item.ez51E+'</td>'+
                    //             '<td></td>'+
                    //             '</tr>';
                    //         arr.push(str);
                    //     })
                    //     return arr.join('');
                    // }
                    // $("#jiance-list").html(render(onlineData));
                }
            })
        }
    };
    var obj = {
        loadChartsData : loadChartsData,
        // searchCharts : searchCharts,
        loadaCharts : loadaCharts,
        loadMSData : loadMSData,
        loadChartForSite : loadChartForSite,
        dailyWin : dailyWin,
        detailsWin : detailsWin,
        loadfactordetailss : loadfactordetailss
    };
    /*输出内容，注意顺序*/
    exports('waterQualitySiteMng',obj)
})