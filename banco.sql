CREATE DATABASE ambiental;

USE ambiental;

CREATE TABLE capturaAmbiental (
	capturaID int(10) NOT NULL auto_increment,
	datalog datetime,
	temperatura decimal(20, 2),
	`luminosidade` decimal(20, 2),
	PRIMARY KEY( capturaID )
);