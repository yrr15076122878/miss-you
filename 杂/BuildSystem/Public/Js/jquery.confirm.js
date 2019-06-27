(function($){
	$.confirm = function(params){
		var buttonHTML = '';
		$.each(params.buttons,function(name,obj){
			// Generating the markup for the buttons:
			buttonHTML += '<a href="#" class="button btn ng-scope ng-binding btn-primary '+obj['class']+'">'+name+'<span></span></a>';
			if(!obj.action){
				obj.action = function(){};
			}
		});
		
		var markup = [
			'<div class="modal-dialog" id="confirmBox">',
				'<div class="modal-content">',
					'<div class="console-message-dialog ng-scope">',
						'<div class="modal-header">',
							'<button type="button" class="close">×</button>',
							'<h5 class="modal-title ng-binding">',params.title,'</h5>',
						'</div>',
						'<div class="modal-body clearfix">',
							'<div class="col-sm-1 text-center fl">',
								'<span class="text-size-32 ',params.icon,' text-warning"></span>',
							'</div>',
							'<div class="col-sm-11 breakall">',
								'<p ng-bind-html="message" class="ng-binding">',
									,params.message,
								'</p>',
							'</div>',
						'</div>',
						'<div class="modal-footer">',
						buttonHTML,
						'</div></div></div></div>'
		].join('');

		//alert(markup);
		//$(markup).hide().appendTo('body').fadeIn();
		//parent.layer.msg($(markup));
		parent.layer.open({
			type: 1,
			title: false,
			area: ['600px', '199px'],		// 窗口大小
			closeBtn: 0,					// 关闭按钮是否打开
			time: 0,                    	// 设置多长时间关闭  例如：3000
			content: markup,
			success: function(layero, index){
				//console.log(layero.find('.btnOK'));
	            layero.find('.btnOK').on('click', function(){
	            	var type = params.dataType;
	            	if (type == 'all') {
	            	    $.post(params.dataUrl, {
		                	dataUid: params.dataUid, 
		                	type: type,
		                	tip: params.tipName,
		                	status: params.dataStatus,
		                	allData: params.allData
		                }, function(data) {
		                	parent.layer.close(index);
		                	// console.log(data);
		                	// console.log(textStatus);
		                	// console.log(xhr);
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
		                });
	            	}else{
	            		$.post(params.dataUrl, {
		                	dataUid: params.dataUid, 
		                	type: type,
		                	tip: params.tipName,
		                	status: params.dataStatus
		                }, function(data) {
		                	parent.layer.close(index);
		                	// console.log(data);
		                	// console.log(textStatus);
		                	// console.log(xhr);
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
		                });
	            	}
	            });

	            layero.find('.btnCancel,.close').on('click', function(){
	                parent.layer.close(index);
	            });
	        }
		});
	}
})(jQuery);