/**
 * Created by HNCG on 2017/7/3.
 */

layui.define('layer', function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    /*方法*/
    var $ = layui.jquery;
    var urlConfig = sessionStorage.getItem("urlConfig");
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
        maxZoom: 16//地图缩放的最大级别
    });
    var basemap = new esri.layers.ArcGISTiledMapServiceLayer(mapServer);
    var graphicLayer = new esri.layers.GraphicsLayer({id: 'point_layer'});         //点位图层

    map.addLayer(basemap);
    map.addLayer(graphicLayer);
    /*添加点位*/
    var addPoint = function (point, type, isAlt, attr) {
        var symbolUrl;
        // console.log(type);
        if(type === "production_enterprise"){
            symbolUrl = "../../img/index/qiye.png"
        }else if (type === "monistation"){
            symbolUrl = "../../img/index/dianmian.png"
        }
        var symbol = new esri.symbol.PictureMarkerSymbol(symbolUrl, 20, 25);		//标记
        var graphic = new esri.Graphic(point, symbol, attr);
        console.log(attr);
        graphicLayer.add(graphic);
        // map.addLayer(graphicLayer);

    };
    // var addRandomPoint = function (){
    //     var lat = lat0 + Math.random()-0.5,
    //         lgt = lgt0 + Math.random()-0.5,
    //         pt = new esri.geometry.Point(lat, lgt, new esri.SpatialReference(4326)),
    //         type = Math.random()>0.5?"factory":"monistation";
    //     addPoint(pt, type, true, {});
    // };
    //请求企业信息
    function loadCompanydata () {
        var data = {
            pageNum : 1,
            pageSize : 1000
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/enterprise/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'post',
            data: field,
            success: function (result) {
                // console.log(result.data.list);
                var list = result.data.list;
                // console.log(list);
                if(list){
                    for(var i in list){
                        var lon = list[i].lon,
                            lat = list[i].lat,
                            name = list[i].name,
                            address = list[i].address,
                            enterpriseRole = list[i].enterpriseRole;
                        var pt = new esri.geometry.Point(lon, lat, new esri.SpatialReference({wkid:4326})),
                            type = enterpriseRole;
                        addPoint(pt, type, true, list[i]);
                    }
                    // console.log(graphicLayer)
                    // map.addLayer(graphicLayer);
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
        var attr = e.graphic.attributes,
            point = e.graphic.geometry,
            symbolUrl = e.graphic.symbol.url,
            contentHtml = "",
            titleHtml = "";
        // console.log(e.graphic);
        if (symbolUrl.indexOf("qiye") != -1) {
            titleHtml = attr.name;
            contentHtml += "<p>企业名称：<span>"+attr.name+"</span></p>"
                +"<p>企业地址：<span>"+attr.address+"</span></p>"
                +"<p>行业类别：<span>医药制造业</span></p>"
                +"<p>报警总数：<a onclick='layui.map.loadPage(\"pages/alarmMng/alarmMng.html\")'>12个</a></p>";
        } else if (symbolUrl.indexOf("dianmian") != -1) {
            titleHtml = attr.name;
            contentHtml += "<p>名称：<span>"+attr.name+"</span></p>"
                +"<p>地址：<span>荣昌县广顺镇曾家山矿区</span></p>"
                +"<p>报警总数：<a onclick='layui.map.loadPage(\"pages/alarmMng/alarmMng.html\")'>0个</a></p>";
        }
        map.infoWindow.setTitle(titleHtml)
        map.infoWindow.setContent(contentHtml);
        map.infoWindow.show(point);
    };

    /*地图加载*/
    dojo.ready( function () {
        // map.addLayer(basemap);
        /*点位点击事件*/
        dojo.connect(map, "onClick", function (evt) {
            //得到当前点位信息
            var point = evt.graphic.geometry,
                attr = evt.graphic.attributes;
            map.centerAt(point);
        });
        graphicLayer.on("mouse-over", function (e) {
            // console.log(graphicLayer);
            console.log(e);
            infoWin(e);
        });
    });
    var obj = {
        map:map,
        addPoint: addPoint,
        clearMap:clearMap,
        // addRandomPoint:addRandomPoint, //添加随机点位，测试用
        loadCompanydata : loadCompanydata
    };
    //输出test接口
    exports('mapUtils', obj);

});