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
                            '<td style="text-align: center">' +
                            '<a href="#"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini" onclick="layui.roleMng.roleMngWin('+item.roleId+')">编辑</button></a>&nbsp;&nbsp;' +
                            '<a href="#"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini">删除</button></a></td>' +
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
    //权限配置窗口
    var roleMngWin = function (id) {
        var index = layer.open({
            title : '权限配置',
            type : 2,
            id : id,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/roleMng.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            success: function(layero, index){
                var id = $('.layui-layer-content').attr('id');

            },
            yes : function (index) {
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
        });
    };
    // var checkboxTree = function () {
    //     var zTreeObj;
    //     // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    //     var setting = {
    //         check : {
    //             enable: true, //显示复选框
    //             chkStyle : "checkbox"
    //         }
    //     };
    //     // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
    //     var zNodes = [
    //         {name:"功能权限配置", open:true, children:[
    //             {name:"污染源"}, {name:"报警管理"}, {name:"水质自动监测站"}, {name:"系统管理",open:true,children:[
    //                 {name:'企业管理'}, {name:'监测站管理'}, {name:'设备管理'},{name:'联网管理'},{name:'用户管理'},{name:'角色管理'}
    //             ]}]}
    //     ];
    //     $(document).ready(function(){
    //         zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    //     });
    // };
    var obj = {
        loadRoleData : loadRoleData,
        roleMngWin : roleMngWin
    };
    /*输出内容，注意顺序*/
    exports('roleMng',obj)
});