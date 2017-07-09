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
    var infoWin = function(){
        /*point鼠标悬浮事件及内容*/
        graphicLayer.on("mouse-over", function (e) {
            console.log(e)
            var str = "<p><span style='width: 48%; display: inline-block'>空气质量指数：<span style='font-weight: bold'>"+18+"</span></span>"
                +"<span style='display: inline-block; width: 50%'>首要污染物：-</span></p>"
            +"<p><span style='width: 48%; display: inline-block'>空气质量指数：<span style='font-weight: bold'>"+18+"</span></span>"
            +"<span style='display: inline-block; width: 50%'>首要污染物：-</span></p>";
            map.infoWindow.setTitle("空气质量指数(AQI)")
            map.infoWindow.setContent(str);
            map.infoWindow.show(e.graphic.geometry);
        })

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
        infoWin();
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