/*
/污染源
 */
layui.define(['layer', 'element','laypage','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form(),
        cTobody = $('#company-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    var access_token = sessionStorage.getItem("access_token");
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    var Tname = "实时监测数据";
    //加载污染源列表
    var loadCompanyData = function (curr) {
        var name = $('#name').val(),
            data = {
                name : name,
                pageNum : curr||1,
                pageSize : 16,
                enterpriseRole : 'production_enterprise',
                areaCode : '500000-500153'
                // areaId : 500153
            };
        var field = JSON.stringify(data);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/page',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'post',
            data : field,
            success : function (result) {
                console.log(result);
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var cData = result.data.list,
                    pages = result.data.pages,
                    str = "";
                //模拟渲染
                var render = function(cData, curr) {
                    var arr = []
                        , thisData = cData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.name + '</td>' +
                            '<td>' + item.address + '</td>' +
                            '<td>' + item.head+ '</td>' +
                            '<td>' + item.headPhone + '</td>' +
                            // '<td style="text-align: center"><button class="layui-btn layui-btn-mini layui-btn-normal" onclick="layui.pollutionMng.detailCompanyWin()">详情</button></td>' +
                            '<td style="text-align: center"><a href="#" onclick="layui.pollutionDataMng.detailCompanyWin(\''+item.baseEnterpriseId+'\')" title="详情"><img src="../../img/mng/查看详情.png"></a></td>'
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                cTobody.html(render(cData, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo1',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr||1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadCompanyData(obj.curr);
                        }
                    }
                })
            }
        })
    };
    // //根据数采仪查询设备
    // var loadEquipment = function (Did) {
    //     var data = {
    //         pageNumber : 1,
    //         pageSize : 1000,
    //         equipmentMap : {
    //             dauId : Did
    //         }
    //     };
    //     var field = JSON.stringify(data);
    //     $.ajax({
    //         url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/equipment/query/page',
    //         headers: {
    //             'Content-type': 'application/json;charset=UTF-8',
    //             Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
    //         },
    //         type: 'post',
    //         data: field,
    //         success: function (result){
    //             var row = result.data.rows;
    //             $("#select_e").empty();
    //             if(row == null){
    //                 $("#select_e").append("<option value='' selected='selected'>无设备</option>");
    //                 $("#select_f").empty();
    //                 $("#select_f").append("<option value='' selected='selected'>无监测因子</option>");
    //                 $("#com_chart1").empty();
    //                 $("#com_chart1").html('<span>无相关监测因子</span>');
    //             }else{
    //                 for(var i in row){
    //                     $("#select_e").append("<option value="+row[i].id+">"+row[i].equipmentName+"</option>");
    //                 }
    //                 loadFactor(row[0].id);
    //             }
    //             form.render('select');
    //         }
    //     })
    // };
    // //根据设备查询因子
    // var loadFactor = function (id,cn) {
    //     var data = {
    //         pageNumber : 1,
    //         pageSize : 1000,
    //         factorMap : {
    //             equipmentId : id
    //         }
    //     };
    //     var field = JSON.stringify(data);
    //     $.ajax({
    //         url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/factor/query/page',
    //         headers: {
    //             'Content-type': 'application/json;charset=UTF-8',
    //             Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
    //         },
    //         type: 'post',
    //         data: field,
    //         success: function (result){
    //             var row = result.data.rows;
    //             $("#select_f").empty();
    //             if(row == null){
    //                 $("#select_f").append("<option value='' selected='selected'>无监测因子</option>");
    //                 $("#com_chart1").empty();
    //                 $("#com_chart1").html('<span>无相关监测因子</span>');
    //             }else{
    //                 for(var i in row){
    //                     $("#select_f").append("<option value="+row[i].factorCode+">"+row[i].factorName+"</option>");
    //                 }
    //             }
    //             form.render('select');
    //             code=row[0].factorCode;
    //             Fname=row[0].factorName;
    //             needRefresh = true;
    //             console.log(Fname);
    //             // loadaCharts();
    //             // loadaCharts(cn);
    //         }
    //     })
    // };
    //监测详情曲线图
    var loadaCharts = function () {
        var option = {
            chart: {
                type : 'line'
            },
            title: {
                text: Tname
            },
            xAxis: {
                categories : ["22:34:01","22:34:11","22:34:21","22:34:31"]
            },
            tooltip: {
                valueSuffix: 'mg/L'
            },
            yAxis: {
                title: {
                    text: 'mg/L'
                }
                // plotLines: [{
                //     value: 6.9,
                //     dashStyle:'ShortDash',
                //     width: 3,
                //     color: 'red',
                //     label: {
                //         text: '报警值',
                //         align: 'center',
                //         style: {
                //             color: 'gray'
                //         }
                //     }
                // }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'COD',
                data: [6,6.5,6.7,5.2]
            }]
        };
        Highcharts.chart('com_chart1', option);
    };
    var changeChart = function (e) {
        Tname = e;
        console.log(e);
        loadaCharts();
    };
    // loadaCharts();
        /*输出内容，注意顺序*/
        var obj = {
            loadPage : loadPage,
            loadCompanyData : loadCompanyData,
            // detailCompanyWin : detailCompanyWin,
            // draw3dPie :  draw3dPie,
            // loadaCharts : loadaCharts,
            // changeChart : changeChart
        };
        exports('pollutionMng',obj)
})