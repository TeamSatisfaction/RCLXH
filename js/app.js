/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'form', 'element'], function(exports){
    var layer = layui.layer,
        element = layui.element(),
        form = layui.form();

    /*加载CSS文件*/
    layui.link('css/style.css');

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
        console.log(elem)
        layer.msg(elem.text());
    });
    element.on('nav(left_menu)', function(elem){
        console.log(elem)
    });

    exports('app', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});
