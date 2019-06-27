
function fun1(formname) {
//	alert(0)
	checkForm(formname);
	var flag = $("" + formname + " input,.showMsg").hasClass("errorInp");
	if(!flag) {
//alert(0)
		//校验通过
		return true;

	} else {
		//校验没通过
		layer.alert("请检查表单红色信息！<br/> <span style='color:red;'>*</span> 标注的为必填项。", {
			icon: 2,
			title: '错误提示'
		});
		return false;
	}
}

//	function heckForm(formname){
//		alert(666)
//		$("" + formname + "input,.require-text").on("input blur", function() {
//		valide(this);
//	});
//	//提示信息
//	var index = "";
//	$("" + formname + "input,.showMsg").on("mouseover", function() {
//		var errorMsg = $(this).attr("Msg");
//		if(errorMsg) {
//			index = layer.tips(errorMsg, this, {
//				tips: [1, '#0f74cc']
//			});
//		}
//	});
//	$("" + formname + "input,.showMsg").on("mouseout", function() {
//		if(index) {
//			layer.close(index);
//			index = "";
//		}
//	});
//	}
	
	


////onblur事件
//function ss(fom) {
//	valide(this);
//}
////onmouseover事件
//var index = "";
//
//function sx(fom1) {
//	var errorMsg = $(this).attr("Msg");
//	if(errorMsg) {
//		index = layer.tips(errorMsg, this, {
//			tips: [1, '#0f74cc']
//		});
//	}
//}

//onmouseout事件
//	function sxs(form1){
//		if(index) {
//				layer.close(index);
//				index = "";
//			}
//	}

function checkForm(formname) {
	$("" + formname + " input,.require-text").each(function(index, $this) {
		valide(this);
	});
}

function valide($this) {
//	alert()
	var _this = $($this);
	if(_this.hasClass("require-text")) {
		valideOther($this);
//		alert()
	} else {
		var type = _this[0]["type"]; // 输入框类型
		var nTitle = _this.attr("nTitle") || ""; //输入框标题
		var errorMsg = _this.attr("errorMsg") || ""; //报错提示
		var databind = _this.attr("data-bind") || "";
		if(type === "password" && databind) {
			var bindArr = databind.split("|");
			var b = bindArr[0];
			var b2 = bindArr[1];
			var flag = false;
			if(b === "this") {
				b = $this;
			}
			if(b2 === "this") {
				b2 = $this;
				flag = true;
			}
			var _pass0 = $(b);
			var _pass1 = $(b2);
			var _passV0 = $.trim(_pass0.val());
			var _passV1 = $.trim(_pass1.val());
			if(flag) {
				if(_passV0 !== _passV1) {
					var msg = nTitle + errorMsg;
					addRemoveError(_pass1, "add", msg);
				} else {
					addRemoveError(_pass1, "remove");
				}
			} else {
				valideInput(b);
			}
		} else {
			valideInput($this);
		}
	}

}

function valideInput($this) {
	var _this = $($this);
	var required = _this.prop("required"); //必填
	var type = _this[0]["type"]; // 输入框类型

	var reg = _this.attr("reg"); //正则
	var nTitle = _this.attr("nTitle") || ""; //输入框标题
	var errorMsg = _this.attr("errorMsg") || ""; //报错提示
	var val = $.trim(_this.val()); //值
	var e;
	if(reg) {
		e = eval(reg);
	}
	if(required) {
		if(val) {
			if(e && !e.test(val)) { //校验没通过
				var msg = nTitle + errorMsg;
				addRemoveError(_this, "add", msg);
			} else {
				addRemoveError(_this, "remove");
			}
		} else {

			var msg = nTitle + "为必填项";
			addRemoveError(_this, "add", msg);

		}
	} else {

		if(val && e && !e.test(val)) { //校验没通过
			var msg = nTitle + errorMsg;
			addRemoveError(_this, "add", msg);
		} else {
			addRemoveError(_this, "remove");
		}
	}
}

function valideOther($this) {
//	alert()
	var _this = $($this);
	var msg = _this.attr("errorMsg");
	var pEle = _this.parents(".showMsg");
	var val = _this.val();
	if(!val) {
		addRemoveError(pEle, "add", msg);
	} else {
		addRemoveError(pEle, "remove");
	}

}

function addRemoveError(_this, ar, text) {

	if(ar === "add") {
		_this.attr("Msg", text).addClass("errorInp");
	} else if(ar === "remove") {
		_this.removeAttr("Msg").removeClass("errorInp");
	}
}

////正则验证：
//邮箱验证:
//reg = /^[0-9|A-z|_]{1,17}[@][0-9|A-z]{1,3}.(com)$/;
//
//手机号验证:	
//reg = /^1[3456789]\d{9}$/;
//
//中文姓名验证:
//var nameReg = /^[\u4E00-\u9FA5]{2,4}$/;
//
//必填属性:
//required = "required" ;
//
//必须填写英文:
//reg = /[^a-zA-Z]/;
//
//只能输入数字,字母,下划线:
//reg = /[^\a-\z\A-\Z0-9\_]/;
//
//// 纯数字正则，只允许输入数字
//reg = /^[0-9]*$/;

////控制字符长度
// placeholder="不能超过50个字符！"