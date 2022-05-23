<?php
	
	$data = file_get_contents("json/data.json");
	$json = json_decode($data, true);

	$new_data = $_POST['newData'];
	$new_data_json = json_decode($new_data, true);

	array_push($json, $new_data_json);
	$updated_json_string = json_encode($json, JSON_FORCE_OBJECT);

	file_put_contents($_POST['fileName'], $updated_json_string);