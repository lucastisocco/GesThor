USE gesthor;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE registroAsignacion;
TRUNCATE TABLE asignacion;
TRUNCATE TABLE empleadoArea;
TRUNCATE TABLE proyecto;
TRUNCATE TABLE registroHoras;
TRUNCATE TABLE empleado;
TRUNCATE TABLE area;
TRUNCATE TABLE tipoProyecto;
TRUNCATE TABLE cliente;
TRUNCATE TABLE categoriaEmpleado;
SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO categoriaEmpleado (nombre, descripcion, fecDesde) VALUES
('Trainee',         'Empleado en formación inicial, sin experiencia previa',            '2018-03-01 00:00:00'),
('Junior',          'Hasta 2 años de experiencia, requiere supervisión frecuente',       '2018-03-01 00:00:00'),
('Semi Senior',     'Entre 2 y 4 años de experiencia, trabaja con autonomía media',      '2018-03-01 00:00:00'),
('Senior',          'Más de 4 años de experiencia, alta autonomía técnica',              '2018-03-01 00:00:00'),
('Team Lead',       'Referente técnico y líder de un equipo de trabajo',                 '2019-06-01 00:00:00'),
('Project Manager', 'Responsable de la gestión y coordinación de proyectos',            '2019-06-01 00:00:00');


INSERT INTO cliente (razonSocial, cuit, tel, email) VALUES
('Banco del Litoral S.A.',        '30712345671', '3414123456', 'contacto@bancolitoral.com.ar'),
('AgroSanta Cooperativa Ltda.',   '30712345672', '3414223456', 'sistemas@agrosanta.coop'),
('Retail Total S.R.L.',           '30712345673', '3414323456', 'it@retailtotal.com.ar'),
('Municipalidad de Rosario',      '30712345674', '3414423456', 'informatica@rosario.gob.ar'),
('LogiTrans S.A.',                '30712345675', '3414523456', 'soporte@logitrans.com.ar'),
('Uso Interno (Producto Propio)', '30712345676', '3414623456', 'interno@gesthor.com.ar');


INSERT INTO tipoProyecto (nombre, descripcion) VALUES
('Desarrollo a Medida',    'Construcción de un sistema o aplicación desde cero para un cliente'),
('Mantenimiento y Soporte','Correcciones, mejoras menores y soporte sobre un sistema ya existente'),
('Consultoría IT',         'Asesoramiento técnico y relevamiento de procesos sin desarrollo asociado'),
('Producto Propio',        'Desarrollo interno de un producto propio de la empresa'),
('Migración de Datos',     'Migración e integración de datos entre sistemas o bases de datos');


INSERT INTO area (nombre, descripcion, fecDesde) VALUES
('Desarrollo',                 'Equipo encargado de la construcción de software',         '2018-03-01 00:00:00'),
('QA y Testing',                'Equipo encargado del control de calidad y pruebas',       '2018-03-01 00:00:00'),
('Infraestructura y DevOps',    'Equipo encargado de servidores, despliegues y CI/CD',      '2019-01-15 00:00:00'),
('UX/UI',                       'Equipo encargado del diseño de interfaces y experiencia',  '2020-02-01 00:00:00'),
('Gestión de Proyectos',        'Equipo encargado de la planificación y seguimiento',       '2018-03-01 00:00:00'),
('Soporte Técnico',             'Equipo encargado de la atención de incidentes de clientes','2018-08-01 00:00:00'),
('Recursos Humanos',            'Equipo encargado de la gestión del personal',              '2018-03-01 00:00:00');


INSERT INTO registroHoras (cantHoras, descTarea) VALUES
(4,  'Relevamiento de requerimientos con el cliente'),
(8,  'Desarrollo de módulo de autenticación y JWT'),
(6,  'Ejecución de pruebas funcionales y suites e2e'),
(3,  'Corrección de bugs reportados en producción'),
(8,  'Diseño de wireframes y prototipo interactivo en Figma'),
(6,  'Reunión de seguimiento semanal (daily/status) y planning'),
(7,  'Configuración de pipeline de CI/CD en GitHub Actions'),
(8,  'Desarrollo de API RESTful de reportes y exportación'),
(9,  'Migración e ingesta de tablas históricas'),
(10, 'Atención y resolución de incidente crítico en producción');


INSERT INTO empleado (cuil, apeNom, fechaNac, numTel, rol, usuario, passwd, idCategoria) VALUES
('20345678901', 'Gómez, Lucas',       '1996-07-26 00:00:00', '3415551001', 'Desarrollador Backend',   'lgomez',    '$2b$10$e8f2Klq9HashPassEncrypted1', 3),
('27345678902', 'Fernández, Ana',     '1998-11-02 00:00:00', '3415551002', 'Desarrolladora Frontend', 'afernandez','$2b$10$p0mZ7trQHashPassEncrypted2', 2),
('20345678903', 'Rodríguez, Martín',  '1990-02-20 00:00:00', '3415551003', 'QA Tester',               'mrodriguez','$2b$10$q3Vn8sLpHashPassEncrypted3', 3),
('20345678904', 'López, Sofía',       '1993-07-09 00:00:00', '3415551004', 'DevOps Engineer',         'slopez',    '$2b$10$z9Ct4wReHashPassEncrypted4', 4),
('27345678905', 'Pérez, Camila',      '1995-09-30 00:00:00', '3415551005', 'Diseñadora UX/UI',        'cperez',    '$2b$10$k1Bm6yTsHashPassEncrypted5', 3),
('20345678906', 'Sánchez, Diego',     '1988-01-17 00:00:00', '3415551006', 'Team Lead Backend',       'dsanchez',  '$2b$10$j7Nx2pQwHashPassEncrypted6', 5),
('20345678907', 'Torres, Federico',   '1992-04-25 00:00:00', '3415551007', 'Project Manager',         'ftorres',   '$2b$10$h4Rl9mKzHashPassEncrypted7', 6),
('27345678908', 'Álvarez, Julieta',   '1999-03-12 00:00:00', '3415551008', 'Desarrolladora Backend',  'jalvarez',  '$2b$10$w6Yt3nBcHashPassEncrypted8', 1),
('20345678909', 'Ramírez, Nicolás',   '1991-12-05 00:00:00', '3415551009', 'Soporte Técnico',         'nramirez',  '$2b$10$e2Sq8vDfHashPassEncrypted9', 2),
('20345678910', 'Ibáñez, Valentina',  '1994-06-18 00:00:00', '3415551010', 'Recursos Humanos',        'vibanez',   '$2b$10$r5Tp1jGhHashPassEncrypted10', 4);


INSERT INTO proyecto (nombre, proyectoHoras, fechaIni, fechaFin, idCliente, idTipoProyecto) VALUES
('Homebanking Banco del Litoral',        1200, '2024-02-01 00:00:00', NULL,                  1, 1),
('Portal de Socios AgroSanta',            600, '2024-05-15 00:00:00', '2025-01-31 00:00:00', 2, 1),
('Soporte Sistema de Ventas Retail Total', 300, '2023-01-10 00:00:00', NULL,                  3, 2),
('Sistema de Trámites Municipales',       900, '2024-08-01 00:00:00', NULL,                  4, 1),
('Migración de Datos LogiTrans',           250, '2025-03-01 00:00:00', '2025-06-30 00:00:00', 5, 5),
('GesThor - App Interna de Gestión',       400, '2024-01-15 00:00:00', NULL,                  6, 4);


INSERT INTO empleadoArea (fechaInicioArea, fecha_fin_area, cuilEmpleado, idArea) VALUES
('2024-01-01 00:00:00', '2099-12-31 23:59:59', '20345678901', 1),
('2024-01-01 00:00:00', '2099-12-31 23:59:59', '27345678902', 1),
('2024-01-01 00:00:00', '2099-12-31 23:59:59', '27345678908', 1),
('2024-01-01 00:00:00', '2099-12-31 23:59:59', '20345678906', 1),
('2024-01-01 00:00:00', '2099-12-31 23:59:59', '20345678906', 5),
('2024-01-01 00:00:00', '2099-12-31 23:59:59', '20345678903', 2),
('2024-01-01 00:00:00', '2099-12-31 23:59:59', '20345678904', 3),
('2024-01-01 00:00:00', '2099-12-31 23:59:59', '27345678905', 4),
('2024-01-01 00:00:00', '2099-12-31 23:59:59', '20345678907', 5),
('2024-01-01 00:00:00', '2099-12-31 23:59:59', '20345678909', 6),
('2024-01-01 00:00:00', '2099-12-31 23:59:59', '20345678910', 7);


INSERT INTO asignacion (cuilEmpleado, idProyecto, fechaAsig, hsSemanales) VALUES
('20345678906', 1, '2024-02-01 00:00:00', 40),
('20345678901', 1, '2024-02-01 00:00:00', 40),
('27345678902', 1, '2024-03-01 00:00:00', 30),
('20345678903', 1, '2024-02-15 00:00:00', 20),
('20345678907', 1, '2024-02-01 00:00:00', 10),
('27345678908', 2, '2024-05-15 00:00:00', 40),
('27345678902', 2, '2024-05-15 00:00:00', 10),
('20345678907', 2, '2024-05-15 00:00:00', 10),
('20345678909', 3, '2023-01-10 00:00:00', 40),
('20345678901', 4, '2024-08-01 00:00:00', 20),
('20345678903', 4, '2024-08-01 00:00:00', 20),
('20345678904', 4, '2024-09-01 00:00:00', 40),
('20345678907', 4, '2024-08-01 00:00:00', 10),
('20345678904', 5, '2025-03-01 00:00:00', 20),
('20345678906', 6, '2024-01-15 00:00:00', 10),
('27345678905', 6, '2024-01-15 00:00:00', 40);


INSERT INTO registroAsignacion (idRegistroHoras, cuilEmpleado, idProyecto) VALUES
(1,  '20345678907', 1),
(2,  '20345678901', 1),
(3,  '20345678903', 1),
(4,  '20345678901', 4),
(5,  '27345678905', 6),
(6,  '20345678906', 1),
(7,  '20345678904', 4),
(8,  '27345678902', 2),
(9,  '20345678904', 5),
(10, '20345678909', 3);