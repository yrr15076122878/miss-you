/*! jaFunRun page JS */

//胸卡添加信息
;
(function($) {
    jQuery.fn.extend({
        "addInfoText": function(options) {
            var setings = $.extend({
                //"name": "WEII XU",
                //"company": "Corporate IT",
               // "boothNum": "W12",
                //"city": "Shanghai / China",
                //"barcode": "W19941221",
                //"category": "VISITOR 观众"
            }, options);

            // console.log(" name =" + options.name  +", company =" + options.company + ", city =" + options.city  +", barcode =" + options.barcode)
            //插件代码
            //$(".name", this).text(setings.name);
            //$(".company", this).text(setings.company);
           // $(".boothNum", this).text(setings.boothNum);
            //$(".city", this).text(setings.city);
            $(".category", this).text(setings.category);
            $(".barcode .bcTarget", this).empty().barcode(setings.barcode, "code128", {
                barWidth: 1.2,
                barHeight: 30,
                showHRI: true
            });
            return this; //返回this ，使方法可链。
        }
    })
})(jQuery);

(function($) {
    $.extend({
        enterInfo: function(options) {
            var setings = $.extend({
                //"category": "VISITOR 观众"
            }, options);

            //插件代码
            if ($(".getCountry").val() == 86) {
                str = jQuery.trim($(".getProvince option:selected").text());
                length = str.search(/[\u4e00-\u9fa5]/g)
                city = str.substr(0, length - 1)

                str2 = jQuery.trim($(".getCountry option:selected").text());
                length = str2.search(/[\u4e00-\u9fa5]/g)
                Country = str2.substr(0, length - 1)
                if (city != '') {
                    city = city + " / " + Country
                } else {
                    city = Country
                }

            } else {
                str = $(".getCountry option:selected").text();
                length = str.search(/[\u4e00-\u9fa5]/g)
                city = str.substr(0, length - 1)
            }
            /*var fName = jQuery.trim($(".getFirstName").val()),
                lName = jQuery.trim($(".getLastName").val()),
                name = fName + " " + lName;*/
            var name = jQuery.trim($(".getLastName").val()),
             
            company = jQuery.trim($(".getCompany").val()),
                boothNum = jQuery.trim($(".getBoothNum").val()),
                barcode = jQuery.trim($(".getBarcode").val()),
                category = setings.category

            // console.log(name + " | " + company + " | " + city + " | " + barcode + " | " + category)

            $(".wrap").addInfoText({
                name: name,
                company: company,
                boothNum: boothNum,
                //city: city,
                barcode: barcode,
                category: category
            })
            return this; //返回this ，使方法可链。
        },

        defaultState: function(argument) {
            $(".name span").text("");
            $(".company textarea").val("");
            $(".company span").text("");
            $(".city span").text("");
            $(".barcode .bcTarget").empty();
            $(".photo").empty();
            $(".boothNum span").empty();
            $(".category").empty();
            $(".full-fixed").slideDown("fast");
            $('.wrap').removeClass('printing');
            // $('.pos-box').css('marginLeft', 'auto'); //文字左右偏移
            $(".wrap:gt(0)").remove();
            $("#formBadgeText input, #formBadgeText select").val("");
            $("#formBadgeText input").eq(0).focus();
            console.log("默认-清空");
        }

    })
})(jQuery);

$(document).ready(function() {

    // input Enter 事件
    $('.form-search input.form-control').focus().on('keyup', function(event) {
        if (event.keyCode == 13) {
            // console.log("Enter")
            $(this).parents('.form-search').next('.form-group').find('.btn-search').triggerHandler('click');
        }
    });

    // 表格行双击触发按钮
    $('.table').on('dblclick', 'tr', function(event) {
        event.preventDefault();
        console.log('tr')
        $(this).find('a span, a i').trigger('click');
    });

    // 表单验证
    $('#enter-info .form-control').on('blur', function(event) {
        if ($(this).smkValidate()) {}
        // console.log($(this))
        // console.log(event.type)
        // console.log(event.keyCode)

        if ($(this).is('.getCompany')) {
            // && event.type == 'blur'
            if ($("#country").val() == "" && event.type == 'blur') {
                $("#country").select2("open");
            }
        }
        $.enterInfo()
    }).keyup(function(event) {
        $.enterInfo()
    });

    // 国家-省份
    /*$('#country').css('width', '100%');
    $('#province').css('width', '100%');

    var $country = $('#country').select2();
    var $province = $('#province').select2();
    $('#country').select2({
        placeholder: "选择一个国家"
    });
    $('#province').select2({
        placeholder: "选择一个省份"
    });
    $('#country, #province').on('select2:select', function(event) {
        // console.log($("#country").select2("val"))
        if ($(this).is('#country') && $(this).val() == 86) {
            $('#province').prop("disabled", false);

            $("#province").select2("open");
        } else if ($(this).is('#province') && $(this).val() != "") {
            $country.val("86").trigger("change");
        } else {
            $province.val(null);
            $('#province').select2({
                placeholder: "选择一个省份"
            });
            $('#province').prop("disabled", true).smkClear();
        }
        $('.getBarcode').focus();
        jQuery.enterInfo()
    });

    // 搜索
    $('#btnPrompt').click(function(e) {
        e.preventDefault();
        // $('#smkPromptInput').attr('val', 'password');
        $('#smkPromptInput').focus();
        $.smkPrompt({
            text: '输入密码',
            accept: '确定',
            cancel: '取消'
        }, function(res) {
            // Code here
            if (res == "corpitit") {
                $.smkAlert({
                    text: '正确！ ',
                    type: 'success',
                    position: 'top-right',
                    time: 10
                });
                location.href = "search.html";
            } else {
                $.smkAlert({
                    text: '错误！',
                    type: 'warning',
                    position: 'top-right',
                    time: 5
                });
            }
        });
    });*/

    // 全屏
    $('#fullscreen').smkFullscreen();
    // Panel
    $("#enter-info").smkPanel({
        hide: 'min,remove'
    });
    // Panel success
    $("#panel1").smkPanel();

    // getBarcode打印事件
    $('.getBarcode').keyup(function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            $('#print').triggerHandler('click')
        }
    });

    //打印事件
    $('#print').on('click', function(event) {
        event.preventDefault();

        if (confirm("你确定打印吗？")) {  }  
        else {  return ; } 

        if ($('#formBadgeText').smkValidate()) {
            // Code here

            $.smkProgressBar({
                element: 'body',
                status: 'start',
                bgColor: 'rgba(0,0,0,0.6)',
                barColor: '#fff',
                content: '<i class="fa fa-spin fa-spinner"></i>　请稍等...'
            });

            if (typeof($('#print').attr('disabled')) === 'undefined') {
                console.log('打印。。。')
                allPrint();
                setTimeout(function() {
                    $.smkProgressBar({
                        status: 'end'
                    });
                    $('.empty').trigger('click');
                    $('#print').removeAttr('disabled');
                    $.smkAlert({
                        text: '打印发送成功!',
                        type: 'success'
                    });

                }, 3000);
            } else {
                console.log('稍后 正在打印。。。')
                $('#print').attr('disabled', 'true');
            }

        } else {
            $.smkAlert({
                text: '提示：请将信息填写完整',
                type: 'warning',
            });
        }

        // allPrint();

    });
    //默认状态
    $.defaultState();

    //清空
    $('.empty').hover(function() {
        $('.fa', this).addClass('fa-spin')
    }, function() {
        $('.fa', this).removeClass('fa-spin')
    }).on('click', function(event) {
        event.preventDefault();
        $.defaultState();
        $('form').smkClear();
        /*$('#country').select2({
            placeholder: "选择一个国家"
        });
        $('#province').select2({
            placeholder: "选择一个省份"
        });
        $('#province').prop("disabled", false);
        $country.val(null);
        $province.val(null);*/
    });

    var infoText = [{
        "name": "name",
        "company": "company",
        "city": "city",
        "barcode": "barcode",
        "category": "category"
    }];
    for (var i = 0; i < infoText.length; i++) {
        var $target = $(".wrap").eq(i)
            // console.log($target)
            // console.log(infoText[i].name)
        $target.addInfoText({
            name: infoText[i].name,
            company: infoText[i].company,
            city: infoText[i].city,
            barcode: infoText[i].barcode,
            category: infoText[i].category
        })
    }
    swicth();
    $(".checked-switch").click(function(){swicth();});

    $(".getLastName").keyup(function(){
        var text = $(this).val();
        fontAutoSize('.wrap','.name span',this, fontSize.nameMinFontSize,text);
    });
    $(".getCompany").keyup(function(){
        var text = $(this).val();
        fontAutoSize('.wrap','.company span',this, fontSize.companyMinFontSize,text);
    });
	$(".getBoothNum").keyup(function(){
        var text = $(this).val();
        fontAutoSize('.boothNum','.boothNum span',this, fontSize.boothNumMinFontSize,text);
    });
    
});

function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, ""); //去掉所有的html标记
}

function isIE() { //ie?  
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
    } else {
        return false;
    }
}

function doPrint(options) {
    if (!isIE()) {
        $.smkAlert({
            text: '请使用IE浏览器打开！',
            type: 'warning',
            position: 'top-right',
            time: 10
        });
    }
    //添加打印class
    $('.wrap').addClass('printing');
        // ie 打印控件不居中  文字左右调节
        //$('.pos-box').css('marginLeft', '-15px');
        //$('.wrap').css('border','1px solid #000');

    for (var i = 0; i < $('.wrap').length; i++) {
        $('.wrap')[i].id = 'page' + (i + 1)
        console.log($('.wrap')[i].id)
    }
    var badge = {
        documents: document,
        copyrights: '杰创软件拥有版权  www.jatools.com'
    };
    var jatoolsPrinter = document.getElementById("jatoolsPrinter");
    if (options == '') {
        jatoolsPrinter.print(badge, false); // 不弹出对话框打印
        console.log('直接打印')
    } else if (options == '预览') {
        jatoolsPrinter.printPreview(badge); // 打印预览
        console.log('打印预览')
    } else if (options == '选项') {
        jatoolsPrinter.print(badge, true); // 打印前弹出打印设置对话框
        console.log('打印选项')
    } else {
        jatoolsPrinter.print(badge, false); // 不弹出对话框打印
        console.log('直接打印')
    }
}

// 打印
function allPrint(options) { 

    //添加打印class
    $('.wrap').addClass('printing')
    if (isIE()) {
        // IE不提示打印框
        var jp = document.getElementById("jatoolsPrinter");
        if (typeof jp.printPreview == 'undefined') {
            $.smkAlert({
                text: '没有安装打印控件，请下载安装',
                type: 'warning',
                position: 'top-right',
                time: 10
            });
        }
        doPrint();
    } else {
        $('.wrap').addClass('printing chromeSize')
        window.print();
    }
    // var timer = null;
    // var timer = setTimeout($.defaultState, 3000);
    // $.defaultState();
}

if (!isIE()) {
    $.smkAlert({
        text: '请使用IE浏览器打开！',
        type: 'warning',
        position: 'top-right',
        time: 10
    });
}
/** 开关  */
function swicth(){
    var check = $(".checked-switch").prop("checked");
    if(!check){
        $('.wrap').css({
            'display': 'block',
           'margin':'25% auto'
        });
        $('.wrap:gt(0)').hide();
    }else{
        $('.wrap').css({
            'display':'inline-block',
            'margin':'80px 8px 8px'
        });
        $('.wrap:gt(0)').show();

    }
}

//字体缩放
//父元素，自己元素，输入框元素，最小字体，需加载的文本
function fontAutoSize(parentElem,selfElem,inputElem,minFont,text){

    var inputText = $(inputElem).val();
    $(selfElem).hide();
    $(selfElem).text(text);
    var parentElemWidth = $(parentElem).width();
    var pFont = parseFloat($(selfElem).parent("div").css('font-size'));
    $(selfElem).css("font-size",pFont+"px")
    var nowFontSize = pFont;
    var selfWidth = 0;
    for(var i = pFont;i > minFont;i-- ){
        selfWidth = $(selfElem).width();
        nowFontSize = parseFloat($(selfElem).css('font-size'));
        if(selfWidth > parentElemWidth-10){
            $(selfElem).css("font-size",--nowFontSize+"px");
        }else{
            break;
        }
    }
    if(!text){return;}
    for(var i = text.length-1;i>=0;i--){
        selfWidth = $(selfElem).width();
        if(selfWidth>parentElemWidth-10){
            var newText = text.substring(0,i);
            $(selfElem).text(newText);
            var j = text.length - i;
            var newInputText = inputText.substring(0,inputText.length-j);
            $(inputElem).val(newInputText);
        }else{
            $(selfElem).show();
            break;
        }
    }

}
