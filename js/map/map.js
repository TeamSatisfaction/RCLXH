/**
 * Created by M4 on 2017/7/5.
 */
layui.define('layer', function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
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
        layer.alert('click')
    }

    //输出test接口
    exports('map', {
        btnClick : btnClick
    });

});