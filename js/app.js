/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
// sessionStorage.setItem("urlConfig", 'http://113.204.228.66:8095');
// sessionStorage.setItem("urlConfig", 'http://172.16.1.10:8095');
sessionStorage.setItem("urlConfig", 'http://172.21.92.236:8095');
// sessionStorage.setItem("urlConfig1", 'http://172.16.1.10:9702');
sessionStorage.setItem("urlConfig1", 'http://172.21.92.236:9702');
// var urlConfig1 = 'http://113.204.228.66:9702';
// var urlConfig1 = 'http://172.16.1.102:9702';
// 113.204.228.66
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
        layui.index.menuMng();
        // layui.index.buttonMng();
    });

    /*导航栏方法*/
    element.on('nav(user)', function(elem){
        // console.log(elem)
        layer.msg(elem.text());
    });
    element.on('nav(left_menu)', function(elem){
        // console.log(elem)
    });
    // layer.ready(function(){
    //     // var storage=window.localStorage;
    //     // var userName = getCookie("userName");
    //     // if(userName){
    //     //     $("#nametext").html(userName);
    //     // }else{
    //     //     // window.location.href = "login.html";
    //     // }
    //     // // console.log(storage.data);
    //     var auth_btn = $(window.parent.document).find('.auth-btn');
    //     console.log(auth_btn);
    // });
    exports('app', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});

