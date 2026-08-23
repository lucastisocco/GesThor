-- ============================================================
-- Script de carga de datos - Proyecto GesThor
-- Materia: Desarrollo de Software - UTN FRRo
-- Escenario: empresa de desarrollo de software (software factory)
-- ============================================================

USE gesthor;

-- ============================================================
-- CATEGORIA_EMPLEADO 
-- ============================================================
INSERT INTO categoria_empleado (id_categoria, nombre, descripcion, fec_desde) VALUES
(1, 'Trainee',       'Empleado en formación inicial, sin experiencia previa',            '2018-03-01'),
(2, 'Junior',        'Hasta 2 años de experiencia, requiere supervisión frecuente',       '2018-03-01'),
(3, 'Semi Senior',   'Entre 2 y 4 años de experiencia, trabaja con autonomía media',      '2018-03-01'),
(4, 'Senior',        'Más de 4 años de experiencia, alta autonomía técnica',              '2018-03-01'),
(5, 'Team Lead',     'Referente técnico y líder de un equipo de trabajo',                 '2019-06-01'),
(6, 'Project Manager','Responsable de la gestión y coordinación de proyectos',            '2019-06-01');

-- ============================================================
-- CLIENTE
-- ============================================================
INSERT INTO cliente (id_cliente, razon_social, cuit, tel, email) VALUES
(1, 'Banco del Litoral S.A.',        '30712345671', '0341-4123456', 'contacto@bancolitoral.com.ar'),
(2, 'AgroSanta Cooperativa Ltda.',   '30712345672', '0341-4223456', 'sistemas@agrosanta.coop'),
(3, 'Retail Total S.R.L.',           '30712345673', '0341-4323456', 'it@retailtotal.com.ar'),
(4, 'Municipalidad de Rosario',      '30712345674', '0341-4423456', 'informatica@rosario.gob.ar'),
(5, 'LogiTrans S.A.',                '30712345675', '0341-4523456', 'soporte@logitrans.com.ar'),
(6, 'Uso Interno (Producto Propio)', '30712345676', '0341-4623456', 'interno@gesthor.com.ar');

-- ============================================================
-- TIPO_PROYECTO
-- ============================================================
INSERT INTO tipo_proyecto (id_tipo_proyecto, nombre, descripcion) VALUES
(1, 'Desarrollo a Medida',    'Construcción de un sistema o aplicación desde cero para un cliente'),
(2, 'Mantenimiento y Soporte','Correcciones, mejoras menores y soporte sobre un sistema ya existente'),
(3, 'Consultoría IT',         'Asesoramiento técnico y relevamiento de procesos sin desarrollo asociado'),
(4, 'Producto Propio',        'Desarrollo interno de un producto propio de la empresa'),
(5, 'Migración de Datos',     'Migración e integración de datos entre sistemas o bases de datos');

-- ============================================================
-- AREA 
-- ============================================================
INSERT INTO area (id_area, nombre, descripcion, fec_desde) VALUES
(1, 'Desarrollo',                 'Equipo encargado de la construcción de software',         '2018-03-01'),
(2, 'QA y Testing',                'Equipo encargado del control de calidad y pruebas',       '2018-03-01'),
(3, 'Infraestructura y DevOps',    'Equipo encargado de servidores, despliegues y CI/CD',      '2019-01-15'),
(4, 'UX/UI',                       'Equipo encargado del diseño de interfaces y experiencia',  '2020-02-01'),
(5, 'Gestión de Proyectos',        'Equipo encargado de la planificación y seguimiento',       '2018-03-01'),
(6, 'Soporte Técnico',             'Equipo encargado de la atención de incidentes de clientes','2018-08-01'),
(7, 'Recursos Humanos',            'Equipo encargado de la gestión del personal',              '2018-03-01');

-- ============================================================
-- REGISTRO_HORAS 
-- ============================================================
INSERT INTO registro_horas (id_registro, cant_horas, desc_tarea) VALUES
(1, 4.0,  'Relevamiento de requerimientos con el cliente'),
(2, 8.0,  'Desarrollo de módulo de autenticación'),
(3, 6.5,  'Ejecución de pruebas funcionales'),
(4, 3.0,  'Corrección de bugs reportados en producción'),
(5, 8.0,  'Diseño de wireframes de la pantalla principal'),
(6, 2.5,  'Reunión de seguimiento semanal (daily/status)'),
(7, 5.0,  'Configuración de pipeline de CI/CD'),
(8, 7.0,  'Desarrollo de API de reportes'),
(9, 4.5,  'Migración de tablas históricas'),
(10, 6.0, 'Soporte a incidente crítico reportado por el cliente');

-- ============================================================
-- EMPLEADO
-- ============================================================
INSERT INTO empleado (cuil, ape_nom, fecha_nac, num_tel, rol, usuario, passwd, id_categoria) VALUES
('20345678901', 'Gómez, Lucas',       '1996-05-14', '341-5551001', 'Desarrollador Backend',   'lgomez',    'x8f2Klq9$hA', 3),
('27345678902', 'Fernández, Ana',     '1998-11-02', '341-5551002', 'Desarrolladora Frontend', 'afernandez','p0mZ7trQ!2b', 2),
('20345678903', 'Rodríguez, Martín',  '1990-02-20', '341-5551003', 'QA Tester',               'mrodriguez','q3Vn8sLp#1c', 3),
('20345678904', 'López, Sofía',       '1993-07-09', '341-5551004', 'DevOps Engineer',         'slopez',    'z9Ct4wRe%3d', 4),
('27345678905', 'Pérez, Camila',      '1995-09-30', '341-5551005', 'Diseñadora UX/UI',        'cperez',    'k1Bm6yTs&4e', 3),
('20345678906', 'Sánchez, Diego',     '1988-01-17', '341-5551006', 'Team Lead Backend',       'dsanchez',  'j7Nx2pQw*5f', 5),
('20345678907', 'Torres, Federico',   '1992-04-25', '341-5551007', 'Project Manager',         'ftorres',   'h4Rl9mKz@6g', 6),
('27345678908', 'Álvarez, Julieta',   '1999-03-12', '341-5551008', 'Desarrolladora Backend',  'jalvarez',  'w6Yt3nBc!7h', 1),
('20345678909', 'Ramírez, Nicolás',   '1991-12-05', '341-5551009', 'Soporte Técnico',         'nramirez',  'e2Sq8vDf#8i', 2),
('20345678910', 'Ibáñez, Valentina',  '1994-06-18', '341-5551010', 'Recursos Humanos',        'vibanez',   'r5Tp1jGh$9j', 4);

-- ============================================================
-- PROYECTO
-- ============================================================
INSERT INTO proyecto (id_proyecto, nombre, proyecto_horas, fecha_ini, fecha_fin, id_cliente, id_tipo_proyecto) VALUES
(1, 'Homebanking Banco del Litoral',        1200.00, '2024-02-01', NULL,         1, 1),
(2, 'Portal de Socios AgroSanta',            600.00, '2024-05-15', '2025-01-31', 2, 1),
(3, 'Soporte Sistema de Ventas Retail Total',300.00, '2023-01-10', NULL,         3, 2),
(4, 'Sistema de Trámites Municipales',      900.00, '2024-08-01', NULL,         4, 1),
(5, 'Migración de Datos LogiTrans',          250.00, '2025-03-01', '2025-06-30', 5, 5),
(6, 'App Interna de Gestión de Horas',       400.00, '2024-01-15', NULL,         6, 4);

-- ============================================================
-- ASIGNACION 
-- ============================================================
INSERT INTO asignacion (cuil, id_proyecto, fecha_ini, fecha_fin) VALUES
('20345678906', 1, '2024-02-01', NULL),        -- Sánchez (Team Lead) - Homebanking
('20345678901', 1, '2024-02-01', NULL),        -- Gómez (Dev Backend) - Homebanking
('27345678902', 1, '2024-03-01', NULL),        -- Fernández (Dev Frontend) - Homebanking
('20345678903', 1, '2024-02-15', NULL),        -- Rodríguez (QA) - Homebanking
('20345678907', 1, '2024-02-01', NULL),        -- Torres (PM) - Homebanking
('27345678908', 2, '2024-05-15', '2025-01-31'),-- Álvarez (Trainee) - Portal AgroSanta
('27345678902', 2, '2024-05-15', '2025-01-31'),-- Fernández - Portal AgroSanta
('20345678907', 2, '2024-05-15', '2025-01-31'),-- Torres (PM) - Portal AgroSanta
('20345678909', 3, '2023-01-10', NULL),        -- Ramírez (Soporte) - Retail Total
('20345678901', 4, '2024-08-01', NULL),        -- Gómez - Trámites Municipales
('20345678903', 4, '2024-08-01', NULL),        -- Rodríguez (QA) - Trámites Municipales
('20345678904', 4, '2024-09-01', NULL),        -- López (DevOps) - Trámites Municipales
('20345678907', 4, '2024-08-01', NULL),        -- Torres (PM) - Trámites Municipales
('20345678904', 5, '2025-03-01', '2025-06-30'),-- López (DevOps) - Migración LogiTrans
('20345678906', 6, '2024-01-15', NULL),        -- Sánchez (Team Lead) - App Interna
('27345678905', 6, '2024-01-15', NULL);        -- Pérez (UX/UI) - App Interna

-- ============================================================
-- EMPLEADO_AREA 
-- ============================================================
INSERT INTO empleado_area (cuil, id_area) VALUES
('20345678901', 1),  -- Gómez - Desarrollo
('27345678902', 1),  -- Fernández - Desarrollo
('27345678908', 1),  -- Álvarez - Desarrollo
('20345678906', 1),  -- Sánchez - Desarrollo
('20345678906', 5),  -- Sánchez - Gestión de Proyectos (también lidera)
('20345678903', 2),  -- Rodríguez - QA y Testing
('20345678904', 3),  -- López - Infraestructura y DevOps
('27345678905', 4),  -- Pérez - UX/UI
('20345678907', 5),  -- Torres - Gestión de Proyectos
('20345678909', 6),  -- Ramírez - Soporte Técnico
('20345678910', 7);  -- Ibáñez - Recursos Humanos

-- ============================================================
-- REGISTRO_ASIGNACION 
-- ============================================================
INSERT INTO registro_asignacion (cuil, id_proyecto, id_registro, fecha_reg) VALUES
('20345678907', 1, 1, '2024-02-05'),   -- Torres: relevamiento en Homebanking
('20345678901', 1, 2, '2024-03-10'),   -- Gómez: módulo de autenticación en Homebanking
('20345678903', 1, 3, '2024-03-20'),   -- Rodríguez: pruebas funcionales en Homebanking
('20345678901', 4, 4, '2024-09-05'),   -- Gómez: corrección de bugs en Trámites Municipales
('27345678905', 6, 5, '2024-02-01'),   -- Pérez: wireframes en App Interna
('20345678906', 1, 6, '2024-04-01'),   -- Sánchez: reunión de seguimiento en Homebanking
('20345678904', 4, 7, '2024-09-15'),   -- López: pipeline CI/CD en Trámites Municipales
('27345678902', 2, 8, '2024-06-01'),   -- Fernández: API de reportes en Portal AgroSanta
('20345678904', 5, 9, '2025-03-20'),   -- López: migración de tablas en LogiTrans
('20345678909', 3, 10, '2023-06-15'); -- Ramírez: soporte a incidente en Retail Total