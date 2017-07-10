/**
 * Created by HNCG on 2017/7/3.
 */

layui.define('layer', function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    /*方法*/
    var mapServer = "http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer";
    var lat0 = 105.5779702660,
        lgt0 = 29.4048578414;
    var center_point = new esri.geometry.Point(lat0,lgt0, new esri.SpatialReference(4326));
    var map = new esri.Map("mapDiv", {
        center: center_point,
        slider: false,
        logo: false,
        zoom: 11,//地图大小级别
        minZoom: 0,//地图缩放的小级别
        maxZoom: 19//地图缩放的最大级别
    });
    var basemap = new esri.layers.ArcGISTiledMapServiceLayer(mapServer);
    var graphicLayer = new esri.layers.GraphicsLayer({id: 'point_layer'});         //点位图层

    /*添加点位*/
    var addPoint = function (point, type, isAlt, attr) {
        var symbolUrl;
        if(type === "factory"){
            symbolUrl = "../../img/map/factory.png"
        }else if (type === "monistation"){
            symbolUrl = "../../img/map/monistation.png"
        }
        var symbol = new esri.symbol.PictureMarkerSymbol(symbolUrl, 25, 25);		//标记
        var graphic = new esri.Graphic(point, symbol, attr);
        graphicLayer.add(graphic);
        map.addLayer(graphicLayer);
    };

    var addRandomPoint = function (){
        var lat = lat0 + Math.random()-0.5,
            lgt = lgt0 + Math.random()-0.5,
            pt = new esri.geometry.Point(lat, lgt, new esri.SpatialReference(4326)),
            type = Math.random()>0.5?"factory":"monistation";
        addPoint(pt, type, true, {});

    };


    /*点位改变样式*/
    var symbolSwitch = function (symbol) {
        
    };
    /*清除地图*/
    var clearMap = function () {
        map.clear()
    };
    /*infoWindow*/
    var infoWin = function(e) {
        var attr = e.graphic.attributes,
            point = e.graphic.geometry,
            symbolUrl = e.graphic.symbol.url,
            contentHtml = "",
            titleHtml = "";
        if (symbolUrl.indexOf("factory") != -1) {
            titleHtml = "重庆永荣矿务局总医院";
            contentHtml += "<p>企业名称：<span>重庆永荣矿务局总医院</span></p>"
                +"<p>企业地址：<span>荣昌县广顺镇曾家山矿区</span></p>"
                +"<p>管控级别：<span>市控</span></p>"
                +"<p>行业类别：<span>医药制造业</span></p>"
                +"<p>报警总数：<a onclick='layui.map.loadPage(\"../alarmMng/alarmMng.html\")'>12个</a></p>";
        } else if (symbolUrl.indexOf("monistation") != -1) {
            titleHtml = "水质自动监测站";
            contentHtml += "<p>名称：<span>水质自动监测站</span></p>"
                +"<p>地址：<span>荣昌县广顺镇曾家山矿区</span></p>"
                +"<p>报警总数：<a onclick='layui.map.loadPage(\"../alarmMng/alarmMng.html\")'>12个</a></p>";
        }
        map.infoWindow.setTitle(titleHtml)
        map.infoWindow.setContent(contentHtml);
        map.infoWindow.show(point);
    };

    /*地图加载*/
    dojo.ready( function () {
        map.addLayer(basemap);
        /*点位点击事件*/
        dojo.connect(map, "onClick", function (evt) {
            //得到当前点位信息
            var point = evt.graphic.geometry,
                attr = evt.graphic.attributes;
            map.centerAt(point);
        });
        graphicLayer.on("mouse-over", function (e) {
            infoWin(e);
        });
    });

    var obj = {
        map:map,
        addPoint: addPoint,
        clearMap:clearMap,

        addRandomPoint:addRandomPoint //添加随机点位，测试用
    };
    //输出test接口
    exports('mapUtils', obj);

});