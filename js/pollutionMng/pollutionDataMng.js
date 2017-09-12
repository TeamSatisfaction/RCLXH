layui.define(['layer', 'element','laypage','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form();
        // cTobody = $('#company-result');
    var urlConfig = sessionStorage.getItem("urlConfig");

    //获取企业基本信息
    var loadData = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id');

        $.ajax({
            url: '' + urlConfig + '/v01/htwl/lxh/enterprise/'+id+'',
            headers: {
                // 'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'get',
            success: function (result) {
                // var data = result.data;
                var data = {
                    "企业名称":"重庆江特表面处理有限公司",
                    "法人代表":"徐开贵",
                    "企业负责人":"朱洪刚",
                    "负责人电话":"13983201027",
                    "组织机构代码":"500226000006773",
                    "管控级别":"区控",
                    "联系人":"朱洪刚",
                    "联系人电话":"13983201027",
                    "建设状态":"已建成",
                    "运行状态":"正常运行",
                    "设计处理量":"2000",
                    "实际处理量":"4600",
                    "行业类别":"污水处理厂",
                    "建设目标":"-",
                    "经度":"-",
                    "纬度":"-",
                    "地址":"重庆市荣昌区板桥工业园",
                    "排污许可证信息":{
                        "许可证类型":"-",
                        "许可证性质":"-",
                        "许可证编号":"渝（荣）环排证【2016】0134号",
                        "许可证状态":"正常",
                        "起始时间":"2016-09-20",
                        "截至时间":"2019-09-19",
                        "发证日期":"-",
                        "办理人":"-",
                        "正本":"../../img/data/003.png",
                        "副本":"../../img/data/004.png",
                        "排口列表":[{
                            "排口附页编号":"10124441",
                            "排污口编码":"22240004",
                            "排污口名称":"外排口1",
                            "排放方式":"连续稳定",
                            "排放去向":"濑溪河",
                            "年排放总量":"1014吨",
                            "OBJECTID":"1"
                        },{
                            "排口附页编号":"10124442",
                            "排污口编码":"22240004",
                            "排污口名称":"外排口1",
                            "排放方式":"连续稳定",
                            "排放去向":"濑溪河",
                            "年排放总量":"800吨",
                            "OBJECTID":"2"
                        }]
                    },
                    "企业处理工艺":[{
                        "url":"../../img/data/005.png",
                        "name":"工艺流程图"
                    },{
                        "url":"../../img/data/005.png",
                        "name":"工艺流程图A"
                    }],
                    "qyphoto":[{
                        "url":"../../img/data/002.png"
                    },{
                        "url":"../../img/data/001.png"
                    }]
                };
                var companyDataDiv = $(".company-online-monitor").find(".layui-tab-item").eq(0);

                companyDataDiv.find("input[name='qymc']").val(data.企业名称);
                companyDataDiv.find("input[name='frdb']").val(data.法人代表);
                companyDataDiv.find("input[name='qyfzr']").val(data.企业负责人);
                companyDataDiv.find("input[name='fzrdh']").val(data.负责人电话);
                companyDataDiv.find("input[name='zzjgdm']").val(data.组织机构代码);
                companyDataDiv.find("input[name='gkjb']").val(data.管控级别);
                companyDataDiv.find("input[name='lxr']").val(data.联系人);
                companyDataDiv.find("input[name='lxrdh']").val(data.联系人电话);
                companyDataDiv.find("input[name='jszt']").val(data.建设状态);
                companyDataDiv.find("input[name='yxzt']").val(data.运行状态);
                companyDataDiv.find("input[name='shejicll']").val(data.设计处理量);
                companyDataDiv.find("input[name='shijicll']").val(data.实际处理量);
                companyDataDiv.find("input[name='hylb']").val(data.行业类别);
                companyDataDiv.find("input[name='jsmb']").val(data.建设目标);
                companyDataDiv.find("input[name='jd']").val(data.经度);
                companyDataDiv.find("input[name='wd']").val(data.纬度);
                companyDataDiv.find("input[name='dz']").val(data.地址);
                companyDataDiv.find("input[name='xkzlx']").val(data.排污许可证信息.许可证类型);
                companyDataDiv.find("input[name='xkzxz']").val(data.排污许可证信息.许可证性质);
                companyDataDiv.find("input[name='xkzbh']").val(data.排污许可证信息.许可证编号);
                companyDataDiv.find("input[name='xkzzt']").val(data.排污许可证信息.许可证状态);
                companyDataDiv.find("input[name='xkzqssj']").val(data.排污许可证信息.起始时间);
                companyDataDiv.find("input[name='xkzjzsj']").val(data.排污许可证信息.截至时间);
                companyDataDiv.find("input[name='xkzfzrq']").val(data.排污许可证信息.发证日期);
                companyDataDiv.find("input[name='xkzblr']").val(data.排污许可证信息.办理人);
                companyDataDiv.find("#pdv_pk").find(".layui-tab-item").eq(0).find("img").attr("src", data.排污许可证信息.正本);
                companyDataDiv.find("#pdv_pk").find(".layui-tab-item").eq(1).find("img").attr("src", data.排污许可证信息.副本);
                //排口列表
                var pklist = "";
                for(var i in data.排污许可证信息.排口列表){
                    pklist+="<tr>"+
                        "<td>"+data.排污许可证信息.排口列表[i].排口附页编号+"</td>"+
                        "<td>"+data.排污许可证信息.排口列表[i].排污口编码+"</td>"+
                        "<td>"+data.排污许可证信息.排口列表[i].排污口名称+"</td>"+
                        "<td>"+data.排污许可证信息.排口列表[i].排放方式+"</td>"+
                        "<td>"+data.排污许可证信息.排口列表[i].排放去向+"</td>"+
                        "<td>"+data.排污许可证信息.排口列表[i].年排放总量+"</td>"+
                        "<td> <i class='layui-icon' style='font-size: 20px;' onclick='layui.companyMng.lookPk("+data.排污许可证信息.排口列表[i].OBJECTID+");'>&#xe60a;</i></td>"+
                        "</tr>"
                }
                companyDataDiv.find("#pdv_pk").find(".layui-tab-item").eq(2).find("tbody").html(pklist);
                //企业处理工艺
                var clgylist = "";
                for(var i in data.企业处理工艺){
                    clgylist += "<div class='thumb lay-img' style=''> " +
                        "<img src='"+ data.企业处理工艺[i].url +"' " +
                        "style=''> " +
                        "<div>"+ data.企业处理工艺[i].name +"</div> </div>"
                }
                companyDataDiv.find(".clgy_photos").find(".thumbs").html(clgylist);
                //企业照片
                var qyPhotos = "";
                for(var i in data.qyphoto){
                    qyPhotos += "<div class='silder-main-img lay-img'> <img src='"+ data.qyphoto[i].url +"' style='width: 600px;height: 400px'> </div>"
                }
                companyDataDiv.find(".silder-main").html(qyPhotos);
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
        });
        loadDau(id);
    };
    //根据企业查询数采仪
    // var loadDau = function (Cid,body) {
        // console.log(Cid);
    var loadDau = function (Cid) {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            dauMap : {
                epId : Cid
            }
        };
        console.log(Cid)
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
                    $("#select_dau").empty();
                if(!row){
                    $("#select_dau").append("<option value='无采集仪' selected='selected'>无采集仪</option>");
                    $("#select_equip").empty().append("<option value='无采集仪' selected='selected'>无设备</option>");
                    $("#select_fac").empty().append("<option value='无采集仪' selected='selected'>无监测因子</option>");
                    $("#com_chart1").empty().html('<h1 style="text-align: center">'+name+'</h1><span>无相关监测因子</span>');
                }else{
                    for(var i in row){
                        // $("#select_d").append("<option id='d_option1' data-mn="+row[i].mn+" value="+row[i].id+">"+row[i].aname+"</option>");
                        $("#select_dau").append("<option id='d_option1' data-mn="+row[i].mn+" value="+row[i].id+">"+row[i].aname+"</option>");
                    }
                }
                form.render('select');
            }
        })
    };
    /*3D饼图*/
    var draw3dPie = function() {
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
            title: {text: '设备能耗统计'},
            tooltip: {pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'},
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 20,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '设备能耗占比',
                data: [
                    ['混排废水提升泵',   45.0],
                    ['含镍废水提升泵',   26.8],
                    ['含铬废水提升泵',   26.8],
                    ['综合废水提升泵',   8.5],
                    ['前处理废水提升泵',   6.2],
                    ['生化鼓风机',   0.7]
                ]
            }]
        };
        Highcharts.chart('ces_pie1', option);
    };
    /*输出内容，注意顺序*/
    var obj = {
        loadData : loadData,
        draw3dPie : draw3dPie
    };
    exports('pollutionDataMng',obj)
})