-- --------------------------------------------------------
-- Anfitrião:                    127.0.0.1
-- Versão do servidor:           10.5.8-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Versão:              11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for techchallengedb
CREATE DATABASE IF NOT EXISTS `techchallengedb` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `techchallengedb`;

-- Dumping structure for table techchallengedb.properties
CREATE TABLE IF NOT EXISTS `properties` (
  `idProperties` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` text NOT NULL,
  PRIMARY KEY (`idProperties`),
  UNIQUE KEY `idProperties_UNIQUE` (`idProperties`),
  UNIQUE KEY `Name_UNIQUE` (`Name`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8;

-- Dumping data for table techchallengedb.properties: ~1 rows (approximately)
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;

-- Dumping structure for table techchallengedb.propertyrooms
CREATE TABLE IF NOT EXISTS `propertyrooms` (
  `idPropertyRooms` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Properties_idProperties` int(10) unsigned NOT NULL,
  `RoomName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idPropertyRooms`),
  UNIQUE KEY `idPropertyRooms_UNIQUE` (`idPropertyRooms`),
  KEY `fk_PropertyRooms_Properties_idx` (`Properties_idProperties`),
  CONSTRAINT `fk_PropertyRooms_Properties` FOREIGN KEY (`Properties_idProperties`) REFERENCES `properties` (`idProperties`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=682 DEFAULT CHARSET=utf8;

-- Dumping data for table techchallengedb.propertyrooms: ~8 rows (approximately)
/*!40000 ALTER TABLE `propertyrooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `propertyrooms` ENABLE KEYS */;

-- Dumping structure for table techchallengedb.roomlookuptable
CREATE TABLE IF NOT EXISTS `roomlookuptable` (
  `idRoomLookupTable` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `RoomName` text NOT NULL,
  PRIMARY KEY (`idRoomLookupTable`),
  UNIQUE KEY `idRoomLookupTable_UNIQUE` (`idRoomLookupTable`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Dumping data for table techchallengedb.roomlookuptable: ~4 rows (approximately)
/*!40000 ALTER TABLE `roomlookuptable` DISABLE KEYS */;
INSERT INTO `roomlookuptable` (`idRoomLookupTable`, `RoomName`) VALUES
	(1, 'kitchen'),
	(2, 'bathroom'),
	(3, 'bedroom'),
	(4, 'living-room');
/*!40000 ALTER TABLE `roomlookuptable` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
