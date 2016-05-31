<?php

	class RoomBooking{
		public $Date;
		public $Rooms;
	}
	
	class Room{
		public $RoomType;
		public $Availability;
		public $Price;
	}
	
	function isValidDateFormat($dateStr){
		$dateArr = explode("-", $dateStr);
		if(count($dateArr) !== 3){
			return false;
		}
		$formattedDate = date_create_from_format('Y-m-d', $dateStr);
		if($formattedDate === false){
			return false;
		}
		if($formattedDate->format("Y") !== $dateArr[0] || $formattedDate->format("m") !== $dateArr[1] || $formattedDate->format("d") !== $dateArr[2]){
			return false;
		}
		return true;
	}

	function createConn() {
		$servername = "localhost";
		$username = "root";
		$password = "";
		$dbname = "ZenRooms";

		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
			
		return $conn;
	}
	
	$method = $_SERVER['REQUEST_METHOD'];
	
	if($method === "GET"){
		$month = $_GET["month"];
		$year = $_GET["year"];
		
		if(is_numeric($month) && is_numeric($year) && $month >= 1 && $month <= 12 && $year >= 1 && $year <= 9999){
			
			$startDate = date_create((string)$year . "-" . (string)$month . "-1");
			$startDateStr = date_format($startDate, 'Y-m-d');
			
			$numOfDays = cal_days_in_month(CAL_GREGORIAN, $month, $year);
			$endDate = date_create((string)$year . "-" . (string)$month . "-" . (string)$numOfDays);
			$endDateStr = date_format($endDate, 'Y-m-d'); 

			$query = "SELECT `Date`, `RoomType`, `Availability`, `Price` FROM `RoomsBooking` WHERE `Date` BETWEEN ? AND ? ORDER BY `Date`";
			$conn = createConn();
			if($stmt = $conn->prepare($query)){
				$stmt->bind_param("ss", $startDateStr, $endDateStr);
				
				if($stmt->execute()){
					$stmt->bind_result($colDate, $colRoomType, $colAvail, $colPrice);
				
					/* fetch values */
					$curDate = "";
					$rooms = array();
					$roomBookings = array();
					while ($stmt->fetch()) {
						$room = new Room();
						$room->RoomType = $colRoomType;
						$room->Availability = $colAvail;
						$room->Price = $colPrice;
						
						if($curDate === $colDate){
							array_push($rooms, $room);
						}else{
							if(count($rooms) > 0){
								$roomBooking->Rooms = $rooms;
								array_push($roomBookings, $roomBooking);
							}
							
							$roomBooking = new RoomBooking();
							$roomBooking->Date = $colDate;
							
							$curDate = $colDate;
							$rooms = array();
							array_push($rooms, $room);
						}
					}
					if(count($rooms) > 0){
						$roomBooking->Rooms = $rooms;
						array_push($roomBookings, $roomBooking);
					}
					header("Content-Type: application/json");
					echo(json_encode($roomBookings));
				}else{
					header("HTTP/1.0 500 Internal Server Error");
					echo("An error occurred while trying to get rooms data.");
				}
		
				$stmt->close();
				$conn->close();
			}else{
				$conn->close();
				header("HTTP/1.0 500 Internal Server Error");
				echo("An error occurred while trying to get rooms data.");
			}
		}else{
			header("HTTP/1.0 400 Bad Request");
			echo("Invalid month or year.");
		}
	}else if($method === "POST"){
		$dateStr = $_POST["dateStr"];
		$roomType = $_POST["roomType"];
		$label = $_POST["label"];
		$value = $_POST["value"];
		
		$areInputsValids = false;
		$errMessage = "Invalid date.";
		$query = "";
		$paramTypes = "";
		
		if(isValidDateFormat($dateStr)){
			$errMessage = "Invalid availability or price.";
			if($label === "Avail"){
				if(is_numeric($value) && $value >= 0 && $value <= 5){
					if(strval($value) === strval(intval($value))){
						$areInputsValids = true;
						$query = "INSERT INTO `RoomsBooking`(`Date`, `RoomType`, `Availability`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `Availability` = ?;";
						$paramTypes = "ssii";
					}else{
						$errMessage = "Availability must be integer.";
					}
				}
			}else if($label === "Price"){
				if(is_numeric($value) && $value >= 0){
					$areInputsValids = true;
					$query = "INSERT INTO `RoomsBooking`(`Date`, `RoomType`, `Price`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `Price` = ?;";
					$paramTypes = "ssdd";
				}
			}
		}
		
		if($areInputsValids === false){
			header("HTTP/1.0 400 Bad Request");
			echo($errMessage);
		}else{
			$conn = createConn();
			if($stmt = $conn->prepare($query)){
				$stmt->bind_param($paramTypes, $dateStr, $roomType, $value, $value);
				if($stmt->execute() === false){
					header("HTTP/1.0 500 Internal Server Error");
					echo("An error occurred while trying to insert/update room data.");
				}else{
					$postdata = http_build_query(
						array(
							"dateStr" => $dateStr,
							"roomType" => $roomType,
							"label" => $label,
							"value" => $value
						)
					);
					
					$opts = array("http" =>
						array(
							"method" => "POST",
							"header" => "Content-Type: application/x-www-form-urlencoded",
							"content" => $postdata
						)
					);
					
					$context = stream_context_create($opts);
					
					$postResult = @file_get_contents("https://3rdparty.com/data/update", false, $context);
					
					//Uncomment this code when 3rd-party app is valid.
					//if($postResult === false){
					//	header("HTTP/1.0 500 Internal Server Error");
					//	echo("Data is saved in our app, but failed to be updated in 3rd-party.");
					//}
				}
				$stmt->close();
				$conn->close();
			}else{
				$conn->close();
				header("HTTP/1.0 500 Internal Server Error");
				echo("An error occurred while trying to insert/update room data.");
			}
		}
	}
?>
