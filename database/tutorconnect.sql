-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2025 at 02:49 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tutorconnect`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้ใช้งาน',
  `portrait_path` varchar(255) DEFAULT NULL COMMENT 'ที่อยู่รูปภาพ',
  `username` varchar(20) NOT NULL COMMENT 'ชื่อผู้ใช้งาน',
  `password` varchar(255) NOT NULL COMMENT 'รหัสผ่าน',
  `permission` enum('นักเรียน','ติวเตอร์','ผู้ดูแล') NOT NULL DEFAULT 'นักเรียน' COMMENT 'สิทธิ์ผู้ใช้งาน',
  `firstname` varchar(100) NOT NULL COMMENT 'ชื่อ',
  `lastname` varchar(100) NOT NULL COMMENT 'นามสกุล',
  `gender` enum('ไม่ระบุ','ชาย','หญิง') NOT NULL DEFAULT 'ไม่ระบุ' COMMENT 'เพศ',
  `email` varchar(100) NOT NULL COMMENT 'อีเมล',
  `phone_number` varchar(10) NOT NULL COMMENT 'หมายเลขโทรศัพท์',
  `account_timestamp` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'เวลาที่สร้างบัญชี'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announces`
--

CREATE TABLE `announces` (
  `announce_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสประกาศ',
  `account_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้ใช้งาน',
  `subject_to_learn` varchar(100) NOT NULL COMMENT 'วิชาที่ต้องการเรียน',
  `place_to_learn` varchar(100) NOT NULL COMMENT 'สถานที่ที่ต้องการเรียน',
  `student_age` varchar(100) NOT NULL COMMENT 'ช่วงวัยนักเรียน',
  `convenient_day` varchar(100) NOT NULL COMMENT 'วันที่สะดวกเรียน',
  `convenient_time` varchar(100) NOT NULL COMMENT 'ช่วงเวลาที่สะดวกเรียน',
  `learning_style` varchar(100) NOT NULL COMMENT 'รูปแบบการเรียนที่ต้องการ',
  `starting_time` varchar(100) NOT NULL COMMENT 'เวลาที่เริ่มเรียนได้',
  `objective` varchar(100) NOT NULL COMMENT 'วัตถุประสงค์ในการเรียน',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'วันที่ของการประกาศ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(100) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสความคิดเห็น',
  `account_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้เรียน',
  `tutor_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้สอน',
  `message` text NOT NULL COMMENT 'ข้อความแสดงความคิดเห็น',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'วันที่แสดงความคิดเห็น'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `graduates`
--

CREATE TABLE `graduates` (
  `graduate_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสข้อมูลการศึกษา',
  `tutor_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้สอน',
  `status` enum('กำลังศึกษา','จบการศึกษา') DEFAULT NULL COMMENT 'สถานะการศึกษา',
  `degree` enum('ระดับปริญญาตรี','ระดับปริญญาโท','ระดับปริญญาเอก') DEFAULT NULL COMMENT 'ระดับการศึกษา',
  `school_name` varchar(100) NOT NULL COMMENT 'ชื่อสถานศึกษา',
  `honor` varchar(100) DEFAULT NULL COMMENT 'เกียรตินิยม',
  `grade` varchar(100) DEFAULT NULL COMMENT 'เกรดเฉลี่ย',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'เวลาที่สร้าง'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `location_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสสถานที่',
  `tutor_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสติวเตอร์',
  `place_name` varchar(100) NOT NULL COMMENT 'ชื่อสถานที่',
  `coordinates` varchar(100) NOT NULL COMMENT 'พิกัดสถานที่',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'เวลาที่สร้าง'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messsages`
--

CREATE TABLE `messsages` (
  `message_id` int(100) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสข้อความ',
  `sender_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้ใช้งาน (ผู้ส่ง)',
  `receiver_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้ใช้งาน (ผู้รับ)',
  `message_text` text NOT NULL COMMENT 'เนื้อหาข้อความ',
  `attachment_path` varchar(255) NOT NULL COMMENT 'ที่อยู่รูปภาพ',
  `is_read` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'เช็คการอ่าน',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'เวลาที่ส่ง'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสการแจ้งเตือน',
  `account_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้ใช้งาน',
  `message` text NOT NULL COMMENT 'ข้อความแจ้งเตือน',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'วันที่และเวลาที่แจ้งเตือน'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `rating_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสคะแนนรีวิว',
  `account_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้เรียน',
  `tutor_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้สอน',
  `score` int(1) NOT NULL COMMENT 'คะแนนที่ให้',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'วันที่ให้คะแนน'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `revisits`
--

CREATE TABLE `revisits` (
  `revisit_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสการกลับมาเรียน',
  `tutor_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้สอน',
  `account_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้เรียน',
  `revisit_count` int(10) NOT NULL COMMENT 'จำนวนการกลับมาเรียน',
  `update_timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'เวลาที่อัปเดท'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `studys`
--

CREATE TABLE `studys` (
  `study_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสการเรียน',
  `account_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้เรียน',
  `tutor_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้สอน',
  `subject_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสวิชา',
  `status` enum('รออนุมัติ','อนุมัติคำขอ') NOT NULL DEFAULT 'รออนุมัติ' COMMENT 'สถานะการเรียน',
  `register_timestamp` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'เวลาที่สมัครเรียน',
  `approve_timestamp` timestamp NULL DEFAULT NULL COMMENT 'เวลาที่ได้รับอนุมัติ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสข้อมูลวิชาที่สอน',
  `tutor_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้สอน',
  `category` varchar(100) NOT NULL COMMENT 'หมวดหมู่วิชา',
  `subject_name` varchar(100) NOT NULL COMMENT 'ชื่อวิชาที่สอน',
  `degree_level` varchar(100) NOT NULL COMMENT 'ระดับวิชาที่สอน',
  `price` int(11) NOT NULL COMMENT 'ี่ราคาต่อชั่วโมง',
  `register_count` int(11) NOT NULL COMMENT 'จำนวนผู้สมัคร',
  `student_count` int(11) NOT NULL COMMENT 'จำนวนผู้เรียน',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'เวลาที่สร้างวิชาสอน'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tutors`
--

CREATE TABLE `tutors` (
  `tutor_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้สอน',
  `account_id` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'รหัสผู้ใช้งาน',
  `displayname` varchar(30) NOT NULL COMMENT 'ชื่อติวเตอร์',
  `facebook_link` varchar(255) NOT NULL COMMENT 'facebook link',
  `line_id` varchar(30) NOT NULL COMMENT 'ไอดี Line',
  `introduce_message` text NOT NULL COMMENT 'ข้อความแนะนำตัว',
  `description` text NOT NULL COMMENT 'คำอธิบายการสอน',
  `rating_score` float NOT NULL COMMENT 'คะแนนรีวิว',
  `revisit_score` float NOT NULL COMMENT 'อัตรากลับมาเรียน',
  `profile_status` enum('สมัครติวเตอร์','รอตรวจสอบ','พร้อมสอน') NOT NULL COMMENT 'สถานะโปรไฟล์',
  `date_modified` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'วันที่แก้ไขโปรไฟล์'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `announces`
--
ALTER TABLE `announces`
  ADD PRIMARY KEY (`announce_id`),
  ADD KEY `student_announce` (`account_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `commentStudent` (`account_id`),
  ADD KEY `commentTutor` (`tutor_id`);

--
-- Indexes for table `graduates`
--
ALTER TABLE `graduates`
  ADD PRIMARY KEY (`graduate_id`),
  ADD KEY `tutorgraduate` (`tutor_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`location_id`),
  ADD KEY `tutorlocation` (`tutor_id`);

--
-- Indexes for table `messsages`
--
ALTER TABLE `messsages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `sender` (`sender_id`),
  ADD KEY `receiver` (`receiver_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `account_notification` (`account_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`rating_id`),
  ADD KEY `ratingStudent` (`account_id`),
  ADD KEY `ratingTutor` (`tutor_id`);

--
-- Indexes for table `revisits`
--
ALTER TABLE `revisits`
  ADD PRIMARY KEY (`revisit_id`),
  ADD KEY `revisitTutor` (`tutor_id`),
  ADD KEY `revisitStudent` (`account_id`);

--
-- Indexes for table `studys`
--
ALTER TABLE `studys`
  ADD PRIMARY KEY (`study_id`),
  ADD KEY `studyStudent` (`account_id`),
  ADD KEY `studyTutor` (`tutor_id`),
  ADD KEY `studySubject` (`subject_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`),
  ADD KEY `tutorID` (`tutor_id`);

--
-- Indexes for table `tutors`
--
ALTER TABLE `tutors`
  ADD PRIMARY KEY (`tutor_id`),
  ADD KEY `accountID` (`account_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสผู้ใช้งาน';

--
-- AUTO_INCREMENT for table `announces`
--
ALTER TABLE `announces`
  MODIFY `announce_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสประกาศ';

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(100) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสความคิดเห็น';

--
-- AUTO_INCREMENT for table `graduates`
--
ALTER TABLE `graduates`
  MODIFY `graduate_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสข้อมูลการศึกษา';

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `location_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสสถานที่';

--
-- AUTO_INCREMENT for table `messsages`
--
ALTER TABLE `messsages`
  MODIFY `message_id` int(100) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสข้อความ';

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสการแจ้งเตือน';

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `rating_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสคะแนนรีวิว';

--
-- AUTO_INCREMENT for table `revisits`
--
ALTER TABLE `revisits`
  MODIFY `revisit_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสการกลับมาเรียน';

--
-- AUTO_INCREMENT for table `studys`
--
ALTER TABLE `studys`
  MODIFY `study_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสการเรียน';

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสข้อมูลวิชาที่สอน';

--
-- AUTO_INCREMENT for table `tutors`
--
ALTER TABLE `tutors`
  MODIFY `tutor_id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'รหัสผู้สอน';

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announces`
--
ALTER TABLE `announces`
  ADD CONSTRAINT `student_announce` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `commentStudent` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `commentTutor` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`tutor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `graduates`
--
ALTER TABLE `graduates`
  ADD CONSTRAINT `tutorgraduate` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`tutor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `tutorlocation` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`tutor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `messsages`
--
ALTER TABLE `messsages`
  ADD CONSTRAINT `receiver` FOREIGN KEY (`receiver_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sender` FOREIGN KEY (`sender_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `account_notification` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratingStudent` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratingTutor` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`tutor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `revisits`
--
ALTER TABLE `revisits`
  ADD CONSTRAINT `revisitStudent` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `revisitTutor` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`tutor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `studys`
--
ALTER TABLE `studys`
  ADD CONSTRAINT `studyStudent` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studySubject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studyTutor` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`tutor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `tutorID` FOREIGN KEY (`tutor_id`) REFERENCES `tutors` (`tutor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tutors`
--
ALTER TABLE `tutors`
  ADD CONSTRAINT `accountID` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
