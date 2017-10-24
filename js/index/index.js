/**
 * Created by HNCG on 2017/7/3.
 */

layui.define(['layer','element'], function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var $ = layui.jquery,
        element = layui.element();
    var urlConfig = sessionStorage.getItem("urlConfig");
    function hideSidebar() {
        $(".side").find("li").find("a").find(".layui-nav-more").show();
        $(".side").animate({width : "70"}, 200, function () {
            $(".side").find("li").find("a").find("cite").hide();
        } );
        $(".side").find(".layui-nav").animate({width : "70"}, 200 );
        $(".layui-body").animate({width : $(".layui-body")+130, marginLeft: -130}, 200 );
    }
    function showSidebar() {
        $(".side").find("li").find("a").find("cite").show();
        $(".side").animate({width : "200"}, 200 );
        $(".side").find(".layui-nav").animate({width : "200"}, 200 );
        $(".layui-body").animate({width : $(".layui-body")-130, marginLeft: 0}, 200 );
    }

    /*方法*/
    var init = function () {
        /*标题栏时间*/
        setInterval(
            'document.getElementById("time").innerHTML = layui.utils.dateFormat("yy年MM月dd日 HH:mm:ss EEE");',
            100);
        /*加载首页*/
        loadPage('pages/map/map.html');

    };
    
    var loadPage = function (url) {
        if(url=="undefined") return;

        if(url.indexOf('sysMngView')!=-1){
            $("#index_frame").hide()
        }else{
            $("#index_frame").show()
        }
        $("#index_frame").attr("src", url);
        //左侧目录
        // $(".side").find("li").each(function () {
        //     if($(this).find("a").attr("onclick").indexOf(url.substring(url.lastIndexOf('/'), url.length)) != -1){
        //         $(this).addClass("layui-this").siblings().removeClass("layui-this");
        //     }
        // })
    };
    /*菜单管理*/
    var menuMng = function () {
        var userId = getCookie("userId");
        $.ajax({
            url :''+urlConfig+'/v01/htwl/lxh/user/query/'+userId+'',
            headers : {
                Authorization:'admin,670B14728AD9902AECBA32E22FA4F6BD'
            },
            type : 'get',
            success : function (msg) {
                // console.log(msg)
                var authList = msg.authList;
                localStorage.setItem('authList', JSON.stringify(authList));
                var str = '<li class="side-hider" style="border-bottom:1px solid #fff"> ' +     //缩放按钮
                        '<a href="#"> ' +
                        '<i class="layui-icon">&#xe60f;</i> ' +
                        '</a> ' +
                        '</li> ' +
                        '<li class="layui-nav-item layui-this menu-home"> ' +                   //首页
                        '<a href="#" onclick="layui.index.loadPage(\'pages/map/map.html\')">' +
                        '<i class="layui-icon"></i> ' +
                        '<cite style="padding:10px">首页</cite> ' +
                        '</a> ' +
                        '</li>',
                    data = msg.menuList[0].menuList;
                console.log(data)
                if(data.length>0){
                    for(var i in data){
                        var d = getDataByName(data[i].menuName);
                        console.log(d)
                        //第一级
                        str += '<li class="layui-nav-item '+ d.class +' layui-nav-itemed"> ' +
                            '<a href="#" onclick="layui.index.loadPage(\''+ d.url +'\')"> ' +
                            '<i class="layui-icon"></i> ' +
                            '<cite style="padding: 10px">'+ data[i].menuName +'</cite> ' +
                            '</a> ';
                        //第二级
                        if(data[i].menuList && data[i].menuList.length>0){
                            str += '<dl class="layui-nav-child">';

                            for(var j in data[i].menuList){
                                var d1 = getDataByName(data[i].menuList[j].menuName);

                                str += '<dd style="margin-left: 10px" class="'+d1.class+'">' +
                                    '<a href="#" onclick="layui.index.loadPage(\''+d1.url+'\')">' +
                                    '<i class="layui-icon"></i>' +
                                    '<cite style="margin-left: 10px">'+ data[i].menuList[j].menuName +'</cite> ' +
                                    '</a>' +
                                    '</dd>'
                            }
                            str += '</dl>'
                        }
                        str += '</li>'
                    }

                    $("#left_menu").html(str);  //写入页面
                    element.init();             //重新初始化element

                    $(".side-hider").click(function () {
                        $(this).toggleClass("off");
                        $(this).hasClass("off")?hideSidebar():showSidebar();
                    })
                }
            }
        })
        // $.ajax({
        //     url: 'data/roleData.json',
        //     dataType : 'json',
        //     type: 'get',
        //     success: function(msg){
        //         console.log(msg)
        //         var str = '<li class="side-hider" style="border-bottom:1px solid #fff"> ' +     //缩放按钮
        //                     '<a href="#"> ' +
        //                             '<i class="layui-icon">&#xe60f;</i> ' +
        //                     '</a> ' +
        //                 '</li> ' +
        //                 '<li class="layui-nav-item layui-this menu-home"> ' +                   //首页
        //                     '<a href="#" onclick="layui.index.loadPage(\'pages/map/map.html\')">' +
        //                         '<i class="layui-icon"></i> ' +
        //                         '<cite style="padding:10px">首页</cite> ' +
        //                     '</a> ' +
        //                 '</li>',
        //             data = msg[0].menuList;
        //
        //         if(data.length>0){
        //             for(var i in data){
        //                 var d = getDataByName(data[i].menuName);
        //                 console.log(d)
        //                 //第一级
        //                 str += '<li class="layui-nav-item '+ d.class +' layui-nav-itemed"> ' +
        //                             '<a href="#" onclick="layui.index.loadPage(\''+ d.url +'\')"> ' +
        //                                 '<i class="layui-icon"></i> ' +
        //                                 '<cite style="padding: 10px">'+ data[i].menuName +'</cite> ' +
        //                             '</a> ';
        //                 //第二级
        //                 if(data[i].menuList && data[i].menuList.length>0){
        //                     str += '<dl class="layui-nav-child">';
        //
        //                     for(var j in data[i].menuList){
        //                         var d1 = getDataByName(data[i].menuList[j].menuName);
        //
        //                         str += '<dd style="margin-left: 10px" class="'+d1.class+'">' +
        //                                     '<a href="#" onclick="layui.index.loadPage(\''+d1.url+'\')">' +
        //                                         '<i class="layui-icon"></i>' +
        //                                         '<cite style="margin-left: 10px">'+ data[i].menuList[j].menuName +'</cite> ' +
        //                                     '</a>' +
        //                                 '</dd>'
        //                     }
        //                     str += '</dl>'
        //                 }
        //                 str += '</li>'
        //             }
        //
        //             $("#left_menu").html(str);  //写入页面
        //             element.init();             //重新初始化element
        //
        //             $(".side-hider").click(function () {
        //                 $(this).toggleClass("off");
        //                 $(this).hasClass("off")?hideSidebar():showSidebar();
        //             })
        //         }
        //     }
        // })
    };

    var getDataByName = function(name){
        var menuData = {
            "污染源": {
                "url": "pages/pollutionMng/pollutionView.html",
                "class": "menu-pollution"
            },
            "报警管理": {
                "url": "pages/alarmMng/alarmMng.html",
                "class": "menu-alarm"
            },
            "水质自动监测站": {
                "url": "pages/waterQualitySite/waterQualitySiteView.html",
                "class": "menu-equipment"
            },
            "无人机管理": {
                "url": "pages/UAVMng/UAVView.html",
                "class": "wrjmng"
            },
            "统计分析": {
                "class": "menu-statistics"
            },
            "系统管理": {
                "class": "menu-sysmng"
            },
            "报警统计": {
                "url": "pages/statisticsMng/alarmStatistics.html",
                "class": "equipmentmng"
            },
            "废水日均报表": {
                "url": "pages/statisticsMng/waterDaily.html",
                "class": "daily"
            },
            "废水月报": {
                "url": "pages/statisticsMng/waterMonthly.html",
                "class": "monthly"
            },
            "废水年报": {
                "url": "pages/statisticsMng/waterAnnual.html",
                "class": "yearly"
            },
            "超标统计": {
                "url": "pages/statisticsMng/overproofList.html",
                "class": "mnmng"
            },
            "企业管理": {
                "url": "pages/sysMng/sysMngView.html?token=0",
                "class": "cmng"
            },
            "监测站管理": {
                "url": "pages/sysMng/sysMngView.html?token=1",
                "class": "mnmng"
            },
            "设备管理": {
                "url": "pages/sysMng/sysMngView.html?token=2",
                "class": "equipmentmng"
            },
            "联网管理": {
                "url": "pages/sysMng/sysMngView.html?token=3",
                "class": "networkmng"
            },
            "用户管理": {
                "url": "pages/sysMng/sysMngView.html?token=4",
                "class": "usermng"
            },
            "角色管理": {
                "url": "pages/sysMng/sysMngView.html?token=5",
                "class": "rolemng"
            }
        };
        return menuData[name];
    };
    //登出
    var signOut = function () {
        delCookie("userName");
        delCookie("userId");
        window.location.href="login.html";
    };
    //获取Cookie
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    };
    //清除Cookie
    function delCookie(name)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
    // //按钮管理
    // var buttonMng = function () {
    //     $.ajax({
    //         url: 'data/menuData.json',
    //         dataType : 'json',
    //         type: 'get',
    //         success: function(msg){
    //             var authList = msg.authList;
    //             localStorage.setItem('authList', JSON.stringify(authList));
    //         }
    //     })
    // };
    layer.ready(function(){
        var userName = getCookie("userName");
        if(userName){
            $("#nametext").html(userName);
        }else{
            window.location.href = "login.html";
        }
    });

    /*输出内容，注意顺序*/
    var obj = {
        init : init,
        loadPage : loadPage,
        menuMng : menuMng,
        signOut : signOut
        // buttonMng : buttonMng
    };
    //输出test接口
    exports('index', obj);

});