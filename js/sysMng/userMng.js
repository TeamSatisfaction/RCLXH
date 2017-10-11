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
                            '<td>' + item.userName + '</td>' +
                            '<td>' + item.realName + '</td>' +
                            '<td>' + item.phone + '</td>' +
                            '<td>' + item.idCard+ '</td>' +
                            '<td>' + item.status + '</td>' +
                            '<td style="text-align: center">'+
                            '<a class="auth-btn" data-authId="59" href="#" onclick="layui.userMng.userRoleMngWin(\''+item.id+'\')" title="用户编辑"><img src="../../img/mng/alter.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="81" href="#" onclick="layui.userMng.userRoleMngWin(\''+item.id+'\')" title="分配角色"><img src="../../img/mng/configure.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="57" href="#" onclick="layui.userMng.initializePassword(\''+item.id+'\')" title="初始化密码"><img src="../../img/mng/password.png"></a></td>'+
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                uTobody.html(render(uData, obj.curr));
                layui.sysMng.loadAuthen();
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
    var userRoleMngWin = function (id) {
        var index = layer.open({
            title : '权限配置',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/userRoleMng.html',
            btn: ['关闭'],
            btnAlign: 'c',
            success : function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var id = $('.layui-layer-content').attr('id');
                //用户角色列表
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/user/query/'+id+'',
                    headers : {
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'get',
                    success : function (result) {
                        var roleList = result.roleList;
                        var str = '';
                        $.ajax({
                            url: ''+urlConfig+'/v01/htwl/lxh/user/role/query',
                            headers : {
                                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                            },
                            type : 'get',
                            success : function (result) {
                                if(roleList){
                                    var tempArray1 = [];//临时数组1
                                    var tempArray2 = [];//临时数组2
                                    for(var i=0;i<roleList.length;i++){
                                        tempArray1[roleList[i].roleId]=true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
                                    }
                                    for(var i=0;i<result.length;i++){
                                        if(!tempArray1[result[i].roleId]){
                                            tempArray2.push(result[i]);//过滤array1 中与array2 相同的元素；
                                        }
                                    }
                                    // console.log(tempArray2);
                                    var render = function(tempArray2) {
                                        var arr = [];
                                        layui.each(tempArray2, function(index, item){
                                            str = '<tr>' +
                                                '<td>' + item.roleName + '</td>' +
                                                '<td style="text-align: center">'+
                                                '<a href="#" onclick="layui.userMng.userAddRole(\''+item.roleId+'\',\''+id+'\')" title="角色添加"><img src="../../img/mng/add.png"></a></td>'+
                                                '</tr>';
                                            arr.push(str);
                                        });
                                        return arr.join('');
                                    };
                                    body.contents().find("#noRole_list").html(render(tempArray2));
                                }else {
                                    var render = function(result) {
                                        var arr = [];
                                        layui.each(result, function(index, item){
                                            str = '<tr>' +
                                                '<td>' + item.roleName + '</td>' +
                                                '<td style="text-align: center">'+
                                                '<a href="#" onclick="layui.userMng.userAddRole(\''+item.roleId+'\',\''+id+'\')" title="角色添加"><img src="../../img/mng/add.png"></a></td>'+
                                                '</tr>';
                                            arr.push(str);
                                        });
                                        return arr.join('');
                                    };
                                    body.contents().find("#noRole_list").html(render(result));
                                }
                            }
                        });
                        if(roleList){
                            var render = function(roleList) {
                                var arr = [];
                                layui.each(roleList, function(index, item){
                                    str = '<tr>' +
                                        '<td>' + item.roleName + '</td>' +
                                        '<td style="text-align: center">'+
                                        '<a href="#" onclick="layui.userMng.userDeleteRole(\''+item.roleId+'\',\''+id+'\')" title="角色删除"><img src="../../img/mng/delete.png" width="20" height="20"></a></td>'+
                                        '</tr>';
                                    arr.push(str);
                                });
                                return arr.join('');
                            };
                            body.contents().find("#isRole_list").html(render(roleList));
                        }
                    }
                });
            }
        });
    };
    // 用户配置角色
    var userAddRole = function (roleId,userId) {
        var data = {
            roleId : roleId,
            userId : userId
        };
        var field = JSON.stringify(data);
        layer.msg('是否分配该角色', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url: '' + urlConfig + '/v01/htwl/lxh/user/role',
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type: 'post',
                    data : field,
                    success: function (result) {
                        if(result.resultcode == 2){
                            layer.msg('分配成功！', {icon: 1,time:1000}, function() {
                                location.reload()
                            });
                        }
                    }
                })
            }
        })
    };
    // 用户删除角色
    var userDeleteRole = function (roleId,userId) {
        var data = {
            roleId : roleId,
            userId : userId
        };
        var field = JSON.stringify(data);
        layer.msg('是否删除该角色', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url: '' + urlConfig + '/v01/htwl/lxh/user/role',
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type: 'delete',
                    data : field,
                    success: function (result) {
                        if(result.resultcode == 2){
                            layer.msg('删除成功！', {icon: 1,time:1000}, function() {
                                location.reload()
                            });
                        }
                    }
                })
            }
        })
    };
    //初始化密码
    var initializePassword = function (id) {
        var data = {
            password : "111111",
            userId : id
        };
        var field = JSON.stringify(data);
        layer.msg('是否初始化密码', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url: '' + urlConfig + '/v01/htwl/lxh/user/changepwd',
                    headers: {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type: 'put',
                    data : field,
                    success: function (result) {
                        console.log(result)
                    }
                })
            }
        })
    };
    var obj = {
        loadPage : loadPage,
        addUserWin : addUserWin,
        loadUserData : loadUserData,
        passwordJudge : passwordJudge,
        userRoleMngWin : userRoleMngWin,
        userAddRole : userAddRole,
        userDeleteRole : userDeleteRole,
        initializePassword : initializePassword
    };
    /*输出内容，注意顺序*/
    exports('userMng',obj)
})