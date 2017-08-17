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
    var loadEquipmentData = function (curr) {
        var equipmentName = $('#equipmentName').val(),
            data = {
                pageNumber : curr||1,
                pageSize : 16,
                equipmentMap : {
                    equipmentName : equipmentName
                }
            };
        var field = JSON.stringify(data);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/jcsjgz/equipment/query/page',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'post',
            data : field,
            success : function (result) {
                console.log(result);
                var nums = 16; //每页出现的数据量
                //模拟渲染
                var eData = result.data.rows,
                    pages = result.data.totalPage,
                    str = "";
                var render = function(eData, curr) {
                    var arr = []
                        , thisData = eData.concat().splice(curr * nums - nums, nums);
                    layui.each(thisData, function(index, item){
                        str = '<tr>' +
                            '<td>'+(index+1)+'</td>' +
                            '<td>' + item.equipmentCode + '</td>' +
                            '<td>' + item.equipmentName + '</td>' +
                            '<td>' + item.equipmentNo+ '</td>' +
                            '<td>' + item.productor + '</td>' +
                            '<td>' + item.classicType + '</td>' +
                            '<td>' + item.classicType + '</td>' +
                            '<td>' + item.usedDate + '</td>' +
                            '<td>' + item.equipmentType + '</td>' +
                            '<td><a href="#"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini">详情</button></a>'+
                            '&nbsp;&nbsp;<a href="#"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini">修改</button></a>'+
                            '&nbsp;&nbsp;<a href="#"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini" onclick="layui.equipmentMng.equipmentFactorWin()">因子</button></a>'+
                            '&nbsp;&nbsp;<a href="#"><button type="button" class="layui-btn layui-btn-normal layui-btn-mini">删除</button></a></td>'+
                            '</tr>';
                        arr.push(str);
                    });
                    return arr.join('');
                };
                eTobody.html(render(eData, obj.curr));
                //调用分页
                laypage({
                    cont: 'demo3',
                    skin: '#00a5dd',
                    pages : pages,
                    curr: curr || 1, //当前页,
                    skip: true,
                    jump: function(obj,first){
                        if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr
                            loadEquipmentData(obj.curr);
                        }
                    }
                })
            }
        })
    };
    //新增设备窗口
    var addEquipmentWin = function () {
        var index = layer.open({
            title : '新增设备',
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/addEquipmentView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index) {
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
        });
        layer.full(index);
    };
    //配置因子窗口
    var equipmentFactorWin = function () {
        var index = layer.open({
            title : '关联因子',
            type : 2,
            moveOut: true,
            area : ['1000px','600px'],
            content : '../../pages/sysMng/equipmentFactorView.html',
            btn: ['提交', '返回'],
            btnAlign: 'c',
            yes : function (index) {
                layer.msg('提交成功！', {icon: 1});
                layer.close(index);
            }
        });
        layer.full(index);
    }
    /*设备因子事件*/
    var efCheckEvt = function(){
        var leftForm = $(".ef-left").find('.ef-checklist'),
            rightForm = $(".ef-right").find('.ef-checklist');

        /*因子列表，需要修改就改这里*/
        var factorArray = ['单台设备总电流', 'A相电流', 'B相电流', 'C相电流', '单台设备总电压', 'A相电压',
            'B相电压', 'C相电压', '单台设备总功率因素', 'A相功率因素', 'B相功率因素', 'C相功率因素'];

        /*template*/
        var leftTpl = $("#leftTpl").html();
        var rightTpl = $("#rightTpl").html();

        /*左边form*/
        laytpl(leftTpl).render(factorArray, function(html){
            leftForm.html(html) ;
            form.render();
            /*事件*/
            var inputBoxes = leftForm.find(".layui-form-item"),
                inputs = inputBoxes.find("input");
            inputBoxes.find(".layui-form-checkbox").on('click',function () {
                var index = $(this).parents(".layui-form-item").index();
                rightForm.find(".layui-form-item").eq(index).slideToggle(); //toggle事件，如果出现问题，改成获取勾选状态控制显隐
                /*当前选中的元素*/
                var checkedArray = [];
                inputs.each(function () {
                    if($(this).parent().find(".layui-form-checkbox").hasClass("layui-form-checked"))
                        checkedArray.push($(this).attr('title'))
                });
                console.log(checkedArray);
            });
        });

        /*右边form*/
        laytpl(rightTpl).render(factorArray, function(html){
            rightForm.html(html) ;
            form.render("select");
        });
    };



    /*输出内容，注意顺序*/
    var obj = {
        loadPage : loadPage,
        loadEquipmentData : loadEquipmentData,
        addEquipmentWin : addEquipmentWin,
        equipmentFactorWin : equipmentFactorWin,
        efCheckEvt : efCheckEvt
    };
    exports('equipmentMng',obj)
})