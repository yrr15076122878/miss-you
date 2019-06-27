
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

var visitMain = {

    initialiseName: "",  //设置初始化姓名
    initialiseCompany: "",   //设置初始化公司名
    formSeriValAll: "#formDrawCard", //设置要提交的表单Id
    searchId: '#searchRevIpt',  //保存搜索框的Id
    jQBarcode:"",
    QRC:false,  //是否打印二维码
    start: function () {
        //visitMain.GetQueryString();
        visitMain.fullScreen('#fullScreenP');  //启用全屏
        visitMain.clearCard('#btnClear');  //清空输入框内容初始化数据
        //阻止默认提交表单
        $(visitMain.formSeriValAll).submit(function (e) { e.preventDefault(); });
        visitMain.printCard();   //打印胸卡
        visitMain.searchData();  //调用搜索框
        //$('#jQBarcode').barcode('barcode', "code128", { barHeight: 30 }); //初始化条码
        //读取信息绘制胸卡
        visitMain.drawAndReg({ '.getLastName': '.card_name' });  //姓名{输入框Class:胸卡Class}
        visitMain.drawAndReg({ '.getCompany': '.card_company' });   //公司

        visitMain.drawAndReg({ '.cp_country div div div .searchable-select-item' : '.card_country_province' ,
            '.cp_province div div div .searchable-select-item' : '.card_country_province'}); //国家
        visitMain.drawAndReg({"#position":".card_position"}); //职位
        // $('#jQBarcode').barcode('barcode', "code128",{barHeight: 30}); //初始化条码
        // visitMain.drawAndReg({'.getBarcode':'#jQBarcode'});   //条码
        visitMain.other();
        //visitMain.drawCard('null', "11111111111@1000029@333@444@555@666@777@888");
    },
    searchData: function () {
        $('#btnSearch').on('click ', function () {  //点击搜索按钮执行事件
            if ($(visitMain.searchId).val() != "") {
                visitMain.AjaxDat();  //Ajax请求数据
            } else {
                sweetAlert({ title: "搜索关键字不能为空值！",
                    text: "",
                    type: "error",
                    timer: 2000
                });
            }
        });
        $(visitMain.searchId).keyup(function (ec) {
            if (ec.keyCode == 13) {
                if ($(visitMain.searchId).val() != "") {
                    visitMain.AjaxDat();  //Ajax请求数据
                } else {
                    sweetAlert({ title: "搜索关键字不能为空值！",
                        text: "",
                        type: "error",
                        timer: 2000
                    });
                }
            }
        });
    },
    AjaxDat: function () {
        $.ajax({
            type: 'post',    //请求类型
            url: "../data/getinfo.ashx",   //请求地址
            dataType: "text",  //请求的数据类型必须为对象
            data: { SeaKey: $(visitMain.searchId).val() },  //请求参数
            success: function (dataList) {
                if (dataList == "1") {  //如果没有搜索到数据返回空数组
                    sweetAlert({ title: "没有搜索到匹配的信息！",
                        text: "请校对后在进行搜索",
                        type: "question",
                        timer: 3000
                    });
                } else {
                    visitMain.drawCard('null', dataList);     //添加搜索到的数据
                }
            },
            error: function () {  //请求出现错误回调函数
                sweetAlert({ title: "请求出错",
                    text: "请检查服务器是否正常!",
                    type: "error",
                    timer: 2000
                });
            }
        });
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
        // $('.form-group select').empty(); //清空选择
        $(".cp_country div div div .searchable-select-item:eq(0)").click();
        $(".card_name div,.card_position div,.card_company div,.card_country_province div,.card_boothNum div,#jQBarcode,.card_QRcode,.card_category").html("");//card_category
    },
    drawAndReg: function (Elem) {  //输入框判断
        for (var key in Elem) {   //遍历对象里面的值
            if (Elem[key] == '.card_name') {  //姓名
                $(key).on("input paste dragenter",function (event) {   //键盘事件读取输入的值
                    var text = $('.getLastName').val();
                    $(this).parent().removeClass('has-error').children('span').remove();  //移除报错状态
                    Pum.textAdaptation({LineNumber:1,event:event,autoWrap:false,text:text,pElem:Elem[key],dElem:Elem[key]+" div",iElem:this,minF:fontSize.nameMinFontSize});
                });
            } else if (Elem[key] == '.card_company' || Elem[key] == ".card_position") {//公司 和 职位
                $(key).on("input paste dragenter",function (event) {   //键盘事件读取输入的值
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
                $(key).keyup(function () {   //键盘事件读取输入的值
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
                $(key).on("input paste dragenter",function () {   //键盘事件读取输入的值
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
            var inptRest = true;  //设置打印判断默认为true
            $(visitMain.formSeriValAll).submit(function (e) { e.preventDefault(); });  //阻止表单默认跳转
            // 将必须要填写的元素保存在变量中
            var elem = $('.form-group input[requir="true"],.form-group select[required="required"]');
            for (var i = 0; i < elem.length; i++) {  //循环每个元素确定其的值不为空
                if (elem.eq(i).val() == "" || !eval(elem.eq(i).attr('data-smk-pattern')).test(elem.eq(i).val())) {
                    inptRest = false;  //如果有空值设置其为false,则不能打印
                    $(elem.eq(i)).parent().addClass('has-error');  //设置空的输入框为报错状态
                }
            }
           // console.log($(visitMain.formSeriValAll).serialize());

            if (inptRest) {   //如果值不为空可以进行打印
                $(visitMain.formSeriValAll).submit(function (e) { e.preventDefault(); });  //阻止表单默认跳转
                swal({
                    title: '胸卡修改重打需要输入密码！',
                    input: 'password',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    confirmButtonColor: '#31b0d5',
                    // showLoaderOnConfirm: true,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            resolve();
                        });
                    },
                    allowOutsideClick: false
                }).then(function (value) {

                    if (value == 'corpit' || value == 'CORPIT') {  //设置输入框密码
                        //                                  resolve(); //提示框
                        $.ajax({
                            type: "post",  //设置请求类型
                            url: "../data/reprint.ashx",  //请求路径
                        
                            data: $(visitMain.formSeriValAll).serialize() + '&barcode=' + $('#jQBarcode div').last().html(),  //请求参数
                            success: function (data) {  //成功回调函数
                                // console.log(data.msg);
                           
                                if (data === "1") {     //如果返回值匹配则执行打印
                                    if (!visitMain.isIE()) {   //判断浏览器是否为IE
                                        swal(
                                            '请使用Ie浏览器进行打印!',
                                            '', 'warning'
                                        )
                                    } else {
                                        //$('#jQBarcode').barcode(data[0][1].barcode, "code128", { barHeight: 30 }); //初始化条码
                                       // $('.getBarcode').val(data[0][1].barcode);  //将返回的条码追加到元素上去

                                        //if(visitMain.QRC){
                                        //    $(".card_QRcode").html("<img id='qr_code' src='../QRcode/" + visitMain.jQBarcode + ".png' alt=''>");
                                        //    $("#qr_code").one("load", function () {
                                        //        visitMain.printMode();
                                        //    });
                                        //    $("#qr_code").one("error", function () {
                                        //        $(".card_QRcode").html("");
                                        //        if (confirm("二维码加载失败啦，是否继续打印？")) {
                                        //            visitMain.printMode();
                                        //        }
                                        //    });
                                        //}else{
                                        //    visitMain.printMode();
                                        //}
                                        visitMain.printMode();
                                    }
                                } else {
                                    sweetAlert({ title: "温馨提醒:",
                                        text: "数据提交失败,请处理后重试!",
                                        type: "warning",
                                        timer: 2000
                                    });
                                }
                            },
                            error: function () {
                                sweetAlert({
                                    title: "请求出错",
                                    text: "请检查服务器是否正常!",
                                    type: "error",
                                    timer: 2000
                                });

                            }
                        })
                    } else {
                        sweetAlert({
                            title: "密码输入错误！", text: "", type: "error", timer: 2000
                        });
                    }
                })

            } else {
                sweetAlert({ title: "温馨提醒:",
                    text: "不能以空格开头或值不能为空,请校对!",
                    type: "warning",
                    timer: 2000
                });
            }
        })
    },

    printMode:function () {
        visitMain.statusProgress(); //打印进度条
        visitMain.doPrint();  //调用Ie打印功能
        //定时器清空防止打印不到数据
        setTimeout(function () {
            visitMain.clearContent();  //清空数据
        }, 3000);
    },
    drawCard: function (me, dataLs) {   //绘制胸卡

        if (me == 'null') {
            //            for (var key in dataLs) {
            //                var dtListName = dataLs[key].name,
            //                    dtListCompany = dataLs[key].company,
            //                    dtListBarcode = dataLs[key].barcode,
            //                    dtListEmail = dataLs[key].email,
            //                    dtListCategory = dataLs[key].category;
            //            }
            visitMain.QRC = false;
            var arr = dataLs.split('@@');

            // 判断类型通道，不符时不加载卡片
            //var o = Pum.GetQueryString();
            //var category1 = decodeURIComponent(o["category"]).toLocaleLowerCase();
            var category1 = "普通观众 CONSUMER|专业观众 TRADE VISITOR";
            //var trData = table.row(this).data();
            var textC = arr[5].toLocaleUpperCase();
            if (category1.indexOf(textC) === -1) {
                $.smkAlert({
                    text: '提示：您当前通道与选择通道不符',
                    type: 'warning',
                    time: 2
                });
                return;
            }

            $('.getLastName').val(arr[2]);
            $('#position').val(arr[3]);
            $('.getCompany').val(arr[4]);
            $('.getBarcode').val(arr[1]);
            $('.getBoothNumb').val(arr[4]);
			$('.getPhone').val(arr[7]);
            $('.getEmail').val(arr[8]);
            $(".carder_box").html("");
            Pum.loadCard("carder_box");
            $('.pre').html(arr[9]).show();
            Pum.textAdaptation({LineNumber:1,event:-1,autoWrap:true,text:arr[2],pElem:'.card_name',dElem:'.card_name div',minF:fontSize.nameMinFontSize});
            Pum.textAdaptation({LineNumber:1,event:-1,autoWrap:true,text:arr[4],pElem:'.card_company',dElem:'.card_company div',minF:fontSize.companyMinFontSize});
            //Pum.textAdaptation({LineNumber:1,event:-1,autoWrap:true,text:arr[3],pElem:'.card_position',dElem:'.card_position div',minF:fontSize.companyMinFontSize});
            Pum.textAdaptation({LineNumber:1,event:-1,autoWrap:true,text:arr[5],pElem:'.card_category',dElem:'.card_category div',minF:fontSize.categoryMinFontSize});

            //jQui动画参数 clip裁切  fold折叠  drop降落  puff膨胀  slide滑动
            $('#jQBarcode').ready(function () {  //当svg加载出来开始绘制条码
                visitMain.jQBarcode = arr[1];
                $('#jQBarcode').barcode(arr[1], "code128", { barHeight: 30 });
                if(arr[5].indexOf("观众")>-1 && (arr[7] ||arr[8])){
                    visitMain.QRC = true;
                    $(".card_QRcode").html("<img id='qr_code' src='http://reg.biofachchina.com/QRcode/" + arr[1] + ".png' alt=''>");
                    $("#qr_code").one("error",function () {
                        $(this).attr("src","../QRcode/"+arr[1]+".png");
                    });
                }

            });
        } else {
            //未用到
            var htmlCont = '<div class="badge-box center-block" id="page1">' +
                '<div class="cont-box card_name"><span class="name_span">' + $(me).children('td').eq(visitMain.nameIndex).html() + '</span></div>' +
                '<div class="cont-box card_company"><span class="company_span">' + $(me).children('td').eq(visitMain.companyIndex).html() + '</span></div>' +
                '<div class="cont-box card_barcode"><div id="jQBarcode"></div></div>' +
                '<div class="cont-box card_category">' + $(me).children('td').eq(visitMain.categoryIndex).html() + '</div>' +
                '</div>';
            $('.carder_box').html(htmlCont).children().hide().show("puff");   //追加信息到元素中

            //jQui动画参数 clip裁切  fold折叠  drop降落  puff膨胀  slide滑动
            $('#jQBarcode').ready(function () {  //当svg加载出来开始绘制条码
                $('#jQBarcode').barcode($(me).children('td').eq(visitMain.barcodeIndex).html(), "code128", { barHeight: 30 });
            });
            // $('#jsBarcode').ready(function () {  //当svg加载出来开始绘制条码
            //     JsBarcode('#jsBarcode', $(me).children('td').eq(1).html(),{height:45,/*fontOptions: "bold",*/font: 'Arial'});
            // });
        }
    },
    doPrint: function (how) {   //杰表打印控件
        var myDoc = {   //打印文档对象
            settings: {
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
            },
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
    GetQueryString:function(){
        var cate = new RegExp("(^|&)category=([^&]*)(&|$)");
        var cate2 = window.location.search.substr(1).match(cate);
        var ls = decodeURIComponent(cate2[2]);
        cate?visitMain.addNav(ls):"";
    },
    addNav:function(nt){
        var html = ""
        if(nt){
            html = '<li><a href="../Oprint/index.html?category='+nt+'&PType=d"><span>'+nt+'</span></a></li>';
        }
        html += '<li><a href="reg.html?category='+nt+'">网上预登记</a></li>'
            +'<li class="select"><a href="reprint.html?category='+nt+'">修改重打</a></li>'
            +'<li><a href="../index.html">返回首页</a></li>';
        $(".nav-ul").html(html);

    },
    other:function(){
        $('.cp_province>div:eq(1)').hide();//隐藏省份选项
        //打印预览
        $('.glyphicon-eye-open').click(function(){
            visitMain.doPrint('打印预览...');
        });

        if (config.country_province) {
            $(".cp_country,.cp_province,.card_country_province").show();
        } else {
            $(".cp_country,.cp_province,.card_country_province").hide();
        }
        if(config.position){
            $(".position_div,.card_position").show();
            $(".company_div").removeClass("col-sm-12").addClass("col-sm-6");
        }else{
            $(".position_div,.card_position").hide();
            $(".company_div").removeClass("col-sm-6").addClass("col-sm-12");
        }



    }


};
window.onload=function(){visitMain.start()}; //执行Js