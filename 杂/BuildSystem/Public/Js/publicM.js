/**
 *  公共的方法封装在这里
 */
var public = {

    // 返回顶部，样式在 i-css.css 中
    gotoTop:function(){
        if($(".gotoTop").length===0){
            $("body").append('<div class="gotoTop"></div>');
        }
        $(window).scroll(function () {
            if ($(window).scrollTop() > 50) {
                $(".gotoTop").fadeIn(1000);
            } else {
                $(".gotoTop").fadeOut();
            }
        });
        $(".gotoTop").click(function () {
            $('body,html').animate({scrollTop: 0}, 500);
            return false;
        });
    },
    //获取url参数对象
    getUrlVal:function(){
        var url=location.search;
         var Request = {};
        if(url.indexOf("?")!=-1){　　
            var str = url.substr(1)　//去掉?号
             var strs = str.split("&")||[];　
             for(var i=0;i<strs.length;i++){
                 //加密 encodeURL();
                 var KV = strs[i].split("=")||[];
                 Request[KV[0]] = decodeURI(KV[1]);
             }
             //console.log(Request);
        }
        return Request;
    },
    /**
     *  公共表格设置   tableEle:表的选择器
     *  dataList : 数据对象 [{"a":"","b":""},{},......]
     *  columnsArr: [{"data":""},{},{},...]
     *  orderArr:数据排序 如：[
     *                       [0, 'asc'],
     *                       [1, 'asc'],
     *                       [2, 'asc'],
     *                       [3, 'desc'],
     *                       [4, 'asc']，
     *                       ...
     *                       ]
     *
     * callback ：对数据行做的操作
     * searching : 是否支持二次搜索
     * lengthChange ： 是否支持每页显示几条
     */
    setDataTable:function(tableEle,dataList,columnsArr,orderArr,callback,searching,lengthChange) {
        if(!tableEle || !columnsArr || columnsArr.length==0 ){
            console.log("无法生成表格，请检查传值是否正确。");
            return null;
        }
        var obj = {
            "ajax": null,
            //'data': dataList,
            'destroy': true,   //不保存记录 方便重复搜索
            "jQueryUI": true,
            'searching': false, //是否支持搜索
            "lengthChange": false,  //每页显示几条,false 为不启用
            'iDisplayLength': 30,//首次加载多少条数据
            "processing": true,
            "scrollCollapse": true,
            "paging": true,
            "language": {
                "paginate": {
                    "previous": "上一页",
                    "next": "下一页"
                },
                "emptyTable": "没有数据",
                "sZeroRecords": "找不到相关数据",
                "sSearch": "搜索表中数据",
                "info": "显示  _START_ - _END_ 共 _TOTAL_ 条记录",
                "sInfoEmpty": "显示 0 - 0 共 0 条记录",
                "sInfoFiltered": "",
                "sLengthMenu": "每页显示 _MENU_ 条记录"
            }
        };


        if(dataList && dataList.length>0){
            obj["data"] = dataList;
        }
        if(columnsArr && columnsArr.length>0){
            obj["columns"] = columnsArr;
        }
        if(orderArr && orderArr.length>0){
            obj["order"] = orderArr;
        }
        if(searching){
            obj["searching"] = searching;
        }
        if(lengthChange){
            obj["lengthChange"] = lengthChange;
        }
        if(callback){
            obj["createdRow"] = function (row, data, index) {
                callback(row);
            };
        }
        var table = $(tableEle).DataTable(obj);
        return table;
    },
    /**
     * 输入框的简单校验
     * 需要按照下面的参数进行配置
     */
    /**
     * reg ：正则
     * nTitle ：输入框名称
     * errorMsg ：输入错误是的提示
     * data-bind ：ele|bele //密码框需要 ele和bele 都是元素选择器
     *
     * 示例：
     * 普通输入框 <input type="text" name="UserName" id="UserName" class="width" required reg="/^[a-zA-Z0-9_-]{6,12}$/" nTitle="用户名" errorMsg="为 6 到 12 位（字母，数字，下划线，减号）">
     * 密码框：<input type="password" name="password" id="password" class="width" required reg="/^[\w\W]{4,}$/" nTitle="密码" errorMsg="有误" data-bind="this|#confPass">
     * 确认密码框：<input type="password" name="confPass" id="confPass" class="width" required errorMsg="两次密码输入不一致" data-bind="#password|this">
     *
     * 错误时样式 .errorInp {
     *     border: 1px solid red !important;
     * }
     *
     * 无特别要求时直接调用start方法即可
     */
    valide:function(){
        var obj = {
            input:function(formEle){
                //input 输入时
                $(formEle+" input:visible").on("input blur", function () {
                    valide(this);
                });
                //提示信息
                var index = "";
                $(formEle+" input:visible").on("mouseover", function () {
                    var errorMsg = $(this).attr("Msg");
                    if (errorMsg) {
                        index = layer.tips(errorMsg, this, { tips: [ 1,'#0f74cc'] });
                    }
                });
                $(formEle+" input:visible").on("mouseout", function () {
                    if (index) {
                        layer.close(index);
                        index = "";
                    }
                });
            },
            getValide:function(formEle){//表单选择器，获得输入框的检验标志，false为校验通过
                //提交校验
                $(formEle+" input:visible").each(function (index, $this) {
                    valide(this);
                });
                return $(formEle+" input").hasClass("errorInp");
            },
            submit:function(formEle,btnEle){
                $(btnEle).click(function(){
                    var flag = obj.getValide(formEle);
                    if(flag){
                        return false;
                    }else{
                        return true;
                    }

                });
            },
            start:function (formEle,btnEle) {//表单选择器，提交按钮选择器
                obj.input(formEle);
                obj.submit(formEle,btnEle);
            }
        };
        function valide($this){
            var _this = $($this);
            var type = _this[0]["type"];// 输入框类型
            var nTitle = _this.attr("nTitle")||"";//输入框标题
            var errorMsg = _this.attr("errorMsg")||"";//报错提示
            var databind = _this.attr("data-bind")||"";
            if(type === "password" && databind){
                var bindArr = databind.split("|");
                var b = bindArr[0];
                var b2 = bindArr[1];
                var flag = false;
                if(b==="this"){
                    b = $this;
                }
                if(b2==="this"){
                    b2 = $this;
                    flag = true;
                }
                var _pass0 = $(b);
                var _pass1 = $(b2);
                var _passV0 = $.trim(_pass0.val());
                var _passV1 = $.trim(_pass1.val());
                if(flag){
                    if(_passV0!==_passV1){
                        var msg = nTitle+errorMsg;
                        addRemoveError(_pass1,"add",msg);
                    }else{
                        addRemoveError(_pass1,"remove");
                    }
                }else{
                    valideInput(b);
                }
            }else{
                valideInput($this);
            }
        }
        function valideInput($this) {
            var _this = $($this);
            var required = _this.prop("required"); //必填
            var type = _this[0]["type"];// 输入框类型
            var reg = _this.attr("reg");//正则
            var nTitle = _this.attr("nTitle")||"";//输入框标题
            var errorMsg = _this.attr("errorMsg")||"";//报错提示
            var val = $.trim(_this.val());//值
            var e;
            if (reg) { e = eval(reg); }
            if (required) {
                if(val){
                    if(e && !e.test(val)){//校验没通过
                        var msg = nTitle+errorMsg;
                        addRemoveError(_this,"add",msg);
                    }else{
                        addRemoveError(_this,"remove");
                    }
                } else {
                    var msg = nTitle + "不能为空";
                    addRemoveError(_this, "add", msg);
                }
            } else {
                if(val && e && !e.test(val)){//校验没通过
                    var msg = nTitle+errorMsg;
                    addRemoveError(_this,"add",msg);
                }else{
                    addRemoveError(_this,"remove");
                }
            }
        }
        function addRemoveError(_this,ar,text){
            if(ar==="add"){
                _this.attr("Msg",text).addClass("errorInp");
            }else if(ar==="remove"){
                _this.removeAttr("Msg").removeClass("errorInp");
            }
        }
        return obj;
    }
};
















