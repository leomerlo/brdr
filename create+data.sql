-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 03, 2018 at 03:31 AM
-- Server version: 10.1.33-MariaDB
-- PHP Version: 7.2.6

DROP DATABASE IF EXISTS BRDR;

CREATE DATABASE BRDR;

USE BRDR;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `BRDR`
--

-- --------------------------------------------------------

--
-- Table structure for table `COMENTARIOS`
--

CREATE TABLE `COMENTARIOS` (
  `id` int(10) UNSIGNED NOT NULL,
  `texto` varchar(255) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `activo` bit(1) DEFAULT b'1',
  `FK_POST` int(10) UNSIGNED DEFAULT NULL,
  `FK_USUARIO` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `COMENTARIOS`
--

INSERT INTO `COMENTARIOS` (`id`, `texto`, `fecha`, `activo`, `FK_POST`, `FK_USUARIO`) VALUES
(1, 'Majestuoso. #ReporteOk #Proceda', '2018-07-03 00:50:25', b'1', 1, 2),
(2, 'Que hermoso! Me recuerda a mi gabrielito. Que cosas tan raras que ponen', '2018-07-03 01:22:12', b'1', 1, 3),
(3, 'Le dije a mi hija que venga a verlo', '2018-07-03 01:23:21', b'1', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `NOTIFICACIONES`
--

CREATE TABLE `NOTIFICACIONES` (
  `id` int(10) UNSIGNED NOT NULL,
  `accion` varchar(255) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `FK_POST` int(10) UNSIGNED DEFAULT NULL,
  `FK_USUARIO` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `PERMISOS`
--

CREATE TABLE `PERMISOS` (
  `id` int(10) UNSIGNED NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `agregar` bit(1) DEFAULT b'0',
  `editar` bit(1) DEFAULT b'0',
  `eliminar` bit(1) DEFAULT b'0',
  `permisos` bit(1) DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `PERMISOS`
--

INSERT INTO `PERMISOS` (`id`, `usuario`, `agregar`, `editar`, `eliminar`, `permisos`) VALUES
(1, 'admin', b'1', b'1', b'1', b'1'),
(2, 'user', b'1', b'1', b'1', b'0');

-- --------------------------------------------------------

--
-- Table structure for table `POSTS`
--

CREATE TABLE `POSTS` (
  `id` int(10) UNSIGNED NOT NULL,
  `texto` varchar(255) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `activo` bit(1) DEFAULT b'1',
  `FK_USUARIO` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `POSTS`
--

INSERT INTO `POSTS` (`id`, `texto`, `fecha`, `activo`, `FK_USUARIO`) VALUES
(1, 'Pajaro Greenfinch nativo de Norteamerica, se puede observar su gran plumaje. #OperationGalileo #Success #OK', '2018-07-03 00:48:00', b'1', 1);

-- --------------------------------------------------------

--
-- Table structure for table `USUARIOS`
--

CREATE TABLE `USUARIOS` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ultima_visita` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `activo` bit(1) DEFAULT b'1',
  `FK_PERMISOS` int(10) UNSIGNED DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `USUARIOS`
--

INSERT INTO `USUARIOS` (`id`, `nombre`, `apellido`, `usuario`, `email`, `password`, `fecha`, `ultima_visita`, `activo`, `FK_PERMISOS`) VALUES
(1, 'Richard', 'Jones', 'MrJones74', 'rjones@fbi.gov', '$2y$10$CCSSK3KAn1wIYlrf7bzC0Oqw.ef3z/k5v8Xt0Btw/C5yxlhkgSpHO', '2018-07-03 00:32:09', '2018-07-03 00:32:09', b'1', 2),
(2, 'Walter', 'Frey', 'wfrey', 'wfrey@fbi.gov', '$2y$10$CCSSK3KAn1wIYlrf7bzC0Oqw.ef3z/k5v8Xt0Btw/C5yxlhkgSpHO', '2018-07-03 00:49:43', '2018-07-03 00:49:43', b'1', 2),
(3, 'Nelly', 'Gustavo', 'nelly86', 'nelly86@gmail.com', '$2y$10$CCSSK3KAn1wIYlrf7bzC0Oqw.ef3z/k5v8Xt0Btw/C5yxlhkgSpHO', '2018-07-03 01:06:30', '2018-07-03 01:06:30', b'1', 2);

--
-- Table structure for table `AMIGOS`
--

CREATE TABLE `AMIGOS` (
  `id` int(10) UNSIGNED NOT NULL,
  `FK_usuario` int(10) UNSIGNED DEFAULT '1',
  `FK_amigo` int(10) UNSIGNED DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `FAVORITOS`
--

CREATE TABLE `FAVORITOS` (
  `id` int(10) UNSIGNED NOT NULL,
  `FK_POST` int(10) UNSIGNED DEFAULT '1',
  `FK_USUARIO` int(10) UNSIGNED DEFAULT '1',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `MENSAJES`
--

CREATE TABLE `MENSAJES` (
  `id` int(10) UNSIGNED NOT NULL,
  `FK_emisor` int(10) UNSIGNED DEFAULT '1',
  `FK_receptor` int(10) UNSIGNED DEFAULT '1',
  `mensaje` varchar(255) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `activo` bit(1) DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `COMENTARIOS`
--
ALTER TABLE `COMENTARIOS`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_POST` (`FK_POST`),
  ADD KEY `FK_USUARIO` (`FK_USUARIO`);

--
-- Indexes for table `NOTIFICACIONES`
--
ALTER TABLE `NOTIFICACIONES`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_POST` (`FK_POST`),
  ADD KEY `FK_USUARIO` (`FK_USUARIO`);

--
-- Indexes for table `PERMISOS`
--
ALTER TABLE `PERMISOS`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `POSTS`
--
ALTER TABLE `POSTS`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_USUARIO` (`FK_USUARIO`);

--
-- Indexes for table `USUARIOS`
--
ALTER TABLE `USUARIOS`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `usuarios_ibfk_1` (`FK_PERMISOS`);

--
-- Indexes for table `AMIGOS`
--
ALTER TABLE `AMIGOS`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_usuario` (`FK_usuario`),
  ADD KEY `FK_amigo` (`FK_amigo`);

--
-- Indexes for table `FAVORITOS`
--
ALTER TABLE `FAVORITOS`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_USUARIO` (`FK_USUARIO`),
  ADD KEY `FK_POST` (`FK_POST`);

--
-- Indexes for table `MENSAJES`
--
ALTER TABLE `MENSAJES`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_emisor` (`FK_emisor`),
  ADD KEY `FK_receptor` (`FK_receptor`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `COMENTARIOS`
--
ALTER TABLE `COMENTARIOS`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `NOTIFICACIONES`
--
ALTER TABLE `NOTIFICACIONES`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PERMISOS`
--
ALTER TABLE `PERMISOS`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `POSTS`
--
ALTER TABLE `POSTS`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `USUARIOS`
--
ALTER TABLE `USUARIOS`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `AMIGOS`
--
ALTER TABLE `AMIGOS`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `FAVORITOS`
--
ALTER TABLE `FAVORITOS`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `MENSAJES`
--
ALTER TABLE `MENSAJES`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `COMENTARIOS`
--
ALTER TABLE `COMENTARIOS`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`FK_POST`) REFERENCES `POSTS` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`FK_USUARIO`) REFERENCES `USUARIOS` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `NOTIFICACIONES`
--
ALTER TABLE `NOTIFICACIONES`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`FK_POST`) REFERENCES `POSTS` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`FK_USUARIO`) REFERENCES `USUARIOS` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `POSTS`
--
ALTER TABLE `POSTS`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`FK_USUARIO`) REFERENCES `USUARIOS` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `USUARIOS`
--
ALTER TABLE `USUARIOS`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`FK_PERMISOS`) REFERENCES `PERMISOS` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `AMIGOS`
--
ALTER TABLE `AMIGOS`
  ADD CONSTRAINT `amigos_ibfk_1` FOREIGN KEY (`FK_usuario`) REFERENCES `USUARIOS` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `amigos_ibfk_2` FOREIGN KEY (`FK_amigo`) REFERENCES `USUARIOS` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `FAVORITOS`
--
ALTER TABLE `FAVORITOS`
  ADD CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`FK_USUARIO`) REFERENCES `USUARIOS` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`FK_POST`) REFERENCES `POSTS` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `MENSAJES`
--
ALTER TABLE `MENSAJES`
  ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`FK_emisor`) REFERENCES `USUARIOS` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`FK_receptor`) REFERENCES `USUARIOS` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
