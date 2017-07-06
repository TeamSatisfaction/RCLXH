/**
 * Created by HNCG on 2017/7/3.
 */

layui.define('layer', function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    /*方法*/
    var init = function () {
        /*标题栏时间*/
        setInterval(
            'document.getElementById("time").innerHTML = layui.utils.dateFormat("yy年MM月dd日 HH:mm:ss EEE");',
            100);
        /*加载首页*/
        loadPage('pages/map/map.html')
    };
    
    var loadPage = function (url) {
        var $ = layui.jquery;
        $("#index_frame").attr("src", url)
    };

    /*输出内容，注意顺序*/
    var obj = {
        init : init,
        loadPage : loadPage
    };
    //输出test接口
    exports('index', obj);

});