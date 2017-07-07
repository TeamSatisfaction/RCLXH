layui.define(['layer', 'element','laypage','layedit', 'laydate'],function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        element = layui.element,
        laypage = layui.laypage,
        layedit = layui.layedit,
        laydate = layui.laydate,
        cTobody = $('#company-result');
    var loadCompanyData = function () {
        var name = $("#name").val();
        console.log(name);
        $.post("../../data/companyData.json",function (data,status) {
            if(status == "success") {
                var cData = data.jsonObject.data,
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
                            '<td><a href="#"><i class="layui-icon">&#xe63c;</i></a>' +
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
                    ,pages: Math.ceil(cData.length/nums) //得到总页数
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
    loadCompanyData();
    var obj = {
        loadCompanyData : loadCompanyData
    }
    /*输出内容，注意顺序*/
    exports('sysMng',obj)
})