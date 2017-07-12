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
    // layui.upload({
    //     url: ''
    //     ,elem: ['#test1','#test2']//指定原始元素，默认直接查找class="layui-upload-file"
    //     ,method: 'get' //上传接口的http类型
    //     ,success: function(res){
    //         LAY_demo_upload.src = res.url;
    //     }
    // });

    /*选择图片*/
    var imgSelect = function (input) {
        /*创建图片路径*/
        var src = window.URL.createObjectURL(input.files[0]),
            thumb =  $(input).parent(".thumb"),
            thisContent = thumb[0].outerHTML;
        /*写HTML*/
        var str =
                '<img src="' + src + '"> ' +
                '<i class="layui-icon" onclick="layui.companyMng.imgDelete(this);">&#x1007;</i> ' ;
        console.log(thumb);
        $(input).removeAttr("onchange").hide();
        thumb.find("img").remove();
        thumb.removeClass("thumb-input").prepend(str);
        thumb.after(thisContent);
        getImgSelection();
    };
    /*移除选择的图片*/
    var imgDelete = function (i) {
        var thumb = $(i).parent(".thumb");
        thumb.remove();
    };

    /*获取所有图片的方法
    * urls: 图片的本地路径，若为C://fakepath/ 是被浏览器保护了
    * formData: 文件转为formData格式，在非IE浏览器可以用ajax的POST上传formData中文件
    * 		type: 'POST',           //必须是post
    * 		data: formData,         //参数为formData
    * 		contentType: false,  	//必要
    * 		processData: false,  	//必要，防止ajax处理文件流
    * */
    var getImgSelection = function () {
        var zb_thumbs = $(".photo-area").find(".thumbs").eq(0),
            fb_thumbs = $(".photo-area").find(".thumbs").eq(1),
            zb_urls = [],
            fb_urls = [],
            zb_formData = new FormData(),
            fb_formData = new FormData();
        /*正本*/
        $(zb_thumbs).each(function () {
            zb_formData.append($(this).index().toString(), $(this).find("input")[0].files[0]);
            zb_urls.push($(this).find("input").val());
        });
        /*副本*/
        $(fb_thumbs).each(function () {
            fb_formData.append($(this).index().toString(), $(this).find("input")[0].files[0]);
            fb_urls.push($(this).find("input").val());
        });
        /*formData打印不出来的，需要有接口才能测试*/
        console.log(zb_formData, fb_formData);
    };




    /*输出内容，注意顺序*/
    var obj = {
        loadPage : loadPage,
        imgSelect: imgSelect,
        imgDelete: imgDelete
    };
    exports('companyMng',obj)
})