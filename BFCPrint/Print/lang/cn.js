(function($){
  $.fn.smkValidate.Languaje = {
    // 错误信息 输入为空的
    textEmpty        : '必填项',
    // 错误信息 输入为邮箱的
    textEmail        : '请输入一个有效的电子邮件',
    // 错误信息 输入字母数字
    textAlphanumeric : '请输入字母和数字',
    // 错误信息 输入数字
    textNumber       : '请输入数字',
    // 错误信息 输入数字范围 
    textNumberRange  : '数值范围必须大于<b> {@} </b>且小于<b> {@} </b>',
    // 错误信息 小数
    textDecimal      : '只允许小数',
    // 错误信息 货币数量
    textCurrency     : '请输入一个有效的货币数量',
    // 错误信息 选项 input
    textSelect       : '你必需选择一个选项',
    // 错误信息 选项 input checkbox y radio
    textCheckbox     : '你必需选择一个选项',
    // 错误信息 字符数等于
    textLength       : '字符数需要等于 <b> {@} </b>',
    // 错误信息 字符数大于、小于
    textRange        : '字符数需要大于 <b> {@} </b> 和小于 <b> {@} </b>',
    // 错误信息 不能少于四个字符
    textSPassDefault : '不能少于四个字符 ',
    // 错误信息 最少6个字符
    textSPassWeak    : '最少6个字符',
    // 错误信息 最少6个字符数字
    textSPassMedium  : '最少6个字符数字',
    // 错误信息 最少6个字符数字和字母
    textSPassStrong  : '最少6个字符数字和字母',
    textUrl          : '请输入一个有效的链接',
    textTel          : '请输入一个有效的电话号码',
    textColor        : '请输入一个有效的十六进制颜色',
    textDate         : '请输入一个有效的日期',
    textDatetime     : '请输入一个有效的日期和时间',
    textMonth        : '请输入一个有效的月份',
    textWeek         : '请输入一个有效的一周',
    textTime         : '请输入一个有效的时间',
    textPattern      : '请输入一个有效的字符串'
  };

  $.smkEqualPass.Languaje = {
    // 错误信息 密码不匹配
    textEqualPass    : '密码不匹配 '
  };

  $.smkDate.Languaje = {
    shortMonthNames : ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthNames : ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
  };

}(jQuery));