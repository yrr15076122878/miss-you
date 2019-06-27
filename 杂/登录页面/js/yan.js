required="required" //必填属性，layui框架和bootstrap均适用

var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; //匹配电子邮件

var regmob = /^1[3456789]\d{9}$/; //验证手机
//当用户释放键盘按钮时执行事件



onkeyup="value=value.replace(/[^a-zA-Z]/ig,'')" //必须填写英文

onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\_]/g,'')" //只能输入数字、字母、下划线：

//只允许输入汉字
 var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    if(!reg.test(plateNumber.charAt(0))){
        alert("请输入首位汉字");
        return false;
    }
// 纯数字正则，只允许输入数字
ar reg = /^[0-9]*$/;
if(!reg.test(vmobile)){
    alert("请输入纯数字");
    
 //限制长度，ios可能控制不了   
    maxlength="200"

//bootstrap的验证

 type="email" class="form-control" id="exampleInputEmail1" placeholder="Email" //邮箱验证 type值
 
//