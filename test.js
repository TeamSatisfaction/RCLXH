/**
 * Created by M4 on 2017/7/9.
 */
/**
 * Created by Administrator on 2016/7/19 0019.
 */
/**
 *  spa.map.js  地图模块
 *  map module for SPA
 */
spa.map = (function () {

    require(["esri/map", "esri/layers/ArcGISTiledMapServiceLayer","esri/geometry/Point",
        "esri/symbols/TextSymbol","esri/renderers/SimpleRenderer", "esri/layers/LabelClass",
        "esri/SpatialReference","esri/geometry/Extent","dojo/domReady!","esri/layers/FeatureLayer","esri/layers/graphics","esri/layers/GraphicsLayer"]);
    var initMap, initModule, map;
    var no_downtown = ["安宁市","晋宁县","富民县","嵩明县","宜良县","石林彝族自治县","寻甸回族彝族自治县","禄劝彝族苗族自治县","东川区"];
    //----------------------------- END MODULE SCOPE VARIABLES -----------------------------------

    //----------------------------- BEGIN UTILITY METHODS ----------------------------
    //----------------------------- END UTILITY METHODS -------------------------------

    //------------------------------ BEGIN DOM METHODS  -----------------------------------
    initMap = function () {

        var baseLayer ;
        var lods = [
            {
                "level": 1,
                "resolution": 264.5838625010584,
                "scale": 1000000
            },
            {
                "level": 3,
                "resolution": 66.1459656252646,
                "scale": 250000
            }
        ];
        var startExtent = new esri.geometry.Extent(214094.3554999996,2700995.1746999994,365259.64300000016,2938729.437000001,
            new esri.SpatialReference({wkid:2343}) );
        map = new esri.Map("mapDiv",{
            logo : false,
            showLabels : true,
            lods: lods,
            extent:startExtent
            // extent : new esri.geometry.Extent({
            //     "xmin":11363857.974364154,"ymin": 2809501.901254209,"xmax":11520401.008292254,"ymax":2940209.2196219102,
            //     "spatialReference":{wkid:102100}
            // })
        });

        map.setMapCursor("pointer");    //鼠标手势

        addLayers();
        addEvents();
        InitPoints();
    };

    /*随机颜色*/
    var getRandomColor = function () {
        var coloArr = ['#57cc57', '#c1be50', '#d59354'];
        return coloArr[parseInt(3*Math.random())];
    };

    /*根据级别定颜色*/
    var getColor = function (level) {
        var color = "";
        var src = "";
        switch (level){
            case "一级":color = "#57cc57"; src = "images/Point/green.gif"; break;
            case "二级":color = "#c1be50"; src = "images/Point/green.gif"; break;
            case "三级":color = "#d59354"; src = "images/Point/green.gif"; break;
            case "四级":color = "#ee5c5f"; src = "images/Point/green.gif"; break;
            case "五级":color = "#cc528e"; src = "images/Point/green.gif"; break;
            case "六级":color = "#a43a63"; src = "images/Point/green.gif"; break;
            default: color = "#999"; break;
        }
        return {color : color, src : src};
    };

    /*给地图添加图层*/
    function addLayers() {
        /*详细图层*/
        var vector_layer = new
        esri.layers.ArcGISTiledMapServiceLayer('http://192.168.2.21:6080/arcgis/rest/services/kmhb_yjsl/MapServer',{
            id:"vec",
            // minScale:999999
        });
        /*功能图层*/
        var layer = new esri.layers.FeatureLayer("http://192.168.2.21:6080/arcgis/rest/services/kmxjm/MapServer/0",{        //县级面
            outFields: ["*"],//输出所有属性
            opacity :0,
            maxScale : 1000000,
            id:"FeatureLayer"
        });
        /*遮罩图层*/
        var dgAnalysis_layer = new esri.layers.GraphicsLayer({
            maxScale : 1000000,
            opacity :1,
            id:"dgA"
        });
        /*绿点图层*/
        var point_layer = new esri.layers.GraphicsLayer({id: 'pointLayer'});

        map.addLayer(vector_layer);
        map.addLayer(point_layer);
        map.addLayer(layer);
        map.addLayer(dgAnalysis_layer);
    }

    /*infoTemplate的简单方法*/
    function normalTemplate(arg1, arg2) {
        var str = "<p>1小时平均浓度："+arg1+"</p>" +"<p>1小时平均分指数："+arg2+"</p>";
        return str;
    }

    /*写infoTemplate的方法*/
    function writeTemplateHTML() {
        var infoTemplateType = localStorage.getItem("infoTemplateType");
        var infoTemplateData = JSON.parse(localStorage.getItem("infoTemplateData"));
        var str="";
        for(var k in infoTemplateData){
            if(infoTemplateData[k]=="")
                infoTemplateData[k] = "--"
        }
        if(infoTemplateData==""||infoTemplateData==null){
            str = "<p>暂无数据</p>";
        }
        else if(infoTemplateType=="AQI"){
            str = "<p><span style='width: 48%; display: inline-block'>空气质量指数：<span style='color: "+getColor(infoTemplateData.AqiLevel).color+"; font-weight: bold'>"+infoTemplateData.AQI+"</span></span>"
                +"<span style='display: inline-block; width: 50%'>首要污染物："+spa.util.pollutantTransfer(infoTemplateData.primaryPollutants)+"</span></p>"
                +"<p>空气质量指数级别：<span style='color: "+getColor(infoTemplateData.AqiLevel).color+"; font-weight: bold'>"+infoTemplateData.AqiLevel+"</span></p>"
                +"<p>空气质量指数类别：<span style='color: "+getColor(infoTemplateData.AqiLevel).color+"; font-weight: bold'>"+infoTemplateData.AqiKind+"</span></p>"
                +"<p style='width: 210px; background-color: rgb(227,238,232); border-top-right-radius: 10px; border-bottom-right-radius: 10px;" +
                "margin: 5px 0 5px 0;'>温馨提示</p>"
                +"<p>"+infoTemplateData.Tips+"</p>";
        }else if(infoTemplateType=="O3"){
            str = "<p>1小时平均浓度："+infoTemplateData.O3_1H+"</p>"
                +"<p>1小时平均分指数："+infoTemplateData.O3_1HAQI+"</p>"
                +"<p>8小时滑动平均浓度："+infoTemplateData.O3_8H+"</p>"
                +"<p>8小时滑动平均分指数："+infoTemplateData.O3_8HAQI+"</p>";
        }else if(infoTemplateType=="SO2"){
            str = normalTemplate(infoTemplateData.SO2N,infoTemplateData.SO2Z);
        }else if(infoTemplateType=="NO2"){
            str = normalTemplate(infoTemplateData.NO2N,infoTemplateData.NO2Z);
        }else if(infoTemplateType=="CO"){
            str = normalTemplate(infoTemplateData.CON,infoTemplateData.COZ);
        }else if(infoTemplateType=="PM25"){
            str = normalTemplate(infoTemplateData.PM25N,infoTemplateData.PM25Z);
        }else if(infoTemplateType=="PM10"){
            str = normalTemplate(infoTemplateData.PM10N,infoTemplateData.PM10Z);
        }
        return str;
    }

    /*添加事件*/
    var addEvents = function () {
        var query = new esri.tasks.Query();
        query.where = "1=1";
        query.outFields=["*"];
        var layer = map.getLayer('FeatureLayer'),
            dgAnalysis_layer = map.getLayer('dgA');
        var labelClasses = [];

        /*从featurelayer中提取图层数据*/
        layer.queryFeatures(query, function(results) {
            var features = results.features, feature, attributes, polySymbol, graphic, i, infoTemplate, infoTemplateHTML, aqiLevel;
            infoTemplateData = localStorage.getItem("infoTemplateData");
            aqiLevel = localStorage.getItem("aqiLevel");
            dgAnalysis_layer.clear();
            for(i in features){
                feature = features[i];
                attributes = feature.attributes;
                /*生成infoTemplate*/
                try{
                    var str = "";
                    if(no_downtown.indexOf(attributes.XZQM)== -1){
                        str = writeTemplateHTML();
                        polySymbol = new esri.symbol.SimpleFillSymbol(
                            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                            new esri.symbol.SimpleLineSymbol( esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([227,207,87]), 2),   //县级区划边框
                            new dojo.Color(getColor(aqiLevel).color));      //县级区划颜色
                    }else if(no_downtown.indexOf(attributes.XZQM)!= -1){
                        str = "<p>暂无数据</p>";
                        polySymbol = new esri.symbol.SimpleFillSymbol(
                            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                            new esri.symbol.SimpleLineSymbol( esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([227,207,87]), 2),   //县级区划边框
                            new dojo.Color(getRandomColor()));      //县级区划颜色
                    }
                    /*添加infoTemplate, 添加graphic*/
                    graphic = new esri.Graphic(feature.geometry, polySymbol);
                    infoTemplate = new esri.InfoTemplate(attributes.XZQM+"-空气质量指数("+spa.util.pollutantTransfer(localStorage.getItem("infoTemplateType"))+")", str);
                    graphic.setAttributes({"title":attributes.XZQM});
                    graphic.setInfoTemplate(infoTemplate);
                    dgAnalysis_layer.add(graphic);

                }catch(e){
                    console.log(e);
                }
            }
        });

        /*map的点击事件*/
        map.on('click', function (evt) {   //创建监测点
            var pointLayer = map.getLayer('pointLayer');
            var point = evt.mapPoint;
            console.log(point);
            var gSymbol = new esri.symbol.PictureMarkerSymbol('images/Point/green.gif', 40, 40);//图标

            var graphic = new esri.Graphic();
            graphic.setSymbol(gSymbol);
            graphic.setGeometry(point);
            // pointLayer.add(graphic);
        });

        /*遮罩图层的点击事件*/
        dgAnalysis_layer.on("click", function(evt) {
            console.log(evt);
            // map.setExtent(evt.graphic._extent)
        });

        /*遮罩图层的改变大小和可视度改变的监听事件*/
        dgAnalysis_layer.on("scale-visibility-change", function () {
            map.infoWindow.hide();  //隐藏infowindow
        })
    }

    /* 初始化监测点的点
     *  目前是本地数据
     *  添加了infotemplate
     * */
    var InitPoints = function(){
        var pointLayer = map.getLayer('pointLayer');
        var rtData = JSON.parse(localStorage.getItem("realTimeAqiData"));

        $.ajax({
            type:"GET",
            url:"data/CityList.json",
            cache:false,
            dataType:'json',
            success:function (data){
                for (var i = 0; i < data.length; i++){
                    //生成监测点点位设置
                    var x = data[i].longitude;
                    var y = data[i].latitude;
                    var point = new esri.geometry.Point(x, y, new esri.SpatialReference({wkid : 4326}));
                    var gSymbol
                    for(var j in rtData){
                        if(rtData[j].JCMC == data[i].stat_name){
                            gSymbol = new esri.symbol.PictureMarkerSymbol('images/Point/green.gif', 40, 40);//图标
                        }else {
                            gSymbol = new esri.symbol.PictureMarkerSymbol('images/Point/green.gif', 40, 40);//图标
                        }
                    }

                    //创建监测点
                    var graphic = new esri.Graphic();
                    graphic.setSymbol(gSymbol);
                    graphic.setGeometry(point);
                    graphic.setAttributes(data[i]);
                    pointLayer.add(graphic);
                }

                /*point鼠标悬浮事件及内容*/
                pointLayer.on("mouse-over", function (e) {
                    console.log(e)
                    var str = "<p><span style='width: 48%; display: inline-block'>空气质量指数：<span style='color: "+getColor(e.graphic.attributes.kind).color+"; font-weight: bold'>"+e.graphic.attributes.AQI+"</span></span>"
                        +"<span style='display: inline-block; width: 50%'>首要污染物："+spa.util.pollutantTransfer(e.graphic.attributes.fw)+"</span></p>"
                        +"<p>空气质量指数级别：<span style='color: "+getColor(e.graphic.attributes.kind).color+"; font-weight: bold'>"+e.graphic.attributes.kind+"</span></p>"
                        +"<p>空气质量指数类别：<span style='color: "+getColor(e.graphic.attributes.kind).color+"; font-weight: bold'>"+e.graphic.attributes.kind+"</span></p>"
                        +"<p style='width: 210px; background-color: rgb(227,238,232); border-top-right-radius: 10px; border-bottom-right-radius: 10px;" ;
                    map.infoWindow.setTitle(e.graphic.attributes.stat_name+"-空气质量指数(AQI)")
                    map.infoWindow.setContent(str);
                    map.infoWindow.show(e.graphic.geometry);
                })
            }
        })
    };

    /*地图缩放功能
     * 根据传值来判断中心点
     * */
    var mapZoomTo = function (str) {
        var layer = map.getLayer('FeatureLayer');
        var query = new esri.tasks.Query();
        query.where = "1=1";
        query.outFields=["*"];
        layer.queryFeatures(query, function(results) {
            for(var i in results.features){
                if(str == "市辖区"){
                    map.setExtent(results.features[8]._extent);
                }else if(str == "昆明市"){
                    map.setExtent(new esri.geometry.Extent(214094.3554999996,2700995.1746999994,365259.64300000016,2938729.437000001,
                        new esri.SpatialReference({wkid:2343})));
                }else if(str == results.features[i].attributes.XZQM){
                    map.setExtent(results.features[i]._extent);
                }
            }
        });
    }

    //------------------------------- END  DOM METHODS --------------------------------------------

    //--------------------------------- BEGIN EVENT HANDLERS --------------------------------------
    //--------------------------------- END EVENT HANDLERS --------------------------------------

    //-------------------------------- BEGIN PUBLIC METHODS ----------------------------------------
    //  Begin Public method /initModule/
    initModule = function (  ) {
        initMap();
    };
    // End Public Method /init Module/

    return { initModule : initModule, addEvents: addEvents, mapZoomTo: mapZoomTo
    };
    //---------------------------------- END PUBLIC METHODS ---------------------------------
}());