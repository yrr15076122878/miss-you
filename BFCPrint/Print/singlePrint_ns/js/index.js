
//禁止回车键提交表单——动态绑定
$(function () {
    $("input").on('keypress',  //所有input标签回车无效，当然，可以根据需求自定义
function (e) {
    var key = window.event ? e.keyCode : e.which;
    if (key.toString() == "13") {
        return false;
    }
}
);
});
/**
 * Created by Administrator on 2017/4/25/025.
 */
var visitMain = {
    initialiseName: "Name",  //设置初始化姓名
    initialiseCompany: "Company",   //设置初始化公司名
    formSeriValAll: "#formDrawCard", //设置要提交的表单Id
    boothNumbFlag : false,
    start: function () {
        if (!visitMain.isIE()) {   //判断浏览器是否为IE
             $.smkAlert({
                text: '请使用IE浏览器打开！',
                type: 'warning',
                position: 'top-right',
                time: 10
            });
         }
        $.smkAlert({
            text: '该页面仅供应急使用，不保存胸卡信息！',
            type: 'warning',
            position: 'top-right',
            time: 10
        });


        //visitMain.drawCard(); //胸卡初始化
        Pum.loadCard("carder_box");
        visitMain.fullScreen('#fullScreenP');  //启用全屏
        //根据Url传入的参数改变卡片类型
        visitMain.GetQueryString("category","PType");
        visitMain.clearCard('#btnClear');  //清空输入框内容初始化数据
        visitMain.printCard();   //打印胸卡
        //读取信息绘制胸卡
        visitMain.drawAndReg({ '.getCompany': '.card_company' });   //公司
        visitMain.drawAndReg({'.getBarcode':'#jQBarcode'});   //条码
        
        if(config.nameInput ){
            visitMain.drawAndReg({ '.getLastName': '.card_name' });  //姓名{输入框Class:胸卡Class}   一个输入框
            $("#name_two").hide();
        }else{
            visitMain.drawAndReg({'.getfname':'.card_name','.getlname':'.card_name'});  //姓名{输入框Class:胸卡Class}
            $("#name_one").hide();
        }
        visitMain.drawAndReg({ '.cp_country div div div .searchable-select-item' : '.card_country_province' ,
            '.cp_province div div div .searchable-select-item' : '.card_country_province'}); //国家
        visitMain.drawAndReg({"#position":".card_position"}); //职位
        visitMain.drawAndReg({'.getBoothNumb':'.card_boothNum'});//展位号
        visitMain.other();
         
    },
    clearCard: function (elem) {  //清空输入框内容初始化数据
        $(elem).click(function () {
            swal({
                title: '是否清空数据？',
                text: "",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '清空',
                cancelButtonText: '取消'
            }).then(function (isConfirm) {
                if (isConfirm) {
                    visitMain.clearContent();  //清空卡片
                }
            })
        });
    },
    clearContent: function () {
        $('.form-group input').val("");  //点击确定清空内容
        //$('.form-group select').empty(); //清空选择
        //$('.searchable-select-holder').html(""); //清空选择
        $(".cp_country div div div .searchable-select-item:eq(0)").click();
        $('#jQBarcode').barcode('barcode', "code128", { barHeight: 30 }); //初始化条码
        /*$('.badge-box .card_name span').html(visitMain.initialiseName);
        $('.badge-box .card_company span').html(visitMain.initialiseCompany);*/
        //清楚卡片中个的信息
        $(".card_name div,.card_position div,.card_company div,.card_country_province div,#jQBarcode,.card_boothNum div").html("");//card_category
    },
    drawAndReg: function (Elem) {  //输入框判断
        for (var key in Elem) {   //遍历对象里面的值
            if (Elem[key] == '.card_name') {  //姓名
                $(key).bind("input paste dragenter",function (event) {   //键盘事件读取输入的值
                    var text = "";
                    $(this).parent().removeClass('has-error').children('span').remove();  //移除报错状态
                    // 父元素，自己元素，输入框元素，最小字体，需加载的文本
                    !config.nameInput && (text = $('.getfname').val()+" "+$('.getlname').val());
                    config.nameInput && (text = $('.getLastName').val());
                    var obj = {LineNumber:1,event:event,autoWrap:false,text:text,pElem:Elem[key],dElem:Elem[key]+" div",iElem:this,minF:fontSize.nameMinFontSize}
                    if(!config.nameInput){
                        obj.iElemNum = 2;
                    }
                    Pum.textAdaptation(obj);
                });
            } else if (Elem[key] == '.card_company' || Elem[key] == ".card_position") {//公司 和 职位
                $(key).bind("input paste dragenter",function (event) {   //键盘事件读取输入的值
                    var text = $(this).val();
                    Pum.textAdaptation({LineNumber:1,event:event,autoWrap:false,text:text,pElem:Elem[key],dElem:Elem[key]+" div",iElem:this,minF:fontSize.companyMinFontSize});
                });
            } else if(Elem[key] === '.card_country_province'){ //国家和省份
                $(key).click(function(){
                    var country = $('.cp_country div div div .searchable-select-item.selected').text();
                    var province = $('.cp_province div div div .searchable-select-item.selected').text();
                    var strc = country&&country.substring(0,country&&country.lastIndexOf(" ")).replace(" " ,"");
                    var strp = "";
                    var symbol = "";
                    if(strc==="China"){
                        strp = province&&province.substring(0,province&&province.lastIndexOf(" "));
                        symbol = strp&&strc?" / ":"";
                        $('.cp_province>div:eq(1)').show();
                        if(!strp){
                            $('.cp_province>div:eq(1)').append('<span class="alert_right text-danger">请选择省份</span>');
                            $(".cp_province .control-label").addClass("text-danger");
                            $(".cp_province .searchable-select .searchable-select-holder").addClass("alert_border")
                        }else{
                            $(".cp_province .searchable-select .searchable-select-holder").removeClass("alert_border")
                            $('.cp_province>div:eq(1)').parent().find('span:last').remove();
                            $(".cp_province .control-label").removeClass("text-danger");
                        }

                        $(".card_rediv").hide();
                    }else{
                        $(".cp_province .control-label").removeClass("text-danger");
                        $('.cp_province>div:eq(1)').hide();
                        $(".card_rediv").show();
                    }
                    // $(Elem[key]).html(strp+symbol+strc);
                });
            }else if(Elem[key] === '#jQBarcode'){  //条码
                $(key).bind("input",function () {   //键盘事件读取输入的值
                    var newText = $(this).val().replace(/[\u4E00-\u9FA5]/g,'');
                    $(this).val(newText);
                    $(Elem[key]).barcode( $(".getBarcode").val(), "code128", { barHeight: 30 });
                    $(".getBarcode").attr("maxlength",config.barcodeNum) ;
                    if ($(this).val() != "" && (newText.length==config.barcodeNum)) {   //判断输入的值匹配才能添加到胸卡
                        $(this).parent().removeClass('has-error').children('span').remove();  //
                    } else {
                        $(this).parent().children('span').remove();
                        $(this).parent().addClass('has-error').append('<span class="alert_right text-danger">请输入一个有效的字符串</span>')
                    }

                });

            } else if(Elem[key] === '.card_boothNum'){ //展位号
                $(key).bind("input paste dragenter",function (event) {   //键盘事件读取输入的值
                    var text = $(this).val();
                    Pum.textAdaptation({LineNumber:1,event:event,autoWrap:false,text:text,pElem:Elem[key],dElem:Elem[key]+" div",iElem:this,minF:fontSize.boothNumMinFontSize});
                });
            } else {
                /* $(key).keyup(function () {   //键盘事件读取输入的值
                 var regPattern = eval($(this).attr('data-smk-pattern'));  //将读取到的值转换为对象
                 if ($(this).val() != "" && regPattern.test($(this).val())) {   //判断输入的值匹配才能添加到胸卡
                 $(this).parent().removeClass('has-error').children('span').remove();  //移除报错状态
                 $(Elem[key]).html($(this).val());
                 visitMain.fontAutoSize(Elem[key], 15, this, 14, 17);//自动缩放字体大小
                 } else {
                 $(this).parent().children('span').remove();
                 $(this).parent().addClass('has-error').append('<span class="alert_right text-danger">请输入有效字符串</span>')
                 }
                 });*/
            }
            $(key).focusout(function () {
                var regPattern = eval($(this).attr('data-smk-pattern'));  //将读取到的值转换为对象
                if($(this).val()=="" ||!(regPattern.test($(this).val()))){  //验证输入框内容是否符合要求
                    $(this).parent().children('span').remove();
                    $(this).parent().addClass('has-error').append('<span class="alert_right text-danger">请输入有效字符串</span>')
                }else{
                    $(this).parent().removeClass('has-error').children('span').remove();
                }
            });
        }
    },
    printCard: function () {   //打印胸卡
        $('#print').click(function () {

            var msg = [];
            var fname = visitMain.getValue(".getfname");
            var lname = visitMain.getValue(".getlname");
            var LastName = visitMain.getValue(".getLastName");
            var companyPatt = visitMain.getValue("#companyPatt");
            var position = visitMain.getValue("#position");
            var country = visitMain.getValue(".getCountry");
            var province = visitMain.getValue(".getProvince");
            var boothNumb = visitMain.getValue(".getBoothNumb");
            var remark = $(".getRemark").val();
            var barcode = visitMain.getValue(".getBarcode");
            var category = $('.card_category').html();
            var obj = {
                'nameInput':config.nameInput,
                "Fname":fname||"",
                "Lname":lname||"",
                "Name":LastName||"",
                "Companypatt":companyPatt||"",
                "Jobtitle":position||"",
                "Country":country||"",
                "Province":province||"",
                "Boothnumb":boothNumb||"",
                "Remark":remark||"",
                "Barcode":barcode||"",
                "Category": category||""
            }
            //var strObj = JSON.stringify(obj); 

            if(!config.nameInput){
                if(fname==""){
                    msg.push("姓必填");
                }
                if(lname==""){
                    msg.push("名必填");
                }
            }else{
                if(LastName==""){
                    msg.push("姓名必填");
                }
            }
            
            if(!config.companyPatt && companyPatt==""){
                msg.push("公司必填");
            }
            
            if(config.position && position==""){
                msg.push("职位必填");
            }
            
            if(config.country_province && country==""){
                msg.push("国家必填");
            }
            if (config.country_province && $(".getCountry").val() == "86" && $(".getProvince").val() == "") {
                msg.push("省份必填");
            }
            
            if(visitMain.boothNumbFlag && boothNumb==""){
                msg.push("展位号必填");
            }
             
            if(config.getBarcodeNum === "f"){
                if(!barcode){
                    msg.push("条码必填");
                }else{
                    var value = $(".getBarcode").val();
                    if(value.length!=config.barcodeNum){
                        msg.push("条码有误");
                    }
                }
                         
            }

            if(msg.length>0){
                var alt = "";
                for(var m in msg){
                    alt += ("<span>[ "+msg[m]+" ]</span>");
                    if(m<msg.length-1){
                        alt += "，";
                        if((parseInt(m)+1)%4==0){
                            alt += "<br/>";
                        }
                    }
                }
                swal({
                    title: '温馨提示',
                    //text: alt,
                    type: 'info',
                    html:alt,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '确定',
                })
                return false;
            }

            //$(visitMain.formSeriValAll).submit(function (e) { e.preventDefault(); });  //阻止表单默认跳转
            //visitMain.doPrint('打印...');  //调用Ie打印功能

            if(!config.test){
                $.ajax({
                    type: 'post',  //设置请求类型
                    url: "data/onsiteadd.ashx",  //请求路径
                    data: obj,  //请求参数
                    success: function (data) {  //成功回调函数

                        if (data!= "0") {     //如果返回值匹配则执行打印
                            if (!visitMain.isIE()) {   //判断浏览器是否为IE
                                swal(
                                    '请使用IE浏览器进行打印!',
                                    '', 'warning'
                                )
                            } else {
                                $('#jQBarcode').barcode(data, "code128", { barHeight: 30 }); //初始化条码
                                $('.getBarcode').val(data);  //将返回的条码追加到元素上去
                                visitMain.statusProgress(); //打印进度条
                                visitMain.doPrint();  //调用Ie打印功能
                                //定时器清空防止打印不到数据
                                setTimeout(function () {
                                    visitMain.clearContent();  //清空数据
                                }, 3000);

                            }
                        } else {
                            sweetAlert({ title: "温馨提醒:",
                                text: "已经打印过",
                                type: "warning",
                                timer: 2000
                            });
                        }
                    },error:function(){
                        sweetAlert({ title: "请求出错",
                            text: "请检查服务器是否正常!",
                            type: "error",
                            timer: 2000
                        });
                    }
                });
            }else{
                    visitMain.statusProgress(); //打印进度条
                    visitMain.doPrint();  //调用Ie打印功能\
                    setTimeout(function () {
                        visitMain.clearContent();  //清空数据
                    }, 3000);
            }
        });
    },

    drawCard: function (me) {   //绘制胸卡
        var htmlCont = '<div class="badge-box center-block" id="page1">'+
            '<div class="cont-box card_name"><span class="name_span"></span></div>'+
            '<div class="cont-box card_position"><span class="company_span"></span></div>'+
            '<div class="cont-box card_company"><span class="position_span"></span></div>'+
            '<div class="cont-box card_country_province"><span class="country_province_span"></span></div>'+
            '<div class="cont-box card_barcode"><div id="jQBarcode"></div></div>'+
            '<div class="cont-box card_boothNum"><span class="boothNum_span"></span></div>'+
            '<div class="cont-box card_category"></div>'+
            '</div>';
        $('.carder_box').html(htmlCont).children().hide().show("puff");   //追加信息到元素中

        //jQui动画参数 clip裁切  fold折叠  drop降落  puff膨胀  slide滑动
        $('#jQBarcode').ready(function () {  //当svg加载出来开始绘制条码
            $('#jQBarcode').barcode('barcode', "code128", { barHeight: 30 });
        });
        // $('#jsBarcode').ready(function () {  //当svg加载出来开始绘制条码
        //     JsBarcode('#jsBarcode', $(me).children('td').eq(1).html(),{height:45,/*fontOptions: "bold",*/font: 'Arial'});
        // });
    },
    GetQueryString: function (category,type) {  //获取Url传入的参数
        var reg = new RegExp("(^|&)" + category + "=([^&]*)(&|$)", "i");  //正则表达式子，是获得的参数
        var reg2 = new RegExp("(^|&)" + type + "=([^&]*)(&|$)", "i");
        /*
        * location是包含了相关的url的信息，它是windown的一部分。
        * search是一个可以查询的属性，可以查询？之后的部分。
        * match()是你要匹配的部分 后面可以是正则表达式.
        * return unescpe（r[2]） 返回的值 一个数组
        * */
        var r = window.location.search.substr(1).match(reg);
        var r2 = window.location.search.substr(1).match(reg2);

        console.log(window.location.search.substr(1));
        if (r != null) {
            var scategory = decodeURIComponent(r[2]);
            var pt = (r2 && decodeURIComponent(r2[2]) )|| "";
            if(scategory.indexOf("展商")>-1){

                $("#booth_number,.card_boothNum").show();
                if(pt === "E" || pt === "e"){
                    $("input[name=boothNumb]").attr("disabled","disabled");
                    visitMain.boothNumbFlag = false;
                }else {
                    $("input[name=boothNumb]").removeAttr("disabled");
                    visitMain.boothNumbFlag = true;
                }

            }else{
                $("#booth_number,.card_boothNum").hide();
            }
            $('.card_category').html(scategory);

        } else {
            $("#booth_number,.card_boothNum").hide();
            $('.card_category span').html('');
        }
    },
    doPrint: function (how) {   //杰表打印控件
        var myDoc = {   //打印文档对象
            /*settings: {
                // 如果想使用默认打印机,不需要设置
                // printer: '联想激打',
                copies: 1,     //打印份数
                paperWidth: 1030,   //设置打印的宽度
                paperHeight: 1400,  //设置打印的高度
                topMargin: 0,
                leftMargin: 0,
                bottomMargin: 0,
                rightMargin: 0
                // 指定纸张的高宽以十分之一毫米为单位,本设置实际是指定为a4大小

                // 指定打打印方向为横向, 1/2 = 纵向/横向
            },*/
            documents: document,    // 打印页面(div)们在本文档中
            copyrights: '杰创软件拥有版权  www.jatools.com'         // 版权声明必须
        };
        var jatoolsPrinter = document.getElementById("jatoolsPrinter");
        // 调用打印方法
        if (how == '打印预览...') {
            jatoolsPrinter.printPreview(myDoc);   // 打印预览
        }
        else if (how == '打印...') {
            jatoolsPrinter.print(myDoc, true);   // 打印前弹出打印设置对话框
        }
        else {
            jatoolsPrinter.print(myDoc, false);       // 不弹出对话框打印
        }
    },
    progresDoc: function () {  //绘制Dom元素
        $('body').append('<div class="jq22-content" id="jQTtContent">' +
            '<h3 class="center-block"><i>正在打印&nbsp;&nbsp;&nbsp;</i><span class="glyphicon glyphicon-print"></span></h3>' +
            '<div class="progress"><b class="progress__bar"><span class="progress__text">' +
            '正在发送: <em>0%</em></span></b></div></div>')
    },
    statusProgress: function () {   //打印进度条
        visitMain.progresDoc();  //在文档中追加doc元素
        var $progress = $('.progress'),
            $bar = $('.progress__bar'),
            $text = $('.progress__text'),
            percent = 0, update, resetColors,
            speed = 200, orange = 30, yellow = 55, green = 85, timer;
        resetColors = function () {
            $bar.removeClass('progress__bar--green').removeClass('progress__bar--yellow')
                .removeClass('progress__bar--orange').removeClass('progress__bar--blue');
            $progress.removeClass('progress--complete');
        };
        update = function () {
            timer = setTimeout(function () {
                percent += Math.random() * 1.8;
                percent = parseFloat(percent.toFixed(1));
                $text.find('em').text(percent + '%');
                if (percent >= 80) {
                    percent = 80;
                    $progress.addClass('progress--complete');
                    $bar.addClass('progress__bar--blue');
                    $text.find('em').text('100%');
                    $('#jQTtContent').remove(); //移除进度条
                } else {
                    if (percent >= green) {
                        $bar.addClass('progress__bar--green');
                    } else if (percent >= yellow) {
                        $bar.addClass('progress__bar--yellow');
                    } else if (percent >= orange) {
                        $bar.addClass('progress__bar--orange');
                    }
                    speed = Math.floor(Math.random() * 40);
                    update();
                }
                $bar.css({ width: percent + '%' });
            }, speed);
        };
        setTimeout(function () {
            $progress.addClass('progress--active');
            update();
        }, 500);
        $(document).on('click', function (e) {
            percent = 0;
            clearTimeout(timer);
            resetColors();
            update();
        });
    },
    isIE: function () {   //判断是否为IE
        if (!!window.ActiveXObject || "ActiveXObject" in window)
            return true;
        else
            return false;
    },
    fullScreen: function (btnClick) {
        $(btnClick).click(function () {  //全屏
            if (screenfull.enabled) {
                // 仅仅只进行全屏而不退出全屏可以调用
                screenfull.toggle();
                // screenfull.toggle();
            } else {
                // Ignore or do something else
            }
        });
    },
    getValue:function(t){
        var value = $(t).val();
        var value2 = $.trim(value);
        if(value2 == ""&& value!="    "){
            return "";
        }else if(value=="    "){
            return value;
        }else{
            return value2;
        }

    },
    other:function(){
        $('.cp_province>div:eq(1)').hide();//隐藏省份选项
        if(config.getBarcodeNum=="b"){
            $(".getBarcode").attr("disabled","disabled")
        }else{
            $(".getBarcode").removeAttr("disabled")
        }
        if(config.country_province){
            $(".cp_country,.cp_province,.card_country_province").show();
        }else{
            $(".cp_country,.cp_province,.card_country_province").hide();
        }
        if(config.companyPatt){
            $(".company_div,.card_company").hide();
        }else{
            $(".company_div,.card_company").show();
        }

        if(config.position){
            $(".position_div,.card_position").show();
            $(".company_div").removeClass("col-sm-12").addClass("col-sm-6");
        }else{
            $(".position_div,.card_position").hide();
            $(".company_div").removeClass("col-sm-6").addClass("col-sm-12");
        }

        //打印预览
        $('.glyphicon-eye-open').click(function(){
            visitMain.doPrint('打印预览...');

        });
        
    }

};
window.onload=function(){visitMain.start()}; //执行Js