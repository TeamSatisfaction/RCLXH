layui.define(['layer', 'element','form'],function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form();
        element = layui.element();
    //页面跳转
    var loadPage = function(url,p){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };

    var getTab = function () {
        // layui.companyMng.loadCompanyData();
        var tabIndex = layui.utils.getArg("token");
        element.tabChange('sysmng', tabIndex.toString());
        $('#index_frame', parent.document).show();
        switch (tabIndex){
            case '0':layui.companyMng.loadCompanyList();break;
            case '1':layui.MSMng.loadMSData();break;
            case '2':layui.equipmentMng.loadMnSelect();;break;
            case '3':layui.networkMng.loadNetWorkData();break;
            case '4':layui.userMng.loadUserData();break;
            case '5':layui.roleMng.loadRoleData();break;
        }
    };

    function loadAuthen(){
        var storage=window.localStorage;
        var authList = JSON.parse(storage.getItem("authList"));
        console.log(authList)
        $(".auth-btn").each(function(){
            var flag = false;
            for(var i in authList){
                if(authList[i].authId == $(this).attr('data-authId')){
                    // $(this).attr('data-ajaxUrl', authList[i].url);
                    // $(this).attr('data-ajaxType', authList[i].type);
                    $(this).show();
                    flag = true;
                }
            }
            if(!flag){ $(this).hide() }
        });
    }
    var obj = {
        loadPage : loadPage,
        getTab: getTab,
        loadAuthen : loadAuthen
    };
    /*输出内容，注意顺序*/
    exports('sysMng',obj)
})