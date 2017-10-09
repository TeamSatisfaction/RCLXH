/*
/企业管理ctrl
 */
layui.define(['layer', 'element','laypage','form','upload'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form(),
        cTobody = $('#company-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //加载企业列表
    var loadCompanyList = function (curr) {
        var name = $('#name').val(),
            data = {
                name : name,
                pageNum : curr||1,
                pageSize : 16,
                enterpriseRole : 'production_enterprise',
                areaCode : '500000-500153'
            };
        var field = JSON.stringify(data);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/page',
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
                if(cData != null) {
                    var render = function (cData, curr) {
                        var arr = []
                            , thisData = cData.concat().splice(curr * nums - nums, nums);
                        layui.each(thisData, function (index, item) {
                            str = '<tr>' +
                                '<td>' + (index + 1) + '</td>' +
                                '<td>' + item.name + '</td>' +
                                '<td>' + item.address + '</td>' +
                                '<td>' + item.head + '</td>' +
                                '<td>' + item.headPhone + '</td>' +
                                '<td style="text-align: center"><a class="auth-btn" data-authId="19" href="#" onclick="layui.companyMng.detailCompanyWin(\'' + item.baseEnterpriseId + '\')" title="企业详情"><img src="../../img/mng/details.png"></a>' +
                                '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="21" href="#" onclick="layui.companyMng.alterCompanyWin(\'' + item.baseEnterpriseId + '\')" title="更新企业"><img src="../../img/mng/alter.png"></a>' +
                                '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="54" href="#" onclick="layui.companyMng.alarmRuleList(\'' + item.baseEnterpriseId + '\')" title="报警规则列表"><img src="../../img/mng/configure.png"></a>' +
                                '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="20" href="#" onclick="layui.companyMng.deleteCompanyData(\'' + item.baseEnterpriseId + '\')" title="删除企业"><img src="../../img/mng/delete.png"></a>' +
                                '</tr>';
                            arr.push(str);
                        });
                        return arr.join('');
                    };
                    cTobody.html(render(cData, obj.curr));
                }else{
                    cTobody.html(str);
                }
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
    /*单选图片*/
    var imgSelect1 = function (input) {
        /*创建图片路径*/
        var src = window.URL.createObjectURL(input.files[0]),
            thumb =  $(input).parent(".thumb");
        /*写HTML*/
        var str =
            '<img src="' + src + '"> ' +
            '<i class="layui-icon" onclick="layui.companyMng.imgDelete1(this);">&#x1007;</i> ';
        $(input).removeAttr("onchange").hide();
        thumb.find("img").remove();
        thumb.removeClass("thumb-input").prepend(str).show();
        getImgLicence(input);
    };
    /*多选图片*/
    var imgSelect = function (input) {
        /*创建图片路径*/
        var src = window.URL.createObjectURL(input.files[0]),
            thumb =  $(input).parent(".thumb"),
            thisContent = thumb[0].outerHTML;
        /*写HTML*/
        var str =
                '<img src="' + src + '"> ' +
                '<i class="layui-icon" onclick="layui.companyMng.imgDelete(this);">&#x1007;</i> ';
        $(input).removeAttr("onchange").hide();
        thumb.find("img").remove();
        thumb.removeClass("thumb-input").prepend(str).show();
        thumb.after(thisContent);
        getImgSelection(input);
    };
    /*移除单个选择的图片*/
    var imgDelete1 = function (i) {
        var thumb = $(i).parent(".thumb");
        var fileId = thumb.find("img").attr("data-id");
        $.ajax({
            url : 'http://39.108.112.173:9021/v03/htwl/file/'+fileId+'',
            post : 'delete',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            success : function (result){
                if(result.code == 1000){
                    $.ajax({
                        url :''+urlConfig+'/v01/htwl/lxh/enterprise/attachment/'+fileId+'',
                        post : 'delete',
                        headers : {
                            Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                        },
                        success : function (result){
                            console.log(result);
                            thumb.empty();
                            var str =
                                '<img src="../../img/plus.png">'+
                                '<input name="thumb1" class="layui-upload-file" type="file" ' +
                                'accept="image/gif,image/jpeg,image/jpg,image/png" onchange="layui.companyMng.imgSelect1(this);">';
                            thumb.html(str);
                        }
                    })
                }
            }
        })
    };
    /*移除多个选择的图片*/
    var imgDelete = function (i) {
        var thumb = $(i).parent(".thumb"),
            fileId = thumb.find("img").attr("data-id");
        $.ajax({
            url : 'http://39.108.112.173:9021/v03/htwl/file/'+fileId+'',
            post : 'delete',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            success : function (result){
                if(result.code == 1000){
                    $.ajax({
                        url :''+urlConfig+'/v01/htwl/lxh/enterprise/attachment/'+fileId+'',
                        post : 'delete',
                        headers : {
                            Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                        },
                        success : function (result){
                            console.log(result);
                            thumb.remove();
                        }
                    })
                }
            }
        })
    };
    // /*处理工艺的图片事件*/
    // var clgyImgSelect = function (input) {
    //     /*创建图片路径*/
    //     var src = window.URL.createObjectURL(input.files[0]),
    //         thumb =  $(input).parent(".thumb"),
    //         thisContent = thumb[0].outerHTML;
    //     /*写HTML*/
    //     var str =
    //         '<img src="' + src + '"> ' +
    //         '<i class="layui-icon" onclick="layui.companyMng.imgDelete(this);">&#x1007;</i> '+
    //         '<div>' + ($(".clgy_item").find("input[name='gylx']").val()) + '</div>';    //工艺类型
    //     $(input).removeAttr("onchange").hide();
    //     thumb.find("img").remove();
    //     thumb.removeClass("thumb-input").prepend(str).show();
    //     thumb.after(thisContent);
    //     getImgSelection(input);
    // };
    // //定义上传按钮事件
    // $('#clgy_upload').click(function () {
    //     $(".clgy_photos").find(".thumb-input").find("input").click()
    // });
    /*获取所有图片的方法
    * urls: 图片的本地路径，若为C://fakepath/ 是被浏览器保护了
    * formData: 文件转为formData格式，在非IE浏览器可以用ajax的POST上传formData中文件
    * 		type: 'POST',           //必须是post
    * 		data: formData,         //参数为formData
    * 		contentType: false,  	//必要
    * 		processData: false,  	//必要，防止ajax处理文件流
    * */
    //提交企业附件
    var getImgSelection = function (input) {
        var Cid = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
        var formData = new FormData();
            formData.append(input.value, input.files[0]);
        /*formData打印不出来的，需要有接口才能测试*/
        $.ajax({
            url : 'http://39.108.112.173:9021/v03/htwl/file/upload',
            type: 'POST',           //必须是post
            data: formData,         //参数为formData
            contentType: false,  	//必要
            processData: false,  	//必要，防止ajax处理文件流
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            success : function (result){
                var data = result.data[0],
                    field = {
                        attachmentName : data.fileName,
                        attachmentAddress : data.uri,
                        attachmentGroup : 'enterprise',
                        majorKey : Cid,
                        createUser: 'admin'
                    };
                console.log(data);
                var thumb = $(input).parent(".thumb");
                thumb.find("img").attr("data-id",data.id);
                field = JSON.stringify(field);
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/enterprise/attachment',
                    headers : {
                        'Content-type': 'application/json;charset=UTF-8',
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    dataType : 'json',
                    type : 'post',
                    data : field,
                    success : function (result){
                        console.log(result);
                        layui.msg('上传成功!',{icon:1})
                    }
                })
            }
        })
    };
    //提交许可证附件
    var getImgLicence = function (input) {
        var thumb = $(input).parent(".thumb");
        var formData = new FormData();
        formData.append(input.value, input.files[0]);
        /*formData打印不出来的，需要有接口才能测试*/
        $.ajax({
            url : 'http://39.108.112.173:9021/v03/htwl/file/upload',
            type: 'POST',           //必须是post
            data: formData,         //参数为formData
            contentType: false,  	//必要
            processData: false,  	//必要，防止ajax处理文件流
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            success : function (result){
                var data = result.data[0];
                thumb.find("img").attr("data-id",data.fileId);
                thumb.find("img").attr("data-address",data.uri);
            }
        })
    };
    //新增企业信息
    var addCompanyWin = function () {
        var win = layer.open({
            title : '新增企业',
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/sysMng/addCompanyView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index,layero) {
                layero.find("iframe").contents().find('#company-save').click();
            }
        });
        layer.full(win);
    };
    //form表单提交-新增企业信息
    form.on('submit(company-save)',function (data) {
        data.field.areaCode = "500000-500153";
        data.field.orgCode = "production_enterprise"; //这里和enterpriseRole是反的
        data.field.establishDate = '2017-9-28';
        data.field.buildStatus = "已建成";
        var field = JSON.stringify(data.field);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            // dataType : 'json',
            type : 'post',
            data : field,
            success : function (result){
                console.log(result);
                var  frameindex= parent.layer.getFrameIndex(window.name);
                if(result.code == '1000'){
                    layer.msg('提交成功！', {icon: 1,time:1000},function () {
                        parent.layer.close(frameindex);
                        parent.location.reload(); // 父页面刷新
                    });
                    // parent.layer.msg('提交成功', { icon: 1, shade: 0.4, time: 1000 });
                }else{
                    layer.msg(result.message, {icon: 2});
                }
            }
        });
        return false;
    });
    //form表单提交-修改企业信息
    form.on('submit(company-alter)',function (data) {
        var Cid = $(window.parent.document).find('.layui-layer-content').attr('id');
        data.field.areaCode = "500000-500153";
        data.field.enterpriseRole = "production_enterprise";
        data.field.baseEnterpriseId = Cid;
        var field = JSON.stringify(data.field);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            // dataType : 'json',
            type : 'put',
            data : field,
            success : function (result){
                if(result.code == '1000'){
                    layer.msg('保存成功！', {icon: 1});
                }else{
                    layer.msg(result.message, {icon: 2});
                }
            }
        });
        return false;
    });
    //删除企业信息
    var deleteCompanyData = function (id) {
        layer.msg('是否确定删除该企业', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/enterprise/'+id+'',
                    headers : {
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'delete',
                    success : function (result){
                        if(result.code == '1000'){
                            layer.msg('删除成功', { icon: 1, shade: 0.4, time: 1000 },function () {
                                layer.close(index);
                                location.reload(); // 页面刷新
                            });
                        }else {
                            layer.msg(result.resultdesc, {icon: 2});
                        }
                    }
                })
            }
        });
    };
    // 编辑企业信息
    var alterCompanyWin = function (id) {
        var win = layer.open({
            title : '编辑企业信息',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/sysMng/alterCompanyView.html',
            btn: [ '返回'],
            btnAlign: 'c'
        });
        layer.full(win);
    };
    //编辑许可证信息
    form.on('submit(Licence-save)',function (data) {
        var id = $('.layui-form-item').find("input[name='id']").val();//许可证id
        var Cid = $(window.parent.document).find('.layui-layer-content').attr('id'),
            attach,
            field;
        var img1 = $('#thumb1').find("img").attr("data-address"),
            img2 = $('#thumb2').find("img").attr("data-address");
        if(!img1){
            img1 = 'null'
        }
        if(!img2){
            img2 = 'null'
        }
        attach = img1+","+img2;
        data.field.attach = attach;
        data.field.enterpriseId = Cid;
        if(id == ""){//新增
            field = JSON.stringify(data.field);
            $.ajax({
                url :''+urlConfig+'/v01/htwl/lxh/enterprise/license',
                headers : {
                    'Content-type': 'application/json;charset=UTF-8',
                    Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                },
                async : false,
                type : 'post',
                data : field,
                success : function (result){
                    if(result.code == '1000'){
                        layer.msg('保存成功！', {icon: 1});
                    }else{
                        layer.msg(result.message, {icon: 2});
                    }
                }
            })
        }else{//修改
            data.field.id = id;
            field = JSON.stringify(data.field);
            $.ajax({
                url :''+urlConfig+'/v01/htwl/lxh/enterprise/license',
                headers : {
                    'Content-type': 'application/json;charset=UTF-8',
                    Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                },
                async : false,
                type : 'put',
                data : field,
                success : function (result){
                    if(result.code == '1000'){
                        layer.msg('保存成功！', {icon: 1});
                    }else{
                        layer.msg(result.message, {icon: 2});
                    }
                }
            })
        }
        return false;
    });
    //请求企业基本信息
    var loadCompanyData = function(){
        var id = $(window.parent.document).find('.layui-layer-content').attr('id'),//企业id
            title =  $(window.parent.document).find('.layui-layer-title').text();
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                console.log(result)
                var data = result.data;
                switch (data.controlLevel){
                    case "area_control":
                        data.controlLevel = '区(县)控';
                        break;
                    case "country_control":
                        data.controlLevel = '国控';
                        break;
                }
                // var qyImg = [{
                //     "url":"../../img/data/002.png"
                // },{
                //     "url":"../../img/data/001.png"
                // }
                // ];
                var qyImg =data.attachments;
                //企业基本信息
                $("input[name='name']").val(data.name);
                $("input[name='legalRepresentative']").val(data.legalRepresentative);
                $("input[name='head']").val(data.head);
                $("input[name='headPhone']").val(data.headPhone);
                $("input[name='orgCode']").val(data.orgCode);
                $("input[name='controlLevel']").val(data.controlLevel);
                $("input[name='envHead']").val(data.envHead);
                $("input[name='envHeadPhone']").val(data.envHeadPhone);
                $("input[name='buildStatusName']").val(data.buildStatusName);
                $("input[name='processing']").val(data.processing);
                $("input[name='riverBasin']").val(data.riverBasin);
                $("input[name='lon']").val(data.lon);
                $("input[name='lat']").val(data.lat);
                $("input[name='expectDate']").val(data.expectDate);
                $("input[name='address']").val(data.address);
                if(title == "编辑企业信息"){
                    var attach = data.attachments;
                    if(attach.length > 0){
                        /*创建图片路径*/
                        var thumb =  $("#thumbs3").find(".thumb"),
                            thisContent = thumb[0].outerHTML;
                        layui.each(attach, function (index, item){
                            var str =
                                '<div class="thumb">'+
                                '<img src="' + item.attachmentAddress + '"> ' +
                                '<i class="layui-icon" onclick="layui.companyMng.imgDelete(this);">&#x1007;</i> ' +
                                '</div>';
                            thumb.before(str).show();
                        })
                    }
                }else{
                    if(qyImg.length>0){
                        //企业照片
                        var qyPhotos = "";
                        for(var i in qyImg){
                            qyPhotos += "<div class='silder-main-img lay-img'> <img src='"+ qyImg[i].attachmentAddress +"' style='width: 600px;height: 400px'> </div>"
                        }
                        $(".silder-main").html(qyPhotos);
                        //图片点击
                        layer.photos({
                            photos: '.lay-img'
                            ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                        });

                        $(".js-silder").silder({
                            auto: true,//自动播放，传入任何可以转化为true的值都会自动轮播
                            speed: 20,//轮播图运动速度
                            sideCtrl: true,//是否需要侧边控制按钮
                            bottomCtrl: true,//是否需要底部控制按钮
                            defaultView: 0,//默认显示的索引
                            interval: 3000,//自动轮播的时间，以毫秒为单位，默认3000毫秒
                            activeClass: "active"//小的控制按钮激活的样式，不包括作用两边，默认active
                        });
                    }else{
                        var str = '<p style="text-align: center">未上传企业照片</p>';
                        $(".silder-main").html(str);
                    }
                }
            }
        })
    };
    //请求许可证基本信息
    var loadLicenseData = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id'),//企业id
            title =  $(window.parent.document).find('.layui-layer-title').text();
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/license/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                var data = result.data[0];
                if(data){
                    $("input[name='licenseCode']").val(data.licenseCode);
                    $("input[name='beginDate']").val(data.beginDate);
                    $("input[name='endDate']").val(data.endDate);
                    $("input[name='maxiMum']").val(data.maxiMum);
                    $("input[name='gross']").val(data.gross);
                    $("input[name='licenceType']").val(data.licenceType);
                    $("input[name='id']").val(data.id);
                    console.log(data.pic.length)
                    if(title == '企业详情'){
                        if(data.pic[1].attachmentAddress!='null'){
                            $("#pdv_pk").find(".layui-tab-item").eq(0).find("img").attr("src", data.pic[1].attachmentAddress);
                        }else{
                            var str = '<span>未上传正本</span>';
                            $('#zhengben').html(str);
                        }
                        if(data.pic[0].attachmentAddress != 'null'){
                            $("#pdv_pk").find(".layui-tab-item").eq(1).find("img").attr("src", data.pic[0].attachmentAddress);
                        }else{
                            var str = '<span>未上传副本</span>';
                            $('#fuben').html(str);
                        }
                    }else if(title == '编辑企业信息'){
                        console.log(data)
                        if(data.pic[0].attachmentAddress != 'null'){
                            var thumb1 =  $('#thumb1');
                            var str1 =
                                '<img src="' + data.pic[0].attachmentAddress + '" data-address="'+data.pic[0].attachmentAddress+'" data-id="'+data.pic[0].id+'"> ' +
                                '<i class="layui-icon" onclick="layui.companyMng.imgDelete1(this);">&#x1007;</i> ';
                            thumb1.find("input").removeAttr("onchange").hide();
                            thumb1.find("img").remove();
                            thumb1.removeClass("thumb-input").prepend(str1).show();
                        }
                        if(data.pic[1].attachmentAddress != 'null'){
                            var thumb2 =  $('#thumb2');
                            var str2 =
                                '<img src="' + data.pic[1].attachmentAddress + '" data-address="'+data.pic[0].attachmentAddress+'" data-id="'+data.pic[0].id+'"> ' +
                                '<i class="layui-icon" onclick="layui.companyMng.imgDelete1(this);">&#x1007;</i> ';
                            thumb2.find("input").removeAttr("onchange").hide();
                            thumb2.find("img").remove();
                            thumb2.removeClass("thumb-input").prepend(str2).show();
                        }
                    }
                }else{
                    var str = '<span>未上传正本</span>';
                    $('#zhengben').html(str);
                    var str1 = '<span>未上传副本</span>';
                    $('#fuben').html(str1);
                }
            }
        })
    };
    //请求排口信息
    var loadPortData = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id'),//企业id
            title =  $(window.parent.document).find('.layui-layer-title').text();
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/discharge/port/'+id+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                var render = function(result) {
                    var arr = [],
                        str = '';
                    layui.each(result, function(index, item){
                        if(title == '编辑企业信息'){
                            str = '<tr>' +
                                '<td>' + item.pageNumber + '</td>' +
                                '<td>' + item.dischargePortCode + '</td>' +
                                '<td>' + item.dischargePortName + '</td>' +
                                '<td>' + item.mode + '</td>' +
                                '<td>' + item.whereabouts + '</td>' +
                                '<td>' + item.emissionAmount + '</td>' +
                                '<td style="text-align: center">'+
                                '<a href="#" onclick="layui.companyMng.deletePK(\''+item.id+'\')" title="删除"><img src="../../img/mng/delete.png"></a></td>'+
                                '</tr>';
                        }else{
                            str = '<tr>' +
                                '<td>' + item.pageNumber + '</td>' +
                                '<td>' + item.dischargePortCode + '</td>' +
                                '<td>' + item.dischargePortName + '</td>' +
                                '<td>' + item.mode + '</td>' +
                                '<td>' + item.whereabouts + '</td>' +
                                '<td>' + item.emissionAmount + '</td>' +
                                '</tr>';
                        }
                        arr.push(str);
                    });
                    return arr.join('');
                };
                $("#dis-port-list").html(render(result));
            }
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
            ,btnAlign: 'c'
            ,btn: ['提交', '返回'] //只是为了演示
            ,yes: function(index,layero){
                $("#pk-save").click();
            }
            ,zIndex: layer.zIndex //重点1
        })
    };
    form.on('submit(pk-save)',function (data) {
        var Cid = $(window.parent.document).find('.layui-layer-content').attr('id');//企业id
        data.field.refid = Cid;
        var field = JSON.stringify(data.field);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/discharge/port',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'post',
            data : field,
            success : function (result){
                console.log(result);
                layer.msg('新增成功！', {icon: 1,time:1000}, function() {
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    layer.close(index); //再执行关闭
                    location.reload();
                });
            }
        })
        return false;
    });
    /*删除排口*/
    var deletePK = function (id) {
        layer.msg('是否确定删除该排口', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/enterprise/discharge/port/'+id+'',
                    headers : {
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'delete',
                    success : function (result){
                        if(result.resultcode == '2'){
                            layer.msg('删除成功！', {icon: 1,time:1000}, function() {
                                location.reload()
                            });
                        }else{
                            layer.msg('删除失败！', {icon: 2});
                        }
                    }
                })
            }
        })
    }
    //企业详情
    var detailCompanyWin = function (id) {
        var index = layer.open({
            title : '企业详情',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/sysMng/companyDataView.html',
            btn: [ '返回'],
            btnAlign: 'c'
        });
        layer.full(index);
    };
    //企业规则列表
    var alarmRuleList = function (id) {
        sessionStorage.setItem("company_id", id);
        var index = layer.open({
            title : '报警规则',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/sysMng/alarmRuleList.html',
            btn: [ '返回'],
            btnAlign: 'c',
            success : function (layero, index) {
                // var body = layer.getChildFrame('body', index);
                // var id = $('.layui-layer-content').attr('id');
                // loadAlarmRuleDetails(id,body,'1');
            }
        });
        layer.full(index);
    };
    //关闭窗口
    var closeWin = function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    };
    /*在线监测*/
    $(".company-online-monitor").find(".layui-btn-group").find(".layui-btn").click(function () {
        var btn = $(this);
        if(!btn.hasClass("active")){
            btn.addClass("active").siblings().removeClass("active");
        }
        console.log(getActiveBtn($(".company-online-monitor").find(".layui-btn-group")[0]));
    });
    /*获取按钮组选中的值*/
    var getActiveBtn = function (btngroup) {
        var value;
        $(btngroup).find(".layui-btn").each(function(){
            if($(this).hasClass("active")){
               value = $(this).text();
            }
        });
        return value;
    };
    /*输出内容，注意顺序*/
    var obj = {
        loadPage : loadPage,
        loadCompanyList : loadCompanyList,
        imgSelect: imgSelect,
        imgSelect1 : imgSelect1,
        imgDelete1 : imgDelete1,
        imgDelete: imgDelete,
        addCompanyWin : addCompanyWin,
        deleteCompanyData : deleteCompanyData,
        alterCompanyWin : alterCompanyWin,
        loadCompanyData : loadCompanyData,
        addPk : addPk,
        deletePK : deletePK,
        detailCompanyWin : detailCompanyWin,
        alarmRuleList : alarmRuleList,
        closeWin : closeWin,
        loadLicenseData : loadLicenseData,
        loadPortData : loadPortData
    };
    exports('companyMng',obj)
})