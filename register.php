<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title> ГрадГид - Регистрация</title>
	<link href="css/style_reg.css" media="screen" rel="stylesheet">
	<link href="css/style_index.css" rel="stylesheet">
	<link rel="stylesheet" href="css/style.css">
	<link href="css/style_map.css" rel="stylesheet">
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800'rel='stylesheet' type='text/css'>
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet"/>
	<!-- jQuery (Cloudflare CDN) -->
	<script defer src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<!-- Bootstrap Bundle JS (Cloudflare CDN) -->
	<script defer src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.1/js/bootstrap.min.js" integrity="sha512-UR25UO94eTnCVwjbXozyeVd6ZqpaAE9naiEUBK/A+QDbfSTQFhPGj5lOR6d8tsgbBk84Ggb5A3EkjsOgPRPcKA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<script defer src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
	integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ=="
	crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300&display=swap" rel="stylesheet">
</head>
<body>
	<?php require_once("connection.php"); ?>
	<?php

	if(isset($_POST["register"])){

		if(!empty($_POST['full_name']) && !empty($_POST['email']) && !empty($_POST['password'])) {
			$full_name= htmlspecialchars($_POST['full_name']);
			$email=htmlspecialchars($_POST['email']);
			$password=htmlspecialchars($_POST['password']);
			$query=mysqli_query($con , "SELECT * FROM users WHERE email=$email");

			if($query==false)
			$numrows=0;
			else
			$numrows=mysqli_num_rows($query);
			if($numrows==0)
			{
				$sql="INSERT INTO users
				(full_name, email, password)
				VALUES('$full_name','$email', '$password')";
				$result=mysqli_query($con , $sql);
				if($result){
					$message = "Account Successfully Created";
				} else {
					$message = "Failed to insert data information!";
				}
			} else {
				$message = "That username already exists! Please try another one!";
			}
		} else {
			$message = "All fields are required!";
		}
	}
	?>

	<?php if (!empty($message)) {echo "<p class='error'>" . "MESSAGE: ". $message . "</p>";} ?>
		<header>
			<div class="menu">
				<div class="flex_menu">

					<div class="logo_menu">
						<a href="index.php"><img src="imgs/logo.png" class="logo"></a>
					</div>
					<div class="logo_menu2">
						<a href="index.php" class="title1">ГрадГид</a>
						<p class="mini_title">Твой личный путеводитель</p>
					</div>
				</div>
				<div class="el_menu">
					<a href="index.php#index-title" class="el_a">О нас </a>
					<a href="" class="el_a">Инструкция</a>
					<a href="index.php#contact" class="el_a">Контакты</a>
					<a href="map.html" class="el_a map">Карта</a>
				</div>

			</div>
		</header>

<div class="conteiner">
	<h1>Регистрация</h1>
		<div class="form_reg_backgr">

			<div id="login">
				<form action="register.php" id="registerform" method="post"name="registerform">
					<p><label for="user_login">Полное имя<br>
						<input class="input" id="full_name" name="full_name"size="32"  type="text" value=""></label></p>
						<p><label for="user_pass">E-mail<br>
							<input class="input" id="email" name="email" size="32"type="email" value=""></label></p>
							<p><label for="user_pass">Пароль<br>
								<input class="input" id="password" name="password"size="32"   type="password" value=""></label></p>
								<p class="submit"><input class="btn btn-primary" id="register" name= "register" type="submit" value="Зарегистрироваться"></p>
								<p class="regtext">Уже зарегистрированы? <a href= "login.php">Введите имя пользователя</a>!</p>
							</form>
						</div>
					</div>
</div>

					<footer>
						<div>
							<div class="logo"><img src="imgs/logo_w.png"></div>
							<div>
								<h3>Контакты</h3>
								<div>GradGid@mail.ru</div>
								<div>+ 7 (890) 123 - 45 - 67</div>
								<a href="#"><i class="fa fa-twitter"></i></a>
								<a href="#"><i class="fa fa-linkedin"></i></a>
								<a href="#"><i class="fa fa-google-plus"></i></a>
								<a href="#"><i class="fa fa-skype"></i></a>
							</div>
						</div>
						<div>
							<h3>
								Путешествуй и изучай
								<br>историю своего города<br>вместе нами!
							</h3>

						</div>
					</footer>
				</body>
				</html>
