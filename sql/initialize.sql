
CREATE DATABASE ZenRooms;
USE ZenRooms;
CREATE TABLE RoomsBooking (
	ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	`Date` DATE NOT NULL,
	RoomType VARCHAR(50) NOT NULL,
	Availability INT,
	Price DECIMAL(10, 4),
	UNIQUE Date_RoomType (`Date`, RoomType)
);