/**
 * Created by HNCG on 2017/7/3.
 */

layui.define('layer', function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    /*方法*/
    var $ = layui.jquery;
    var urlConfig = sessionStorage.getItem("urlConfig");
    var Authorization = sessionStorage.getItem("Authorization");
    var mapServer = "http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer";
    var lat0 = 105.5779702660,
        lgt0 = 29.4048578414;
    var center_point = new esri.geometry.Point(lat0,lgt0, new esri.SpatialReference(4326));

    var map = new esri.Map("mapDiv", {
        center: center_point,
        slider: false,
        logo: false,
        zoom: 13,//地图大小级别
        minZoom: 9,//地图缩放的小级别
        maxZoom: 16//地图缩放的最大级别
    });
    var basemap = new esri.layers.ArcGISTiledMapServiceLayer(mapServer);
    var graphicLayer = new esri.layers.GraphicsLayer({id: 'point_layer'});         //点位图层

    map.addLayer(basemap);
    map.addLayer(graphicLayer);
    /*添加点位*/
    var addPoint = function (point, type, isAlt, attr) {
        var symbolUrl;
        // console.log(attr);
        if(type === "production_enterprise"){
            symbolUrl = "../../img/index/qiye.png"
        }else if (type === "monitoringStation_enterprise"){
            symbolUrl = "../../img/index/mn.png"
        }
        var symbol = new esri.symbol.PictureMarkerSymbol(symbolUrl, 20, 25);		//标记
        var graphic = new esri.Graphic(point, symbol, attr);
        graphicLayer.add(graphic);
        // map.addLayer(graphicLayer);

    };
    //请求企业信息
    function loadCompanydata () {
        var data = {
            pageNum : 1,
            pageSize : 65,
            enterpriseRole : 'production_enterprise',
            areaCode : '500000-500153'
        };
        var field = JSON.stringify(data);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
               Authorization:Authorization
            },
            type: 'post',
            data: field,
            success: function (result) {
                var list = result.data.list;
                if(list){
                    for(var i in list){
                        var lon = list[i].lon,
                            lat = list[i].lat,
                            enterpriseRole = list[i].enterpriseRole;
                        var pt = new esri.geometry.Point(lon, lat, new esri.SpatialReference({wkid:4326})),
                            type = enterpriseRole;
                        addPoint(pt, type, true, list[i]);
                    }
                }
            }
        })
    };
    loadCompanydata();
    /*点位改变样式*/
    var symbolSwitch = function (symbol) {
        
    };
    /*清除地图*/
    var clearMap = function () {
        map.clear()
    };
    /*infoWindow*/
    var infoWin = function(e) {
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/alrm/enterprise/statistics',
            headers : {
                Authorization:Authorization
            },
            type: 'get',
            success: function(result){
                var attr = e.graphic.attributes,
                    point = e.graphic.geometry,
                    symbolUrl = e.graphic.symbol.url,
                    contentHtml = "",
                    titleHtml = "";
                if(result.length>0){
                    for(var i in result){
                        if(result[i].enterpriseName == attr.name){
                            attr.num = result[i].count;
                        }else{
                            attr.num = "0";
                        }
                    }
                }else{
                    attr.num = "0";
                }
                if (symbolUrl.indexOf("qiye") != -1) {
                    titleHtml = attr.name;
                    contentHtml += "<p>企业名称：<span>"+attr.name+"</span></p>"
                        +"<p>企业地址：<span>"+attr.address+"</span></p>"
                        // +"<p>行业类别：<span>医药制造业</span></p>"
                        +"<p>报警总数：<a onclick='layui.map.loadPage(\"pages/alarmMng/alarmMng.html\")'>"+attr.num+"</a></p>";
                } else if (symbolUrl.indexOf("mn") != -1) {
                    titleHtml = attr.name;
                    contentHtml += "<p>名称：<span>"+attr.name+"</span></p>"
                        +"<p>地址：<span>"+attr.address+"</span></p>"
                        +"<p>报警总数：<a onclick='layui.map.loadPage(\"pages/alarmMng/alarmMng.html\")'>"+attr.num+"</a></p>";
                }
                map.infoWindow.setTitle(titleHtml)
                map.infoWindow.setContent(contentHtml);
                map.infoWindow.show(point);
            }
        });
    };

    /*地图加载*/
    dojo.ready( function () {
        // map.addLayer(basemap);
        /*点位点击事件*/
        // dojo.connect(map, "onClick", function (evt) {
        //     //得到当前点位信息
        //     var point = evt.graphic.geometry,
        //         attr = evt.graphic.attributes;
        //     map.centerAt(point);
        // });
        graphicLayer.on("mouse-over", function (e) {
            infoWin(e);
        });
    });
    var obj = {
        map:map,
        addPoint: addPoint,
        clearMap:clearMap,
        loadCompanydata : loadCompanydata
    };
    //输出test接口
    exports('mapUtils', obj);

});