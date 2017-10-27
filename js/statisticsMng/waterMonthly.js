/**
 * Created by Administrator on 2017/10/23.
 */
layui.define(['layer','element','layedit','laypage'], function(exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage;
    var urlConfig = sessionStorage.getItem("urlConfig");
    var Authorization = sessionStorage.getItem("Authorization");
    //当前时间
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    // if (strDate >= 0 && strDate <= 9) {
    //     strDate = "0" + strDate;
    // }
    // var dealTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
    //     + " " + date.getHours() + seperator2 + date.getMinutes()
    //     + seperator2 + date.getSeconds();
    //初始化时间
    var setTime = function () {
        var eTime =  date.getFullYear() + seperator1 + month;
        $('input[name=time]').val(eTime);
        loadList()
    };
    var loadList = function (curr) {
        var ename = $("input[name=eName]").val(),
            queryDate = $("input[name=time]").val();
        if(queryDate){
            var beginDate =  queryDate + "00:00:00",
                endDate = queryDate + "23:59:59";
        }else{
            var beginDate =  "2017-10-18 00:00:00",
                endDate = "2017-10-18 23:59:59";
        }
        var data = {
            pageNum : curr||1,
            pageSize : 16,
            epName : ename,
            beginDate : beginDate,
            endDate : endDate,
            cn : "2041"
        };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/statistics/daily/wastewater',
            headers : {
                Authorization:Authorization
            },
            type : 'get',
            async : false,
            data : data,
            success : function (result){
                console.log(result)
                var str = "",
                    nums = 16; //每页出现的数据量
                //模拟渲染
                var render = function(result, curr) {
                    var arr = [];
                    // , thisData = result.concat().splice(curr * nums - nums, nums);
                    layui.each(result, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.name + '</td>' +
                            // '<td>' + item.address + '</td>' +
                            // '<td>' + item.head + '</td>' +
                            // '<td>' + item.headPhone+ '</td>' +
                            // '<td>' + item.lon + '</td>' +
                            // '<td>' + item.lat + '</td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                $("#fsrbb-list").html(render(result, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo1',
                    skin: '#00a5dd',
                    pages : 1,
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
        setTime : setTime,
        loadList : loadList
    };
    /*输出内容，注意顺序*/
    exports('waterMonthly',obj)
})