/**
 * Created by M4 on 2017/7/5.
 */
layui.define(['layer', 'element', 'layedit'], function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var $ = layui.jquery;
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
                }
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

    /*曲线图*/
    function drawLine() {
        var now = new Date(),
            today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            data = [];
        for(var i = today.getTime(); i < now.getTime(); i += 300000){
            var t = new Date(i);
            data.push([Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds()), Math.round(Math.random()*20)])
        }
        var option = {
            chart: {
            },
            title: {
                text: '化学需氧量（mg/L）'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                }
            },
            tooltip: {
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                }
            },
            yAxis: {
                title: {enabled: false},
                min: 0
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: '化学需氧量',
                data: data
            }]
        };
        Highcharts.chart('mapStats_Line', option);
    }
    setInterval(function(){drawLine()}, 30000)
    drawLine();

    /*新报警提示*/
    function showNotification() {
        $(".notification").slideDown();
    }
    function closeNotification() {
        $(".notification").slideUp();
    }
    setInterval('layui.map.showNotification()', 15000);

    //输出test接口
    exports('map', {
        btnClick : btnClick,
        loadPage: loadPage,
        close: close,
        showNotification:showNotification,
        closeNotification:closeNotification
    });

});