/*
/设备管理
 */
layui.define(['layer', 'element','laypage','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        eTobody = $('#equipment-result');
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    var loadEquipmentData = function (curr) {
        var equipmentName = $('#equipmentName').val(),
            data = {
                pageNumber : curr||1,
                pageSize : 16,
                equipmentMap : {
                    equipmentName : equipmentName
                }
            };
        var field = JSON.stringify(data);
        $.ajax({
            url :'http://172.21.92.63:8092/v01/htwl/lxh/jcsjgz/equipment/query/page',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'post',
            data : field,
            success : function (result) {
                console.log(result);
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var eData = result.data.rows,
                    pages = result.data.totalPage,
                    str = "";
                var render = function(eData, curr) {
                    var arr = []
                        , thisData = eData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.equipmentCode + '</td>' +
                            '<td>' + item.equipmentName + '</td>' +
                            '<td>' + item.equipmentNo+ '</td>' +
                            '<td>' + item.productor + '</td>' +
                            '<td>' + item.classicType + '</td>' +
                            '<td>' + item.classicType + '</td>' +
                            '<td>' + item.usedDate + '</td>' +
                            '<td>' + item.equipmentType + '</td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                eTobody.html(render(eData, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo3',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr || 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadEquipmentData(obj.curr);
                        }
                    }
                })
            }
        })
    }
    /*输出内容，注意顺序*/
    var obj = {
        loadPage : loadPage,
        loadEquipmentData : loadEquipmentData
    };
    exports('equipmentMng',obj)
})