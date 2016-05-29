<?php

	class RoomBooking
	{
		public $Date;
		public $Rooms;
	}
	
	class Room{
		public $RoomType;
		public $Availability;
		public $Price;
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
				$stmt->execute();
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
				header('Content-Type: application/json');
				echo(json_encode($roomBookings));
		
				$stmt->close();
				$conn->close();
			}else{
				$conn->close();
				header("HTTP/1.0 500 Internal Server Error");
				echo("Something is wrong with the query.");
			}
		}else{
			header("HTTP/1.0 400 Bad Request");
			echo("Invalid Input(s)");
		}
	}else if($method === "POST"){
		
	}
?>
