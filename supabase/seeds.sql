-- ============================================================
-- Atlas&You — Datos de ejemplo para desarrollo
-- ============================================================

-- Categorías
INSERT INTO categories (name, slug, description, position, active) VALUES
  ('Pendientes', 'pendientes', 'Pendientes artesanales únicos hechos con arcilla polimérica y resina', 1, TRUE),
  ('Colgantes', 'colgantes', 'Colgantes y collares artesanales irrepetibles', 2, TRUE),
  ('Pulseras', 'pulseras', 'Pulseras artesanales hechas a mano', 3, TRUE),
  ('Anillos', 'anillos', 'Anillos artesanales de arcilla polimérica', 4, TRUE);

-- Productos de ejemplo
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, stock, weight_grams, images, tags, active, featured)
VALUES
  (
    'Pendientes Floral Rosa Pastel',
    'pendientes-floral-rosa-pastel',
    'Pendientes únicos elaborados a mano con arcilla polimérica en tonos rosa pastel. Diseño floral delicado, ligeros y cómodos para el uso diario. Cada par es completamente irrepetible.',
    18.00, 22.00,
    (SELECT id FROM categories WHERE slug = 'pendientes'),
    5, 20,
    ARRAY['https://via.placeholder.com/600x600/f9a8d4/fff?text=Floral+Rosa'],
    ARRAY['arcilla', 'pendientes', 'floral', 'rosa', 'pastel'],
    TRUE, TRUE
  ),
  (
    'Pendientes Lunares Terracota',
    'pendientes-lunares-terracota',
    'Pendientes redondos con diseño de lunares en tonos terracota y crema. Perfectos para otoño-invierno. Hechos con arcilla polimérica y acabado mate.',
    16.00, NULL,
    (SELECT id FROM categories WHERE slug = 'pendientes'),
    8, 18,
    ARRAY['https://via.placeholder.com/600x600/c2714f/fff?text=Lunares+Terracota'],
    ARRAY['arcilla', 'pendientes', 'terracota', 'lunares'],
    TRUE, TRUE
  ),
  (
    'Colgante Hoja Verde',
    'colgante-hoja-verde',
    'Colgante artesanal con forma de hoja en tonos verdes. Fabricado con resina y arcilla polimérica. Cadena dorada de 45cm incluida.',
    24.00, NULL,
    (SELECT id FROM categories WHERE slug = 'colgantes'),
    3, 15,
    ARRAY['https://via.placeholder.com/600x600/4ade80/fff?text=Hoja+Verde'],
    ARRAY['resina', 'colgante', 'verde', 'hoja', 'naturaleza'],
    TRUE, TRUE
  ),
  (
    'Pulsera Mármol Azul',
    'pulsera-marmol-azul',
    'Pulsera artesanal con efecto mármol en tonos azul y blanco. Hecha con arcilla polimérica. Talla ajustable.',
    14.00, NULL,
    (SELECT id FROM categories WHERE slug = 'pulseras'),
    6, 25,
    ARRAY['https://via.placeholder.com/600x600/60a5fa/fff?text=Marmol+Azul'],
    ARRAY['arcilla', 'pulsera', 'marmol', 'azul'],
    TRUE, FALSE
  ),
  (
    'Pendientes Geométricos Negros',
    'pendientes-geometricos-negros',
    'Pendientes de diseño geométrico en negro y oro. Minimalistas y elegantes. Arcilla polimérica con detalles dorados a mano.',
    22.00, 28.00,
    (SELECT id FROM categories WHERE slug = 'pendientes'),
    4, 20,
    ARRAY['https://via.placeholder.com/600x600/1c1917/fff?text=Geometricos+Negros'],
    ARRAY['arcilla', 'pendientes', 'geometrico', 'negro', 'dorado', 'elegante'],
    TRUE, TRUE
  ),
  (
    'Colgante Galaxia Resina',
    'colgante-galaxia-resina',
    'Colgante hecho con resina epoxy con efecto galaxia. Purpurinas y pigmentos de alta calidad. Pieza única irrepetible. Cadena plateada 42cm.',
    32.00, NULL,
    (SELECT id FROM categories WHERE slug = 'colgantes'),
    2, 20,
    ARRAY['https://via.placeholder.com/600x600/7c3aed/fff?text=Galaxia+Resina'],
    ARRAY['resina', 'colgante', 'galaxia', 'espacio', 'unico'],
    TRUE, TRUE
  ),
  (
    'Pendientes Lavanda Seco',
    'pendientes-lavanda-seco',
    'Pendientes con lavanda natural real preservada en resina transparente. Cada par captura la belleza de la naturaleza para siempre.',
    26.00, NULL,
    (SELECT id FROM categories WHERE slug = 'pendientes'),
    0, 15,
    ARRAY['https://via.placeholder.com/600x600/c084fc/fff?text=Lavanda+Resina'],
    ARRAY['resina', 'pendientes', 'lavanda', 'botanico', 'natural'],
    TRUE, FALSE
  ),
  (
    'Pulsera Set Verano',
    'pulsera-set-verano',
    'Set de 3 pulseras coordinadas en tonos verano: coral, amarillo y turquesa. Hechas con arcilla polimérica. Perfectas para regalo.',
    28.00, 35.00,
    (SELECT id FROM categories WHERE slug = 'pulseras'),
    10, 45,
    ARRAY['https://via.placeholder.com/600x600/fb923c/fff?text=Set+Verano'],
    ARRAY['arcilla', 'pulsera', 'set', 'verano', 'regalo', 'coral'],
    TRUE, TRUE
  );

-- Zona de envío: España
INSERT INTO shipping_zones (name, countries) VALUES
  ('España', ARRAY['ES', 'AD', 'GI']),
  ('Europa', ARRAY['PT', 'FR', 'DE', 'IT', 'BE', 'NL', 'AT', 'CH', 'LU', 'DK', 'SE', 'NO', 'FI', 'IE', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'LT', 'LV', 'EE', 'GR', 'CY', 'MT']);

-- Tarifas de envío: España
INSERT INTO shipping_rates (zone_id, carrier, name, rate, free_from_amount, estimated_days)
VALUES
  (
    (SELECT id FROM shipping_zones WHERE name = 'España'),
    'Correos', 'Estándar', 3.50, 50.00, '3-5 días hábiles'
  ),
  (
    (SELECT id FROM shipping_zones WHERE name = 'España'),
    'MRW', 'Express 24h', 6.90, NULL, '1 día hábil'
  );

-- Tarifas de envío: Europa
INSERT INTO shipping_rates (zone_id, carrier, name, rate, free_from_amount, estimated_days)
VALUES
  (
    (SELECT id FROM shipping_zones WHERE name = 'Europa'),
    'Correos', 'Internacional Estándar', 8.50, 80.00, '7-15 días hábiles'
  ),
  (
    (SELECT id FROM shipping_zones WHERE name = 'Europa'),
    'DHL', 'Express Internacional', 18.00, NULL, '3-5 días hábiles'
  );

-- IVA España
INSERT INTO tax_rates (name, country, rate_percentage, is_default) VALUES
  ('IVA España (21%)', 'ES', 21.00, TRUE);

-- Código de descuento de bienvenida
INSERT INTO discount_codes (code, type, value, min_order_amount, active) VALUES
  ('BIENVENIDA10', 'percentage', 10, 0, TRUE),
  ('ENVIOGRATIS', 'free_shipping', 0, 30, TRUE);

-- Configuración inicial
INSERT INTO settings (key, value) VALUES
  ('store_name', 'Atlas&You'),
  ('store_email', 'hola@atlasandyou.es'),
  ('store_description', 'Joyería artesanal única hecha con arcilla polimérica y resina. Pendientes, colgantes y pulseras irrepetibles.'),
  ('free_shipping_threshold', '50'),
  ('low_stock_threshold', '3'),
  ('currency', 'EUR'),
  ('instagram', '@atlasandyou');
