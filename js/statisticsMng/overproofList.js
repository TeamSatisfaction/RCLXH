layui.define(['layer','element','layedit','laypage'], function(exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage;
    var urlConfig = sessionStorage.getItem("urlConfig");
    var Authorization = sessionStorage.getItem("Authorization");
    var loadList = function (curr) {
        var ename = $("input[name=eName]").val(),
            startTime = $("input[name=beginTime]").val(),
            endTime = $("input[name=endTime]").val();
        var data = {
            pageNo : curr||1,
            pageSize : 16,
            ename : ename
        };
        if(startTime){
            startTime = startTime + ' 00:00:00';
            data.startTime = startTime;
        }
        if(endTime){
            endTime = endTime + " 23:59:59"
            data.entTime = endTime;
        }
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/statistics/exceeding',
            headers : {
                Authorization:Authorization
            },
            type : 'get',
            async : false,
            data : data,
            success : function (result){
                console.log(result)
                var str = "",
                    pages = result.pages,
                    nums = 16; //每页出现的数据量
                //模拟渲染
                var render = function(result, curr) {
                    var arr = [],
                        list = result.list;
                    // , thisData = result.concat().splice(curr * nums - nums, nums);
                    layui.each(list, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.ename + '</td>' +
                            '<td style="color: red">' + item.startTime + '</td>' +
                            '<td style="color: red">' + item.entTime + '</td>' +
                            '<td>' + item.exceedingKey + '</td>' +
                            '<td>' + item.exceedingValue + '</td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                $("#over-list").html(render(result, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo1',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr || 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadList(obj.curr);
                        }
                    }
                })
            }
        });

    };
    var obj = {
        loadList : loadList
    };
    /*输出内容，注意顺序*/
    exports('overproofList',obj)
})