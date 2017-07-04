/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'form', 'element'], function(exports){
    var layer = layui.layer,
        form = layui.form();

    /*加载CSS文件*/
    layui.link('css/style.css');

    /*加载JS模块*/
    layui.extend({ //设定模块别名
        index : 'index/index',
        utils : 'utils'
    });

    /*要USE*/
    /*USE完以后才能调用*/
    layui.use('utils');
    /*调用JS中的方法*/
    layui.use('index', function () {
        layui.index.init();
    })


    exports('app', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});
