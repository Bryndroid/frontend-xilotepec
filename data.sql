-- =========================
-- CATEGORIES
-- =========================
INSERT INTO Categories (id, name, image_url) VALUES
(1, 'Bebidas Calientes','https://res.cloudinary.com/diogirqun/image/upload/v1778429717/bebidacaliente_olhqqy.jpg'),
(2, 'Bebidas Frías','https://res.cloudinary.com/diogirqun/image/upload/v1778429726/bebidafria_ai7vgo.jpg'),
(3, 'Postres','https://res.cloudinary.com/diogirqun/image/upload/v1778429710/postre_tqnfmh.jpg'),
(4, 'Snacks','https://res.cloudinary.com/diogirqun/image/upload/v1778429860/croa_phpx7u.jpg');

-- =========================
-- PAYMENT METHODS
-- =========================
INSERT INTO payment_methods (id, name) VALUES
(1, 'Efectivo'),
(2, 'Tarjeta'),
(3, 'Pago móvil');

-- =========================
-- USERS
-- =========================
INSERT INTO users (id, name, email, password, role, created_at, updated_at) VALUES
(1, 'Carlos Méndez', 'carlos@cafe.com', '123456', 'cliente', NOW(), NOW()),
(2, 'Ana Rivera', 'ana@cafe.com', '123456', 'cliente', NOW(), NOW()),
(3, 'Admin Cafe', 'admin@cafe.com', 'admin123', 'admin', NOW(), NOW());

-- =========================
-- PRODUCTS (CAFETERÍA)
-- =========================
INSERT INTO Products (id, name, description, price, category_id, url_image, max_quantity, is_active) VALUES
(1, 'Café Americano', 'Café negro tradicional', 1.50, 1, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778431669/zbi2luvs2oxyp6ev7wuw.png', 100, TRUE),
(2, 'Cappuccino', 'Café con leche espumosa', 2.75, 1, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778439264/bcgwfkbfpo1qmde689fl.png', 80, TRUE),
(3, 'Latte', 'Café con leche caliente', 3.00, 1, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778439417/nhqgx1qytax1g6kp3oxl.png', 80, TRUE),
(4, 'Frappé Mocha', 'Bebida fría con chocolate', 3.50, 2, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778440710/bekvowj4wsvbdcz08nrd.png', 60, TRUE),
(5, 'Té Helado', 'Té frío con limón', 2.00, 2, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778440486/ju4ryxicyrdbo8izctzc.png', 70, TRUE),
(6, 'Cheesecake', 'Pastel de queso', 3.25, 3, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778440501/twnzmlihmf8u0yjhbtr5.png', 40, TRUE),
(7, 'Brownie', 'Pastel de chocolate', 2.50, 3, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778440611/u8awnbnm5x2gtd0u95gb.jpg', 50, TRUE),
(8, 'Croissant', 'Pan francés', 2.20, 4, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778440516/pues3uienoyroc6l90xn.jpg', 60, TRUE);

-- =========================
-- PROMOTIONS
-- =========================
INSERT INTO promotions (id, name, image_url, is_active, start_date, end_date, type, value) VALUES
(1, 'Promo Desayuno', 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778439678/cbemgizwf8yztjpre7ku.png', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'combo_fijo', 1.00),
(2, 'Descuento Café', 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778439622/pateaqhqdzfnbkjlxgis.png', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 'porcentaje', 15),
(3, 'Promo Postres', 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778439659/epx1tbtbfc259928surm.png', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 20 DAY), 'porcentaje', 45);

-- =========================
-- PROMOTION_PRODUCT
-- =========================
INSERT INTO Promotion_Product (id, promotion_id, product_id) VALUES
(1, 1, 1), -- Americano
(2, 1, 8), -- Croissant
(3, 2, 2), -- Cappuccino
(4, 3, 6); -- Cheesecake

-- =========================
-- ORDERS
-- =========================
INSERT INTO Orders (id, user_id, date, total, status, payment_method_id) VALUES
(1, 1, NOW(), 8.25, 'completado', 1),
(2, 2, NOW(), 11.00, 'pendiente', 2);

-- =========================
-- ORDER DETAILS
-- =========================
INSERT INTO order_details (id, order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES
-- ORDEN 1 (Carlos)
(1, 1, 1, 'Café Americano', 1.50, 2, 3.00),
(2, 1, 8, 'Croissant', 2.20, 1, 2.20),
(3, 1, 7, 'Brownie', 2.50, 1, 2.50),
(4, 1, 2, 'Cappuccino', 2.75, 0.2, 0.55), -- ejemplo pequeño ajuste/promoción

-- ORDEN 2 (Ana)
(5, 2, 4, 'Frappé Mocha', 3.50, 2, 7.00),
(6, 2, 6, 'Cheesecake', 3.25, 1, 3.25),
(7, 2, 5, 'Té Helado', 2.00, 1, 2.00);







-- =========================
-- DESACTIVAR REVISIÓN DE FORÁNEAS TEMPORALMENTE
-- =========================
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- CATEGORIES
-- =========================
INSERT IGNORE INTO categories (id, name, url_image) VALUES
(1, 'Bebidas Calientes','https://res.cloudinary.com/diogirqun/image/upload/v1778429717/bebidacaliente_olhqqy.jpg'),
(2, 'Bebidas Frías','https://res.cloudinary.com/diogirqun/image/upload/v1778429726/bebidafria_ai7vgo.jpg'),
(3, 'Postres','https://res.cloudinary.com/diogirqun/image/upload/v1778429710/postre_tqnfmh.jpg'),
(4, 'Snacks','https://res.cloudinary.com/diogirqun/image/upload/v1778429860/croa_phpx7u.jpg');

-- =========================
-- PAYMENT METHODS
-- =========================
INSERT IGNORE INTO payment_methods (id, name) VALUES
(1, 'Efectivo'),
(2, 'Tarjeta'),
(3, 'Pago móvil');

-- =========================
-- USERS
-- =========================
INSERT IGNORE INTO users (id, name, email, password, role, created_at, updated_at) VALUES
(1, 'Carlos Méndez', 'carlos@cafe.com', '123456', 'cliente', NOW(), NOW()),
(2, 'Ana Rivera', 'ana@cafe.com', '123456', 'cliente', NOW(), NOW()),
(3, 'Admin Cafe', 'admin@cafe.com', 'admin123', 'admin', NOW(), NOW());

-- =========================
-- PRODUCTS (CAFETERÍA)
-- =========================
INSERT IGNORE INTO products (id, name, description, price, category_id, url_image, max_quantity, is_active) VALUES
(1, 'Café Americano', 'Café negro tradicional', 1.50, 1, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778431669/zbi2luvs2oxyp6ev7wuw.png', 100, TRUE),
(2, 'Cappuccino', 'Café con leche espumosa', 2.75, 1, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778439264/bcgwfkbfpo1qmde689fl.png', 80, TRUE),
(3, 'Latte', 'Café con leche caliente', 3.00, 1, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778439417/nhqgx1qytax1g6kp3oxl.png', 80, TRUE),
(4, 'Frappé Mocha', 'Bebida fría con chocolate', 3.50, 2, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778440710/bekvowj4wsvbdcz08nrd.png', 60, TRUE),
(5, 'Té Helado', 'Té frío con limón', 2.00, 2, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778440486/ju4ryxicyrdbo8izctzc.png', 70, TRUE),
(6, 'Cheesecake', 'Pastel de queso', 3.25, 3, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778440501/twnzmlihmf8u0yjhbtr5.png', 40, TRUE),
(7, 'Brownie', 'Pastel de chocolate', 2.50, 3, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778440611/u8awnbnm5x2gtd0u95gb.jpg', 50, TRUE),
(8, 'Croissant', 'Pan francés', 2.20, 4, 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778440516/pues3uienoyroc6l90xn.jpg', 60, TRUE);

-- =========================
-- PROMOTIONS
-- =========================
INSERT IGNORE INTO promotions (id, name, image_url, is_active, start_date, end_date, type, value) VALUES
(1, 'Promo Desayuno', 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778439678/cbemgizwf8yztjpre7ku.png', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'combo_fijo', 1.00),
(2, 'Descuento Café', 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778439622/pateaqhqdzfnbkjlxgis.png', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 'porcentaje', 15),
(3, 'Promo Postres', 'https://res.cloudinary.com/dh81vvqax/image/upload/v1778439659/epx1tbtbfc259928surm.png', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 20 DAY), 'porcentaje', 45);

-- =========================
-- PROMOTION_PRODUCT
-- =========================
INSERT IGNORE INTO promotion_product (id, promotion_id, product_id) VALUES
(1, 1, 1), -- Americano
(2, 1, 8), -- Croissant
(3, 2, 2), -- Cappuccino
(4, 3, 6); -- Cheesecake

-- =========================
-- ORDERS
-- =========================
INSERT IGNORE INTO orders (id, user_id, date, total, status, payment_method_id) VALUES
(1, 1, NOW(), 8.25, 'completado', 1),
(2, 2, NOW(), 11.00, 'pendiente', 2);

-- =========================
-- ORDER DETAILS
-- =========================
INSERT IGNORE INTO order_details (id, order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES
-- ORDEN 1 (Carlos)
(1, 1, 1, 'Café Americano', 1.50, 2, 3.00),
(2, 1, 8, 'Croissant', 2.20, 1, 2.20),
(3, 1, 7, 'Brownie', 2.50, 1, 2.50),
(4, 1, 2, 'Cappuccino', 2.75, 0.2, 0.55), 

-- ORDEN 2 (Ana)
(5, 2, 4, 'Frappé Mocha', 3.50, 2, 7.00),
(6, 2, 6, 'Cheesecake', 3.25, 1, 3.25),
(7, 2, 5, 'Té Helado', 2.00, 1, 2.00);

-- =========================
-- REACTIVAR REVISIÓN DE FORÁNEAS
-- =========================
SET FOREIGN_KEY_CHECKS = 1;