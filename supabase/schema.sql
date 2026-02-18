-- Schema SQL para o banco de dados da Academia

-- Tabela de Planos
CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_months INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Membros
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  cpf_id VARCHAR(14) UNIQUE NOT NULL,
  phone VARCHAR(20),
  entry_date DATE NOT NULL,
  plan_id INTEGER REFERENCES plans(id),
  status BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Frequência (Check-ins)
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  check_in_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  next_payment_date DATE,
  status VARCHAR(20) CHECK (status IN ('paid', 'pending', 'overdue')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Treinos
CREATE TABLE IF NOT EXISTS trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(50),
  level VARCHAR(20) CHECK (level IN ('iniciante', 'intermediario', 'avancado')),
  responsible VARCHAR(255),
  members TEXT[], -- Array de IDs dos membros
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_members_cpf ON members(cpf_id);
CREATE INDEX IF NOT EXISTS idx_attendance_member ON attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(check_in_date);
CREATE INDEX IF NOT EXISTS idx_payments_member ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Dados de exemplo para Planos
INSERT INTO plans (name, description, price, duration_months) VALUES
('Mensal', 'Plano mensal básico', 99.90, 1),
('Trimestral', 'Plano de 3 meses com desconto', 269.70, 3),
('Semestral', 'Plano de 6 meses com desconto', 509.40, 6),
('Anual', 'Plano anual com maior desconto', 959.00, 12)
ON CONFLICT DO NOTHING;
