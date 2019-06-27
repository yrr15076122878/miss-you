/**
 * Created by Web Develop on 2017/4/10.
 */
var main = {
    searchId:'#searchIpt',  //保存搜索框的Id
    dataTableId:"#search-result",  //设置数据表格的id
    barcodeIndex:1, //设置元素在表格中的位置
    nameIndex:2,
    companyIndex:3,
    boothNumIndex:4,
    categoryIndex:5,
    start:function () {
        main.fullScreen('#fullScreenP');  //启用全屏
        main.dataTables([]);  //初始化表格状态
        main.selectData();  //设置单行数据选中事件
        main.printCard();   //打印胸卡
        main.searchData();  //搜索数据

        $("#printPreview").click(function(){
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
            }).then(function(isConfirm) {
                if (isConfirm) {
                   main.dataTables([]);  //清空数据
                   $('.carder_box').html(""); //移除卡片
                }
            })
        })

        //main.dataTables([{"name":"崔建玲","category":"媒体 PRESS","printStatus":"0","boothNum":"010101","company":"corporate IT solutuions (shanghai) co., ltd","barcode":"3100666"},{"firstName":"蒋学周","category":"主办单位 ORGANIZER","printStatus":"1","boothNum":"010101","company":"漯河市召陵区农林局 ","barcode":"3100863"},{"firstName":"李普","category":"专业观众 TRADE VISITOR","printStatus":"1","boothNum":"010101","company":"金周科技(上海)有限公司","barcode":"5000484"},{"firstName":"卢周锋","category":"专业观众 TRADE VISITOR","printStatus":"1","boothNum":"010101","company":"西安耀天生化科技有限公司","barcode":"5000229"},{"firstName":"邵周鹏","category":"专业观众 TRADE VISITOR","printStatus":"1","boothNum":"010101","company":"香格里拉圣宝食品进出口有限责任公司","barcode":"2102375"}]);
    },
    searchData:function () {
        $('#btnSearch').on('click ',function () {  //点击搜索按钮执行事件
            if($(main.searchId).val()!=""){
                if (main.judgeCate()) {  //判断页面的类型设置请求数据的路径
                    main.AjaxDat("../../data/ERegList.ashx?SeaKey=" + escape($('#searchIpt').val()) + "");  //Ajax请求数据
                } else {
                    main.AjaxDat("../../data/ERegList.ashx?SeaKey=" + escape($('#searchIpt').val()) + "");  //Ajax请求数据
                }
                $('.carder_box,.carder_box_repeat').html(""); //移除卡片
                $(main.searchId).val("");  //请求完成清空搜索内容
            }else{
                sweetAlert({title: "搜索关键字不能为空值！",
                    text: "",
                    type: "error",
                    timer: 2000
                });
            }
        });
        $(main.searchId).keyup(function (ec) {
            if(ec.keyCode==13){
                if($(main.searchId).val()!=""){
                    if($('#pageCate').attr('type-val')=='reprint'){  //判断页面的类型设置请求数据的路径
                        main.AjaxDat("../../data/ERegList.ashx?SeaKey=" + escape($('#searchIpt').val()) + "");  //Ajax请求数据
                    }else{
                       main.AjaxDat("../../data/ERegList.ashx?SeaKey=" + escape($('#searchIpt').val()) + "");  //Ajax请求数据
                    }
                    $('.carder_box,.carder_box_repeat').html(""); //移除卡片
                    $(main.searchId).val("");  //请求完成清空搜索内容
                }else{
                    sweetAlert({title: "搜索关键字不能为空值！",
                        text: "",
                        type: "error",
                        timer: 2000
                    });
                }
            }
        });
    },
    judgeCate:function () {  //判断页面类型
        if($('#pageCate').attr('type-val')=='reprint'){
            return true;
        }
    },
    printCard:function () {   //打印胸卡
        $('#print').click(function () {
       
            if($('#page1').html()!=undefined){
                if(!main.isIE()){   //判断浏览器是否为IE
                    swal(
                        '请使用Ie浏览器进行打印!',
                        '', 'warning'
                    )
                } else {
                    //打印状态更新
                       $.ajax({
                type: 'post',
                url: '../../data/ERegadd.ashx',
                data: {
                    'Barcode': $('#jQBarcode div').last().html()
                },
                 success: function(data) {
         
                    console.log('Ajax 请求成功！！！')
                     //已打印
                 
                         if (data == 2) {
                       sweetAlert({ title: "提示信息",
                    text: "已经打印过",
                    type: "error",
                    timer: 2000
                              });
                         
                        }
                         //已打印
                           //没打印
                    if (data == 1) {
                    //打印区域
                    main.statusProgress(); //打印进度条
                    main.doPrint();  //调用Ie打印功能
                    setTimeout(function () {
                    main.dataTables([]); 
                        $('.carder_box').html(""); //移除卡片
                    }, 3000);
                    //打印区域
                    }
                     //没打印
                    },
                     //没请求到
                   error: function() {
                       sweetAlert({title: "请求出错",
                           text: "请检查服务器是否正常!",
                           type: "error",
                           timer: 2000
                       });

                    }
                         //没请求到
               });
               }                
                
            }else{
                sweetAlert({title: "请选择要打印的胸卡!",
                    text: "",
                    type: "warning",
                    timer: 2000
                });
            }
        })
    },
    AjaxDat:function (ajaxUrl) {
        $.ajax({
            type: 'post',    //请求类型
            url: ajaxUrl,   //请求地址
            dataType:"json",  //请求的数据类型必须为对象
            data:'barcode='+$(main.searchId).val(),  //请求参数
            success: function(dataList) {
                if(dataList=="0"){  //如果没有搜索到数据返回空数组
                    sweetAlert({title: "没有搜索到匹配的信息！",
                        text: "请校对后在进行搜索",
                        type: "question",
                        timer: 3000
                    });
                    main.dataTables([]);
                }else{
                    // console.dir(dataList);
                    main.dataTables(dataList);     //添加搜索到的数据
                }
            },
            error:function () {  //请求出现错误回调函数
                sweetAlert({title: "请求出错",
                    text: "请检查服务器是否正常!",
                    type: "error",
                    timer: 2000
                });
            }
        });
    },
    selectData:function(){   //表格数据单行选中执行事件
        $(main.dataTableId).on( 'click', 'tbody tr', function () {
            var lastThs = this;  //将this保存在变量后面方便使用
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');  //取消选中状态
                //移除卡片
                $('.carder_box,.carder_box_repeat').html("");
            }
            else {
                $(main.dataTableId).dataTable().$('tr.selected').removeClass('selected');   //移除兄弟元素的选中状态
                $(this).addClass('selected');   //设置为选中状态
                //判断是否已经打印过
                if($(this).children('td').children('span').attr('status')==0){
                    //绘制卡片
                    main.drawCard(this);
                    main.fontAutoSize('.card_company');

                }else{
                    if($(this).children('td').attr('class')!='dataTables_empty'){
                        $(this).removeClass('selected');//取消选中
                        swal({
                            title: '胸卡重打需要输入密码！',
                            input: 'password',
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            confirmButtonColor: '#31b0d5',
                            // showLoaderOnConfirm: true,
                            preConfirm: function() {
                                return new Promise(function(resolve) {
                                    resolve();
                                });
                            },
                            allowOutsideClick: false
                        }).then(function(value) {
                            if (value == 'corpit' || value == 'CORPIT') {  //设置输入框密码
//                                  resolve(); //提示框
                                $(lastThs).addClass('selected');  //如果密码正确设置为选中状态并绘制卡片
                                main.drawCard(lastThs);
                                main.fontAutoSize('.card_company'); //字体自动缩放
                            } else {
                                sweetAlert({
                                    title: "密码输入错误！",text: "",type: "error",timer: 2000
                                });
                            }
                        })
                    }else{
                        sweetAlert({
                            title: "数据为空",text: "不能添加胸卡!",type: "warning",timer: 2000
                        });
                    }
                }
            }
        } );
    },
    //父元素，自己元素，最小字体，需加载的文本
    fontAutoSize:function(parentElem,selfElem,minFont,text){

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
        if(!text){return ;}
        for(var i = text.length-1;i>=0;i--){
            selfWidth = $(selfElem).width();
            if(selfWidth>parentElemWidth-10){
                var newText = text.substring(0,i);
                $(selfElem).text(newText);
                var j = text.length - i;
            }else{
                $(selfElem).show();
                break;
            }
        }

    },
    drawCard:function (me) {   //绘制胸卡
        var nameText = $(me).children('td').eq(main.nameIndex).text();
        var companyTetx = $(me).children('td').eq(main.companyIndex).text();
        var positionTetx = $(me).children('td').eq(main.positionIndex).text();
        var boothNumText = $(me).children('td').eq(main.boothNumIndex).text();
        var categoryText = $(me).children('td').eq(main.categoryIndex).text();

        $(".carder_box").html("");
        Pum.loadCard("carder_box");
        Pum.textAdaptation({LineNumber:1,event:-1,autoWrap:true,text:nameText,pElem:'.card_name',dElem:'.card_name div',minF:fontSize.nameMinFontSize});
        Pum.textAdaptation({LineNumber:1,event:-1,autoWrap:true,text:companyTetx,pElem:'.card_company',dElem:'.card_company div',minF:fontSize.companyMinFontSize});
        Pum.textAdaptation({LineNumber:1,event:-1,autoWrap:true,text:boothNumText,pElem:'.card_boothNum',dElem:'.card_boothNum div',minF:fontSize.boothNumMinFontSize});
        Pum.textAdaptation({LineNumber:1,event:-1,autoWrap:true,text:positionTetx,pElem:'.card_position',dElem:'.card_position div',minF:fontSize.companyMinFontSize});
        Pum.textAdaptation({LineNumber:1,event:-1,autoWrap:true,text:categoryText,pElem:'.card_category',dElem:'.card_category div',minF:fontSize.categoryMinFontSize});


        //jQui动画参数 clip裁切  fold折叠  drop降落  puff膨胀  slide滑动
        $('#jQBarcode').ready(function () {  //当svg加载出来开始绘制条码
            $('#jQBarcode').barcode($(me).children('td').eq(main.barcodeIndex).html(), "code128",{barHeight: 30});
        });

    },
    dataTables:function(resultData){  //动态加载数据表
        var varColumns = [];
        if(main.judgeCate()){
            varColumns = [
                { "data": "printStatus" },
                { "data": "barcode" },
                { "data": "name" },
                { "data": "company" },
                { "data": "boothNum" },
                { "data": "category" }
            ]
        }else{
            varColumns = [     //读取结果中对应的数据
                { "data": "printStatus" },
                { "data": "barcode" },
                { "data": "name" },
                { "data": "company" },
                { "data": "boothNum" },
                { "data": "category" }
            ]
        }
        $(main.dataTableId).dataTable( {
            //"bFilter": false,  //搜索功能
            "destroy": true,   //不保存记录 方便重复搜索
            //"aLengthMenu": [6, 25, 50, -1],
            //"bLengthChange": false,   //页面显示条数默认True
            "scrollY": false,
            "language": {
                "paginate": {
                    "previous": "上一页",
                    "next": "下一页"
                },
                "emptyTable": "没有数据",
                "sZeroRecords":"找不到相关数据",
                "sSearch": "搜索表中数据",
                "info": "显示  _START_ - _END_ 共 _TOTAL_ 条记录",
                "sInfoEmpty": "显示 0 - 0 共 0 条记录",
                "sInfoFiltered":"",
                "sLengthMenu": "每页显示 _MENU_ 条记录"

            },
            // "ajax": "data/objects.ashx",
            "ajax":null,
            "columns": varColumns,
            "data":resultData,
            "jQueryUI": true,
            searching: true, //是否支持搜索
            iDisplayLength: 10,//首次加载多少条数据
            "processing": true,
            "createdRow": function(row) {
                var PrintStatus = $('td', row).eq(0).html();
                if (PrintStatus == 0) {
                    $('td', row).eq(0).html("<span status='0' class='label label-success'>未打印</span>");
                    $(row).addClass('PrintOn');
                } else if (PrintStatus == 1) {
                    $('td', row).eq(0).html("<span status='1' class='label label-danger'>已打印</span>");
                    $(row).addClass('PrintOff');
                } else {
                    sweetAlert({title:window.location.host+"提醒您：",
                        text: "打印状态值不匹配,无法确定是否已打印!",
                        type: "error",
                        timer: 2000
                    });
                }

            }
        } );
    },
    doPrint:function (how) {   //杰表打印控件
        var myDoc = {   //打印文档对象
            settings:{
                // 如果想使用默认打印机,不需要设置
                // printer: '联想激打',
                copies:1,     //打印份数
                paperWidth : 1030,   //设置打印的宽度
                paperHeight : 1400,  //设置打印的高度
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
        if (how == '打印预览...')
        {
            jatoolsPrinter.printPreview(myDoc);   // 打印预览
        }
        else if (how == '打印...')
        {
            jatoolsPrinter.print(myDoc, true);   // 打印前弹出打印设置对话框
        }
        else
        {
            jatoolsPrinter.print(myDoc, false);       // 不弹出对话框打印
        }
    },
    progresDoc:function () {  //绘制Dom元素
        $('body').append('<div class="jq22-content" id="jQTtContent">' +
            '<h3 class="center-block"><i>正在打印&nbsp;&nbsp;&nbsp;</i><span class="glyphicon glyphicon-print"></span></h3>' +
            '<div class="progress"><b class="progress__bar"><span class="progress__text">' +
            '正在发送: <em>0%</em></span></b></div></div>')
    },
    statusProgress:function () {   //打印进度条
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
    isIE:function () {   //判断是否为IE
        if (!!window.ActiveXObject || "ActiveXObject" in window)
            return true;
        else
            return false;
    },
    fullScreen:function (btnClick) {
        $(btnClick).click(function () {  //全屏
            if(screenfull.enabled){
                // 仅仅只进行全屏而不退出全屏可以调用
                screenfull.toggle();
                // screenfull.toggle();
            }else {
                // Ignore or do something else
            }
        });
    }

};
window.onload=function(){main.start()}; //执行Js