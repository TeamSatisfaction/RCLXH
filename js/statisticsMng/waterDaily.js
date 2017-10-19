layui.define(['layer','element','layedit','laypage'], function(exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage;
    var urlConfig = sessionStorage.getItem("urlConfig");
    var loadList = function () {
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
            epName : ename,
            beginDate : beginDate,
            endDate : endDate,
            cn : "2041"
        };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/statistics/daily/wastewater',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            async : false,
            data : data,
            success : function (result){
                console.log(result)
                return false;
            }
        });
    };
    var obj = {
        loadList : loadList
    };
    /*输出内容，注意顺序*/
    exports('waterDaily',obj)
})