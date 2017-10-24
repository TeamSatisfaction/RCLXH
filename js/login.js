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
        var data = {
            userName : username,
            password : hex_md5(password)
        };
        var field = JSON.stringify(data);
        $.ajax({
            url :'http://113.204.228.66:8095/v01/htwl/lxh/login',
            headers : {
                'Content-type': 'application/json;charset=UTF-8'
            },
            type : 'post',
            data : field,
            success : function (result) {
                if(result.resultcode){
                    layer.msg(result.resultdesc,{icon:2,time:1000},function () {
                        verifyCode.refresh();
                        $('input[name="username"]').val('');
                        $('input[name="password"]').val('');
                        $('#verify').val('');
                    })
                }else if(result.userName){
                    if(!window.localStorage){
                        layer.msg("该浏览器版本过低，请更换高版本的浏览器！");
                    }else{
                        // console.log(result)
                        // var storage=window.localStorage;
                        // var d=JSON.stringify(result.authList);
                        // storage.setItem("authList",d);
                        setCookie("userName",result.userName);
                        setCookie("userId",result.userId)
                        window.location.href="index.html";
                    }
                }
            }
        })
    };

    function setCookie(name,value)
    {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    };
    layer.open({
        type : 1,
        content : $('#login_container')
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,area: '470px'
        ,offset: [($(window).height()/2 - 250 )+ 'px', ($(window).width()-500)+'px']
        ,shade: 0
        ,resizing: true
        ,id: 'login' //设定一个id，防止重复弹出
        ,moveType: 1 //拖拽模式，0或者1
        // ,offset : ['100px','50px']
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