/**
 * Created by HNCG on 2017/7/3.
 */

layui.define('layer', function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    /*方法*/
    var init1 = function () {
        // layer.alert("initfunction")
        document.getElementsByTagName("h1")[0].innerHTML = "这是个测试项目"
        
    };
    
    var initLeftClick = function () {
        
    }
    
    var loadPage = function (url) {
        var $ = layui.jquery;
        $("#index_frame").attr("src", url)
    }

    /*输出内容，注意顺序*/
    var obj = {
        init : init1,
        loadPage : loadPage
    };
    //输出test接口
    exports('index', obj);
});