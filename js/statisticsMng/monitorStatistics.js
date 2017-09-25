/**
 * Created by Administrator on 2017/8/18.
 */
layui.define(['layer','element','layedit','laypage','form'], function(exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form(),
        aTobody = $('#alarm-result');
    //页面跳转
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    var monitorListWin = function () {
        var index = layer.open({
            title : '污染源排放量',
            type : 2,
            content : '../../pages/statisticsMng/monitorStatisticsList.html',
            btn: ['返回'],
            btnAlign: 'c',
            success : function (index, layero) {
                var body = layer.getChildFrame('body', layero);
                var id = $('.layui-layer-content').attr('id');
                // loadAlarmDetails(id,body);
            }
        });
        layer.full(index);
    };
    var monitorListYearWin = function () {
        var index = layer.open({
            title : '年度统计',
            type : 2,
            content : '../../pages/statisticsMng/monitorStatisticsYearList.html',
            btn: ['返回'],
            btnAlign: 'c',
            success : function (index, layero) {
                var body = layer.getChildFrame('body', layero);
                var id = $('.layui-layer-content').attr('id');
                // loadAlarmDetails(id,body);
            }
        });
        layer.full(index);
    };
    // var loadDailyList = function () {
    //     var curr = 1,
    //         nums = 16,
    //         str = '';
    //     $.ajax({
    //         url: '../../data/fsrsj.json',
    //         dataType : 'json',
    //         type: 'get',
    //         success: function(data){
    //             var render = function(data, curr) {
    //                 var arr = []
    //                     , thisData = data.concat().splice(curr * nums - nums, nums);
    //                 layui.each(thisData, function(index, item){
    //                     console.log(item);
    //                     var row = data.rows,
    //                         str1 = '',
    //                         str2 = '';
    //                     layui.each(row, function(index, item){
    //                         str1 = '<th>'+item.dName+'</th>';
    //                         str2 = '<th>标准限值</th>'+
    //                                 '<th>日均值</th>'
    //                     },
    //                     str = '<colgroup>'+
    //                         '<col width="60">'+
    //                         '<colgroup>'+
    //                         '<thead>'+
    //                         '<tr>'+
    //                         '<th rowspan="2">序号</th>'+
    //                         '<th rowspan="2">企业名称</th>'+
    //                         '<th rowspan="2">监测日期</th>'+
    //                         '<th rowspan="2">废水流量(吨)</th>'+
    //                         '</tr>'+
    //                         '</thead>'+
    //                         '<tbody>'+
    //                         '<tr>'+
    //                         '<td>'+(index+1)+'</td>'+
    //                         '<td>' + item.name + '</td>'+
    //                         '<td>' + item.rq + '</td>'+
    //                         '<td>' + item.ll + '</td>'+
    //                         '</tr>'+
    //                     '</tbody>';
    //                     arr.push(str);
    //                 });
    //                 return arr.join('');
    //             };
    //             $('#fsrbb-list').html(render(data, obj.curr));
    //         }
    //     })
    // };
    var obj = {
        loadPage : loadPage,
        // loadaCharts : loadaCharts,
        // loadPie : loadPie,
        monitorListWin : monitorListWin,
        monitorListYearWin : monitorListYearWin,
        loadDailyList : loadDailyList
    };
    /*输出内容，注意顺序*/
    exports('monitorStatistics',obj)
})
