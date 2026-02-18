-- ============================================
-- Script para DESABILITAR RLS e permitir acesso total
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- OPÇÃO 1: Desabilitar RLS completamente (Para desenvolvimento)
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainings DISABLE ROW LEVEL SECURITY;

-- ============================================
-- OPÇÃO 2: Habilitar RLS com políticas permissivas (Recomendado)
-- ============================================

-- Limpar políticas existentes
DROP POLICY IF EXISTS "Enable all for authenticated users" ON plans;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON members;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON attendance;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON payments;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON trainings;

-- Habilitar RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir tudo para usuários autenticados
CREATE POLICY "Enable all for authenticated users" ON plans
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON attendance
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON payments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users" ON trainings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Inserir dados iniciais de planos
-- ============================================
INSERT INTO plans (name, description, price, duration_months) VALUES
('Mensal', 'Plano mensal básico', 99.90, 1),
('Trimestral', 'Plano de 3 meses com desconto', 269.70, 3),
('Semestral', 'Plano de 6 meses com desconto', 509.40, 6),
('Anual', 'Plano anual com maior desconto', 959.00, 12)
ON CONFLICT DO NOTHING;
