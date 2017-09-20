/**
 * Created by Administrator on 2017/9/20.
 */
layui.define(['layer', 'element','laypage','form'],function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form();
    var urlConfig = sessionStorage.getItem("urlConfig");
    //新增规则
    var addAlarmRuleWin = function () {

        layer.open({
            title : '新增报警规则',
            type : 2,
            // id : id,
            moveOut: true,
            area : ['1000px','700px'],
            content : '../../pages/alarmMng/onlineAlarmRule.html',
            btn: [ '提交','返回'],
            btnAlign: 'c',
            success: function(layero,index){

            },
            yes  : function (index,layero) {
                layero.find('.icon-save').click();
            }
        });
    };
    var obj = {
        addAlarmRuleWin : addAlarmRuleWin
    };
    exports('onlineAlarmRuleMng',obj)
})