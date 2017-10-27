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
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    //初始化时间
    var setTime = function () {
        var eTime =  date.getFullYear() + seperator1 + month + seperator1 + strDate;
        $('input[name=time]').val(eTime);
        loadList();
    };
    //遮罩
    function ityzl_SHOW_LOAD_LAYER(){
        return layer.msg('加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false,offset: '0px', time:100000}) ;
    }
    var loadList = function () {
        var ename = $("input[name=eName]").val(),
            queryDate = $("input[name=time]").val(),
            i;
        if(queryDate){
            var beginDate =  queryDate + " 00:00:00",
                endDate = queryDate + " 23:59:59";
        }else{
            var beginDate =  "2017-10-18 00:00:00",
                endDate = "2017-10-18 23:59:59";
        }
        var data = {
            epName : ename,
            beginDate : beginDate,
            endDate : endDate,
            cn : "2041"
        };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/statistics/daily/wastewater',
            // url :'http://172.21.92.236:8095/v01/htwl/lxh/statistics/daily/wastewater',
            headers : {
                Authorization:Authorization
            },
            type : 'get',
            data : data,
            beforeSend : function () {
                i = ityzl_SHOW_LOAD_LAYER();
            },
            success : function (result) {
                layer.close(i);
                layer.msg('加载完成！',{time: 1000,offset: '10px'});
                var str,
                    nums = 16; //每页出现的数据量
                //模拟渲染
                var render = function(result) {
                    var arr = [];
                    //废水流量(吨)	化学需氧量(mg/L)	氨氮(mg/L)	总磷(mg/L)	总氮(mg/L)	PH(无量纲)	六价铬(μg/L)	总镍(mg/L)	生物毒性(%)	温度(℃)	高锰酸盐(mg/L)	浊度(FTU)	电导率(μS/cm)	溶解氧(mg/L)	总电量
                    layui.each(result, function(index, item){
                        var valueObj = {}
                        for (var j in item.avgList){
                            valueObj[item.avgList[j].codeName] = item.avgList[j].avg;
                        }
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.name + '</td>' +
                            '<td>' + valueObj.废水流量 + '</td>' +
                            '<td>' + valueObj.COD + '</td>' +
                            '<td>' + valueObj.氨氮 + '</td>' +
                            '<td>' + valueObj.总磷 + '</td>' +
                            '<td>' + valueObj.总氮 + '</td>' +
                            '<td>' + valueObj.PH + '</td>' +
                            '<td>' + valueObj.六价铬 + '</td>' +
                            '<td>' + valueObj.总镍 + '</td>' +
                            '<td>' + valueObj.生物毒性 + '</td>' +
                            '<td>' + valueObj.温度 + '</td>' +
                            '<td>' + valueObj.高锰酸盐 + '</td>' +
                            '<td>' + valueObj.浊度 + '</td>' +
                            '<td>' + valueObj.电导率 + '</td>' +
                            '<td>' + valueObj.溶解氧 + '</td>' +
                            '<td>' + valueObj.总电量 + '</td>' +
                            // '<td>' + item.head + '</td>' +
                            // '<td>' + item.headPhone+ '</td>' +
                            // '<td>' + item.lon + '</td>' +
                            // '<td>' + item.lat + '</td>' +
                            '</tr>';
                        arr.push(str.replace(/undefined/g, '-'));
                    });
                    return arr.join('');
                };
                $("#fsrbb-list").html(render(result));
                //调用分页
                // laypage({
                //     cont: 'demo1',
                //     skin: '#00a5dd',
                //     pages : 1,
                //     curr: curr || 1, //当前页,
                //     skip: true,
                //     jump: function(obj,first){
                //         if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                //             loadList(obj.curr);
                //         }
                //     }
                // })
            }
        });
    };
    var obj = {
        setTime : setTime,
        loadList : loadList
    };
    /*输出内容，注意顺序*/
    exports('waterDaily',obj)
})