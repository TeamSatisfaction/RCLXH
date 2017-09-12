layui.define(['layer', 'element','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form();
        // cTobody = $('#company-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    // //企业详情
    // var detailCompanyWin = function (id) {
    //     var index = layer.open({
    //         title : '企业详情',
    //         id : id,
    //         type : 2,
    //         moveOut: true,
    //         area : ['1200px','700px'],
    //         content : '../../pages/pollutionMng/pollutionDataView.html',
    //         btn: [ '返回'],
    //         btnAlign: 'c',
    //         success : function (layero, index) {
    //             var body = layer.getChildFrame('body', index);
    //             var id = $('.layui-layer-content').attr('id');
    //             loadData(id,body);
    //             // loadAlarmRuleDetails(id,body,'1');
    //         }
    //     });
    //     layer.full(index);
    // };
    // 获取企业基本信息
    var loadData = function (){
        var id = sessionStorage.getItem("CidConfig");
        $.ajax({
            url: '' + urlConfig + '/v01/htwl/lxh/enterprise/'+id+'',
            headers: {
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'get',
            success: function (result) {
                var data = result.data;
            }
        });
        loadDau(id);
    };
    //根据企业查询数采仪
    var loadDau = function (Cid,body) {
        // console.log(Cid);
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
                $("#select_dau").empty();
                // body.find("#select_dau").empty();
                if(row == null){
                    $("#select_dau").append("<option value='' selected='selected'>无采集仪</option>");
                    // body.find("#select_equip").empty();
                    // body.find("#select_equip").append("<option value='' selected='selected'>无设备</option>");
                    // body.find("#select_fac").empty();
                    // body.find("#select_fac").append("<option value='' selected='selected'>无监测因子</option>");
                    // body.find("#select_fac").empty();
                    // body.find("#select_fac").html('<h1 style="text-align: center">'+name+'</h1><span>无相关监测因子</span>');
                }else{
                    for(var i in row){
                        // body.find("#select_dau").append("<option id='d_option1' data-mn="+row[i].mn+" value="+row[i].id+">"+row[i].aname+"</option>");
                        $("#select_dau").append("<option id='d_option1' data-mn="+row[i].mn+" value="+row[i].id+">"+row[i].aname+"</option>");
                    }
                }
                console.log($("#select_dau"));
                form.render("select","select_dau");
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
        // detailCompanyWin : detailCompanyWin,
        loadData : loadData,
        draw3dPie : draw3dPie
    };
    exports('pollutionDataMng',obj)
})