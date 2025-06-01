
-- Creează tabelele pentru aplicația AUTONOM

-- Tabelul pentru clienți
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nume_complet VARCHAR(255) NOT NULL,
  cnp VARCHAR(13) UNIQUE NOT NULL,
  nr_carte_identitate VARCHAR(20) NOT NULL,
  permis_conducere VARCHAR(20) NOT NULL,
  telefon VARCHAR(15) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabelul pentru vehicule
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  marca VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  numar_inmatriculare VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'disponibil' CHECK (status IN ('disponibil', 'inchiriat', 'mentenanta')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabelul pentru rezervări
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  data_inceput DATE NOT NULL,
  data_sfarsit DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'activa' CHECK (status IN ('activa', 'finalizata', 'anulata')),
  observatii TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabelul pentru tranzacții
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  suma DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'neplatit' CHECK (status IN ('platit', 'neplatit')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserează câteva vehicule pentru test
INSERT INTO vehicles (marca, model, numar_inmatriculare, status) VALUES
('BMW', 'X5', 'B123ABC', 'disponibil'),
('Audi', 'A4', 'B456DEF', 'disponibil'),
('Mercedes', 'C-Class', 'B789GHI', 'disponibil'),
('Volkswagen', 'Golf', 'B321CBA', 'disponibil'),
('Toyota', 'Corolla', 'B654FED', 'mentenanta');

-- Configurează Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Creează politici pentru acces public (pentru demo)
CREATE POLICY "Allow all operations on clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all operations on vehicles" ON vehicles FOR ALL USING (true);
CREATE POLICY "Allow all operations on reservations" ON reservations FOR ALL USING (true);
CREATE POLICY "Allow all operations on transactions" ON transactions FOR ALL USING (true);
