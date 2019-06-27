<!DOCTYPE html>
<html lang="en">

	<head>
		<meta charset="UTF-8">
		<meta http-equiv="Expires" content="0">
		<meta http-equiv="Pragma" content="no-cache">
		<meta http-equiv="Cache-control" content="no-cache">
		<meta http-equiv="Cache" content="no-cache">
		<title>展台信息</title>
		<link rel="stylesheet" href="../plugin/layui/css/layui.css">
		<link rel="stylesheet" href="../plugin/bootstrap/css/_bootstrap.css">
		<link rel="stylesheet" href="../EApplication/Default/Css/i-css.css">

	</head>

	<body>
		<form method="post" action="Boothinfo.aspx" id="form1">
<div class="aspNetHidden">
<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="/wEPDwUKMTMzMTMxNTA5OQ9kFgICAQ9kFgRmDxYCHgtfIUl0ZW1Db3VudAIBFgJmD2QWAmYPFQcBMQnmlYjmnpzlm74J5pWI5p6c5Zu+ETIwMTkvNC8xMiAwOjAwOjAwAAAJ5pyq6YCa6L+HZAIBDxYCHwACARYCZg9kFgJmDxUDATELPHA+YmJiYjwvcD4TMjAxOS0wNC0xMiAxMDo1MTowM2Rk5TeTNwiX0qeeP3DBa7bxn5IlDuAlfnXXR9P+uGnQYrU=" />
</div>

			<div class="col-md-12 subtitle-top">
				<div class="subtitle">
					<span>展台信息</span>
				</div>
			</div>
			<div class="col-md-12">
				<div class="triangle"></div>
			</div>
			<div class="col-md-12 i-body">	
				<ul class="nav nav-tabs">
				  <li role="presentation" class="active"><a href="boothinfo.aspx">展台信息</a></li>
				  <li role="presentation"><a href="boothedit.aspx">展台编辑</a></li>
				</ul>
				<br>
				<br>
				<div class="row" style="margin-top: 20px;">
					<div class="col-md-6" style="padding: 0;">
						<div class="col-md-12">
							<div class="piece">
								<div class="ptitle2">
									<span>展台信息</span>
								</div>
								<div class="content">
									<table class="ctable">
										<tr>
											<td width="20%" class="font-wr">展台号：</td>
											<td width="30%">
												A01
											</td>
											<td width="20%" class="font-wr">参展公司：</td>
											<td width="30%">
												TEST
											</td>
										</tr>
										<tr>

											<td width="20%" class="font-wr">展台面积：</td>
											<td width="80%" colspan="3">
												100.00
											</td>
										</tr>

									</table>
								</div>
							</div>
						</div>
						<div class="col-md-12">
							<div class="piece">
								<div class="ptitle2">
									<span>展商展台联系人</span>
								</div>
								<div class="content">
									<table class="ctable">
										<tr>
											<td width="20%" class="font-wr">姓名：</td>
											<td width="30%">
												TEST
											</td>
											<td width="20%" class="font-wr">职称：</td>
											<td width="30%">
												
											</td>
										</tr>
										<tr>
											<td width="20%" class="font-wr">手机：</td>
											<td width="30%">
												
											</td>
											<td width="20%" class="font-wr">电话：</td>
											<td width="30%">
												   
											</td>
										</tr>
										<tr>
											<td width="20%" class="font-wr">邮件：</td>
											<td width="30%">
												12345@12345.com
											</td>
											<td width="20%" class="font-wr"></td>
											<td width="30%">

											</td>
										</tr>
									</table>
								</div>
							</div>
						</div>
						<div class="col-md-12">
							<div class="piece">
								<div class="ptitle2">
									<span>展商指定搭建商联系人</span>
								</div>
								<div class="content">
									<table class="ctable">
										<tr>
											<td width="20%" class="font-wr">姓名：</td>
											<td width="30%">
												test
											</td>
											<td width="20%" class="font-wr">公司：</td>
											<td width="30%">
												test
											</td>
										</tr>
										<tr>
											<td width="20%" class="font-wr">手机：</td>
											<td width="30%">
												1515165
											</td>
											<td width="20%" class="font-wr">电话：</td>
											<td width="30%">
												   
											</td>
										</tr>
										<tr>
											<td width="20%" class="font-wr">邮件：</td>
											<td width="30%">
												1@1.com
											</td>
											<td width="20%" class="font-wr"></td>
											<td width="30%">

											</td>
										</tr>
									</table>
								</div>
							</div>
						</div>

						<div class="col-md-12">

						</div>

					</div>
					<div class="col-md-6" style="padding: 0;">
						<div class="col-md-12">
							<div class="piece">
								<div class="ptitle2">
									<span>展台设计</span>
								</div>
								<div class="content">
									<table id="desTable" class="table table-bordered table-striped">
										<thead>
											<tr>
												<th>ID</th>
												<th>资料类型</th>
												<th>资料名称</th>

											

												<th>提交日期</th>
												<th>审核状态</th>
											</tr>
										</thead>
										<tbody>
											
													<tr>
														<td>
															1 </td>
														<td>
															效果图
														</td>
														<td>
															效果图
														</td>

												

														<td>
															2019/4/12 0:00:00
														</td>

														<td>
															
															
															未通过
														</td>

													</tr>
												

										</tbody>

									</table>
								</div>
							</div>
						</div>
						<div class="col-md-12">
							<div class="piece">
								<div class="ptitle2">
									<span>审图反馈</span>
								</div>
								<div class="content">
									<table id="Table1" class="table table-bordered table-striped">
										<thead>
											<tr>
												<th width="5%">ID</th>
												<th>审核意见</th>
												<th width="25%">发送日期</th>
											</tr>
										</thead>
										<tbody>
											
													<tr>
														<td>
															1 </td>
														<td>
															<p>bbbb</p> </td>
														<td>
															2019-04-12 10:51:03
														</td>
													</tr>
												

										</tbody>

									</table>
								</div>
							</div>
						</div>
						<div class="col-md-12">
							<div class="piece">
								<div class="ptitle2">
									<span>电工证</span>
								</div>
								<div class="content">
									<table class="table table-bordered table-striped" style="margin-top: 15px;">
										<thead>
											<tr>
												<th width="50%">ID</th>
												<th width="50%">姓名</th>
											</tr>
										</thead>
										<tbody>
											

										</tbody>
									</table>
								</div>
							</div>
						</div>

						<div class="col-md-12">
							<div class="piece">
								<div class="ptitle2">
									<span>补充材料</span>
								</div>
								<div class="content">
									<table class="table table-bordered table-striped" style="margin-top: 15px;">
										<thead>
											<tr>
												<th width="20%">ID</th>
												<th width="50%">类别</th>
												<th width="30%">查看</th>
											</tr>
										</thead>
										<tbody>
											

										</tbody>
									</table>
								</div>
							</div>
						</div>
						<div class="col-md-12">

						</div>

					</div>
				</div>

			</div>

			<script type="text/javascript" src="../Public/Js/jquery-1.9.1.min.js"></script>
			<script src="../plugin/layui/layui.all.js"></script>
			<script src="../Public/Js/publicM.js"></script>
			<script>
			    //返回顶部按钮
			    $(function () {
			        public.gotoTop();
			    });
			</script>
		</form>
	</body>

</html>