/*
/设备管理
 */
layui.define(['layer', 'element','laypage','form', 'laytpl'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form(),
        laytpl = layui.laytpl,
        laypage = layui.laypage,
        eTobody = $('#equipment-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //载入设备
    var loadEquipmentData = function (curr) {
        layui.sysMng.loadAuthen();
        var dauId = $('#dau').val(),
            data = {
                pageNumber : curr||1,
                pageSize : 16,
                equipmentMap : {
                    dauId : dauId
                }
            };
        var field = JSON.stringify(data);
        if(dauId != '') {
            $.ajax({
                url: '' + urlConfig + '/v01/htwl/lxh/jcsjgz/equipment/query/page',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8',
                    Authorization: 'admin,670B14728AD9902AECBA32E22FA4F6BD'
                },
                type: 'post',
                data: field,
                success: function (result) {
                    var nums = 16; //每页出现的数据量
                    //模拟渲染
                    var eData = result.data.rows,
                        pages = result.data.totalPage,
                        str = "";
                    if(eData != null){
                        var render = function (eData, curr) {
                            var arr = []
                                , thisData = eData.concat().splice(curr * nums - nums, nums);
                            layui.each(thisData, function (index, item) {
                                var type = item.eaOrEb;
                                if(type == "EA"){
                                    type = 'power_equipment'
                                }else{
                                    type = 'instrument_sensor'
                                }
                                str = '<tr>' +
                                    '<td>' + (index + 1) + '</td>' +
                                    '<td>' + item.equipmentCode + '</td>' +
                                    '<td>' + item.equipmentName + '</td>' +
                                    '<td>' + item.equipmentNo + '</td>' +
                                    '<td>' + item.productor + '</td>' +
                                    '<td>' + item.classicType + '</td>' +
                                    '<td>' + item.classicType + '</td>' +
                                    '<td>' + item.usedDate + '</td>' +
                                    '<td>' + item.equipmentType + '</td>' +
                                    '<td style="text-align: center"><a class="auth-btn" data-authId="44" href="#" onclick="layui.equipmentMng.equipmentDataWin(\''+item.id+'\')" title="详情"><img src="../../img/mng/details.png"></a>' +
                                    '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="40" href="#" onclick="layui.equipmentMng.alterEquipmentDataWin(\''+item.id+'\')" title="修改"><img src="../../img/mng/alter.png"></a>' +
                                    '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="47" href="#" onclick="layui.equipmentMng.equipmentFactorWin(\''+type+'\',\''+item.id+'\')" title="配置因子"><img src="../../img/mng/configure.png"></a>' +
                                    '&nbsp;&nbsp;&nbsp;<a class="auth-btn" data-authId="41" href="#" onclick="layui.equipmentMng.deleteEquipment(\''+item.id+'\')" title="删除"><img src="../../img/mng/delete.png"></a>' +
                                    '</tr>';
                                arr.push(str);
                            });
                            return arr.join('');
                        };
                        eTobody.html(render(eData, obj.curr));
                        layui.sysMng.loadAuthen();
                    }else{
                        eTobody.html(str);
                    }
                    //调用分页
                    laypage({
                        cont: 'demo3',
                        skin: '#00a5dd',
                        pages: pages,
                        curr: curr || 1, //当前页,
                        skip: true,
                        jump: function (obj, first) {
                            if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                                loadEquipmentData(obj.curr);
                            }
                        }
                    })
                }
            })
        }
    };
    //数采仪select
    var loadMnSelect = function () {
        var data = {
            pageNumber : 1,
            pageSize : 1000,
            dauMap : {}
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
                var row = result.data.rows;
                if(row == null){
                    $("#dau").empty();
                    $("#dau").append("<option value='' selected='selected'>无数采仪</option>");
                }else{
                    for(var i in row){
                        $("#dau").append("<option value="+row[i].id+">"+row[i].aname+"</option>");
                    }
                }
                form.render('select');
            }
        })
    };
    //数采仪select change事件
    form.on('select(dau-select)', function(data){
        loadEquipmentData();
    });
    //新增设备窗口
    var addEquipmentWin = function () {
        var dauId = $('#dau').val();
        console.log(dauId);
        if(dauId != ''){
            var index = layer.open({
                title : '新增设备',
                type : 2,
                moveOut: true,
                area : ['1000px','600px'],
                content : '../../pages/sysMng/addEquipmentView.html',
                btn: ['提交', '返回'],
                btnAlign: 'c',
                yes : function (index,layero) {
                    layero.find("iframe").contents().find('#equipment-save').click();
                },
                success : function (layero,index) {
                    var body = layer.getChildFrame('body',index);
                    body.contents().find("input[name='dauId']").val(dauId);
                }
            });
            layer.full(index);
        }else{
            layer.msg('请先选择数采仪！', {icon: 2,time:2000});
        }
    };
    form.on('submit(equipment-save)', function(data){
        var field = JSON.stringify(data.field);
        console.log(field);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/jcsjgz/equipment',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            dataType : 'json',
            type : 'post',
            data : field,
            success : function (result){
                console.log(result);
                if(result.code == '1000'){
                    layer.msg('提交成功！', {icon: 1,time:1000},function () {
                        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭
                        parent.location.reload();
                    });
                }else {
                    layer.msg('提交失败！', {icon: 2,time:1000});
                }
            }
        });
        return false;
    });
    //设备详情窗口
    var equipmentDataWin = function (id) {
        var index = layer.open({
            title : '设备详情',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/equipmentDataView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c'
        });
        layer.full(index);
    };
    //修改设备窗口
    var alterEquipmentDataWin = function (id) {
        var index = layer.open({
            title : '修改设备',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/addEquipmentView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c'
        });
        layer.full(index);
    };
    //载入设备详情
    var loadEquipmentDetails = function () {
        var id = $(window.parent.document).find('.layui-layer-content').attr('id'),
            title =  $(window.parent.document).find('.layui-layer-title').text();
        if(title != "新增设备"){
            $.ajax({
                url :''+urlConfig+'/v01/htwl/lxh/jcsjgz/equipment/'+id+'',
                headers : {
                    Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                },
                type : 'get',
                success : function (result){
                    var qyImg = [{
                        "url":"../../img/data/002.png"
                    },{
                        "url":"../../img/data/001.png"
                    }
                    ];
                    if(title == "设备详情"){
                        //设备照片
                        var qyPhotos = "";
                        for(var i in qyImg){
                            qyPhotos += "<div class='silder-main-img lay-img'> <img src='"+ qyImg[i].url +"' style='width: 600px;height: 400px'> </div>"
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
                    }else if(title == "修改设备"){
                        if(qyImg.length > 0){
                            /*创建图片路径*/
                            var thumb =  $("#thumbs7").find(".thumb");
                            layui.each(qyImg, function (index, item){
                                var str =
                                    '<div class="thumb">'+
                                    '<img src="' + item.url + '"> ' +
                                    '<i class="layui-icon" onclick="layui.companyMng.imgDelete(this);">&#x1007;</i> ' +
                                    '</div>';
                                thumb.before(str).show();
                            })
                        }
                    }
                }
            })
        }
    };
    //删除设备
    var deleteEquipment = function (id) {
        layer.msg('是否确定删除该设备', {
            icon: 3,
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            yes : function (index,layero) {
                $.ajax({
                    url :''+urlConfig+'/v01/htwl/lxh/jcsjgz/equipment/'+id+'',
                    headers : {
                        Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
                    },
                    type : 'delete',
                    success : function (result){
                        if(result.code == '1000'){
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
    };
    //配置因子窗口
    var equipmentFactorWin = function (type,id) {
        var a = [];
        a.push(type,id);
        console.log(a);
        var index = layer.open({
            title : '关联因子',
            id : a,
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/equipmentFactorView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index,layero) {
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
        });
        layer.full(index);
    };
    //请求左边所有因子
    var loadAllFactorData = function () {
        var type = $(window.parent.document).find('.layui-layer-content').attr('id'),
            i = type.split(',');
        $.ajax({
            url :'http://39.108.112.173:9002/v03/htwl/dic/parent/'+i[0]+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (result){
                var factorArray = [];
                for(var i in result){
                    factorArray.push(result[i].dicName)
                }
                efCheckEvt(factorArray);
            }
        })
    };

    var leftFormEvent = function(){

        var leftForm = $(".ef-left").find('.ef-checklist'),
            rightForm = $(".ef-right").find('.ef-checklist'),
            rightTpl = $("#rightTpl").html(),
            inputBoxes = leftForm.find(".layui-form-item"),
            inputs = inputBoxes.find("input");

        inputBoxes.find(".layui-form-checkbox").on('click',function () {
            var index = $(this).parents(".layui-form-item").index();
            // rightForm.find(".layui-form-item").eq(index).slideToggle(); //toggle事件，如果出现问题，改成获取勾选状态控制显隐
            /*右边form*/
            laytpl(rightTpl).render(getCheckedArray(inputs), function(html){
                rightForm.html(html) ;
                form.render("select");
            });
        });
        /*右边form*/
        laytpl(rightTpl).render(getCheckedArray(inputs), function(html){
            rightForm.html(html) ;
            form.render("select");
        });
    };

    /*当前选中的元素*/
    var getCheckedArray = function(inputs){
        var checkedArray = [];
        inputs.each(function () {
            if($(this).siblings(".layui-form-checkbox").hasClass("layui-form-checked")){
                checkedArray.push($(this).attr('title'))
            }
        });
        return checkedArray;
    };

    /*设备因子事件*/
    var efCheckEvt = function(factorArray){
        /*因子列表，需要修改就改这里*/
        // var factorArray = ['单台设备总电流', 'A相电流', 'B相电流', 'C相电流', '单台设备总电压', 'A相电压',
        //     'B相电压', 'C相电压', '单台设备总功率因素', 'A相功率因素', 'B相功率因素', 'C相功率因素'];

        /*template*/
        var leftTpl = $("#leftTpl").html();

        /*左边form*/
        laytpl(leftTpl).render(factorArray, function(html){
            $(".ef-left").find('.ef-checklist').html(html) ;
            form.render();
        });
    };

    //请求已有的因子
    var loadFactorData =function(){
        var type = $(window.parent.document).find('.layui-layer-content').attr('id'),
            i = type.split(',');
        var data = {
            pageSize:1000,
            pageNumber:1,
            factorMap : {
                equipmentId : i[1]
            }
        };
        var field = JSON.stringify(data);
        $.ajax({
            url: '' + urlConfig + '/v01/htwl/lxh/jcsjgz/factor/query/page',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'post',
            data : field,
            success : function (result){
                var row = result.data.rows;
                var checkedArray = []; //选中的元素
                // console.log(row);
                // var row = [
                //     {
                //         "factorName": "A相电流",
                //         "factorCode": "ez61a01",
                //         "factorTypeDic": {
                //             "baseDicId": "cc9475f3325a4e0081f89f5a2ef226d6",
                //             "dicName": "工艺过程"
                //         }
                //     }
                // ];
                for(var i in row){
                    checkedArray.push(row[i].factorName)
                }
                var leftForm = $(".ef-left").find('.ef-checklist'),
                    inputBoxes = leftForm.find(".layui-form-item"),
                    inputs = inputBoxes.find("input");

                inputs.each(function(){
                    if($.inArray($(this).attr("title"), checkedArray)!=-1){
                        $(this).attr("checked", "checked");
                    }
                });
                form.render('checkbox');
                leftFormEvent();
            }
        })
    };

    /*输出内容，注意顺序*/
    var obj = {
        loadPage : loadPage,
        loadEquipmentData : loadEquipmentData,
        loadMnSelect : loadMnSelect,
        addEquipmentWin : addEquipmentWin,
        deleteEquipment : deleteEquipment,
        equipmentDataWin : equipmentDataWin,
        alterEquipmentDataWin : alterEquipmentDataWin,
        loadEquipmentDetails : loadEquipmentDetails,
        equipmentFactorWin : equipmentFactorWin,
        loadAllFactorData : loadAllFactorData,
        loadFactorData : loadFactorData,
        efCheckEvt : efCheckEvt
    };
    exports('equipmentMng',obj)
})