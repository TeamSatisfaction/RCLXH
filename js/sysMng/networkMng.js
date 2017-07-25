/*
 *监测站管理
 */
layui.define(['layer','element','laypage', 'laydate','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        element=layui.element(),
        laypage = layui.laypage,
        form = layui.form();
    var scyTobody = $('#scy-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    //页面跳转
    var loadPage = function(url,p){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //载入联网列表
    var loadNetWorkData = function (curr) {
        var address = $('#Mn_address').val(),
            data = {
                pageNumber : curr||1,
                pageSize : 16,
                dauMap : {
                    address : address
                }
            };
        var field = JSON.stringify(data);
        $.ajax({
            url: ''+urlConfig+'/v01/htwl/lxh/jcsjgz/dau/query/page',
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            data : field,
            type: 'post',
            success: function (result) {
                console.log(result);
                var rows = result.data.rows;
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var str = "";
                var render = function(rows, curr) {
                    var arr = []
                        , thisData = rows.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.aname + '</td>' +
                            '<td>' + item.mn + '</td>' +
                            '<td>' + item.address + '</td>' +
                            '<td>' + item.epName + '</td>' +
                            '<td style="text-align: center"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini">详情</button></td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                scyTobody.html(render(rows, obj.curr));
            }
        })
    }
    var addNetworkWin = function () {
        layer.open({
            title : '新增联网信息',
            type : 2,
            area : ['800px','500px'],
            content : '../../pages/sysMng/addNetworkView.html'
        })
    };
    //关闭窗口
    var closeAddWin = function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    };

    var obj = {
        loadPage : loadPage,
        loadNetWorkData : loadNetWorkData,
        addNetworkWin : addNetworkWin,
        closeAddWin : closeAddWin
    };
    /*输出内容，注意顺序*/
    exports('networkMng',obj)
})