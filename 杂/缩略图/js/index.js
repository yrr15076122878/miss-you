$(function(){
	/* 禁用右键菜单 */
    document.oncontextmenu=function(){ return false }

	/* 系统时间 */
	var time = self.setInterval(function() {
		$("#today").html(Date());
	}, 1000);
	var sidebar = $('#sidebar-left');

    /*$(window).resize(function(){
		var w = $(window).width();
		if (w < 1600) {
		    sidebar.removeClass('viewFramework-sidebar-full');
		    sidebar.addClass('viewFramework-sidebar-mini');
		    $('#time').toggleClass('hidden');
		}else{
			sidebar.addClass('viewFramework-sidebar-full');
			sidebar.removeClass('viewFramework-sidebar-mini');
		}
	}).trigger('resize');

     //展开和收起一级菜单
	$('#sidebar-icon').on('click', function(event) {
		if (sidebar.hasClass('viewFramework-sidebar-full')) {
		    sidebar.removeClass('viewFramework-sidebar-full');
			$("#sidebar-icon").attr("title","展开导航栏");
		}else{
			sidebar.addClass('viewFramework-sidebar-full');
            $("#sidebar-icon").attr("title","收起导航栏");
		}
		sidebar.toggleClass('viewFramework-sidebar-mini');
		$('#time').toggleClass('hidden');
	});
     */
	$('#icon-left').on('click', function(event) {
		$('#sidebal-middle').toggleClass("viewFramework-product-col-1");
	});
    /* 第一级导航菜单 */
	/*$("#sidebar").on('click', 'li.nav-item', function(event) {
		event.preventDefault();
		var $this = $(this),$thisa = $this.children('a'),subordinate = $thisa.attr("data-sub"),Their = $thisa.attr("Their");
		$("#sidebar").find('li.nav-item').removeClass('active');
		$this.find('.ng-isolate-scope').addClass('active');
        $this.addClass('active');
		var text = $this.find("span.nav-title").text();
        $(".titleOne").html(text);
        //有下一级菜单
		if(subordinate==="true"){
			$('#icon-left').removeClass('hidden');
			$('#sidebal-middle').addClass("viewFramework-product-col-1");
			//开始生成第二级菜单
            twoClassNav({
				"Their":Their
			});
			var subm = $("#product-nav-list ul");
			var submLi = subm.children('li');
			if(submLi.length > 0){//下级菜单中有选项
				submLi.find('.ng-isolate-scope').removeClass('active')
				var iframeSrc = submLi.eq(0).find('.ng-isolate-scope').addClass('active').find('a').attr("data-url");
				subm.removeClass('hidden').siblings('ul').addClass('hidden');
				showNavbar(iframeSrc);
			}else{//下级菜单中无选项
				hiddenNavbar($thisa.attr("data-url"));
			}
		}else{//没有下级菜单
			hiddenNavbar($thisa.attr("data-url"));
		}
	});*/
    $("#sidebar").on('click', 'li.nav-item a.ng-scope', function(event) {
        event.preventDefault();
        var pLi = $(this).parent("li");
        var lisub = pLi.attr("lisub");
        if(lisub==="true"){
            var status = pLi.attr("status");
            var ul = pLi.find(".ulsub");
            if(status==="0"){
                ul.slideDown();
                pLi.attr("status","1");
			}else{
                ul.slideUp();
                pLi.attr("status","0");
			}
		}else{
            packUp(pLi);
			$("#sidebar").find('li.nav-item').removeClass('active');
            pLi.find('.ng-isolate-scope').addClass('active');
            pM(pLi);
		}
		//收起子菜单
        pLi.siblings("li").each(function(){
            var _this = $(this);
            if(_this.attr("lisub")==="true"){
            //.removeClass("active-sub")
                _this.attr("status","0");
                _this.find("ul.ulsub").slideUp();
            }
        });
    });
    $("#sidebar").on('click', 'li.nav-item ul.ulsub li a', function(event) {
        event.preventDefault();
        var ul = $(this).parent("li").parent("ul");
        ul.children().removeClass("active");
        $(this).parent("li").addClass("active");
        var pli = $(this).parents("li.nav-item");
        pli.addClass("active-sub");
        packUp(pli);
        pM($(this).parent("li"));
	});
    //收起
    function packUp(pLi){
        pLi.siblings("li").each(function(){
            var _this = $(this);
            if(_this.hasClass("active")){
                _this.removeClass("active");
            }
            if(_this.hasClass("active-sub")){
                _this.removeClass("active-sub");
                _this.find("ul.ulsub li").removeClass("active");
            }
        });
	}
	function pM($this){
        var $thisa = $this.children('a'),subordinate = $thisa.attr("data-sub"),Their = $thisa.attr("Their");
        $this.addClass('active');
        var text = $this.find("span.nav-title").text();
        //$(".titleOne").html(text);

        //有下一级菜单
        if(subordinate==="true"){
            $('#icon-left').removeClass('hidden');
            $('#sidebal-middle').addClass("viewFramework-product-col-1");
            //开始生成第二级菜单
            twoClassNav({
                "Their":Their
            });
            var subm = $("#product-nav-list ul");
            var submLi = subm.children('li');
            if(submLi.length > 0){//下级菜单中有选项
                submLi.find('.ng-isolate-scope').removeClass('active')
                var iframeSrc = submLi.eq(0).find('.ng-isolate-scope').addClass('active').find('a').attr("data-url");
                subm.removeClass('hidden').siblings('ul').addClass('hidden');
                showNavbar(iframeSrc);
            }else{//下级菜单中无选项
                hiddenNavbar($thisa.attr("data-url"));
            }
        }else{//没有下级菜单
            hiddenNavbar($thisa.attr("data-url"));
        }
	}



	var sidem = $("#sidebal-middle"),mainFrame = $("#mainFrame");
   /* 次级导航菜单  */
	$("#product-nav-list").on('click', 'a', function(event) {
		var $this = $(this),url = $this.attr("data-url");
		$this.parents(".ng-isolate-scope").addClass('active').parents("li").siblings('li').find('.ng-isolate-scope').removeClass('active');
		mainFrame.attr("src",url);
	});
	function hiddenNavbar (iframeSrc) {
		sidem.children('.ng-scope').addClass('hidden');
		sidem.removeClass('viewFramework-product-col-1');
		mainFrame.attr("src",iframeSrc);
	}
	function showNavbar (iframeSrc) {
		sidem.children('.ng-scope').removeClass('hidden');
		sidem.addClass('viewFramework-product-col-1');
		mainFrame.attr("src",iframeSrc);
	}
    /* 次要导航中的下级导航 */
	$('.checkChild').on('click', function(event) {
        var $this = $(this);
        $this.siblings('.ishidden').toggleClass('hidden');
        if($this.siblings('.ishidden').hasClass('hidden')) {
            $this.find('span.i-arrow').removeClass("icon-arrow-down").addClass("icon-arrow-right");
        }else{
            $this.find('span.i-arrow').removeClass("icon-arrow-right").addClass("icon-arrow-down");
        }
    });

	/* 管理员退出 */
	$('#loginOut').on({
		mouseover:function(){
			$(this).addClass('open');
		},
		mouseout:function(){
			$(this).removeClass('open');
		}
	});
	$('.dropdown').on('click', function(event) {
		$(this).toggleClass('open');
	});

    /*var h = $('.viewFramework-sidebar',parent.document).height();
    $('.home-container').css('height', h-30);*/

	/*var tabs = $(".nav-tabs li");
	 $('.nav-tabs li').each(function(index, el) {
	 $(this).click(function(event) {
	 tabs.removeClass('active');
	 $('#formData .install').addClass('hidden');
	 tabs.eq(index).addClass('active');
	 $('.mt'+index).removeClass('hidden');
	 });
	 });*/

	/*$('.show-tip').on('click', function(event) {
	 if ($(this).text()=='关闭操作提示') {
	 $(this).text('展开操作提示')
	 }else{
	 $(this).text('关闭操作提示')
	 }
	 $('#tip').toggleClass('hidden');
	 });*/

	/*$('#nomenu').on('click', function(event) {
	 parent.layer.msg('没有菜单！',{
	 type: 0,
	 shade: [0.8, '#393D49'],
	 });
	 var $this = $(this),url = $this.attr("data-url");
	 mainFrame.attr("src",url);
	 return false;
	 });*/

	/*$('.feedback-trigger-text').on('click', function(event) {
	 $('#message').removeClass('hidden');
	 });

	 $('.feedback-close').on('click', function(event) {
	 $('#message').addClass('hidden');
	 });*/
});