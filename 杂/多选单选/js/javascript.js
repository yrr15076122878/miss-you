var mainProject = {
    countdownTime: 20,//获取验证码间隔的时间
    start: function () {
        mainProject.inputTest("#btnPGetYzm1", mainProject.isPhoneNo, "手机号码不正确！");
        mainProject.inputTest("#btnEGetYzm1", mainProject.isEmail, "请输入正确的邮箱地址！");
        mainProject.IFIE();
    },
    //编写提示框  模态框
    modAlert: function (textVal, btnName) {
        //var textVal = "Error:Null";
        var subMit = btnName == undefined ? "确定" : btnName;
        var modalAlert = '<div class="Modal_box">' +
            '<p>' + window.location.host + '&nbsp;提醒您:</p>' +
            '<span>' + textVal + '</span>' +
            '<input type="submit" id="alertModBtn" value="' + subMit + '"/>' +
            '</div>';
        if ($('body').find("div.Modal_box").html() == undefined) {  //避免DOM节点重复追加
            $('body').append(modalAlert);
        }
        $('#alertModBtn').click(function () {
            $('.Modal_box').remove();
        })
    },
    isPhoneNo: function (phone) {  //手机号码验证
        var pattern = /^1[34578]\d{9}$/;
        return pattern.test(phone);
    },
    isEmail: function (str) {   //验证邮箱
        //var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return reg.test(str);

    },
    inputTest: function (btnCode, testFn, modAlTxt) {  //检查输入的input是否为真
        var thiPrev = $(btnCode).prev(); //获取当前输入框的值
        var kaiguan = 1;//防止Click事件被多次挤压执行 只能执行一次
        var countdown = mainProject.countdownTime;
        function settimeCode(obj) {
            console.log("执行settimecode");
            //判断如果输入框的值为空或者为假不执行函数内容
            if (thiPrev.val().length != "" && testFn($.trim(thiPrev.val())) !== false) {
                thiPrev.attr("disabled", true);  //每次执行函数禁止用户更改联系方式
                if (countdown == 0) {
                    kaiguan = 1;   //每次执行完设置click的判断值为1可重复使用函数
                    $(obj).css(
                        { "background": "#1161ee", "color": "#fff" }
                     ).removeAttr("disabled").val("获取验证码");
                    thiPrev.removeAttr("disabled");
                    countdown = mainProject.countdownTime;  //每次执行完重置时间
                    return;
                } else {
                    $(obj).css(
                        { "background": "#ccc", "color": "rgb(159,159,159)" }
                    ).attr("disabled", true).val(countdown + "s重新获取");
                    countdown--;
                }
                setTimeout(function () {
                    settimeCode(obj)
                }
                    , 1000)
            }
        }
        //自动判断输入是否已经完成
        thiPrev.on('keyup', function () {
            // 判断手机号码
            if (testFn($.trim(thiPrev.val())) == false) {   //如果输入框的值不匹配返回false
                $(this).change(function () {
                    if (testFn($.trim($(this).val())) == false) {
                        mainProject.modAlert(modAlTxt);
                        //$(this).val("");
                        $(btnCode).css({ "background": "#ccc", "color": "rgb(159,159,159)" });
                    }
                })
            } else {
                if ($(this).val() != "" && testFn($.trim($(this).val())) !== false && $(this).val().length >= 11) {  //判断输入框内容不为空
                    $(btnCode).css({ "background": "#1161ee", "color": "#fff" }).click(function () {

                        if (kaiguan) {   //设置click事件点击一次执行一次
                            settimeCode(this);   //传入参数btnCode指当前点击的这个元素,防止这些元素都执行
                            kaiguan = 0;
                        }
                    })
                }
            }
        });
        $(btnCode).click(function () {
            if (thiPrev.val() == "" || testFn($.trim(thiPrev.val())) == false) {
                mainProject.modAlert("请检查是否输已入正确信息!");
            }
        });
    },
    IFIE: function () {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            flag = false;
            alert("暂不支持IE 6.0及其一下版本,请使用IE 8.0+ 打开");
        }
        if (navigator.userAgent.indexOf("MSIE 7.0") > 0) {
            flag = false;
            alert("暂不支持IE 7.0及其一下版本,请使用IE 8.0+ 打开")
        }
        if (navigator.userAgent.indexOf("MSIE 8.0") > 0) {
            toggleMenu('label[class="tab"]', 'for');
        }
        if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
            toggleMenu('input[name="tab"]', 'id');
        }
        function toggleMenu(Elem, Typ) {
            $('.sign-up-htm').css("display", "none");
            $('.sign-in-htm').css("display", "block");
            $(Elem).on('change click', function () {
                if ($(this).attr(Typ) == "tab-1") {
                    $('.sign-up-htm').hide();
                    $('.sign-in-htm').show();
                } else {
                    $('.sign-up-htm').show();
                    $('.sign-in-htm').hide();
                }
            })
        }
    }
};
//页面加载后，执行函数
window.onload = function () { mainProject.start() };