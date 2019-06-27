
$(function(){
    //日期
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#blDate' //指定元素
            ,min:"1900-01-01"
            ,max: 0
            ,theme: '#393D49'//主题
            ,done: function(value, date, endDate){//日期选择完成后的回调
                valide("#blDate");
            }
        });
    });

    // 图片上传
    layui.use('upload', function() {
        var upload = layui.upload;
        //执行实例
        var uploadInst = upload.render({
            elem: '#blImgUp' //绑定元素
            ,url: '/upload/' //上传接口
            ,accept:"images" //只能上传图片
            ,method:"post"  //上传接口的 HTTP 类型
            ,size:"500"  //上传图片不能超过 500KB
            , done: function (res,index,upload) {
                //上传完毕回调
                var src = "";
                if(src){
                    $("#imgSrc").val(src);
                }else{
                    $("#imgSrc").val("");
                }
                //显示打开图片和删除的按钮
                $("#opImg,#cancelImg").show();
            }
            , error: function () {
                //请求异常回调
                //layer.alert("图片上传失败！",{icon: 2, title:'提示'});
                //失败后清理掉路径
                //$("#imgSrc").val("");
            }
        });
    });
    //查看上传的图片
    $("#opImg").on("click",function () {
        var src = $("#imgSrc").val()||"./image/login-bg.jpg";
        if(src){
            parent.layer.alert("<img src='"+src+"' style='width:100%;height:100%;'/>",{title:"查看上传的图片",area: ['500px', '500px']});
        }else{
            layer.msg("无图片可查看！");
        }
    });

    //删除上传的图片
    $("#cancelImg").on("click",function () {
        var src = $("#imgSrc").val()||"./image/login-bg.jpg";
        $.ajax({
            url:"/deleteImg/",
            data:{"src":src},
            type:"post",
            dataType:"json",
            cache:false,
            timeout:10000,
            async:true,
            success:function(data){
                layer.msg("图片已删除");
                $("#opImg,#cancelImg").hide();
            },
            error:function(e){
                parent.layer.alert('删除图片出错了！', {icon: 2});
            }
        });
    });

    //确定表单提交
    $("#ok").click(function(event){
        event.preventDefault();
        checkForm();
        var flag = $("#form_ep_login input").hasClass("errorInp");
        if(!flag){ //校验通过
            var indexOk = layer.confirm('确认无误后再提交', {title:"提交确认",
                btn: ['确认','再看看'] //按钮
            }, function(){
                layer.close(indexOk);
                $.ajax({
                    url:"/Upload/",
                    data:$("#form_ep_login").serialize(),
                    type:"post",
                    dataType:"json",
                    cache:false,
                    timeout:20000,
                    async:false,
                    success:function(data){
                        if(data===-1){
                            parent.layer.alert('统一社会信用代码无效，注册失败！', {icon: 2});
                        }else if(data===1){
                            //确认完成后关闭窗口
                            var pindex = parent.layer.getFrameIndex(window.name); //获取窗口索引
                            parent.layer.close(pindex);//关闭窗口
                            parent.layer.msg("表单信息已提交！");
                        }else{
                            parent.layer.alert('未知错误！', {icon: 2});
                        }
                    },
                    error:function(e){
                        parent.layer.alert('重置密码出错了！', {icon: 2});
                    }
                });
            },function(){

            });
        }else{
            parent.layer.alert("请检查表单红色信息！<br/> <span style='color:red;'>*</span> 标注的为必填项。",{icon: 2, title:'错误提示'});
        }
    });

    $("#form_ep_login input").on("input blur",function(){
        valide(this);
    });

    var index = "";
    $("#form_ep_login input").on("mouseover",function(){
        var id = $(this).attr("id");
        var errorMsg = $(this).attr("errorMsg");
        if(errorMsg){
            index = layer.tips(errorMsg, "#"+id,{tips: [1,'#0f74cc']});
        }
    });
    $("#form_ep_login input").on("mouseout",function () {
        if(index){
            layer.close(index);
            index = "";
        }
    });

    //关闭弹框
    $("#cancel").click(function(e){
        e.preventDefault();
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);//关闭窗口
    });

});

function checkForm(){
    $("#form_ep_login input").each(function(index,$this){
        valide(this);
    });
}
//一个简单的校验
function valide($this){
    if(!$this){return;}
    var _this = $($this);
    var id = _this.attr("id");
    var val = $.trim(_this.val());
    var reg = _this.attr("data-reg");
    var e;
    if(reg){
        e = eval(reg);
    }
    if(id==="UserName"){
        if(val){
            if(!e.test(val)){
                _this.attr("errorMsg","用户名为 6 到 12 位（字母，数字，_，-）！").addClass("errorInp");
            }else{
                _this.removeAttr("errorMsg").removeClass("errorInp");
            }
        }else{
            _this.attr("errorMsg","用户名为必填项！").addClass("errorInp");
        }
    }else if(id==="ServiceNo"){
        if(val){
            if(!e.test(val)){
                _this.attr("errorMsg","服务号填写有误！").addClass("errorInp");
            }else{
                _this.removeAttr("errorMsg").removeClass("errorInp");
            }
        }else{
            _this.attr("errorMsg","服务号为必填项！").addClass("errorInp");
        }
    }else if(id==="password"){
        if(val){
            if(!e.test(val)){
                _this.attr("errorMsg","密码最小为4位！").addClass("errorInp");
            }else{
                _this.removeAttr("errorMsg").removeClass("errorInp");
            }
        }else{
            _this.attr("errorMsg","密码为必填项！").addClass("errorInp");
        }
    }else if(id==="confPass"){
        var password = $("#password").val();
        if(password!==val){
            _this.attr("errorMsg","两次密码输入不一致！").addClass("errorInp");
        }else{
            _this.removeAttr("errorMsg").removeClass("errorInp");
        }
    }else if(id==="companyName"){
        if(val){
            if(!e.test(val)){
                _this.attr("errorMsg","公司名称填写有误！").addClass("errorInp");
            }else{
                _this.removeAttr("errorMsg").removeClass("errorInp");
            }
        }else{
            _this.attr("errorMsg","公司名称为必填项！").addClass("errorInp");
        }
    }else if(id==="companyAddress"){
        if(val){
            if(!e.test(val)){
                _this.attr("errorMsg","公司地址填写有误！").addClass("errorInp");
            }else{
                _this.removeAttr("errorMsg").removeClass("errorInp");
            }
        }else{
            _this.attr("errorMsg","公司地址为必填项！").addClass("errorInp");
        }
    } else if(id==="postcode"){
        if(val && !e.test(val)){
            _this.attr("errorMsg","请填写有效的邮编！").addClass("errorInp");
        }else{
            _this.removeAttr("errorMsg").removeClass("errorInp");
        }
    }else if(id==="url"){
        if(val && !e.test(val)){
            _this.attr("errorMsg","请填写有效的网址！").addClass("errorInp");
        }else{
            _this.removeAttr("errorMsg").removeClass("errorInp");
        }
    }else if(id==="scCode"){
        if(val){
            if(!e.test(val)){
                _this.attr("errorMsg","统一社会信用代码为15到18个字符！").addClass("errorInp");
            }else{
                _this.removeAttr("errorMsg").removeClass("errorInp");
            }
        }else{
            _this.attr("errorMsg","统一社会信用代码为必填项！").addClass("errorInp");
        }
    }else if(id==="blDate"){
        if(val){
            if(!e.test(val)){
                _this.attr("errorMsg","营业执照成立日期格式不正确！").addClass("errorInp");
            }else{
                _this.removeAttr("errorMsg").removeClass("errorInp");
            }
        }else{
            _this.attr("errorMsg","营业执照成立日期为必填项！").addClass("errorInp");
        }
    } else if(id==="pCountry" || id==="fCountry"){
        if(val && !e.test(val)){
            _this.attr("errorMsg","国别填写不正确！").addClass("errorInp");
        }else{
            _this.removeAttr("errorMsg").removeClass("errorInp");
        }
    }else if(id==="pRegion" || id==="fRegion"){
        if(val && !e.test(val)){
            _this.attr("errorMsg","地区填写不正确！").addClass("errorInp");
        }else{
            _this.removeAttr("errorMsg").removeClass("errorInp");
        }
    } else if(id==="fax"){
        if(val && !e.test(val)){
            _this.attr("errorMsg","请输入有效的传真号码！").addClass("errorInp");
        }else{
            _this.removeAttr("errorMsg").removeClass("errorInp");
        }
    }else if(id==="phone"){
        if(val){
            if(!e.test(val)){
                _this.attr("errorMsg","请输入有效的电话号码！").addClass("errorInp");
            }else{
                _this.removeAttr("errorMsg").removeClass("errorInp");
            }
        }else{
            _this.attr("errorMsg","电话号码为必填项！").addClass("errorInp");
        }
    }else if(id==="extPhone" || id==="extFax"){
        if(val && !e.test(val)){
            _this.attr("errorMsg","分机号码填写不正确！").addClass("errorInp");
        }else{
            _this.removeAttr("errorMsg").removeClass("errorInp");
        }
    } else if(id==="cpName"){
        if(val){
            if(!e.test(val)){
                _this.attr("errorMsg","姓名输入错误！").addClass("errorInp");
            }else{
                _this.removeAttr("errorMsg").removeClass("errorInp");
            }
        }else{
            _this.attr("errorMsg","姓名为必填项！").addClass("errorInp");
        }
    }else if(id==="cpPhone"){
        if(val){
            if(!e.test(val)){
                _this.attr("errorMsg","请输入有效的手机！").addClass("errorInp");
            }else{
                _this.removeAttr("errorMsg").removeClass("errorInp");
            }
        }else{
            _this.attr("errorMsg","手机为必填项！").addClass("errorInp");
        }
    }else if(id==="Email"){
        if(val){
            if(!e.test(val)){
                _this.attr("errorMsg","请输入有效的电子邮箱！").addClass("errorInp");
            }else{
                _this.removeAttr("errorMsg").removeClass("errorInp");
            }
        }else{
            _this.attr("errorMsg","电子邮箱为必填项！").addClass("errorInp");
        }
    }else {

    }
}

