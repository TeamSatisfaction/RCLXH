/*
/用户管理
 */
layui.define(['layer','element','laypage','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form(),
        uTobody = $('#user-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    //页面跳转
    var loadPage = function(url,p){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    var addUserWin = function () {
        layer.open({
            title : '新增用户',
            type : 2,
            area : ['850px','750px'],
            content : '../../pages/sysMng/addUserView.html',
            btn: [ '提交','返回'],
            btnAlign: 'c',
            success: function(layero,index){
                form.render();
                //表单验证
                // form.verify({
                //     threshold : function (value) {
                //         if(!new RegExp("^(([1-9])|(1[0-9])|(2[0-4]))$").test(value)){
                //             return '只能输入1~24的整数';
                //         }
                //     }
                // });
            },
            yes  : function (index,layero) {
                layero.find("iframe").contents().find('#user-save').click();
            }
        })
    };
    //form表单提交
    form.on('submit(user-save)',function (data) {
        data.field.orgId = "lxh_user";
        data.field.isDel = "0";
        data.field.status = "1";
        var field = JSON.stringify(data.field);
        console.log(field);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/user',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            dataType : 'json',
            type : 'post',
            data : field,
            success : function (result){
                var  frameindex= parent.layer.getFrameIndex(window.name);
                if(result.code == '1000'){
                    layer.msg('提交成功！', {icon: 1});
                    parent.layer.close(frameindex);
                    parent.location.reload(); // 父页面刷新
                }else if(result.resultcode == '501'){
                    layer.msg(result.resultdesc, {icon: 2});
                }
            }
        });
        return false;
    });
    //加载用户列表
    var loadUserData = function (curr) {
        var name = $('#uName').val(),
            data = {
                pageNumber : curr||1,
                pageSize : 16,
                epMap : {
                    realName : name,
                    orgId : 'lxh_user'
                }
            };
        var field = JSON.stringify(data);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/user/page',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            dataType : 'json',
            type : 'post',
            data : field,
            success : function (result){
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var uData = result.data.rows,
                    pages = result.data.totalPage,
                    str = "";
                var render = function(uData, curr) {
                    var arr = []
                        , thisData = uData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.realName + '</td>' +
                            '<td>' + item.phone + '</td>' +
                            '<td>' + item.idCard+ '</td>' +
                            '<td>' + item.status + '</td>' +
                            '<td style="text-align: center">'+
                            '<a href="#" onclick="layui.userMng.userRoleMngWin()" title="权限配置"><img src="../../img/mng/configure.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a href="#" onclick="" title="删除"><img src="../../img/mng/delete.png"></a>'+
                            '</tr>';
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                uTobody.html(render(uData, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo4',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr || 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadUserData(obj.curr);
                        }
                    }
                })
            }
        })
    };
    //验证密码
    var passwordJudge = function () {
        var password = $('#password').val(),
            password2 =  $('#password2').val();
        if(password2){
            if(password2 != password){
                layer.msg('两次密码不一致！', {icon: 2});
            }
        }
    };
    var userRoleMngWin = function () {
        var index = layer.open({
            title : '权限配置',
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/userRoleMng.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index) {
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
        });
    };
    var obj = {
        loadPage : loadPage,
        addUserWin : addUserWin,
        loadUserData : loadUserData,
        passwordJudge : passwordJudge,
        userRoleMngWin : userRoleMngWin
    };
    /*输出内容，注意顺序*/
    exports('userMng',obj)
})