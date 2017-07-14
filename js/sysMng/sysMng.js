layui.define(['layer', 'element','laypage','layedit', 'laydate'],function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        element = layui.element(),
        // layedit = layui.layedit,
        // laydate = layui.laydate,
        eTobody = $('#equipment-result'),
        uTobody = $('#user-result');
    //页面跳转
    var loadPage = function(url,p){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
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
                        // var num = curr * nums - nums+1;
                        // console.log(curr);
                        // console.log(num);
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
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                //调用分页
                laypage({
                    cont: 'demo3'
                    ,skin: '#00a5dd'
                    ,pages: Math.ceil(eData.length/nums) //得到总页数
                    ,jump: function(obj){
                        eTobody.html(render(eData, obj.curr));
                    }
                    , skip: true
                });
            }
        })
    };
    //加载用户列表
    var loadUserData = function () {
        $.ajax({

        })
    };
    //Hash地址的定位
    var layid = location.hash.replace(/^#test=/, '');
    element.tabChange('test', layid);
    element.on('tab(test)', function(elem){
        location.hash = 'test='+ $(this).attr('lay-id');
    });
    loadEquipmentData();
    loadUserData();
    var obj = {
        loadPage : loadPage,
        loadEquipmentData : loadEquipmentData,
        loadUserData : loadUserData
    };
    /*输出内容，注意顺序*/
    exports('sysMng',obj)
})