/*
/企业管理ctrl
 */
layui.define(['layer', 'element','form','laydate','upload'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer;
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    layui.upload({
        url: ''
        ,elem: ['#test1','#test2']//指定原始元素，默认直接查找class="layui-upload-file"
        ,method: 'get' //上传接口的http类型
        ,success: function(res){
            LAY_demo_upload.src = res.url;
        }
    });
    /*输出内容，注意顺序*/
    var obj = {
        loadPage : loadPage
    };
    exports('companyMng',obj)
})