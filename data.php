<?php

/*$images_dir = 'uploads/';
$image_temp = $_FILES['foto']['tmp_name'];

if (isset($_FILES['foto']['name']))
	move_uploaded_file($image_temp, $images_dir . $_FILES['file']['name']);*/

$data = file_get_contents($_POST['fileName']);
$json = json_decode($data, false);

$new_data = $_POST['newData'];
$new_data_json = json_decode($new_data, true);

array_push($json->features, $new_data_json);
$updated_json_string = json_encode($json);

file_put_contents($_POST['fileName'], $updated_json_string);
