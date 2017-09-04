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
    //加载污染源列表
    var loadCompanyData = function (curr) {
        var name = $('#name').val(),
            data = {
                name : name,
                pageNum : curr||1,
                pageSize : 16
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
                            '<td style="text-align: center"><a href="#" onclick="layui.pollutionMng.detailCompanyWin()" title="详情"><img src="../../img/mng/查看详情.png"></a></td>'
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
    //企业详情
    var detailCompanyWin = function () {
        var index = layer.open({
            title : '企业详情',
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/pollutionMng/pollutionDataView.html',
            btn: [ '返回'],
            btnAlign: 'c'
        });
        layer.full(index);
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
    //监测详情曲线图
    var loadaCharts = function () {
        var option = {
            chart: {
                type : 'line'
            },
            title: {
                text: '实时监测数据'
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
    /*输出内容，注意顺序*/
    var obj = {
        loadPage : loadPage,
        loadCompanyData : loadCompanyData,
        detailCompanyWin : detailCompanyWin,
        draw3dPie :  draw3dPie,
        loadaCharts : loadaCharts
    };
    exports('pollutionMng',obj)
})