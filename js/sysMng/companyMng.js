/*
/企业管理ctrl
 */
layui.define(['layer', 'element','laypage','form','laydate','upload'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        cTobody = $('#company-result');
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
    //加载企业列表
    var loadCompanyData = function (curr) {
        var name = $('#name').val(),
            data = {
                name : name,
                pageNum : curr||1,
                pageSize : 16
               // areaCode : '500153'
            };
        var field = JSON.stringify(data);
        $.ajax({
            url :'http://172.21.92.63:8092/v01/htwl/lxh/enterprise/page',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'post',
            data : field,
            success : function (result) {
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var cData = result.data.list,
                     pages = result.data.pages,
                     str = "";
                //模拟渲染
                var render = function(cData, curr) {
                    var arr = []
                        , thisData = cData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.name + '</td>' +
                            '<td>' + item.address + '</td>' +
                            '<td>' + item.head+ '</td>' +
                            '<td>' + item.headPhone + '</td>' +
                            '<td><a href="#"><i class="layui-icon">&#xe63c;</i></a>' +
                            '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe620;</i></a>' +
                            '&nbsp;&nbsp;<a href="#"><i class="layui-icon">&#xe640;</i></a></td>' +
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                cTobody.html(render(cData, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo1',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr || 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadCompanyData(obj.curr);
                        }
                    }
                })
            }
        })
    };
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

        $(input).removeAttr("onchange").hide();
        thumb.find("img").remove();
        thumb.removeClass("thumb-input").prepend(str).show();
        thumb.after(thisContent);
        getImgSelection(input);
    };

    /*移除选择的图片*/
    var imgDelete = function (i) {
        var thumb = $(i).parent(".thumb");
        thumb.remove();
    };

    /*处理工艺的图片事件*/
    var clgyImgSelect = function (input) {
        /*创建图片路径*/
        var src = window.URL.createObjectURL(input.files[0]),
            thumb =  $(input).parent(".thumb"),
            thisContent = thumb[0].outerHTML;
        /*写HTML*/
        var str =
            '<img src="' + src + '"> ' +
            '<i class="layui-icon" onclick="layui.companyMng.imgDelete(this);">&#x1007;</i> '+
            '<div>' + ($(".clgy_item").find("input[name='gylx']").val()) + '</div>';    //工艺类型
        $(input).removeAttr("onchange").hide();
        thumb.find("img").remove();
        thumb.removeClass("thumb-input").prepend(str).show();
        thumb.after(thisContent);
        //重新定义上传按钮的事件
        // $('#clgy_upload').off("click").click(function () {
        //     $(".clgy_photos").find(".thumb-input").find("input").click()
        // });
        getImgSelection(input);
    };
    //定义上传按钮事件
    $('#clgy_upload').click(function () {
        $(".clgy_photos").find(".thumb-input").find("input").click()
    });

    /*获取所有图片的方法
    * urls: 图片的本地路径，若为C://fakepath/ 是被浏览器保护了
    * formData: 文件转为formData格式，在非IE浏览器可以用ajax的POST上传formData中文件
    * 		type: 'POST',           //必须是post
    * 		data: formData,         //参数为formData
    * 		contentType: false,  	//必要
    * 		processData: false,  	//必要，防止ajax处理文件流
    * */
    var getImgSelection = function (input) {
        var thumbs = $(input).parents(".photo-area").find(".thumbs"),
            urls = [],
            formData = new FormData();
        /*遍历*/
        $(thumbs).find('.thumb').each(function () {
            formData.append($(this).index().toString(), $(this).find("input")[0].files[0]);
            urls.push($(this).find("input").val());
        });
        console.log(urls);
        /*formData打印不出来的，需要有接口才能测试*/
        console.log(formData);
    };
    var addCompanyWin = function () {
        layer.open({
            title : '新增企业',
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/sysMng/addCompanyView.html',
            btn: ['提交', '关闭'],
            btnAlign: 'c',
            yes : function (index) {
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
            // ,zIndex: layer.zIndex //重点1
            // ,success: function(layero){
            //     layer.setTop(layero); //重点2
            // }
        })
    };
    /*新增排口*/
    var addPk = function () {
        var pk_win =  $('#pk_window');
        pk_win.find('input').attr('disabled', false);
        pk_win.find('.thumb-input').show();
        layer.open({
            type: 1
            ,title: '新增排口'
            ,area: ['800px']
            ,shade: 0.3
            ,content: pk_win
            ,btn: ['提交', '关闭'] //只是为了演示
            ,yes: function(){
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
            ,zIndex: layer.zIndex //重点1
            ,success: function(layero){
                layer.setTop(layero); //重点2
            }
        })
    };
    /*查看排口信息*/
    var lookPk = function () {
        var pk_win =  $('#pk_window');
        pk_win.find('input').attr('disabled', 'disabled');
        pk_win.find('.thumb-input').hide();
        layer.open({
            type: 1
            ,title: '查看排口'
            ,area: ['800px']
            ,shade: 0.3
            ,content: pk_win
            ,btn: ['提交', '关闭'] //只是为了演示
            ,yes: function(){
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
            ,zIndex: layer.zIndex //重点1
            ,success: function(layero){
                layer.setTop(layero); //重点2
            }
        })
    };
    // layer.ready(function(){
    //     loadCompanyData();
    // });
    /*输出内容，注意顺序*/
    var obj = {
        loadPage : loadPage,
        loadCompanyData : loadCompanyData,
        imgSelect: imgSelect,
        imgDelete: imgDelete,
        addCompanyWin : addCompanyWin,
        addPk : addPk,
        lookPk : lookPk,
        clgyImgSelect : clgyImgSelect
    };
    exports('companyMng',obj)
})