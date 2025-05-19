-- Tabla Usuario
CREATE TABLE Usuario (
    ID_Usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Contraseña VARCHAR(255) NOT NULL,
    Tipo ENUM('Cliente', 'Jefe') NOT NULL
);

-- Tabla Categoria
CREATE TABLE Categoria (
    ID_Categoria INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Orden INT
);

-- Tabla Producto
CREATE TABLE Producto (
    ID_Producto INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Foto VARCHAR(255),
    ID_Categoria INT NOT NULL,
    FOREIGN KEY (ID_Categoria) REFERENCES Categoria(ID_Categoria) ON DELETE CASCADE
);

-- Tabla Precio_Producto (Formato ahora es VARCHAR(50) en lugar de ENUM)
CREATE TABLE Precio_Producto (
    ID_Precio INT AUTO_INCREMENT PRIMARY KEY,
    ID_Producto INT NOT NULL,
    Formato VARCHAR(50) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (ID_Producto) REFERENCES Producto(ID_Producto) ON DELETE CASCADE
);

-- Tabla Reseña (Modificada para incluir Puntuacion)
CREATE TABLE Reseña (
    ID_Reseña INT AUTO_INCREMENT PRIMARY KEY,
    ID_Usuario INT NOT NULL,
    ID_Producto INT NOT NULL,
    Texto TEXT,
    Puntuacion DECIMAL(3,1) NOT NULL CHECK (Puntuacion >= 1.0 AND Puntuacion <= 5.0),
    Fecha DATE NOT NULL,
    FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    FOREIGN KEY (ID_Producto) REFERENCES Producto(ID_Producto) ON DELETE CASCADE
);

-- Tabla Alergeno
CREATE TABLE Alergeno (
    ID_Alergeno INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Imagen VARCHAR(255)
);

-- Tabla Producto_Alergeno
CREATE TABLE Producto_Alergeno (
    ID_Producto INT NOT NULL,
    ID_Alergeno INT NOT NULL,
    PRIMARY KEY (ID_Producto, ID_Alergeno),
    FOREIGN KEY (ID_Producto) REFERENCES Producto(ID_Producto) ON DELETE CASCADE,
    FOREIGN KEY (ID_Alergeno) REFERENCES Alergeno(ID_Alergeno) ON DELETE CASCADE
);

-- INSERCCIONES 

-- Insertar Usuarios (Jefes con permisos completos)
INSERT INTO Usuario (Nombre, Correo, Contraseña, Tipo) VALUES
('Pedro Luis Linero Gómez', 'pedroluis.linero@restaurante.com', 'pllinero123', 'Jefe'),
('Patricio Mendoza Vargas', 'patricio.mendoza@restaurante.com', 'patricio456', 'Jefe');

-- Insertar Usuarios (Clientes con permisos limitados)
INSERT INTO Usuario (Nombre, Correo, Contraseña, Tipo) VALUES
('Ana María Pérez', 'ana.perez@cliente.com', 'ana123', 'Cliente'),
('Juan Carlos López', 'juan.lopez@cliente.com', 'juan456', 'Cliente'),
('Laura Gómez Ruiz', 'laura.gomez@cliente.com', 'laura789', 'Cliente');

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Chacinas y Mariscos', 1);

-- 2. Insertar Todos los Alérgenos
INSERT INTO Alergeno (Nombre, Imagen) VALUES
('Cereales con gluten', NULL),
('Leche y derivados', NULL),
('Huevos y derivados', NULL),
('Crustáceos', NULL),
('Moluscos y derivados', NULL),
('Pescado y derivados', NULL),
('Frutos de cáscara', NULL),
('Cacahuetes', NULL),
('Soja', NULL),
('Apio y derivados', NULL),
('Granos de sésamo', NULL),
('Mostaza', NULL),
('Altramuces', NULL),
('Dióxido de azufre y sulfitos', NULL);

-- 3. Insertar Productos (incluyendo nuevos)
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Jamón ibérico', NULL, NULL, 1),
('Queso puro de oveja', NULL, NULL, 1),
('Caña de lomo', NULL, NULL, 1),
('Chicharrón de Cádiz', NULL, NULL, 1),
('Jamón y queso', 'Jamón, queso y caña de lomo', NULL, 1),
('Tabla ibérica', NULL, NULL, 1),
('Mojama de atún', NULL, NULL, 1),
('Gambas al ajillo', NULL, NULL, 1),
('Gambas cocidas', NULL, NULL, 1);

-- 4. Insertar Precios
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(1, 'Tapa', 3.25), (1, 'Plato', 11.00),
(2, 'Tapa', 3.25), (2, 'Plato', 8.50),
(3, 'Tapa', 3.25), (3, 'Plato', 8.50),
(4, 'Tapa', 3.25), (4, 'Plato', 8.50),
(5, 'Plato', 13.00),
(6, 'Plato', 16.00),
(7, 'Tapa', 3.25), (7, 'Plato', 8.50),
(8, 'Tapa', 4.50), (8, 'Plato', 10.00),
(9, 'Tapa', 3.75), (9, 'Media', 6.50), (9, 'Plato', 13.00);

-- 5. Insertar Relaciones Producto-Alergeno
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(2, 2),
(5, 2),
(7, 6),
(8, 4),
(9, 4);

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Tapas Frías', 2);

-- 2. Insertar Productos
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Ensaladilla rusa', NULL, NULL, 2),
('Patatas alioli', NULL, NULL, 2),
('Aliño de gambas', NULL, NULL, 2),
('Cóctel de marisco', NULL, NULL, 2),
('Salmorejo', NULL, NULL, 2),
('Aceitunas', NULL, NULL, 2);

-- 3. Insertar Precios
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(10, 'Tapa', 3.25), (10, 'Plato', 6.25),
(11, 'Tapa', 3.25), (11, 'Plato', 6.25),
(12, 'Tapa', 3.25), (12, 'Plato', 6.25),
(13, 'Tapa', 3.50),
(14, 'Plato', 3.00),
(15, 'Plato', 1.50);

-- 4. Insertar Relaciones Producto-Alergeno
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(10, 1), (10, 3), (10, 14),
(11, 3), (11, 14),
(12, 4), (12, 14),
(13, 3), (13, 4), (13, 6), (13, 14),
(14, 1), (14, 3), (14, 14),
(15, 14);

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Montaditos', 3);

-- 2. Insertar Productos
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Montadito de cabeza de lomo y pollo', NULL, NULL, 3),
('Montadito de cabeza de lomo y pollo con jamón', NULL, NULL, 3),
('Montadito de melva y pimiento', NULL, NULL, 3),
('Montadito de gambas al ajillo', NULL, NULL, 3),
('Mini serranito de cabeza de lomo y pollo', NULL, NULL, 3);

-- 3. Insertar Precios
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(16, 'Unidad', 3.25),
(17, 'Unidad', 3.75),
(18, 'Unidad', 3.50),
(19, 'Unidad', 3.50),
(20, 'Unidad', 4.00);

-- 4. Insertar Relaciones Producto-Alergeno
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(16, 1),
(17, 1),
(18, 1), (18, 6),
(19, 1), (19, 3), (19, 4),
(20, 1), (20, 14);

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Guisos Caseros', 4);

-- 2. Insertar Productos
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Menudo', NULL, NULL, 4),
('Carne con tomate', NULL, NULL, 4),
('Carrillada', NULL, NULL, 4);

-- 3. Insertar Precios
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(21, 'Tapa', 3.25), (21, 'Plato', 8.25),
(22, 'Tapa', 3.25), (22, 'Plato', 8.25),
(23, 'Tapa', 3.75), (23, 'Plato', 9.50);

-- 4. Insertar Relaciones Producto-Alergeno
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(21, 1), (21, 14),
(22, 1), (22, 14),
(23, 1), (23, 14);

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Revueltos', 5);

-- 2. Insertar Productos
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Revuelto de gambas', NULL, NULL, 5),
('Revuelto de champiñones', NULL, NULL, 5),
('Revuelto de espárragos', NULL, NULL, 5);

-- 3. Insertar Precios
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(24, 'Plato', 8.25),
(25, 'Plato', 7.25),
(26, 'Plato', 7.25);

-- 4. Insertar Relaciones Producto-Alergeno
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(24, 3), (24, 4), (24, 14),
(25, 3), (25, 14),
(26, 3), (26, 14);

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Pescados', 6);

-- 2. Insertar Productos
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Adobo', NULL, NULL, 6),
('Tiras de calamar frito', NULL, NULL, 6),
('Boquerones adobados', NULL, NULL, 6),
('Tortillita de camarones', NULL, NULL, 6),
('Chipirón a la plancha', NULL, NULL, 6),
('Rosada a la plancha', NULL, NULL, 6),
('Langostinos con bacon', NULL, NULL, 6),
('Pez espada a la plancha', NULL, NULL, 6);

-- 3. Insertar Precios
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(27, 'Tapa', 3.25), (27, 'Plato', 8.25),
(28, 'Tapa', 3.25), (28, 'Plato', 8.50),
(29, 'Tapa', 3.25), (29, 'Plato', 8.25),
(30, 'Tapa', 3.25), (30, 'Plato', 8.25),
(31, 'Tapa', 3.50), (31, 'Plato', 9.00),
(32, 'Tapa', 3.25), (32, 'Plato', 8.25),
(33, 'Tapa', 3.25), (33, 'Plato', 8.25),
(34, 'Tapa', 3.25), (34, 'Plato', 8.25);

-- 4. Insertar Relaciones Producto-Alergeno
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(27, 1), (27, 6), (27, 14),
(28, 1), (28, 6), (28, 14),
(29, 1), (29, 6), (29, 14),
(30, 1), (30, 3), (30, 4), (30, 6), (30, 14),
(31, 5),
(32, 6), (32, 14),
(33, 4), (33, 14),
(34, 6), (34, 14);

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Carnes', 7);

-- 2. Insertar Productos
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Lagrimitas caseras', NULL, NULL, 7),
('Croquetas de puchero', NULL, NULL, 7),
('Pincho de pollo', NULL, NULL, 7),
('Hamburguesa de pollo', NULL, NULL, 7),
('Hamburguesa de ternera', NULL, NULL, 7),
('Pechuga de pollo', NULL, NULL, 7),
('Churrasco de cerdo', NULL, NULL, 7),
('Punta de solomillo al whisky', NULL, NULL, 7),
('Punta de solomillo al jamón', NULL, NULL, 7),
('Punta de solomillo al roquefort', NULL, NULL, 7),
('Punta de solomillo a la pimienta', NULL, NULL, 7),
('Punta de solomillo salsa churrasco', NULL, NULL, 7),
('Punta de solomillo a la almendra', NULL, NULL, 7),
('Lomito (cabeza de lomo) al jamón', NULL, NULL, 7),
('Lomito (cabeza de lomo) a la almendra', NULL, NULL, 7),
('Extra de salsa', NULL, NULL, 7);

-- 3. Insertar Precios
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(35, 'Tapa', 3.25), (35, 'Plato', 8.25),
(36, 'Tapa', 3.25), (36, 'Plato', 8.25),
(37, 'Tapa', 3.50),
(38, 'Plato', 3.50),
(39, 'Plato', 3.50),
(40, 'Plato', 5.25),
(41, 'Plato', 6.25),
(42, 'Plato', 7.25),
(43, 'Plato', 8.50),
(44, 'Plato', 7.25),
(45, 'Plato', 7.25),
(46, 'Plato', 7.25),
(47, 'Plato', 7.25),
(48, 'Tapa', 3.25),
(49, 'Tapa', 3.25),
(50, 'Plato', 0.60);

-- 4. Insertar Relaciones Producto-Alergeno
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(35, 1), (35, 3), (35, 4), (35, 5),
(36, 1), (36, 2), (36, 3), (36, 4), (36, 5), (36, 14),
(37, 14),
(38, 1), (38, 11),
(39, 1), (39, 11),
(40, 14),
(41, 14),
(42, 1), (42, 14),
(43, 14),
(44, 2),
(45, 2),
(46, 14),
(47, 2), (47, 7), (47, 8),
(48, 14),
(49, 2), (49, 7), (49, 8), (49, 14);

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Sugerencias', 8);

-- 2. Insertar Productos
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Mejillones Gigantes', NULL, NULL, 8),
('Churrasquito Boom Bun', NULL, NULL, 8),
('Solomillo a la mostaza', NULL, NULL, 8),
('Pollo frito', NULL, NULL, 8),
('Patatas Boom Bun', NULL, NULL, 8);

-- 3. Insertar Precios
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(51, 'Plato', 12.00),
(52, 'Tapa', 4.50), (52, 'Plato', 9.50),
(53, 'Tapa', 4.00),
(54, 'Tapa', 3.75), (54, 'Plato', 7.50),
(55, 'Plato', 7.00);

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Fines de Semana', 9);

-- 2. Insertar Productos
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Arroz', NULL, NULL, 9);

-- 3. Insertar Precios
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(56, 'Tapa', 4.50);

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Nuestros Vinos', 10);

-- 2. Insertar Productos
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Frizzante', NULL, NULL, 10),
('Barbadillo', NULL, NULL, 10),
('Verdejo', NULL, NULL, 10),
('Solaz Coupage (Tempranillo y Sirah)', NULL, NULL, 10),
('Rioja', NULL, NULL, 10),
('Ribera del Duero', NULL, NULL, 10);

-- 3. Insertar Precios
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(57, 'Copa', 2.25), (57, 'Botella', 9.00),
(58, 'Copa', 2.25), (58, 'Botella', 9.00),
(59, 'Copa', 2.25), (59, 'Botella', 10.00),
(60, 'Copa', 2.50), (60, 'Botella', 12.00),
(61, 'Copa', 2.25), (61, 'Botella', 12.00),
(62, 'Copa', 2.50), (62, 'Botella', 12.00);

-- Insertar Reseñas (con fechas de ejemplo y puntuaciones)
INSERT INTO Reseña (ID_Usuario, ID_Producto, Texto, Puntuacion, Fecha) VALUES
(3, 1, '¡El Jamón ibérico es delicioso! Muy recomendable.', 4.5, '2024-10-01'),
(3, 10, 'La Ensaladilla rusa tiene un sabor fresco y equilibrado.', 4.0, '2024-10-02'),
(4, 15, 'Las Aceitunas son perfectas para picar.', 3.5, '2024-10-03'),
(4, 27, 'El Adobo es crujiente y sabroso, ¡me encanta!', 4.8, '2024-10-04'),
(5, 35, 'Las Lagrimitas caseras son una delicia, ¡volveré por más!', 5.0, '2024-10-05'),
(5, 50, 'La Extra de salsa es el toque perfecto para cualquier plato.', 3.0, '2024-10-06');