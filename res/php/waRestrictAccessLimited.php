<?php

session_start();

$filename_php = $wa_page_infos['name_infos']['php'];
$basename = $wa_page_infos['name_infos']['basename'];
$wafx_base_res = $wa_page_infos['name_infos']['wafx_base_res'];
$lang = $wa_page_infos['name_infos']['lang'];



$wafx_key_token = 'wafx_token_authenticated';
$wafx_auth_valid = false;

if ($wafx_auth_valid!=true)
{

	?>
	<html>
	<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, user-scalable=no">
			<title>Numento 2 : Securized access</title>

			<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
			<link rel="stylesheet" href="<?php echo $wafx_base_res;?>res/css/auth-form.css"/>



	</head>
	<body>
<div class="login-page">
  <div class="form">
    <div class="login-form" >

    	<p><?php echo waWebMessage('limitedaccess:feature not avalaible',$lang);?></p>
      <input name="auth_wa_identifier" type="text" maxlength="15" value="<?php echo $wa_authorized_main_login;?>"  placeholder="<?php echo waWebMessage('limitedaccess:login placeholder',$lang);?>" required autocomplete="off" />
      <input name="auth_wa_password" readonly type="password" maxlength="15"  placeholder="<?php echo waWebMessage('limitedaccess:password placeholder',$lang);?>"  required autocomplete="off"/>
      <button><?php echo waWebMessage('limitedaccess:log button label',$lang);?></button>
    </div>
  </div>
</div>

	</body>
	</html>
<?php
	exit();
}
