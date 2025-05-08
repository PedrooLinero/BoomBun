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

-- Tabla Reseña
CREATE TABLE Reseña (
    ID_Reseña INT AUTO_INCREMENT PRIMARY KEY,
    ID_Usuario INT NOT NULL,
    ID_Producto INT NOT NULL,
    Texto TEXT,
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

-- 2. Insertar Todos los Alérgenos (sin cambios)
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
('Jamón ibérico', NULL, NULL, 1),           -- Nuevo orden (primero)
('Queso puro de oveja', NULL, NULL, 1),
('Caña de lomo', NULL, NULL, 1),
('Chicharrón de Cádiz', NULL, NULL, 1),
('Jamón y queso', 'Jamón, queso y caña de lomo', NULL, 1),
('Tabla ibérica', NULL, NULL, 1),            -- Nuevo
('Mojama de atún', NULL, NULL, 1),           -- Nuevo
('Gambas al ajillo', NULL, NULL, 1),
('Gambas cocidas', NULL, NULL, 1);

-- 4. Insertar Precios (actualizados)
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(1, 'Tapa', 3.25), (1, 'Plato', 11.00),     -- Jamón ibérico
(2, 'Tapa', 3.25), (2, 'Plato', 8.50),      -- Queso puro de oveja
(3, 'Tapa', 3.25), (3, 'Plato', 8.50),      -- Caña de lomo
(4, 'Tapa', 3.25), (4, 'Plato', 8.50),      -- Chicharrón de Cádiz
(5, 'Plato', 13.00),                         -- Jamón y queso
(6, 'Plato', 16.00),                         -- Tabla ibérica
(7, 'Tapa', 3.25), (7, 'Plato', 8.50),      -- Mojama de atún
(8, 'Tapa', 4.50), (8, 'Plato', 10.00),     -- Gambas al ajillo
(9, 'Tapa', 3.75), (9, 'Media', 6.50), (9, 'Plato', 13.00); -- Gambas cocidas

-- 5. Insertar Relaciones Producto-Alergeno (actualizados)
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(2, 2), -- Queso puro de oveja: Leche y derivados (ID_Alergeno: 2)
(5, 2), -- Jamón y queso: Leche y derivados (ID_Alergeno: 2)
(7, 6), -- Mojama de atún: Pescado (ID_Alergeno: 6)
(8, 4), -- Gambas al ajillo: Crustáceos (ID_Alergeno: 4)
(9, 4); -- Gambas cocidas: Crustáceos (ID_Alergeno: 4)

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

-- 3. Insertar Precios (Ajustado: Cóctel de marisco sin Plato)
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(10, 'Tapa', 3.25), (10, 'Plato', 6.25),    -- Ensaladilla rusa
(11, 'Tapa', 3.25), (11, 'Plato', 6.25),    -- Patatas alioli
(12, 'Tapa', 3.25), (12, 'Plato', 6.25),    -- Aliño de gambas
(13, 'Tapa', 3.50),                          -- Cóctel de marisco (sin Plato)
(14, 'Plato', 3.00),                         -- Salmorejo
(15, 'Plato', 1.50);                         -- Aceitunas

-- 4. Insertar Relaciones Producto-Alergeno (Ajustado)
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(10, 1), (10, 3), (10, 14), -- Ensaladilla rusa: Cereales con gluten (1), Huevos (3), Sulfitos (14)
(11, 3), (11, 14), -- Patatas alioli: Huevos (3), Sulfitos (14)
(12, 4), (12, 14), -- Aliño de gambas: Crustáceos (4), Sulfitos (14)
(13, 3), (13, 4), (13, 6), (13, 14), -- Cóctel de marisco: Huevos (3), Crustáceos (4), Pescado (6), Sulfitos (14)
(14, 1), (14, 3), (14, 14), -- Salmorejo: Cereales con gluten (1), Huevos (3), Sulfitos (14)
(15, 14); -- Aceitunas: Sulfitos (14)

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

-- 3. Insertar Precios (Formato cambiado a Unidad, Mini serranito ajustado)
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(16, 'Unidad', 3.25),    -- Montadito de cabeza de lomo y pollo
(17, 'Unidad', 3.75),    -- Montadito de cabeza de lomo y pollo con jamón
(18, 'Unidad', 3.50),    -- Montadito de melva y pimiento
(19, 'Unidad', 3.50),    -- Montadito de gambas al ajillo
(20, 'Unidad', 4.00);    -- Mini serranito de cabeza de lomo y pollo (ajustado a 4.00€)

-- 4. Insertar Relaciones Producto-Alergeno (Ajustado)
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(16, 1), -- Montadito de cabeza de lomo y pollo: Cereales con gluten (ID_Alergeno: 1)
(17, 1), -- Montadito de cabeza de lomo y pollo con jamón: Cereales con gluten (ID_Alergeno: 1)
(18, 1), (18, 6), -- Montadito de melva y pimiento: Cereales con gluten (1), Pescado (6)
(19, 1), (19, 3), (19, 4), -- Montadito de gambas al ajillo: Cereales con gluten (1), Huevos (3), Crustáceos (4)
(20, 1), (20, 14); -- Mini serranito de cabeza de lomo y pollo: Cereales con gluten (1), Sulfitos (14)

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Guisos Caseros', 4);

-- 2. Insertar Productos (Eliminado Arroz)
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Menudo', NULL, NULL, 4),
('Carne con tomate', NULL, NULL, 4),
('Carrillada', NULL, NULL, 4);

-- 3. Insertar Precios (Eliminado Arroz)
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(21, 'Tapa', 3.25), (21, 'Plato', 8.25),    -- Menudo
(22, 'Tapa', 3.25), (22, 'Plato', 8.25),    -- Carne con tomate
(23, 'Tapa', 3.75), (23, 'Plato', 9.50);    -- Carrillada

-- 4. Insertar Relaciones Producto-Alergeno (Sin cambios, Arroz no tenía alérgenos)
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(21, 1), (21, 14), -- Menudo: Cereales con gluten (ID_Alergeno: 1), Sulfitos (ID_Alergeno: 14)
(22, 1), (22, 14), -- Carne con tomate: Cereales con gluten (ID_Alergeno: 1), Sulfitos (ID_Alergeno: 14)
(23, 1), (23, 14); -- Carrillada: Cereales con gluten (ID_Alergeno: 1), Sulfitos (ID_Alergeno: 14)

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
(24, 'Plato', 8.25),    -- Revuelto de gambas
(25, 'Plato', 7.25),    -- Revuelto de champiñones
(26, 'Plato', 7.25);    -- Revuelto de espárragos

-- 4. Insertar Relaciones Producto-Alergeno (Ajustado)
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(24, 3), (24, 4), (24, 14), -- Revuelto de gambas: Huevos (3), Crustáceos (4), Sulfitos (14)
(25, 3), (25, 14), -- Revuelto de champiñones: Huevos (3), Sulfitos (14)
(26, 3), (26, 14); -- Revuelto de espárragos: Huevos (3), Sulfitos (14)

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
(27, 'Tapa', 3.25), (27, 'Plato', 8.25),    -- Adobo
(28, 'Tapa', 3.25), (28, 'Plato', 8.50),    -- Tiras de calamar frito
(29, 'Tapa', 3.25), (29, 'Plato', 8.25),    -- Boquerones adobados
(30, 'Tapa', 3.25), (30, 'Plato', 8.25),    -- Tortillita de camarones
(31, 'Tapa', 3.50), (31, 'Plato', 9.00),    -- Chipirón a la plancha
(32, 'Tapa', 3.25), (32, 'Plato', 8.25),    -- Rosada a la plancha
(33, 'Tapa', 3.25), (33, 'Plato', 8.25),    -- Langostinos con bacon
(34, 'Tapa', 3.25), (34, 'Plato', 8.25);    -- Pez espada a la plancha

-- 4. Insertar Relaciones Producto-Alergeno (Ajustado según especificación)
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(27, 1), (27, 6), (27, 14), -- Adobo: Cereales con gluten (1), Pescado (6), Sulfitos (14)
(28, 1), (28, 6), (28, 14), -- Tiras de calamar frito: Cereales con gluten (1), Pescado (6), Sulfitos (14)
(29, 1), (29, 6), (29, 14), -- Boquerones adobados: Cereales con gluten (1), Pescado (6), Sulfitos (14)
(30, 1), (30, 3), (30, 4), (30, 6), (30, 14), -- Tortillita de camarones: Cereales con gluten (1), Huevos (3), Crustáceos (4), Pescado (6), Sulfitos (14)
(31, 5), -- Chipirón a la plancha: Moluscos (5)
(32, 6), (32, 14), -- Rosada a la plancha: Pescado (6), Sulfitos (14)
(33, 4), (33, 14), -- Langostinos con bacon: Crustáceos (4), Sulfitos (14)
(34, 6), (34, 14); -- Pez espada a la plancha: Pescado (6), Sulfitos (14)

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
(35, 'Tapa', 3.25), (35, 'Plato', 8.25),    -- Lagrimitas caseras
(36, 'Tapa', 3.25), (36, 'Plato', 8.25),    -- Croquetas de puchero
(37, 'Tapa', 3.50),                          -- Pincho de pollo
(38, 'Plato', 3.50),                         -- Hamburguesa de pollo
(39, 'Plato', 3.50),                         -- Hamburguesa de ternera
(40, 'Plato', 5.25),                         -- Pechuga de pollo
(41, 'Plato', 6.25),                         -- Churrasco de cerdo
(42, 'Plato', 7.25),                         -- Punta de solomillo al whisky
(43, 'Plato', 8.50),                         -- Punta de solomillo al jamón
(44, 'Plato', 7.25),                         -- Punta de solomillo al roquefort
(45, 'Plato', 7.25),                         -- Punta de solomillo a la pimienta
(46, 'Plato', 7.25),                         -- Punta de solomillo salsa churrasco
(47, 'Plato', 7.25),                         -- Punta de solomillo a la almendra
(48, 'Tapa', 3.25),                          -- Lomito (cabeza de lomo) al jamón
(49, 'Tapa', 3.25),                          -- Lomito (cabeza de lomo) a la almendra
(50, 'Plato', 0.60);                         -- Extra de salsa

-- 4. Insertar Relaciones Producto-Alergeno
INSERT INTO Producto_Alergeno (ID_Producto, ID_Alergeno) VALUES
(35, 1), (35, 3), (35, 4), (35, 5), -- Lagrimitas caseras: Cereales con gluten (1), Huevos (3), Crustáceos (4), Moluscos (5)
(36, 1), (36, 2), (36, 3), (36, 4), (36, 5), (36, 14), -- Croquetas de puchero: Cereales con gluten (1), Leche (2), Huevos (3), Crustáceos (4), Moluscos (5), Sulfitos (14)
(37, 14), -- Pincho de pollo: Sulfitos (14)
(38, 1), (38, 11), -- Hamburguesa de pollo: Cereales con gluten (1), Granos de sésamo (11)
(39, 1), (39, 11), -- Hamburguesa de ternera: Cereales con gluten (1), Granos de sésamo (11)
(40, 14), -- Pechuga de pollo: Sulfitos (14)
(41, 14), -- Churrasco de cerdo: Sulfitos (14)
(42, 1), (42, 14), -- Punta de solomillo al whisky: Cereales con gluten (1), Sulfitos (14)
(43, 14), -- Punta de solomillo al jamón: Sulfitos (14)
(44, 2), -- Punta de solomillo al roquefort: Leche (2)
(45, 2), -- Punta de solomillo a la pimienta: Leche (2)
(46, 14), -- Punta de solomillo salsa churrasco: Sulfitos (14)
(47, 2), (47, 7), (47, 8), -- Punta de solomillo a la almendra: Leche (2), Frutos secos (7), Cacahuetes (8)
(48, 14), -- Lomito (cabeza de lomo) al jamón: Sulfitos (14)
(49, 2), (49, 7), (49, 8), (49, 14); -- Lomito (cabeza de lomo) a la almendra: Leche (2), Frutos secos (7), Cacahuetes (8), Sulfitos (14)

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
(51, 'Plato', 12.00),                       -- Mejillones Gigantes
(52, 'Tapa', 4.50), (52, 'Plato', 9.50),    -- Churrasquito Boom Bun
(53, 'Tapa', 4.00),                         -- Solomillo a la mostaza
(54, 'Tapa', 3.75), (54, 'Plato', 7.50),    -- Pollo frito
(55, 'Plato', 7.00);                        -- Patatas Boom Bun

-- 1. Insertar Categoría
INSERT INTO Categoria (Nombre, Orden) VALUES
('Fines de Semana', 9);

-- 2. Insertar Productos
INSERT INTO Producto (Nombre, Descripcion, Foto, ID_Categoria) VALUES
('Arroz', NULL, NULL, 9);

-- 3. Insertar Precios (Sin precio, como indicado)
INSERT INTO Precio_Producto (ID_Producto, Formato, Precio) VALUES
(56, 'Tapa', 4.50);  -- Arroz

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
(57, 'Copa', 2.25), (57, 'Botella', 9.00),  -- Frizzante
(58, 'Copa', 2.25), (58, 'Botella', 9.00),  -- Barbadillo
(59, 'Copa', 2.25), (59, 'Botella', 10.00), -- Verdejo
(60, 'Copa', 2.50), (60, 'Botella', 12.00), -- Solaz Coupage (Tempranillo y Sirah)
(61, 'Copa', 2.25), (61, 'Botella', 12.00), -- Rioja
(62, 'Copa', 2.50), (62, 'Botella', 12.00); -- Ribera del Duero

-- Insertar Reseñas (con fechas de ejemplo)
INSERT INTO Reseña (ID_Usuario, ID_Producto, Texto, Fecha) VALUES
(3, 1, '¡El Jamón ibérico es delicioso! Muy recomendable.', '2024-10-01'),
(3, 10, 'La Ensaladilla rusa tiene un sabor fresco y equilibrado.', '2024-10-02'),
(4, 15, 'Las Aceitunas son perfectas para picar.', '2024-10-03'),
(4, 27, 'El Adobo es crujiente y sabroso, ¡me encanta!', '2024-10-04'),
(5, 35, 'Las Lagrimitas caseras son una delicia, ¡volveré por más!', '2024-10-05'),
(5, 50, 'La Extra de salsa es el toque perfecto para cualquier plato.', '2024-10-06');