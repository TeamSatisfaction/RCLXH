/**
 * Created by HNCG on 2017/7/3.
 */

layui.define('layer', function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    /*方法*/
    var mapServer = "http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer";
    var center_point = new esri.geometry.Point(105.5779702660,29.4048578414, new esri.SpatialReference(4326));
    var alter_point = new esri.geometry.Point(105.5729702660,29.4448578414, new esri.SpatialReference(4326));
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
    /*点位改变样式*/
    var symbolSwitch = function (symbol) {
        
    };
    /*清除地图*/
    var clearMap = function () {
        map.clear()
    };

    /*地图加载*/
    dojo.ready( function () {
        map.addLayer(basemap);

        /*点位点击事件*/
        dojo.connect(map, "onClick", function (evt) {
            //得到当前点位信息
           console.log(evt)
            var point = evt.graphic.geometry,
                attr = evt.graphic.attributes;
            map.centerAt(point);
        });
    });

    var obj = {
        map:map,
        addPoint: addPoint
    };
    //输出test接口
    exports('mapUtils', obj);

});