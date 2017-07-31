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
    //Hash地址的定位
    // var layid = location.hash.replace(/^#test=/, '');
    // element.tabChange('test', layid);
    // element.on('tab(test)', function(elem){
    //     location.hash = 'test='+ $(this).attr('lay-id');
    // });

    var getTab = function () {
        // layui.companyMng.loadCompanyData();
        var tabIndex = layui.utils.getArg("token");
        element.tabChange('sysmng', tabIndex.toString());
        $('#index_frame', parent.document).show();
        switch (tabIndex){
            case '0':layui.companyMng.loadCompanyData();break;
            case '1':layui.MSMng.loadMSData();break;
            case '2':layui.equipmentMng.loadEquipmentData();break;
            case '3':layui.networkMng.loadNetWorkData();break;
            case '4':layui.userMng.loadUserData();break;
            case '5':layui.roleMng.loadRoleData();break;
        }
    };
    var obj = {
        loadPage : loadPage,
        getTab: getTab
    };
    /*输出内容，注意顺序*/
    exports('sysMng',obj)
})