<?php

session_start();
$wafx_base_res = $wa_page_infos['name_infos']['wafx_base_res'];
$filename_php = $wa_page_infos['name_infos']['php'];
//$basename = $wa_page_infos['name_infos']['basename'];

$lang = $wa_page_infos['name_infos']['lang'];


$wafx_key_flash_message = 'wafx_key_flash_message';
$_SESSION[$wafx_key_flash_message] = "";


$wafx_auth_valid = false;

if (waSessionIsAuthenticated($wa_authorized_uuids,$global_webacappella_auth_chain)===true)
{
	$wafx_auth_valid = true;
}

/////

if ($wafx_auth_valid!=true)
{
	if (array_key_exists('auth_wa_identifier', $_POST) && array_key_exists('auth_wa_password', $_POST))
	{
			$wafx_identifier = $_POST['auth_wa_identifier'];
			$wafx_password = $_POST['auth_wa_password'];
			if (waAuthCheck($wafx_identifier,$wafx_password,$wa_authorized_uuids,$global_webacappella_auth_chain)===true)
			{
				$wafx_auth_valid = true;
				header('Location: '.$filename_php);
				
				//exit();
			}
			else
			{
				$_SESSION[$wafx_key_flash_message] = waWebMessage('limitedaccess:error authentication failed',$lang);

			}
	}
}

if ($wafx_auth_valid!=true)
{

	$message_welcome = waWebMessage('limitedaccess:welcome message',$lang);

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
  	<p style="color:red;font-weight:bold;"><?php echo $_SESSION[$wafx_key_flash_message];?></p>
  	<p><?php echo $message_welcome;?></p>
    <form class="login-form" action="<?php echo $filename_php;?>" method="post">
      <input name="auth_wa_identifier" type="text" maxlength="15"  value="<?php echo $wa_authorized_main_login;?>"  placeholder="<?php echo waWebMessage('limitedaccess:login placeholder',$lang);?>" required autocomplete="off" />
      <input name="auth_wa_password" type="password" maxlength="15"  placeholder="<?php echo waWebMessage('limitedaccess:password placeholder',$lang);?>"  required autocomplete="off"/>
      <button><?php echo waWebMessage('limitedaccess:log button label',$lang);?></button>
    </form>
  </div>
</div>


	</body>
	</html>
<?php
	$_SESSION[$wafx_key_flash_message] = "";
	exit();
}
