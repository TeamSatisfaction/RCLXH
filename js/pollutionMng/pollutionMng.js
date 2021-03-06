/*
/污染源
 */
layui.define(['layer', 'element','laypage','form'],function (exports){
    var $ = layui.jquery,
        layer = layui.layer,
        laypage = layui.laypage,
        form = layui.form(),
        cTobody = $('#company-result');
    var urlConfig = sessionStorage.getItem("urlConfig");
    var Authorization = sessionStorage.getItem("Authorization");
    // var access_token = sessionStorage.getItem("access_token");
    var loadPage = function(url){
        var parent = window.parent.document;    //主页面的DOM
        $(parent).find("#index_frame").attr("src", url);
    };
    //遮罩
    function ityzl_SHOW_LOAD_LAYER(){
        return layer.msg('加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false,offset: '0px', time:100000}) ;
    }
    var Tname = "实时监测数据";
    //加载污染源列表
    var loadCompanyData = function (curr) {
        var name = $('#name').val(),
            data = {
                name : name,
                pageNum : curr||1,
                pageSize : 16,
                enterpriseRole : 'production_enterprise',
                areaCode : '500000-500153'
                // areaId : 500153
            },
            i;
        var field = JSON.stringify(data);
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/enterprise/page',
            headers : {
                'Content-type': 'application/json;charset=UTF-8',
                Authorization:Authorization
            },
            type : 'post',
            data : field,
            beforeSend: function () {
                i = ityzl_SHOW_LOAD_LAYER();
            },
            success : function (result) {
                layer.close(i);
                layer.msg('加载完成！',{time: 1000,offset: '10px'});
                // console.log(result);
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
                            '<td>' + item.address + '</td>'+
                            '<td>' + item.head+ '</td>' +
                            '<td>' + item.headPhone + '</td>'+
                            '<td style="text-align: center"><a href="#" onclick="layui.pollutionMng.detailCompanyWin(\''+item.baseEnterpriseId+'\')" title="详情"><img src="../../img/mng/details.png"></a></td>'
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
                    curr: curr||1, //当前页,
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
    //企业详情
    var detailCompanyWin = function (id) {
        var index = layer.open({
            title : '企业详情',
            id : id,
            type : 2,
            moveOut: true,
            area : ['1200px','700px'],
            content : '../../pages/pollutionMng/pollutionDataView.html',
            btn: [ '返回'],
            btnAlign: 'c',
            success : function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var id = $('.layui-layer-content').attr('id');
                // sessionStorage.setItem("CidConfig",id);
            }
        });
        layer.full(index);
    };
    /*输出内容，注意顺序*/
    var obj = {
        loadPage : loadPage,
        loadCompanyData : loadCompanyData,
        detailCompanyWin : detailCompanyWin
    };
    exports('pollutionMng',obj)
})