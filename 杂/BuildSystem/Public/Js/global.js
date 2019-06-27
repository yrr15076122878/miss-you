$(function(){
    $('.ajaxSubmit').on('click', function(event) {
        // var objData = (obj == '') ? $('#formData') : $(obj);
        // var url     = (nodeName == '') ? objData.attr('action') : objData.attr(nodeName);
        // var method  = (method == '') ? 'POST' : 'GET';

        var objData = (typeof($(this).attr('data-url')) == 'undefined') ? $('#formData') : $(this);
        var url     = (typeof($(this).attr('data-url')) == 'undefined') ? objData.attr('action') : $(this).attr('data-url') ;
        var method  = (typeof($(this).attr('binding-data')) == 'undefined') ? 'POST' : 'GET';
        var data    = (typeof($(this).attr('data-url')) == 'undefined') ? '' : $(this).attr('binding-data');

        // console.log(objData);
        // console.log(url);
        // console.log(method);
        // console.log(data);
        //alert(data);
        bindSubmit(objData, url, method, data);
    });
    

    eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('$("4[5=\'b\']").l(k(){j a=$(i).h();$("4[5=\'7\']>8").f("6","6");d(a==0){$("4[5=\'7\']>8[g=\'-1\']").9("6").f("e","e")}c d(a==1){$("4[5=\'7\']>8[b=\'0\']").9("6")}c d(a==2){$("4[5=\'7\']>8[b=\'1\']").9("6")}c d(a==3){$("4[5=\'7\']>8[b=\'2\']").9("6")}c{$("4[5=\'7\']>8[b=\'3\']").9("6")}});',22,22,'||||select|name|disabled|pid|option|removeAttr||level|else|if|selected|attr|value|val|this|var|function|change'.split('|'),0,{}))
});

function percentage(num, total) {
    return (Math.round(num / total * 10000) / 100.00 + "%");// 小数点后两位百分比
}

function checkAll(name){
    var el = document.getElementsByTagName('input');
    var len = el.length;
    for(var i=0; i<len; i++){
        if((el[i].type=="checkbox") && (el[i].name==name)){
            el[i].checked = true;
        }
    }
    getCheckAll($("#tab tbody input[type='checkbox']:checked"));
    $(".button").attr("disabled", true);
    $(".checkbox-post").prop("checked",true);
    $(".allbutton").removeAttr("disabled");
}

function clearAll(name){
    var el = document.getElementsByTagName('input');
    var len = el.length;
    for(var i=0; i<len; i++){
        if((el[i].type=="checkbox") && (el[i].name==name)){
            el[i].checked = false;
        }
    }
    $(".button").removeAttr("disabled","disabled");
    $(".checkbox-post").removeProp('checked').val("");
    $(".allbutton").attr("disabled","disabled");
}

function getCheckAll(elm){
    var checkedVal = "";
    elm.each(function(index, el) {
        checkedVal += $(this).val()+",";
    });
    $(".checkbox-post").val(checkedVal);
}

function bindShow(radio_bind, selectors){
    $(radio_bind).click(function(){
        $(selectors).toggleClass('hidden');
    })
}

function bindSubmit(objData, url, method, data){
    // var objData = (obj == '') ? $('#formData') : $(obj);
    // var url     = (nodeName == '') ? objData.attr('action') : objData.attr(nodeName);
    // var method  = (method == '') ? 'POST' : 'GET';

    // console.log(objData);
    // console.log(url);
    // console.log(method);

    $(objData).ajaxSubmit({
        url:url,
        type:method,
        data:{data},
        success:function(data, st) {
            //var data = eval("(" + data + ")");
            if(data.status==1){
                parent.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0, //不显示关闭按钮
                    scrollbar: false,
                    shade: 0,
                    time: 2000, //2秒后自动关闭
                    offset: '55px',
                    shift: 5,
                    content: '<div class="HTooltip bounceInDown animated" style="width:350px;padding:7px;text-align:center;position:fixed;right:7px;background-color:#5cb85c;color:#fff;z-index:100001;box-shadow:1px 1px 5px #333;-webkit-box-shadow:1px 1px 5px #333;font-size:14px;">'+data.info+'</div>', //iframe的url，no代表不显示滚动条
                });
            }else{
                parent.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0, //不显示关闭按钮
                    scrollbar: false,
                    shade: 0,
                    time: 2000, //2秒后自动关闭
                    offset: ['55px','100%'],
                    shift: 6,
                    content: '<div class="HTooltip bounceInDown animated" style="width:350px;padding:7px;text-align:center;position:fixed;right:7px;background-color:#D84C31;color:#fff;z-index:100001;box-shadow:1px 1px 5px #333;-webkit-box-shadow:1px 1px 5px #333;font-size:14px;">'+data.info+'</div>', //iframe的url，no代表不显示滚动条
                });
                //my_error(data.info);
            }

            if(data.url&&data.url!=''){
                setTimeout(function(){
                    location.href=data.url;
                },2000);
            }
            if(data.url==''){
                setTimeout(function(){
                    location.reload();
                },1000);
            }
        }
    });
}

/**
 * [newRemind 标题闪烁]
 * @param  {[type]} pageTitle  [原页面的标题]
 * @param  {[type]} showRemind [闪烁时显示的东东：如【新提醒】]
 * @param  {[type]} hideRemind [闪烁时隐藏的东东：如【　　　】]
 * @param  {[type]} time       [闪烁间隔的时间]
 */
function newRemind(pageTitle, showRemind, hideRemind, time) {
    if (newRemindFlag == 1) {
        document.title = showRemind + pageTitle;
        newRemindFlag = 2;
    } else {
        document.title = hideRemind + pageTitle;
        newRemindFlag = 1;
    }

    setTimeout("newRemind('" + pageTitle + "','" + showRemind + "','" + hideRemind + "'," + time + ")", time);
}
