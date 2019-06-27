/**
 * Created by Web Develop on 2017/4/10.
 */
var main = {
    searchId: '#searchIpt',  //保存搜索框的Id
	QRC:true,
    start: function () {

        main.fullScreen('#fullScreenP');  //启用全屏
        main.keyBoardPlugin(); //调用键盘
        $('#searchIpt').focus();
        $('#btnSearch').click(function () {  //点击搜索按钮执行事件

            if ($(main.searchId).val() != "") {
                main.AjaxDat();  //Ajax请求数据
                $(main.searchId).val("");  //请求完成清空搜索内容
                $(main.searchId).focus(); //清空完成后获取输入焦点
            } else {
                sweetAlert({ title: "搜索关键字不能为空值！",
                    text: "",
                    type: "error",
                    timer: 2000
                });
            }
        })

        //main.alertAddCard("姓名@1000029@CCCC公司CC@DDD@EEEEEE@fffff种类fff");
    },
    keyBoardPlugin: function () {  //键盘事件

        //new KeyBoard();  //显示键盘
        $('#searchIpt').focus(function () {
            var $input = $(this);
            var inputId = $input.attr('id');  //读取当前输入框Id的值
            $("#calculatorTable td").unbind("click");
            if (inputId === "#searchIpt") { $("#searchCode").blur(); }
            //if (inputId === "#searchCode") { $("#searchIpt").blur(); }
            //var hasFocus = $('#'+inpuId).is(':focus');
            $("#calculatorTable td").click(function () {
                var textVal = $(this).attr("stn");
                var inputVal = $input.val();
                if (textVal != 'delete' && textVal != 'empty') {
                    console.log(textVal);
                    $input.val(inputVal + "" + textVal);
                } else {
                    if (textVal === 'delete') {
                        var newVal = "";
                        inputVal && (newVal = inputVal.substring(0, inputVal.length - 1));
                        $input.val(newVal);
                    }
                    if (textVal === 'empty') {
                        $input.val("");
                    }
                }
            });

        });
    },
    AjaxDat: function () {

        $.ajax({
            type: 'post',    //请求类型
            url: "../data/GetCInfo.ashx",   //请求地址
            dataType: "text",  //请求的数据类型必须为对象
            // data:'barcode='+$(main.searchId).val(),  //请求参数
            data: "SeaKey=" + $(main.searchId).val() + "",  //请求参数
            success: function (dataList) {

                if (dataList.length == 1) {  //如果没有搜索到数据返回空数组
                    sweetAlert({ title: "没有搜索到匹配的信息！",
                        text: "请到前台联系管理人员",
                        type: "question",
                        timer: 3000
                    });
                }
                else {
                    var arr = dataList.split('@@');
                    //打印次数大于0就说明已经打印过了
                    if (parseInt(arr[6])>0) {
                        sweetAlert({ title: "该胸卡已经打印过",
                            text: "请到前台联系管理人员",
                            type: "question",
                            timer: 5000
                        });
                    } else {
                        main.alertAddCard(dataList);     //弹出搜索到的胸卡
                    }
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
    alertAddCard: function (dtList) {
        //        for(var key in dtList){
        //            var dtListName = dtList[key].firstName,
        //                dtListCompany = dtList[key].company,
        //                dtListBarcode = dtList[key].barcode,
        //                dtListCategory = dtList[key].category;
        //        }

        // dtList = 姓名@职位@公司@省份国家(省份 / 国家)@条码@种类
        //Infotxt = "@@"["RegistrationNumber"]"@@"["UserName"]"@@""@@"["Company"]"@@"Category"@@"["PrintStatu"]"@@"["Mobilephone"]"@@"["Email"];
        var arr = dtList.split('@@');


        var htmlCont = '<div class="badge-box center-block" id="page1">' +
            '<div class="cont-box card_name"><span class="name_span">' + arr[2] + '</span></div>' +
            '<div class="cont-box card_position"><span class="position_span"></span></div>' +
            '<div class="cont-box card_company"><span class="company_span">' + arr[4] + '</span></div>' +
        // '<div class="cont-box card_barcode"><div id="jQBarcode"></div>' +
            '<div class="cont-box card_country_province"><span class="country_province_span"></span></div>' +
            '<div class="cont-box card_barcode"></div>' +
            //'<div class="cont-box card_QRcode"></div>'+
            '<div class="cont-box card_category">' + arr[5] + '</div>' +
            '</div>';
            
            
            

        $('#jQBarcode').ready(function () {  //当svg加载出来开始绘制条码

            setTimeout(function () { //设置定时器防止code先加载
            	main.QRC = true;
                //将元素克隆到卡片上,防止元素丢失
                $('.card_barcode').html($('#jQBarcode').barcode(arr[1], "code128", { barHeight: 30 }).clone(true));
                //$(".card_QRcode").html("<img id='qr_code' src='http://reg.biofachchina.com/QRcode/" + arr[1] + ".png' alt=''>");
                //$("#qr_code").on("error",function () {
                //    $(this).attr("src","../QRcode/"+arr[1]+".png");
                //    $(this).on("error",function () {
                //    	$(".card_QRcode").html("");
	            //        main.QRC = false;
	            //    });
                //});
                //     //JsBarcode('#jQBarcode', dtListBarcode,{height:45/*,font: 'Arial'*/});
                //     //$('#jQBarcode').barcode(dtListBarcode, "code128",{barHeight: 30});
            }, 100)

        });

        $('.card_hiden').html(htmlCont);   //设置隐藏域用来保存要打印的胸卡信息
        sweetAlert({ title: "胸卡预览",
            html: htmlCont,
            showCancelButton: true,
            cancelButtonText: '<i class="glyphicon glyphicon-off"></i>&nbsp;取消',
            cancelButtonColor: '#f0ad4e',
            showLoaderOnConfirm: true,
            confirmButtonText: '<i class="glyphicon glyphicon-print"></i>&nbsp;打印',
            confirmButtonColor: '#3085d6',
            closeOnConfirm: false,
            closeOnCancel: false

        }).then(function () {
            /* main.doPrint("打印预览...");
            return;*/
            if (!main.isIE()) {   //判断浏览器是否为IE
                swal(
                    '请使用Ie浏览器进行打印!',
                    '', 'warning'
                )
            } else {

                $.ajax({
                    type: "POST",  //设置请求类型
                    url: "../data/Regadd.ashx",  //请求路径

                    data: $(main.formSeriValAll).serialize() + '&barcode=' + $('#jQBarcode div').last().html(),  //请求参数
                    success: function (data) {  //成功回调函数
                        // console.log(data.msg);
                        if (data === "1") {
                            //if(!main.QRC){
	                        //	if(confirm("二维码加载失败啦，是否继续打印？")){
	                        //		main.statusProgress(); //打印进度条
	                        //        main.doPrint();  //调用Ie打印功能
	                        //	}
                            //}
                            main.statusProgress(); //打印进度条
                            main.doPrint();  //调用Ie打印功能
                            //                  setTimeout(function () {
                            //                                            visitMain.clearContent();  //清空数据
                            //                                        }, 3000);
                        }
                    }

                })

            }
        });

        main.fontAutoSize('.card_name', '.card_name span', fontSize.nameMinFontSize, arr[2]);
        //main.fontAutoSize('.card_position', '.card_position span', fontSize.companyMinFontSize, arr[1]);
        main.fontAutoSize('.card_company', '.card_company span', fontSize.companyMinFontSize, arr[4]);
        main.fontAutoSize('.card_category', '.card_category span', fontSize.nameMinFontSize, arr[5]);
    },
    //父元素，自己元素，最小字体，需加载的文本
    fontAutoSize: function (parentElem, selfElem, minFont, text) {

        $(selfElem).hide();
        $(selfElem).text(text);
        var parentElemWidth = $(parentElem).width();
        var pFont = parseFloat($(selfElem).parent("div").css('font-size'));
        $(selfElem).css("font-size", pFont + "px")
        var nowFontSize = pFont;
        var selfWidth = 0;
        for (var i = pFont; i > minFont; i--) {
            selfWidth = $(selfElem).width();
            nowFontSize = parseFloat($(selfElem).css('font-size'));
            if (selfWidth > parentElemWidth - 10) {
                $(selfElem).css("font-size", --nowFontSize + "px");
            } else {
                break;
            }
        }
        if (!text) { return; }
        for (var i = text.length - 1; i >= 0; i--) {
            selfWidth = $(selfElem).width();
            if (selfWidth > parentElemWidth - 10) {
                var newText = text.substring(0, i);
                $(selfElem).text(newText);
            } else {
                $(selfElem).show();
                break;
            }
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
            '<h3 class="center-block"><i>正在打印&nbsp;&nbsp;&nbsp;</i>' +
            '<span class="glyphicon glyphicon-print"></span></h3>' +
            '<div class="progress"><b class="progress__bar"><span class="progress__text">' +
            '正在发送: <em>0%</em></span></b></div></div>')
    },
    statusProgress: function () {   //打印进度条
        main.progresDoc();  //在文档中追加doc元素
        var $progress = $('.progress'), $bar = $('.progress__bar'), $text = $('.progress__text'), percent = 0, update, resetColors,
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
        if(main.isIE()){
        	//IE需要需要添加受信任的站点，不然此方法调用不了（为防止打印时退出全屏）
        	var wsh  =  new ActiveXObject("WScript.Shell");  
			wsh.sendKeys("{F11}"); 
        }else {
        	// 非IE的浏览器就随便了，反正用不上（杰表免费插件的限制）
        	var bodyEle = $("body");
			if(bodyEle.hasClass("fullScreen")){
				main.exitFullScreen();
			}else{
				main.fullScreenSt(document.documentElement);
			}
			bodyEle.toggleClass("fullScreen");
        }
            /* if (screenfull.enabled) {
                // 仅仅只进行全屏而不退出全屏可以调用
                screenfull.toggle();
                // screenfull.toggle();
            } else {
                // Ignore or do something else
            } */
        });
    },//全屏
	fullScreenSt:function(el) {
	    if(el.requestFullscreen) {
	        el.requestFullscreen();
	    } else if(el.mozRequestFullScreen) {
	        el.mozRequestFullScreen();
	    } else if(el.webkitRequestFullscreen) {
	        el.webkitRequestFullscreen();
	    } else if(el.msRequestFullscreen) {
	        el.msRequestFullscreen();
	    }
	},
	//退出全屏
	exitFullScreen:function(el) {
	    var el= document,
	        cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
	        wscript;
	    if (typeof cfs != "undefined" && cfs) {
	        cfs.call(el);
	        return;
	    }
	}

};
window.onload=function(){main.start()}; //执行Js