-- Execute este SQL DIRETAMENTE no Supabase SQL Editor
-- Isso vai inserir os planos forçadamente, ignorando qualquer RLS

-- Primeiro, garanta que o RLS está desabilitado
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;

-- Limpar planos existentes (se houver)
DELETE FROM plans;

-- Inserir planos
INSERT INTO plans (id, name, description, price, duration_months) VALUES
(1, 'Mensal', 'Plano mensal básico', 99.90, 1),
(2, 'Trimestral', 'Plano de 3 meses com desconto', 269.70, 3),
(3, 'Semestral', 'Plano de 6 meses com desconto', 509.40, 6),
(4, 'Anual', 'Plano anual com maior desconto', 959.00, 12);

-- Verificar se foi inserido
SELECT * FROM plans;
