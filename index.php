
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="utf-8" />
	<title>ГрадГид - Главная</title>

	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300&display=swap" rel="stylesheet">
	<link href="css/style_map.css" rel="stylesheet">
	<link href="css/style_index.css" rel="stylesheet">
	<link rel="stylesheet" href="css/style.css">
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet"/>
	<!-- jQuery (Cloudflare CDN) -->
	<script defer src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<!-- Bootstrap Bundle JS (Cloudflare CDN) -->
	<script defer src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.1/js/bootstrap.min.js" integrity="sha512-UR25UO94eTnCVwjbXozyeVd6ZqpaAE9naiEUBK/A+QDbfSTQFhPGj5lOR6d8tsgbBk84Ggb5A3EkjsOgPRPcKA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<script defer src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
	integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ=="
	crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<script type="text/javascript" src="js/script.js"></script>
</head>
<body>
	<?php require_once("connection.php"); ?>
	<?php
	session_start();
	?>

	<?php
	if(isset($_SESSION["session_email"])){
	// вывод "Session is set"; // в целях проверки
	header("Location: intropage.php");
	}

	if(isset($_POST["login"])){

	if(!empty($_POST['email']) && !empty($_POST['password'])) {
	$email=htmlspecialchars($_POST['email']);
	$password=htmlspecialchars($_POST['password']);
	$query =mysqli_query($con , "SELECT * FROM users WHERE email=$email AND password=$password");
	if($query==false)
	$numrows=0;
	else
	$numrows=mysqli_num_rows($query);
	if($numrows!=0)
 {
while($row=mysqli_fetch_assoc($query))
 {
	$dbemail=$row['email'];
	$dbpassword=$row['password'];
 }
	if($email == $dbemail && $password == $dbpassword)
 {
	// старое место расположения


	//  session_start();
	 $_SESSION['session_email']=$email;
 /* Перенаправление браузера */
	 header("Location: intropage.php");
	}
	} else {
	//  $message = "Invalid username or password!";

	echo  "Invalid username or password!";
 }
	} else {
		$message = "All fields are required!";
	}
	}
	?>

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
				<a href="#index-title" class="el_a">О нас </a>
				<a href="" class="el_a">Инструкция</a>
				<a href="#contact" class="el_a">Контакты</a>
				<a href="map.html" class="el_a map">Карта</a>
			</div>
			<div class="">
				<a href="#" class="autor_btn" onclick="openAutoriz()">Авторизация</a>
				<a href="register.php" class="reg_btn">Регистрация</a>
			</div>
		</div>
	</header>


	<div class="form_autor_backgr" >
		<div id="login">

			<form class="form_autor" action="" id="loginform" method="post"name="loginform">
				<h1>Вход</h1>
				<div class="">
					<span class="close-autoriz" onclick="closeAutoriz()"><i class="fa fa-times" aria-hidden="true" ></i></span>
				</div>

				<div class="form-group">
					<label for="exampleInputEmail1">Email адрес</label>
					<input type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Введите email">

				</div>

				<div class="form-group">
					<label for="exampleInputPassword1">Пароль</label>
					<input type="password" class="form-control" id="password" name="password" placeholder="Введите пароль.">
				</div>

				<div class="form-check">
					<input type="checkbox" class="form-check-input" id="exampleCheck1">
					<label class="form-check-label" for="exampleCheck1">Запомнить меня</label>
				</div>

				<p class="submit"><input class="button btn btn-primary" name="login"type= "submit" value="Войти"></p>
				<p class="regtext">Еще не зарегистрированы?<a href= "register.php">Регистрация</a>!</p>
			</form>
		</div>
	</div>





	<div id="carouselExampleIndicators" class="carousel slide carousel-fade" data-ride="carousel">
		<ol class="carousel-indicators">
			<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
			<li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
			<li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
		</ol>
		<div class="carousel-inner">
			<div class="carousel-item active">
				<img class="d-block w-100" src="imgs/carousel1.jpg" alt="Первый слайд">
			</div>
			<div class="carousel-item" style="bottom:350px;">
				<img class="d-block w-100"  src="imgs/carousel2.jpg" alt="Второй слайд">
			</div>
			<div class="carousel-item">
				<img class="d-block w-100" src="imgs/carousel3.jpg" alt="Третий слайд">
			</div>
		</div>
		<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="sr-only">Previous</span>
		</a>
		<a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>
	</div>



	<div id="index-title" style="position: relative;">
		<div id="title">
			<!-- flex  -->
			<div >
				<!-- conteiner -->
				<div>ГРАДГИД - твой личный путеводитель.</div>
			</div>
		</div>

		<div id="invication">
			<!-- flex  -->
			<div >
				<!-- conteiner -->
				<div>
					<div>
						<img src="imgs/img1.png">
						<div><h2>ПУТЕШЕСТВУЙ</h2></div>
						<div class="text"> С помощью сервиса ГрадГид,
							Вы сможете посетить самые интересные места вашего города.
							<br>В режиме карты выбирайте места, которые хотели бы посетить и составьте Ваш личный туристический маршрут.
							<br>А также мы поможем найти место для перекуса, недалеко от простроенного маршрута.</div>
						</div>
					</div>
				</div>
			</div>

			<div id="invication2">
				<!-- flex  -->
				<div >
					<!-- conteiner -->
					<div>
						<div>
							<div><h2>УЗНАВАЙ</h2></div>
							<div class="text">Узнавайте интересные факты и легенды
								о посещаемых Вами местах, вместе с сервисом ГрадГид.<p>О каждом месте, здании,
									объекте или пространстве Вы найдёте всю необходимую для посещения информацию.</div>
									<img src="imgs/img2.png">
								</div>
							</div>
						</div>
					</div>

					<div id="onmap">
						<!-- flex  -->
						<div >
							<!-- conteiner -->
							<div>
								<a class='onmap' href="map.html">КАРТА</a>
								<p>Начать пользоваться ГрадГид </p>
							</div>
						</div>
					</div>


					<div id="contact">
						<!-- flex  -->
						<div >
							<!-- conteiner -->
							<div>
								<img src="imgs/logo.png">
							</div>
							<div>
								<h2>Связаться с нами</h2>
								<div>e-mail: GradGid@mail.ru</div>
								<div>Тел.: + 7 (890) 123 - 45 - 67</div>
								<div>Мы в социальных сетях:</div>
								<a href="#"><i class="fa fa-twitter"></i></a>
								<a href="#"><i class="fa fa-linkedin"></i></a>
								<a href="#"><i class="fa fa-google-plus"></i></a>
								<a href="#"><i class="fa fa-skype"></i></a>
							</div>
						</div>
					</div>


					<div id="btnblock">
						<!-- flex  -->
						<div >
							<!-- conteiner -->
							<div>
								<a class='onmap' href="map.html">Поехали!</a>
								<p>Построй маршрут по интересным местам<p>своего города прямо сейчас!</p>
							</div>
							<div>
								<img src="imgs/img3.png">
							</div>
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



<script>
function closeAutoriz() {
  $(".form_autor_backgr").css("display", "none");
}
function openAutoriz(){
$(".form_autor_backgr").css("display", "flex");
}
</script>

			</body>
			</html>
