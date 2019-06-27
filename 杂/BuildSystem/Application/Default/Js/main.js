
$(function(){
    //firstClassNav();

   //$("#sidebar")

});

/* 第一级菜单*/
function firstClassNav(){
    //清空第一级菜单
    $("#nav").empty();
    var index = layer.load();
    $.ajax({
        url:"Application/Default/Js/bar.json",
        //data:"",
        type:"post",
        dataType:"json",
        cache:false,
        timeout:20000,
        async:true,
        success:function(data){
            layer.close(index);
            if(!data){
                layer.alert('无可用的一级菜单！');
                return;
            }
            var jsonStr = data["frist"];
            var jsonArr = eval("("+jsonStr+")");
            //console.log(jsonArr);
            var html = "";
            for(var i in jsonArr){
                var obj = jsonArr[i];
                html += '<li class="nav-item ng-scope">'+
                    '<a href="javascript:void(0);" data-sub="'+obj["sub"]+'" data-url="'+obj["url"]+'" class="ng-scope">'+
                    '<div class="nav-icon">'+
                    '<span class="'+obj["icon"]+'"></span>'+
                    '</div>'+
                    '<span class="nav-title ng-binding">'+obj["text"]+'</span>'+
                    '</a>'+
                    '</li>';
            }
            $("#nav").append(html);
        },
        error:function(e){
            layer.close(index);
            layer.alert('加载一级菜单出错了！', {icon: 2});
        }
    });
}
/* 第二级菜单*/
function twoClassNav(param){
    //清空第二级菜单
    $("#product-nav-list ul").empty();
    var index = layer.load();
    $.ajax({
        url:"Application/Default/Js/bar.json",
        data:param||{},
        type:"post",
        dataType:"json",
        cache:false,
        timeout:60000,
        async:false,
        success:function(data){
            layer.close(index);
            if(!data){
                layer.alert('无可用的二级菜单！');
                return;
            }
            var jsonStr = data["two"];
            var jsonArr = eval("("+jsonStr+")");
            ///console.log(jsonArr);
            var html = "";
            for(var i in jsonArr){
                var obj = jsonArr[i];
                html += '<li>'+
                        '<div class="ng-isolate-scope">'+
                        '<a href="javascript:void(0);" data-url="'+obj["url"]+'" class="ng-scope">'+
                        '<div class="nav-icon"></div>'+
                        '<div class="nav-title ng-binding" title="'+obj["text"]+'">'+obj["text"]+'</div>'+
                        '</a>'+
                        '</div>'+
                        '</li>';
            }
            $("#product-nav-list ul").append(html);
        },
        error:function(e){
            layer.close(index);
            layer.alert('加载二级菜单出错了！', {icon: 2});
        }
    });
}





