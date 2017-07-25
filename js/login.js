/**
 * Created by HNCG on 2017/7/25.
 */
layui.define(['layer', 'form', 'element'], function(exports){
    var $ = layui.jquery,
        layer = layui.layer,
        element = layui.element(),
        form = layui.form();

        layer.open({
            type : 1,
            content : $('#login_container')
            ,title: false //不显示标题栏
            ,closeBtn: false
            ,area: '450px;'
            ,shade: 0
            ,id: 'login' //设定一个id，防止重复弹出
            ,moveType: 1 //拖拽模式，0或者1
            ,success: function(layero){
                layer.msg('open')
            }
        });

    exports('login', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});