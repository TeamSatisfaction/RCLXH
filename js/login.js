/**
 * Created by HNCG on 2017/7/25.
 */
layui.define(['layer', 'form', 'element'], function(exports){
    var $ = layui.jquery,
        layer = layui.layer,
        element = layui.element(),
        form = layui.form();
    var verifyCode;

    initVerify = function () {
        verifyCode = new GVerify("verify_image");
    };
    verify = function () {
        return verifyCode.validate(document.getElementById("verify").value);
    };
    loginAction = function () {
        var username = $('input[name="username"]').val(),
            password = $('input[name="password"]').val();
        if(!username)
            layer.msg("请输入用户名");
        else if(!password)
            layer.msg("请输入密码");
        console.log(username, password)
    };

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
            initVerify();
            /*登陆*/
            $('#login_btn').click(function(){
                if(verify()){
                    loginAction();
                } else {
                    layer.msg('验证码输入有误');
                    verifyCode.refresh();
                    $('#verify').val('');
                }
            });
            /*重置*/
            $('#login_reset').click(function () {
                verifyCode.refresh();
                $('input[name="username"]').val('');
                $('input[name="password"]').val('');
                $('#verify').val('');
            });
            /*看不清换一张*/
            $('#verify_change').click(function () {
                verifyCode.refresh();
                $('#verify').val('');
            })
        }
    });

    exports('login', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});