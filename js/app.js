/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
// sessionStorage.setItem("urlConfig", 'http://172.21.92.170:8095');
sessionStorage.setItem("urlConfig", 'http://192.168.30.238:8095');
// sessionStorage.setItem("urlConfig", 'http://192.168.1.135:8095');
layui.define(['layer', 'form', 'element'], function(exports){
    var $ = layui.jquery,
        layer = layui.layer,
        element = layui.element(),
        form = layui.form();
    /*加载CSS文件*/

    /*加载JS模块*/
    layui.extend({ //设定模块别名
        index : 'index/index',
        utils : 'utils'
    });

    /*要USE*/
    /*USE完以后才能调用, 模块的初始化方法都放在这里的function里面*/
    layui.use([
        'index',
        'utils'
    ], function () {
        layui.index.init();
    });

    /*导航栏方法*/
    element.on('nav(user)', function(elem){
        // console.log(elem)
        layer.msg(elem.text());
    });
    element.on('nav(left_menu)', function(elem){
        // console.log(elem)
    });
    layer.ready(function () {
        var code = window.location.href;
        console.log(code);
        var data={};
        data.client_id="dad449b578874069b7a77976b7d94b91";
        data.client_secret="0ff0b7a8f5b64beba42a58bc15029588";
        data.code="4bb310ab49f94e59b1905a8a13fb9cf2";
        $.ajax({
            url : 'http://login.cqhtwl.com.cn/htwl/oauth2/token',
            type : 'post',
            data : data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            async:false,
            success : function (result){
                console.log(result);
                sessionStorage.setItem("access_token", result.access_token);
                sessionStorage.setItem("refresh_token", result.refresh_token);
                sessionStorage.setItem("expires_in", result.expires_in);
            }
        })
    });

    exports('app', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});

