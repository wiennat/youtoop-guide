
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table sim_stories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sim_stories`;

CREATE TABLE `sim_stories` (
  `id` varchar(250) NOT NULL DEFAULT '',
  `description` text,
  `ep` varchar(250) NOT NULL DEFAULT '',
  `epTime` varchar(250) NOT NULL DEFAULT '',
  `name` varchar(250) NOT NULL DEFAULT '',
  `narrator` varchar(250) NOT NULL DEFAULT '',
  `part` varchar(250) NOT NULL DEFAULT '',
  `url` varchar(250) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table sim_story_terms1
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sim_story_terms1`;

CREATE TABLE `sim_story_terms1` (
  `story_id` varchar(250) NOT NULL DEFAULT '',
  `term` varchar(250) NOT NULL DEFAULT '',
  PRIMARY KEY (`story_id`,`term`),
  KEY `term` (`term`,`story_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table sim_story_terms2
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sim_story_terms2`;

CREATE TABLE `sim_story_terms2` (
  `story_id` varchar(250) NOT NULL DEFAULT '',
  `term` varchar(250) NOT NULL DEFAULT '',
  PRIMARY KEY (`story_id`,`term`),
  KEY `term` (`term`,`story_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table sim_terms
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sim_terms`;

CREATE TABLE `sim_terms` (
  `term` varchar(250) NOT NULL DEFAULT '',
  `similar_term` varchar(250) NOT NULL DEFAULT '',
  PRIMARY KEY (`term`,`similar_term`),
  KEY `term` (`similar_term`,`term`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
