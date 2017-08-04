layui.define(['layer','element','laypage','form'],function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form(),
        rTobody = $('#role-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    //加载角色列表
    var loadRoleData = function () {
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/user/role/query',
            headers: {
                // 'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'get',
            success: function (result) {
                console.log(result);
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var str = "";
                var render = function(result, curr) {
                    var arr = []
                        , thisData = result.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td style="text-align: center">' + item.roleName + '</td>' +
                            // '<td><a href="#"><i class="layui-icon">&#xe63c;</i></a>' +
                            // '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe620;</i></a>' +
                            // '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe640;</i></a></td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                rTobody.html(render(result, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo5',
                    skin: '#00a5dd',
                    pages : 1,
                    curr: 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        // if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                        //     loadRoleData(obj.curr);
                        // }
                    }
                })
            }
        })
    };
    var obj = {
        loadRoleData : loadRoleData
    };
    /*输出内容，注意顺序*/
    exports('roleMng',obj)
})