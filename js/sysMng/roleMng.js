
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
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'get',
            success: function (result) {
                // console.log(result);
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
                            '<td style="text-align: center">' + item.description + '</td>' +
                            '<td style="text-align: center">'+
                            '<a href="#" onclick="layui.roleMng.roleMngWin(\''+item.roleId+'\')" title="编辑"><img src="../../img/mng/configure.png"></a>'+
                            '&nbsp;&nbsp;&nbsp;<a href="#" onclick="layui.roleMng.deleteRole(\''+item.roleId+'\')" title="删除"><img src="../../img/mng/delete.png"></a>'+
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
    //新增角色窗口
    var addRoleWin = function (){
        var index = layer.open({
            title : '新增角色',
            type : 2,
            moveOut: true,
            area : ['500px','300px'],
            content : '../../pages/sysMng/addRoleView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index,layero) {
                var body = layer.getChildFrame('body', index);
                var roleName = body.find('#roleName').val(),
                    description = body.find('#description').val();
                var data = {
                    roleName : roleName,
                    description : description
                };
                var field = JSON.stringify(data);
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/role',
                    headers : {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    dataType : 'json',
                    type : 'post',
                    data : field,
                    success : function (result){
                        if(result.resultcode == 2){
                            layer.msg('新增成功！', {icon: 1});
                            layer.close(index);
                            location.reload(); // 页面刷新
                        }else {
                            layer.msg(result.resultdesc, {icon: 2});
                        }
                    }
                })
            }
        });
    };
    var deleteRole = function (id) {
        layer.msg('是否确定删除', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/role/'+id+'',
                    headers : {
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'delete',
                    success : function (result){
                        if(result.resultcode == 2){
                            layer.msg('删除成功！', {icon: 1});
                            layer.close(index);
                            location.reload(); // 页面刷新
                        }else {
                            layer.msg(result.resultdesc, {icon: 2});
                        }
                    }
                })
            }
        });
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
                var id = $('.layui-layer-content').attr('id'),
                    winFrame = layero.find("iframe")[0].contentWindow;
                tree(id,winFrame);
            },
            yes : function (index,layero) {
                var id = $('.layui-layer-content').attr('id'),
                    winFrame = layero.find("iframe")[0].contentWindow;
                var treeDemo = winFrame.document.getElementById("treeDemo");
                var treeObj = winFrame.jQuery.fn.zTree.getZTreeObj('treeDemo');
                var Nodes = treeObj.getCheckedNodes(true);
                var arry = [{menuId:"0",roleId : id}];
                for(var i in Nodes){
                    var tId = Nodes[i].tId;
                    var menuId=tId.split("_")[1];
                    var data = {
                        menuId:menuId,
                        roleId : id
                    };
                    arry.push(data);
                }
                 console.log(arry);
                var field = JSON.stringify(arry);
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/role/menu',
                    headers : {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    dataType : 'json',
                    type : 'post',
                    data : field,
                    success : function (result){
                        layer.msg('提交成功！', {icon: 1});
                        console.log(result);
                    }
                })
            }
        });
    };
    var zTreeObj; //zTree对象
    var tree = function (id,winFrame) {
        // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
        var setting = {
            check : {
                enable: true, //显示复选框
                chkStyle : "checkbox"
            }
        };
        // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
        var zNodes = [
            {name:"菜单功能权限配置", open:true, children:[
                {name:"污染源"}, {name:"报警管理"}, {name:"水质自动监测站"}, {name:"统计分析",open:true,children:[
                    {name:"报警统计"},{name:"监测统计"}
                ]},{name:"系统管理",open:true,children:[
                    {name:'企业管理'}, {name:'监测站管理'}, {name:'设备管理'},{name:'联网管理'},{name:'用户管理'},{name:'角色管理'}
                ]}]}
        ];
        var treeDemo = winFrame.document.getElementById("treeDemo");
        zTreeObj = winFrame.jQuery.fn.zTree.init($(treeDemo), setting, zNodes);
        loadRoleStore(id,winFrame);
    };
    // 加载权限
    var loadRoleStore = function (id,winFrame) {
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/role/menu/'+id+'',
            headers: {
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type: 'get',
            success: function (result) {
                console.log(result);
                if(result.length > 0) {
                    var treeObj = winFrame.jQuery.fn.zTree.getZTreeObj('treeDemo');
                    var nodes = treeObj.getNodes();
                    var checkedArr = getCheckedArr(result[0], []);
                    checkTree(nodes, checkedArr, treeObj);
                }
            }
        });
        // $.ajax({
        //     url : '../../data/roleData.json',
        //     type : 'get',
        //     success: function (result){
        //         var treeObj = winFrame.jQuery.fn.zTree.getZTreeObj('treeDemo');
        //         var nodes = treeObj.getNodes();
        //         // // var children1 = nodes.children;
        //         //     console.log(nodes);
        //         // // for (var i=0; i < nodes.length; i++) {
        //         // //     treeObj.checkNode(nodes[i], true, true);
        //         // // }
        //         // console.log(getCheckedArr(result[0],[]) );
        //         var checkedArr = getCheckedArr(result[0],[]);
        //         checkTree(nodes, checkedArr, treeObj );
        //     }
        // })
    };
    //已选中的项(最下层)
    function getCheckedArr(jsonObject, array) {
        var name;
        if(!jsonObject.menuList){
            name = jsonObject.menuName;
            array.push(name);
        }else{
            for(var i in jsonObject.menuList){
                getCheckedArr(jsonObject.menuList[i], array)
            }
        }
        return array;
    }
    //打钩
    function checkTree(nodes, checkedArr, treeObj ){
        for(var i in nodes){
            if($.inArray(nodes[i].name, checkedArr)!=-1){
                treeObj.checkNode(nodes[i], true, true);
            }
            if(nodes[i].children && nodes[i].children.length>0){
                checkTree(nodes[i].children, checkedArr, treeObj)
            }
        }
    }

    var obj = {
        loadRoleData : loadRoleData,
        addRoleWin : addRoleWin,
        deleteRole : deleteRole,
        roleMngWin : roleMngWin
    };
    /*输出内容，注意顺序*/
    exports('roleMng',obj)
});