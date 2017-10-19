layui.define(['layer','element','layedit','laypage'], function(exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage;
    var urlConfig = sessionStorage.getItem("urlConfig");
    var loadList = function () {
        console.log(1)
        var ename = $("input[name=eName]").val(),
            startTime = $("input[name=beginTime]").val(),
            endTime = $("input[name=endTime]").val();
        if(startTime){
            startTime = startTime + '00:00:00';
        }
        if(endTime){
            endTime = endTime + "23:59:59"
        }
        var data = {
            ename : ename,
            startTime : startTime,
            entTime : endTime
        };
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/statistics/exceeding',
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
    exports('overproofList',obj)
})