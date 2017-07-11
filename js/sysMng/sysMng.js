layui.define(['layer', 'element','laypage','layedit', 'laydate'],function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        layedit = layui.layedit,
        laydate = layui.laydate,
        cTobody = $('#company-result');
        eTobody = $('#equipment-result');
        uTobody = $('#user-result');
    //页面跳转
    var loadPage = function(objectid){
        var url = "pages/sysMng/companyDataView.html";  //相对于主页面的路径
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //加载企业列表
    var loadCompanyData = function () {
        $.post("../../data/companyData.json",function (data,status) {
            if(status == "success") {
                var cData = data.jsonObject.data,
                    pages = data.jsonObject.totalCount,
                    pageNumber = data.jsonObject.pageNumber,
                    str = "";
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var render = function(cData, curr){
                    var arr = []
                        ,thisData = cData.concat().splice(curr*nums-nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.NAME + '</td>' +
                            '<td>' + item.ADDRESS + '</td>' +
                            '<td>' + item.LEVEL + '</td>' +
                            '<td>' + item.LINKNAME + '</td>' +
                            '<td>' + item.LINKPHONE + '</td>' +
                            '<td><a href="#" onclick="layui.sysMng.loadPage('+item.OBJECTID+')"><i class="layui-icon">&#xe63c;</i></a>' +
                            '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe620;</i></a>' +
                            '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe640;</i></a></td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                //调用分页
                laypage({
                    cont: 'demo1'
                    ,pages: Math.ceil(pages/nums) //得到总页数
                    ,curr : pageNumber  //当前页
                    ,jump: function(obj){
                        cTobody.html(render(cData, obj.curr));
                    }
                    , skip: true
                });
            }else{
                layer.msg('请求失败！');
            }
        })
    };
    //加载设备列表
    var loadEquipmentData = function () {
        $.ajax({
            url :'../../data/equipmentData.json',
            type : 'post',
            success : function (result) {
                var eData = result.jsonObject.data,
                    str = "";
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var render = function(eData, curr) {
                    var arr = []
                        , thisData = eData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.eCode + '</td>' +
                            '<td>' + item.name + '</td>' +
                            '<td>' + item.eModel + '</td>' +
                            '<td>' + item.mType + '</td>' +
                            '<td>' + item.eType + '</td>' +
                            '<td>' + item.eCType + '</td>' +
                            '<td>' + item.useTime + '</td>' +
                            '<td>' + item.ifEquipment + '</td>' +
                            '<td><a href="#" onclick=""><i class="layui-icon">&#xe63c;</i></a>' +
                            '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe620;</i></a>' +
                            '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe640;</i></a></td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                //调用分页
                laypage({
                    cont: 'demo2'
                    ,pages: Math.ceil(eData.length/nums) //得到总页数
                    ,jump: function(obj){
                        eTobody.html(render(eData, obj.curr));
                    }
                    , skip: true
                });
            }
        })
    }
    //加载用户列表
    var loadUserData = function () {
        $.ajax({

        })
    }
    loadEquipmentData();
    loadCompanyData();
    loadUserData();
    var obj = {
        loadPage : loadPage,
        loadCompanyData : loadCompanyData,
        loadEquipmentData : loadEquipmentData
    };
    /*输出内容，注意顺序*/
    exports('sysMng',obj)
})