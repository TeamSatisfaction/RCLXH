layui.define(['layer', 'element'],function (exports) {

    /*加载JS模块*/
    layui.extend({ //设定模块别名
        utils : 'utils'
    });

    layui.use([
        'utils'
    ], function () {
        layui.utils.utilTest();
    });

    function a() {
        alert('123')
    }

    exports('sysMng', {
        a:a
    })
})