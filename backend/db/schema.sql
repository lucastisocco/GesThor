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
    id_categoria    INT AUTO_INCREMENT PRIMARY KEY,
    nombre      	VARCHAR(50) NOT NULL,
    descripcion 	VARCHAR(255),
    fec_desde		DATE NOT NULL
) ENGINE=InnoDB;


-- CLIENTE
CREATE TABLE cliente (
    id_cliente   INT AUTO_INCREMENT PRIMARY KEY,
    razon_social VARCHAR(100) NOT NULL,
    cuit         VARCHAR(11)  NOT NULL UNIQUE,
    tel          VARCHAR(20),
    email        VARCHAR(100)
) ENGINE=InnoDB;


-- TIPO_PROYECTO
CREATE TABLE tipo_proyecto (
    id_tipo_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre  		 VARCHAR(50) NOT NULL,
    descripcion      VARCHAR(255)
) ENGINE=InnoDB;


-- AREA
CREATE TABLE area (
    id_area      INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(50) NOT NULL,
    descripcion  VARCHAR(255),
    fec_desde    DATE NOT NULL
) ENGINE=InnoDB;


-- REGISTRO_HORAS
CREATE TABLE registro_horas (
    id_registro  INT AUTO_INCREMENT PRIMARY KEY,
    cant_horas   DECIMAL(5,2) NOT NULL,
    desc_tarea   VARCHAR(255)
) ENGINE=InnoDB;


-- EMPLEADO 
CREATE TABLE empleado (
    cuil          VARCHAR(11)  PRIMARY KEY,
    ape_nom       VARCHAR(100) NOT NULL,
    fecha_nac     DATE NOT NULL,
    num_tel       VARCHAR(20),
    rol           VARCHAR(50) NOT NULL,
    usuario        VARCHAR(50) NOT NULL UNIQUE,
    passwd        VARCHAR(255) NOT NULL,
    id_categoria  INT NOT NULL,
    CONSTRAINT fk_empleado_categoria FOREIGN KEY (id_categoria) REFERENCES categoria_empleado(id_categoria) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- PROYECTO
CREATE TABLE proyecto (
    id_proyecto       INT AUTO_INCREMENT PRIMARY KEY,
    nombre   VARCHAR(100) NOT NULL,
    proyecto_horas    DECIMAL(7,2),
    fecha_ini    DATE         NOT NULL,
    fecha_fin    DATE,
    id_cliente        INT          NOT NULL,
    id_tipo_proyecto  INT          NOT NULL,
    CONSTRAINT fk_proyecto_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_proyecto_tipo FOREIGN KEY (id_tipo_proyecto) REFERENCES tipo_proyecto(id_tipo_proyecto) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;


-- ASIGNACION
CREATE TABLE asignacion (
    cuil         VARCHAR(11) NOT NULL,
    id_proyecto  INT         NOT NULL,
    fecha_ini    DATE        NOT NULL,
    fecha_fin    DATE,
    PRIMARY KEY (cuil, id_proyecto),
    CONSTRAINT fk_asignacion_empleado FOREIGN KEY (cuil) REFERENCES empleado(cuil) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_asignacion_proyecto FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- EMP_AREA
CREATE TABLE empleado_area (
    cuil     VARCHAR(11) NOT NULL,
    id_area  INT         NOT NULL,
    PRIMARY KEY (cuil, id_area),
    CONSTRAINT fk_emparea_empleado FOREIGN KEY (cuil) REFERENCES empleado(cuil) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_emparea_area FOREIGN KEY (id_area) REFERENCES area(id_area) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- REG_ASIG
CREATE TABLE registro_asignacion (
    cuil          VARCHAR(11) NOT NULL,
    id_proyecto   INT         NOT NULL,
    id_registro   INT         NOT NULL,
    fecha_reg     DATE        NOT NULL,
    PRIMARY KEY (cuil, id_proyecto, id_registro),
    CONSTRAINT fk_regasig_asignacion FOREIGN KEY (cuil, id_proyecto) REFERENCES asignacion(cuil, id_proyecto) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_regasig_registro FOREIGN KEY (id_registro) REFERENCES registro_horas(id_registro) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE INDEX idx_proyecto_cliente ON proyecto(id_cliente);
CREATE INDEX idx_empleado_categoria ON empleado(id_categoria);