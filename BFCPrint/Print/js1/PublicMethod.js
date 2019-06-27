/**
 * Created by Administrator on 2017/10/19/019.
 */



var Pum = {
    /**
     * 加载胸卡
     *  animate : 有时这个动画会影响功能，可设置为不要动画（不传 或者为 false就行）
     *
     */

    //url 中携带参数
    GetQueryString: function () {  //获取Url传入的参数
        var obj = {};
        var r = window.location.search.substr(1).split("&");
        for (var n in r) {
            var s = r[n];
            if (s) {
                var arr = s.split("=");
                obj[arr[0]] = arr[1];
            }
        }
        return obj;
    },
    loadCard:function(box,animate) {
        var Badge =
            '<div class="badge-box center-block" id="page1">'+
            '<div class="cont-box card_name"><div></div></div>'+
            '<div class="cont-box card_position"><div></div></div>'+
            '<div class="cont-box card_company"><div></div></div>'+
            '<div class="cont-box card_country_province"><div></div></div>'+
            '<div class="cont-box card_barcode"><div id="jQBarcode"></div></div>'+
            '<div class="cont-box card_boothNum"><div></div></div>'+
           // '<div class="cont-box card_QRcode"></div>'+
            '<div class="cont-box card_category"><div></div></div>'+
            '</div>'
        $("."+box).append(Badge);
        if(animate){
            $("."+box).children().hide().show("puff");
        }
    },

        /**
         * 文字自适应
         *
         * 说明：此文字自适应分为 手动输入(三种事件：input（输入），paste（粘贴），dragenter（拽入）) 和 后台获取内容 两种方式，
         * 包含 文字缩放 自动换行 和 超出剪裁，
         * 自动输入时无法掌控文字大小，建议与手动的最小文字配置分开，
         * 如没有达到预想效果请检查配置。
         * 手动也可配置成自动换行，但字符过长时性能下降很大
         *
         */
        textAdaptation:function(obj){
        /**
         *  默认的配置 （此配置可通过传入 如{ LineNumber:3 ,  ... } 进行修改）
         * LineNumber   :  行数  需要多少行，就配成几   无限制换行：Un
         * event        :  输入event对象   这个很重要，一定要传,没有就配 -1
         * autoWrap     :  自动换行  决定是自动换行，还是手动双空格换行 （自动功能支持有无 双空格 两种情况）
         * text         :  内容文本
         * pElem        :  最外层的容器元素div  决定文本的最大宽度
         * dElem        :  最内层的容器元素div  直接包裹文本的div
         * iElem        :  输入框元素   没有就不配
         * iElemNum     :  输入框的个数 没有就不配
         * minF         :  最小文字大小（px）
         * errValue     :  误差值 （px）  若想要文字两边空白留多些，可配置大一些
         */
        var options = {
            LineNumber:1
            ,event:{}
            ,autoWrap:false
            ,text:""
            ,pElem:""
            ,dElem:""
            ,iElem:""
            ,iElemNum:""
            ,minF:12
            ,errValue:15
        }

        /** 初始化 span */
        function addSpan(){
            if($("#__Autospan").length == 0){
                $("body").append("<span id='__Autospan' style='display: none;'></span>")
            }else{
                $("#__Autospan").attr("style","display: none");
            }
        }
        /** 盒子div的宽度 */
        function boxDivWidth(pE,ev){
            return $(pE).width()-ev;
        }

        /**
         * 控制文字大小
         * pW: 盒子div元素宽度
         * sE: 最内层div元素
         * minFsize: 最小字（px）
         */
        function fontsize(pW,sE,minFsize,txt){
            addSpan();
            $("#__Autospan,"+sE).html(txt);
            var pDIV  = $(sE).parent("div");
            var pDivFont = parseFloat(pDIV.css('font-size'));
            var pDivfamily = pDIV.css('font-family');
            var pDivfw = pDIV.css('font-weight');
            var pDivfc = pDIV.css('text-transform');
            $("#__Autospan,"+sE).css({"font-size":pDivFont+"px",'font-family':pDivfamily,"font-weight":pDivfw,"text-transform":pDivfc});
            for(var i = pDivFont;i > minFsize;i-- ){
                var sW = $("#__Autospan").width();
                var nowFontSize = parseFloat($("#__Autospan").css('font-size'));
                if(sW > pW){
                    $("#__Autospan,"+sE).css("font-size",--nowFontSize+"px");
                }else{
                    break;
                }
            }
        }
        /**
         * 控制换行 ( 有双空格情况)
         * num :次数
         * txt :文本
         */
        function br(num,txt) {
            //自定义行数
            if((typeof(num) == "number"||!isNaN(Number(num)))&&num>0){
                for(var i = 1 ;i < num ; i++){
                    txt = txt.replace(/[\s]{2}/,"<br>");
                }
                //不限制换行数
            }else if(num === "Un"){
                txt = txt.replace(/[\s]{2}/g,"<br>");
            }else if(num <= 0){
                console.info("行数必须大于0");
            }else {
                console.info("行数设置必须为数字或者Un");
            }
            return txt;
        }

        /** 预知下个输入是否会超宽度 */
        function predictNext(pW,sE,iE,minFsize,txt,autoWrap){
            var newtxt = txt + "H";
            var flg = false;
            $("#__Autospan").html(newtxt);
            var selfWidth2 = $("#__Autospan").width();
            var sDivFont = parseFloat($(sE).css('font-size'));
            if(selfWidth2 > pW &&  sDivFont-minFsize < 1){
                if(iE&&!autoWrap){
                    $(iE).attr("maxlength",$(iE).val().length);
                }
                flg = true;
            }else{
                if(iE && $(iE).attr("maxlength")){
                    $(iE).removeAttr("maxlength");
                }
                flg = false;
            }
            $("#__Autospan").html(txt);
            return flg;
        }
        /**
         * 截取字符串
         * pW: 盒子div元素宽度
         * sE :内层div元素
         * iE :输入框元素
         * txt:文本
         */
        function subStr(pW,sE,iE,txt){
            for(var i = txt.length-1; i>-1 ;i--){
                var selfWidth = $("#__Autospan").width();
                if(selfWidth>pW){
                    var newTxt = txt.substring(0,i);
                    $("#__Autospan,"+sE).html(newTxt);
                    if(iE){
                        $(iE).val(newTxt.replace(/<br>/g,"  "));
                    }
                }else{
                    break;
                }
            }
        }
            /**
             * 截取字符串 (多个输入框的情况)
             */
        function subStr2(pW,text,iE,dE){
            for(var i = text.length-1;i>=0;i--){
                var selfWidth = $("#__Autospan").width();
                if(selfWidth>pW){
                    var newText = text.substring(0,i);
                    $("#__Autospan,"+dE).text(newText);
                    var j = text.length - i;
                    var newInputText = $(iE).val().substring(0,$(iE).val().length-j);
                    $(iE).val(newInputText);
                }else{
                    break;
                }
            }
        }

        /** 所有操作完成后，检查是否超出 */
        function inspect(pW,sE,iE,txt,autoWrap){
            var spanw = $("#__Autospan").width();
            if(spanw > pW){
                if(iE&&autoWrap){
                    $(iE).attr("maxlength",txt.replace(/<br>/g,"").length-1);
                }
                subStr(pW,sE,iE,txt);
            }else{
                if(iE&&autoWrap){
                    $(iE).removeAttr("maxlength");
                }
            }
        }

        /**
         *  返回换行数组( 用于自动换行无双空格情况)
         *  Objs   ： 参数对象
         *  pW     ： box div 宽度
         *  val    ： 需加载的文本
         */
        function autoArr(Objs,pW,val) {
            $("#__Autospan,"+Objs.dElem).html("");
            var strArr = [];
            var txt;
            for(var i =0;i<val.length;i++){
                txt = $("#__Autospan").html()||"";
                var f = predictNext(pW,Objs.dElem,Objs.iElem,Objs.minF,txt,Objs.autoWrap);
                if(f){
                    var txt1,txt2;
                    for(var j = txt.length-1;j>0;j--){
                        var nTxt = txt.charAt(j);
                        if(txt.length - j < 20){
                            if(nTxt==" "){
                                txt1 = txt.substring(0,j);
                                txt2 = txt.substring(j,txt.length);
                                break;
                            }
                        }else{
                            txt1 = txt;
                            txt2 = "";
                        }
                        if(!txt1&&!txt2){
                            txt1 = txt;
                            txt2 = "";
                        }
                    }
                    strArr.push(txt1);
                    txt = txt2+val.charAt(i);
                }else{
                    txt += val.charAt(i);
                }
                $("#__Autospan").html(txt);
                if(i==val.length-1){
                    strArr.push(txt);
                }
            }
            return strArr;
        }

        /**
         *  根据行数生成字符串 （用于自动换行无双空格情况）
         */
        function getStr(num,strArr) {
            var txt = "";
            //自定义行数
            if((typeof(num) == "number"||!isNaN(Number(num)))&&num>0){
                for(var c in strArr){
                    if(num-1>0 && c>0){
                        txt = txt + "<br>" + strArr[c];
                        num--;
                    }else{
                        txt += strArr[c];
                    }
                }
                //不限制换行数
            }else if(num === "Un"){
                for(var c in strArr){
                    if(c==0){
                        txt = strArr[c];
                    }else{
                        txt = txt + "<br>" + strArr[c];
                    }
                }
            }else if(num <= 0){
                console.info("行数必须大于0");
            }else {
                console.info("行数设置必须为数字或者Un");
            }
            return txt;
        }

        /**
         * 入口
         */
        function start(Objs) {
            Objs = $.extend(options,Objs);
            //配置不正确时，不往下走
            var eventType = (typeof (Objs.event)!="number");
            if(!Objs.pElem || !Objs.dElem||Objs.minF==-1||(eventType &&Objs.event.length==0)){
                if(Objs.iElem){
                    $(Objs.iElem).val("");
                }
                console.info("请检查配置！");
                return;
            }
            var val = "";
            var inpuType = "";
            if(eventType){
                inpuType = Objs.event.type;
            }
            if(inpuType=="input" || inpuType=="dragenter"||!eventType){
                val = $.trim(Objs.text)||"";
            }else if(inpuType=="paste"){
                //粘贴时需要判断浏览器才能拿到内容
                if(Pum.isIE()){
                    val = window.clipboardData.getData('Text');
                }else{
                    val = Objs.event.originalEvent.clipboardData.getData('Text');
                }
                //if(Objs.iElem){
                //    val = $(Objs.iElem).val() + val;
                //    $(Objs.iElem).val(val);
                //}
            }
            var pW = boxDivWidth(Objs.pElem,Objs.errValue);
            if(Objs.autoWrap){//自动
                var flg = /[\s]{2}/g.test(val);
                if(flg){//有双空格
                    val  = br(Objs.LineNumber,val);
                    fontsize(pW,Objs.dElem,Objs.minF,val);
                }else{//没有双空格
                    fontsize(pW,Objs.dElem,Objs.minF,val);
                    var strArr = autoArr(Objs,pW,val);
                    var compStr = getStr(Objs.LineNumber,strArr);
                    if(compStr){
                        $("#__Autospan,"+Objs.dElem).html(compStr);
                        val = compStr;
                        console.info("compStr --> "+compStr);
                    }
                }
            }else{//手动
                val  = br(Objs.LineNumber,val);
                fontsize(pW,Objs.dElem,Objs.minF,val);
                predictNext(pW,Objs.dElem,Objs.iElem,Objs.minF,val,Objs.autoWrap);
            }
            //多个输入框时可能会有点问题
            var ieNum = Objs.iElemNum;
            if(Objs.iElem && (typeof(ieNum) == "number"||!isNaN(Number(ieNum)))&&ieNum>1){
                subStr2(pW,val,Objs.iElem,Objs.dElem);
            }else{
                inspect(pW,Objs.dElem,Objs.iElem,val,Objs.autoWrap);
            }
            return 200;
        }
        return start(obj);
    }
    /**
     * 判断是否为 IE 浏览器
     */
    ,isIE :function(){
        if (!!window.ActiveXObject || "ActiveXObject" in window){
            return true;
        }else{
            return false;
        }
    }






}



