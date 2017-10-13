layui.define(['layer', 'element','laypage','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form(),
        chart,
        needRefresh = true,
        code,
        Fname,
        Cid,
        mn;
    var urlConfig = sessionStorage.getItem("urlConfig");

    // //获取企业基本信息
    // var loadData = function () {
    //     Cid = $(window.parent.document).find('.layui-layer-content').attr('id');
    //     $.ajax({
    //         url: '' + urlConfig + '/v01/htwl/lxh/enterprise/'+Cid+'',
    //         headers: {
    //             Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
    //         },
    //         type: 'get',
    //         success: function (result) {
    //             // console.log(result);
    //             // var data = result.data;
    //             var data = {
    //                 "name":"重庆江特表面处理有限公司",
    //                 "legalRepresentative":"徐开贵",
    //                 "head":"朱洪刚",
    //                 "headPhone":"13983201027",
    //                 "orgCode":"500226000006773",
    //                 "controlLevel":"区控",
    //                 "envHead":"朱洪刚",
    //                 "envHeadPhone":"13983201027",
    //                 "buildStatusName":"已建成",
    //                 "运行状态":"正常运行",
    //                 "设计处理量":"2000",
    //                 "实际处理量":"4600",
    //                 "行业类别":"污水处理厂",
    //                 "建设目标":"-",
    //                 "lon":"-",
    //                 "lat":"-",
    //                 "address":"重庆市荣昌区板桥工业园",
    //                 "排污许可证信息":{
    //                     "许可证类型":"-",
    //                     "许可证性质":"-",
    //                     "许可证编号":"渝（荣）环排证【2016】0134号",
    //                     "许可证状态":"正常",
    //                     "起始时间":"2016-09-20",
    //                     "截至时间":"2019-09-19",
    //                     "发证日期":"-",
    //                     "办理人":"-",
    //                     "正本":"../../img/data/003.png",
    //                     "副本":"../../img/data/004.png",
    //                     "排口列表":[{
    //                         "排口附页编号":"10124441",
    //                         "排污口编码":"22240004",
    //                         "排污口名称":"外排口1",
    //                         "排放方式":"连续稳定",
    //                         "排放去向":"濑溪河",
    //                         "年排放总量":"1014吨",
    //                         "OBJECTID":"1"
    //                     },{
    //                         "排口附页编号":"10124442",
    //                         "排污口编码":"22240004",
    //                         "排污口名称":"外排口1",
    //                         "排放方式":"连续稳定",
    //                         "排放去向":"濑溪河",
    //                         "年排放总量":"800吨",
    //                         "OBJECTID":"2"
    //                     }]
    //                 },
    //                 "企业处理工艺":[{
    //                     "url":"../../img/data/005.png",
    //                     "name":"工艺流程图"
    //                 },{
    //                     "url":"../../img/data/005.png",
    //                     "name":"工艺流程图A"
    //                 }],
    //                 "qyphoto":[{
    //                     "url":"../../img/data/002.png"
    //                 },{
    //                     "url":"../../img/data/001.png"
    //                 }]
    //             };
    //             var companyDataDiv = $(".company-online-monitor").find(".layui-tab-item").eq(0);
    //             companyDataDiv.find("input[name='qymc']").val(data.name);
    //             companyDataDiv.find("input[name='frdb']").val(data.legalRepresentative);
    //             companyDataDiv.find("input[name='qyfzr']").val(data.head);
    //             companyDataDiv.find("input[name='fzrdh']").val(data.headPhone);
    //             companyDataDiv.find("input[name='zzjgdm']").val(data.orgCode);
    //             companyDataDiv.find("input[name='gkjb']").val(data.controlLevel);
    //             companyDataDiv.find("input[name='lxr']").val(data.envHead);
    //             companyDataDiv.find("input[name='lxrdh']").val(data.envHeadPhone);
    //             companyDataDiv.find("input[name='jszt']").val(data.buildStatusName);
    //             companyDataDiv.find("input[name='yxzt']").val(data.运行状态);
    //             companyDataDiv.find("input[name='shejicll']").val(data.设计处理量);
    //             companyDataDiv.find("input[name='shijicll']").val(data.实际处理量);
    //             companyDataDiv.find("input[name='hylb']").val(data.行业类别);
    //             companyDataDiv.find("input[name='jsmb']").val(data.建设目标);
    //             companyDataDiv.find("input[name='jd']").val(data.lon);
    //             companyDataDiv.find("input[name='wd']").val(data.lat);
    //             companyDataDiv.find("input[name='dz']").val(data.address);
    //             companyDataDiv.find("input[name='xkzlx']").val(data.排污许可证信息.许可证类型);
    //             companyDataDiv.find("input[name='xkzxz']").val(data.排污许可证信息.许可证性质);
    //             companyDataDiv.find("input[name='xkzbh']").val(data.排污许可证信息.许可证编号);
    //             companyDataDiv.find("input[name='xkzzt']").val(data.排污许可证信息.许可证状态);
    //             companyDataDiv.find("input[name='xkzqssj']").val(data.排污许可证信息.起始时间);
    //             companyDataDiv.find("input[name='xkzjzsj']").val(data.排污许可证信息.截至时间);
    //             companyDataDiv.find("input[name='xkzfzrq']").val(data.排污许可证信息.发证日期);
    //             companyDataDiv.find("input[name='xkzblr']").val(data.排污许可证信息.办理人);
    //             companyDataDiv.find("#pdv_pk").find(".layui-tab-item").eq(0).find("img").attr("src", data.排污许可证信息.正本);
    //             companyDataDiv.find("#pdv_pk").find(".layui-tab-item").eq(1).find("img").attr("src", data.排污许可证信息.副本);
    //             //排口列表
    //             var pklist = "";
    //             for(var i in data.排污许可证信息.排口列表){
    //                 pklist+="<tr>"+
    //                     "<td>"+data.排污许可证信息.排口列表[i].排口附页编号+"</td>"+
    //                     "<td>"+data.排污许可证信息.排口列表[i].排污口编码+"</td>"+
    //                     "<td>"+data.排污许可证信息.排口列表[i].排污口名称+"</td>"+
    //                     "<td>"+data.排污许可证信息.排口列表[i].排放方式+"</td>"+
    //                     "<td>"+data.排污许可证信息.排口列表[i].排放去向+"</td>"+
    //                     "<td>"+data.排污许可证信息.排口列表[i].年排放总量+"</td>"+
    //                     "<td> <i class='layui-icon' style='font-size: 20px;' onclick='layui.companyMng.lookPk("+data.排污许可证信息.排口列表[i].OBJECTID+");'>&#xe60a;</i></td>"+
    //                     "</tr>"
    //             }
    //             companyDataDiv.find("#pdv_pk").find(".layui-tab-item").eq(2).find("tbody").html(pklist);
    //             //企业处理工艺
    //             var clgylist = "";
    //             for(var i in data.企业处理工艺){
    //                 clgylist += "<div class='thumb lay-img' style=''> " +
    //                     "<img src='"+ data.企业处理工艺[i].url +"' " +
    //                     "style=''> " +
    //                     "<div>"+ data.企业处理工艺[i].name +"</div> </div>"
    //             }
    //             companyDataDiv.find(".clgy_photos").find(".thumbs").html(clgylist);
    //             //企业照片
    //             var qyPhotos = "";
    //             for(var i in data.qyphoto){
    //                 qyPhotos += "<div class='silder-main-img lay-img'> <img src='"+ data.qyphoto[i].url +"' style='width: 600px;height: 400px'> </div>"
    //             }
    //             companyDataDiv.find(".silder-main").html(qyPhotos);
    //             //图片点击
    //             layer.photos({
    //                 photos: '.lay-img'
    //                 ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
    //             });
    //
    //             $(".js-silder").silder({
    //                 auto: true,//自动播放，传入任何可以转化为true的值都会自动轮播
    //                 speed: 20,//轮播图运动速度
    //                 sideCtrl: true,//是否需要侧边控制按钮
    //                 bottomCtrl: true,//是否需要底部控制按钮
    //                 defaultView: 0,//默认显示的索引
    //                 interval: 3000,//自动轮播的时间，以毫秒为单位，默认3000毫秒
    //                 activeClass: "active"//小的控制按钮激活的样式，不包括作用两边，默认active
    //             });
    //         }
    //     });
    //     loadDau(Cid);
    // };
    //请求企业基本信息
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
                switch (data.controlLevel){
                    case "area_control":
                        data.controlLevel = '区(县)控'
                        break;
                }
                var qyImg = [{
                        "url":"../../img/data/002.png"
                    },{
                        "url":"../../img/data/001.png"
                    }],
                    zhengben = '../../img/data/003.png',
                    fuben = '../../img/data/004.png';
                //企业基本信息
                var companyDataDiv = $(".company-online-monitor").find(".layui-tab-item").eq(0);
                companyDataDiv.find("input[name='name']").val(data.name);
                companyDataDiv.find("input[name='legalRepresentative']").val(data.legalRepresentative);
                companyDataDiv.find("input[name='head']").val(data.head);
                companyDataDiv.find("input[name='headPhone']").val(data.headPhone);
                companyDataDiv.find("input[name='orgCode']").val(data.orgCode);
                companyDataDiv.find("input[name='controlLevel']").val(data.controlLevel);
                companyDataDiv.find("input[name='envHead']").val(data.envHead);
                companyDataDiv.find("input[name='envHeadPhone']").val(data.envHeadPhone);
                companyDataDiv.find("input[name='buildStatusName']").val(data.buildStatusName);
                companyDataDiv.find("input[name='processing']").val(data.processing);
                companyDataDiv.find("input[name='riverBasin']").val(data.riverBasin);
                companyDataDiv.find("input[name='lon']").val(data.lon);
                companyDataDiv.find("input[name='lat']").val(data.lat);
                companyDataDiv.find("input[name='expectDate']").val(data.expectDate);
                companyDataDiv.find("input[name='address']").val(data.address);
                $("#pdv_pk").find(".layui-tab-item").eq(0).find("img").attr("src", zhengben);
                $("#pdv_pk").find(".layui-tab-item").eq(1).find("img").attr("src", fuben);
                //企业照片
                var qyPhotos = "";
                for(var i in qyImg){
                    qyPhotos += "<div class='silder-main-img lay-img'> <img src='"+ qyImg[i].url +"' style='width: 600px;height: 400px'> </div>"
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
    /*输出内容，注意顺序*/
    var obj = {
        loadData : loadData,
        loadLicenseData : loadLicenseData,
        loadPortData : loadPortData,
        loadChartForSite : loadChartForSite
    };
    exports('pollutionDataMng',obj)
})