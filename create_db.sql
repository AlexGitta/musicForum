# Create database script for musicforum

# Create the database
CREATE DATABASE musicforum;
USE musicforum;

# Create the tables
CREATE TABLE genres (genre VARCHAR(50));
CREATE TABLE posts (postid INT AUTO_INCREMENT, username VARCHAR(50), bodytext MEDIUMTEXT, genre VARCHAR(50), PRIMARY KEY postid, FOREIGN KEY genre REFERENCES genres(genre));
CREATE TABLE users (userid INT AUTO_INCREMENT, username VARCHAR(50), password VARCHAR(50), PRIMARY KEY userid);

# Create the app user and give it access to the database
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON musicforum.* TO 'appuser'@'localhost';