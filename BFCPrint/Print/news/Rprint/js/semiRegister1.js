var main = {
    searchId: '#searchIpt',  //保存搜索框的Id
    dataTableId: "#search-result",  //设置数据表格的id
    barcodeIndex: 1, //设置元素在表格中的位置
    CnameIndex: 2,
    nameIndex: 3,
    CcompanyIndex: 4,
    companyIndex: 5,
    typeIndex: 6,
    complete: true,
    start: function () {
        main.fullScreen('#fullScreenP');  //启用全屏
        main.dataTables([]);  //初始化表格状态
        main.selectData();  //设置单行数据选中事件
        main.printCard();   //打印胸卡
        main.searchData();  //搜索数据

        $("#printPreview").click(function () {
            main.doPrint('打印预览...');
        });

        $('#clearCard').click(function () {
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
                    main.dataTables([]);  //清空数据
                    $('.carder_box,.carder_box_repeat').html(""); //移除卡片
                }
            })
        })

        //            main.dataTables([
        //                { "printStatus": "0","ChineseName": "傅啸龙", 'EnglishName': '	FuXiaolong', "ChineseCompany": "广州汽车集团股份有限公司汽车工程研究院", "company": "GAC Automotive Engineering Institute", "DocumentType": "会议代表 Delegate", "barcode": "SAECCE1517" },
        //                { "printStatus": "0","ChineseName": "李涛", 'EnglishName': 'JINPINGFAN', "ChineseCompany": "广州汽车集团股份有限公司汽车工程研究院", "company": "GUANGZHOU AUTOMOBILE GROUP CO.,LTD AUTOMOTIVE ENGINEERING INSTITUTE ", "DocumentType": "会议代表 Delegate", "barcode": "SAECCE1393" },
        //                { "printStatus": "0","ChineseName": "连学通", 'EnglishName': 'litao', "ChineseCompany": "科必睿信息技术（上海）有限公司R", "company": "The Automotive Engineering Institute of Guangzhou Automobile Group Co., Ltd. (GAC ENGINEERING)", "DocumentType": "会议代表 Delegate", "barcode": "SAECCE1393" },
        //                { "printStatus": "0","ChineseName": "杨荣山", 'EnglishName': 'lixin', "ChineseCompany": "科必睿信息技术（上海）有限公司", "company": "GAC R&D", "DocumentType": "会议代表 Delegate", "barcode": "SAECCE1393" },
        //                { "printStatus": "0","ChineseName": "叶树斌", 'EnglishName': 'Wang Bo', "ChineseCompany": "广州汽车集团股份有限公司汽车工程研究院", "company": "GAC R&D CENTER", "DocumentType": "会议代表 Delegate", "barcode": "SAECCE1393" }]);

    },
    searchData: function () {
        $('#btnSearch').on('click ', function () {  //点击搜索按钮执行事件
            if ($(main.searchId).val() != "") {
                if (main.judgeCate()) {  //判断页面的类型设置请求数据的路径
                    main.AjaxDats("../data/RegList.ashx?SeaKey=" + escape($('#searchIpt').val()) + "");  //Ajax请求数据
                } else {
                    main.AjaxDats("../data/RegList.ashx?SeaKey=" + escape($('#searchIpt').val()) + "");  //Ajax请求数据
                }
                $('.carder_box,.carder_box_repeat').html(""); //移除卡片
                $(main.searchId).val("");  //请求完成清空搜索内容
            } else {
                sweetAlert({
                    title: "搜索关键字不能为空值！",
                    text: "",
                    type: "error",
                    timer: 2000
                });
            }
        });
        $(main.searchId).keyup(function (ec) {
            if (ec.keyCode == 13) {
                if ($(main.searchId).val() != "") {
                    if ($('#pageCate').attr('type-val') == 'reprint') {  //判断页面的类型设置请求数据的路径
                        // main.AjaxDat("../data/RegList.ashx?SeaKey=" + escape($('#searchIpt').val()) + "");  //Ajax请求数据
                    } else {
                        //  main.AjaxDat("../data/RegList.ashx?SeaKey=" + escape($('#searchIpt').val()) + "");  //Ajax请求数据
                    }
                    $('.carder_box,.carder_box_repeat').html(""); //移除卡片
                    $(main.searchId).val("");  //请求完成清空搜索内容
                } else {
                    sweetAlert({
                        title: "搜索关键字不能为空值！",
                        text: "",
                        type: "error",
                        timer: 2000
                    });
                }
            }
        });
    },
    judgeCate: function () {  //判断页面类型
        if ($('#pageCate').attr('type-val') == 'reprint') {
            return true;
        }
    },
    printCard: function () {   //打印胸卡
        $('#print').click(function () {
            /*main.statusProgress(); //打印进度条
            main.doPrint();  //调用Ie打印功能
            
            return;
           
            * */
            if ($('#page1').html() != undefined) {
                if (!main.isIE()) {   //判断浏览器是否为IE
                    swal(
                        '请使用Ie浏览器进行打印!',
                        '', 'warning'
                    )
                } else {
                    //打印状态更新
                    $.ajax({
                        type: 'post',
                        url: '../data/Regadd.ashx',
                        data: {
                            'barcode': $('#jQBarcode div').last().html()
                        },
                        success: function (data) {
                            console.log('Ajax 请求成功！！！')
                            //已打印
                            console.log(data);
                            if (data == 2) {
                                sweetAlert({
                                    title: "提示信息",
                                    text: "未付款不能打印",
                                    type: "error",
                                    timer: 2000
                                });
                            }

                            //没打印
                            if (data == 1) {
                                console.log("开始打印")
                                if (main.complete) {
                                    main.printMode();
                                } else {
                                    $(".card_QRcode").html("");
                                    if (confirm("二维码加载失败啦，是否继续打印？")) {
                                        main.printMode();
                                    }
                                }
                            }
                        },
                        //没请求到
                        error: function () {
                            sweetAlert({
                                title: "请求出错",
                                text: "请检查服务器是否正常!",
                                type: "error",
                                timer: 2000
                            });

                        }
                        //没请求到
                    });
                }

            } else {
                sweetAlert({
                    title: "请选择要打印的胸卡!",
                    text: "",
                    type: "warning",
                    timer: 2000
                });
            }
        })
    },
    printMode: function () {
        //打印区域
        main.statusProgress(); //打印进度条
        main.doPrint();  //调用Ie打印功能
        setTimeout(function () {
            main.dataTables([]);
            $('.carder_box,.carder_box_repeat').html(""); //移除卡片
        }, 3000);
    },
    AjaxDats: function (ajaxUrl) {
        $.ajax({
            type: 'post',    //请求类型
            url: ajaxUrl,   //请求地址
            dataType: "json",  //请求的数据类型必须为对象
            //data: 'barcode=' + $(main.searchId).val(),  //请求参数
            success: function (dataList) {
                if (dataList.length == 0) {  //如果没有搜索到数据返回空数组
                    sweetAlert({
                        title: "没有搜索到匹配的信息！",
                        text: "请校对后在进行搜索",
                        type: "question",
                        timer: 3000
                    });
                } else {
                    // console.dir(dataList);
                    main.dataTables(dataList);     //添加搜索到的数据
                }
            },
            error: function () {  //请求出现错误回调函数
                sweetAlert({
                    title: "请求出错",
                    text: "请检查服务器是否正常!",
                    type: "error",
                    timer: 2000
                });
            }
        });
    },
    AjaxDat: function (ajaxUrl) {
        $.ajax({
            type: 'post',    //请求类型
            url: ajaxUrl,   //请求地址
            dataType: "json",  //请求的数据类型必须为对象
            data: 'barcode=' + $(main.searchId).val(),  //请求参数
            success: function (dataList) {
                if (dataList.length == 0) {  //如果没有搜索到数据返回空数组
                    sweetAlert({
                        title: "没有搜索到匹配的信息！",
                        text: "请校对后在进行搜索",
                        type: "question",
                        timer: 3000
                    });
                } else {
                    // console.dir(dataList);
                    main.dataTables(dataList);     //添加搜索到的数据
                }
            },
            error: function () {  //请求出现错误回调函数
                sweetAlert({
                    title: "请求出错",
                    text: "请检查服务器是否正常!",
                    type: "error",
                    timer: 2000
                });
            }
        });
    },
    selectData: function () {   //表格数据单行选中执行事件
        $(main.dataTableId).on('click', 'tbody tr ', function () {
            var lastThs = this;  //将this保存在变量后面方便使用
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');  //取消选中状态
                //移除卡片
                $('.carder_box,.carder_box_repeat').html("");
            }
            else {
                $(main.dataTableId).dataTable().$('tr.selected').removeClass('selected');   //移除兄弟元素的选中状态
                $(this).addClass('selected');   //设置为选中状态
               
                //判断是否已经打印过
                if ($(this).children('td').children('span').attr('status') == 0) {
                    //绘制卡片
                    main.drawCard(this);
                    //            		main.fontAutoSize('.card_company span',fontSize.companyMinFontSize,)
                }

                else if ($(this).children('td').children('span').attr('status') == 1) {
                    if ($(this).children('td').attr('class') != 'dataTables_empty') {
                        $(this).removeClass('selected');//取消选中
                        swal({
                            title: '胸卡重打需要输入密码！',
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
                            if (value == 'corpit') {  //设置输入框密码
                                //                                  resolve(); //提示框
                                $(lastThs).addClass('selected');  //如果密码正确设置为选中状态并绘制卡片
                                main.drawCard(lastThs);
                                //                              main.fontAutoSize('.card_company span',fontSize.companyMinFontSize,); //字体自动缩放
                            } else {
                                sweetAlert({
                                    title: "密码输入错误！", text: "", type: "error", timer: 2000
                                });
                            }
                        })
                    } else {
                        sweetAlert({
                            title: "数据为空", text: "不能添加胸卡!", type: "warning", timer: 2000
                        });
                    }
                } else if ($(this).children('td').children('span').attr('status') == 2) {
                    sweetAlert({
                        title: "未付款", text: "不能打印胸卡!", type: "warning", timer: 2000
                    });
                }

            }
        });
    },
    //父元素，自己元素，最小字体，需加载的文本
    fontAutoSize: function (parentElem, selfElem, minFont, text) {
        //  	$(selfElem).hide();	
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
                console.log("长度" + selfWidth);
            } else {
                break;
            }
        }
        if (!text) { return; }
        for (var i = text.length - 1; i >= 0; i--) {
            selfWidth = $(selfElem).width();
            if (selfWidth > parentElemWidth - 10) {
                var newText = text.substring(0, i);
                console.log("字符长度" + newText.length);
                $(selfElem).text(newText);
            } else {
                $(selfElem).show();
                break;
            }
        }
    },
    fontAutoSize_n: function (parentElem, selfElem, minFont, text) {
        //    	$(selfElem).hide();
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
                var newText = text.substring(0);
                $(selfElem).text(newText);
                var j = text.length - i;
            } else {
                $(selfElem).show();
                break;
            }
        }
    },
    //表格信息在这里录入
    //胸卡在这里重新绘制
    drawCard: function (me) {   //绘制胸卡
        var CnameText = $(me).children('td').eq(main.CnameIndex).text();
        var nameText = $(me).children('td').eq(main.nameIndex).text();
        var CcompanyText = $(me).children('td').eq(main.CcompanyIndex).text();
        var companyText = $(me).children('td').eq(main.companyIndex).text();
        var typeText = $(me).children('td').eq(main.typeIndex).text();

        var htmlCont = '<div class="badge-box-bg">' +
            '<div class="badge-box center-block" id="page1">' +
            '<div class="cont-box card_name"><span class="name_span"></span></div>' +
	        '<div class="cont-box card_Cname"><span class="Cname_span"></span></div>' +
            '<div class="cont-box card_company"><span class="company_span"></span></div>' +
            '<div class="cont-box card_Ccompany"><span class="Ccompany_span"></span></div>' +
            '<div class="cont-box card_barcode"><div id="jQBarcode"></div></div>' +
            '<div class="cont-box card_gettype"><span class="gettype"></span></div>' +
            '</div>' + '</div>';
        $('.carder_box,.carder_box_repeat').html(htmlCont).hide().show("puff");;   //追加信息到元素中
        main.fontAutoSize('.card_name', '.card_name span', fontSize.nameMinFontSize, nameText);
        main.fontAutoSize('.card_Cname', '.card_Cname span', fontSize.nameMinFontSize, CnameText);
        main.fontAutoSize('.card_company', '.card_company span', fontSize.companyMinFontSize, companyText);
        main.fontAutoSize('.card_Ccompany', '.card_Ccompany span', fontSize.companyMinFontSize, CcompanyText);
        main.fontAutoSize('.card_gettype', '.card_gettype span', fontSize.categoryMinFontSize, typeText);
        //main.fontAutoSize('.card_position','.card_position span',fontSize.companyMinFontSize,positionTetx);
        //main.fontAutoSize('.card_category','.card_category span',fontSize.categoryMinFontSize,category);
        //jQui动画参数 clip裁切  fold折叠  drop降落  puff膨胀  slide滑动
        $('#jQBarcode').ready(function () {  //当svg加载出来开始绘制条码
            var jQBarcode = $(me).children('td').eq(main.barcodeIndex).html();
            $('#jQBarcode').barcode(jQBarcode, "code128", { barHeight: 30 });
            $(".card_QRcode").html("<img id='qr_code' src='../QRcode/" + jQBarcode + ".png' alt=''>");
            $("#qr_code").one("error", function () {
                $(this).attr("src", "http://hdz.chinacastexpo.com/QRcode/" + jQBarcode + ".png");
                $("#qr_code").one("error", function () {
                    main.complete = false;
                });
            });
        });
        // $('#jsBarcode').ready(function () {  //当svg加载出来开始绘制条码
        //     JsBarcode('#jsBarcode', $(me).children('td').eq(1).html(),{height:45,/*fontOptions: "bold",*/font: 'Arial'});
        // });
    },


    dataTables: function (resultData) {  //动态加载数据表
        var varColumns = [];
        if (main.judgeCate()) {

            varColumns = [
                { "data": "printStatus" },
                { "data": "barcode" },
                { "data": "ChineseName" },
                { "data": "EnglishName" },
                { "data": "ChineseCompany" },
                { "data": "company" },
                { "data": "DocumentType" }

            ]
        } else {
            varColumns = [     //读取结果中对应的数据
                { "data": "printStatus" },
                { "data": "barcode" },
               	{ "data": "ChineseName" },
                { "data": "EnglishName" },
                { "data": "ChineseCompany" },
                { "data": "company" },
                { "data": "DocumentType" }

            ]
        }
        $(main.dataTableId).dataTable({
            "destroy": true,   //不保存记录 方便重复搜索
            //"aLengthMenu": [6, 25, 50, -1],
            //"bLengthChange": false,   //页面显示条数默认True
            "scrollY": false,
            "language": {
                "paginate": {
                    "previous": "上一页",
                    "next": "下一页"
                },
                "lengthMenu": "每页 _MENU_ 条记录",
                "zeroRecords": "没有找到记录",
                "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
                "infoEmpty": "无记录",
                "sSearch": "搜索表中数据",
                "sZeroRecords": "找不到相关数据",
                "emptyTable": "没有数据",
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sInfoEmpty": "显示 0 - 0 共 0 条记录",
                "infoFiltered": "(从 _MAX_ 条记录过滤)"
            },
            "jQueryUI": true,
            searching: true, //是否支持搜索
            iDisplayLength: 10,//首次加载多少条数据
            "processing": true,
            // "ajax": "data/objects.ashx",
            "ajax": null,
            "columns": varColumns,
            "data": resultData,
            "createdRow": function (row) {
                var PrintStatus = $('td', row).eq(0).html();
                if (PrintStatus == 0) {
                    $('td', row).eq(0).html("<span status='0' class='label label-success'>未打印</span>");
                    $(row).addClass('PrintOn');
                } else if (PrintStatus == 1) {
                    $('td', row).eq(0).html("<span status='1' class='label label-danger'>已打印</span>");
                    $(row).addClass('PrintOff');
                }
                else if (PrintStatus == 2) {
                    $('td', row).eq(0).html("<span status='2' class='label label-warning'>未付款</span>");
                    $(row).addClass('PrintOff');
                }
                else {
                    sweetAlert({
                        title: window.location.host + "提醒您：",
                        text: "打印状态值不匹配,无法确定是否已打印!",
                        type: "error",
                        timer: 2000
                    });
                }

            }
        });
    },
    doPrint: function (how) {   //杰表打印控件
        var myDoc = {   //打印文档对象
            settings: {
                pageWidth: 1000,
                pageHeight: 600,
                orientation: 1
            },
            marginIgnored: true,
            dragDesigner: { viewSource: true },
            ettingsID: '',
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
                    $('#jQTtContent').remove();//移除进度条
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
    }

};
window.onload = function () { main.start() }; //执行Js