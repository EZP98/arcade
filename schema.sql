-- Schema per database D1 - ALF Portfolio
-- Database: alf-portfolio-db

-- Tabella per le sezioni/serie (es: "Name series", "Sculture", etc.)
CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella per le opere d'arte
CREATE TABLE IF NOT EXISTS artworks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  section_id INTEGER NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

-- Tabella per i contenuti statici (hero text, descrizioni, etc.)
CREATE TABLE IF NOT EXISTS content_blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  image_url TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_artworks_section ON artworks(section_id);
CREATE INDEX IF NOT EXISTS idx_artworks_order ON artworks(order_index);
CREATE INDEX IF NOT EXISTS idx_sections_order ON sections(order_index);

-- Dati di esempio
INSERT INTO sections (name, slug, description, order_index) VALUES
  ('Name series', 'name-series', 'Le sculture di Adele Lo Feudo nascono dall''incontro tra materia e spirito, dove ogni forma racconta una storia di trasformazione. Attraverso l''argilla e il bronzo, l''artista esplora i confini dell''espressione umana, creando opere che dialogano con l''anima. Ogni scultura è un viaggio nell''inconscio collettivo, un ponte tra il tangibile e l''invisibile.', 1);

INSERT INTO artworks (title, description, image_url, section_id, order_index) VALUES
  ('Opera 1', 'Opere scultoree che esplorano la materia e la forma attraverso l''arte contemporanea', '/opera.png', 1, 1),
  ('Opera 2', 'Opere scultoree che esplorano la materia e la forma attraverso l''arte contemporanea', '/opera.png', 1, 2),
  ('Opera 3', 'Opere scultoree che esplorano la materia e la forma attraverso l''arte contemporanea', '/opera.png', 1, 3),
  ('Opera 4', 'Opere scultoree che esplorano la materia e la forma attraverso l''arte contemporanea', '/opera.png', 1, 4),
  ('Opera 5', 'Opere scultoree che esplorano la materia e la forma attraverso l''arte contemporanea', '/opera.png', 1, 5),
  ('Opera 6', 'Opere scultoree che esplorano la materia e la forma attraverso l''arte contemporanea', '/opera.png', 1, 6);

INSERT INTO content_blocks (key, title, content) VALUES
  ('hero_title', 'Adele Lo Feudo', NULL),
  ('hero_subtitle', NULL, 'L''Artista Italiana che Esplora l''Anima Attraverso la MATERIA'),
  ('hero_image', NULL, 'https://framerusercontent.com/images/8TonweCu2FGoT0Vejhe7bUZe5ys.png'),
  ('description', NULL, 'Adele Lo Feudo, in arte ALF, è una pittrice contemporanea nota per le sue opere materiche e ritratti espressivi. Esplora temi sociali e l''universo femminile con sguardo penetrante, trasformando la tela in territorio di esplorazione dell''anima umana.');
