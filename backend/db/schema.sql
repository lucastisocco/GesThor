-- ============================================================
-- Script de creación de la base de datos - Proyecto GesThor
-- Materia: Desarrollo de Software - UTN FRRo
-- ============================================================

DROP DATABASE IF EXISTS gesthor;
CREATE DATABASE gesthor
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_spanish_ci;

USE gesthor;


-- CATEGORIA_EMPLEADO
CREATE TABLE categoria_empleado (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    nombre      	VARCHAR(50) NOT NULL,
    descripcion 	VARCHAR(255),
    fecDesde		DATE NOT NULL
) ENGINE=InnoDB;


-- CLIENTE
CREATE TABLE cliente (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    razonSocial VARCHAR(100) NOT NULL,
    cuit         VARCHAR(11)  NOT NULL UNIQUE,
    tel          VARCHAR(20),
    email        VARCHAR(100)
) ENGINE=InnoDB;


-- TIPO_PROYECTO
CREATE TABLE tipo_proyecto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre  		 VARCHAR(50) NOT NULL,
    descripcion      VARCHAR(255)
) ENGINE=InnoDB;


-- AREA
CREATE TABLE area (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(50) NOT NULL,
    descripcion  VARCHAR(255),
    fecDesde    DATE NOT NULL
) ENGINE=InnoDB;


-- REGISTRO_HORAS
CREATE TABLE registro_horas (
    id  INT AUTO_INCREMENT PRIMARY KEY,
    cantHoras   DECIMAL(5,2) NOT NULL,
    descTarea   VARCHAR(255)
) ENGINE=InnoDB;


-- EMPLEADO 
CREATE TABLE empleado (
    cuil          VARCHAR(11)  PRIMARY KEY,
    apeNom       VARCHAR(100) NOT NULL,
    fechaNac     DATE NOT NULL,
    numTel       VARCHAR(20),
    rol           VARCHAR(50) NOT NULL,
    usuario        VARCHAR(50) NOT NULL UNIQUE,
    passwd        VARCHAR(255) NOT NULL,
    idCategoria  INT NOT NULL,
    CONSTRAINT fk_empleado_categoria FOREIGN KEY (idCategoria) REFERENCES categoria_empleado(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- PROYECTO
CREATE TABLE proyecto (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    nombre   VARCHAR(100) NOT NULL,
    proyectoHoras    DECIMAL(7,2),
    fechaIni    DATE         NOT NULL,
    fechaFin    DATE,
    idCliente        INT          NOT NULL,
    idTipoProyecto  INT          NOT NULL,
    CONSTRAINT fk_proyecto_cliente FOREIGN KEY (idCliente) REFERENCES cliente(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_proyecto_tipo FOREIGN KEY (idTipoProyecto) REFERENCES tipo_proyecto(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;


-- ASIGNACION
CREATE TABLE asignacion (
    cuil         VARCHAR(11) NOT NULL,
    idProyecto  INT         NOT NULL,
    fechaIni    DATE        NOT NULL,
    fechaFin    DATE,
    PRIMARY KEY (cuil, idProyecto),
    CONSTRAINT fk_asignacion_empleado FOREIGN KEY (cuil) REFERENCES empleado(cuil) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_asignacion_proyecto FOREIGN KEY (idProyecto) REFERENCES proyecto(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- EMP_AREA
CREATE TABLE empleado_area (
    cuil     VARCHAR(11) NOT NULL,
    idArea  INT         NOT NULL,
    PRIMARY KEY (cuil, idArea),
    CONSTRAINT fk_emparea_empleado FOREIGN KEY (cuil) REFERENCES empleado(cuil) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_emparea_area FOREIGN KEY (idArea) REFERENCES area(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- REG_ASIG
CREATE TABLE registro_asignacion (
    cuil          VARCHAR(11) NOT NULL,
    idProyecto   INT         NOT NULL,
    idRegistro   INT         NOT NULL,
    fechaReg     DATE        NOT NULL,
    PRIMARY KEY (cuil, idProyecto, idRegistro),
    CONSTRAINT fk_regasig_asignacion FOREIGN KEY (cuil, idProyecto) REFERENCES asignacion(cuil, idProyecto) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_regasig_registro FOREIGN KEY (idRegistro) REFERENCES registro_horas(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE INDEX idx_proyecto_cliente ON proyecto(idCliente);
CREATE INDEX idx_empleado_categoria ON empleado(idCategoria);