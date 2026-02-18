const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://irjnaybcxoibhvotylfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_nz7oKH8X_T27CWb98hMzHg_unULMp92";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function setupInitialData() {
  console.log('Configurando dados iniciais...\n');

  // 1. Verificar e criar planos
  console.log('1. Verificando planos...');
  const { data: existingPlans, error: plansCheckError } = await supabase
    .from('plans')
    .select('*');

  if (plansCheckError) {
    console.log('Erro ao verificar planos:', plansCheckError.message);
    return;
  }

  if (!existingPlans || existingPlans.length === 0) {
    console.log('   Criando planos...');
    const { data, error } = await supabase
      .from('plans')
      .insert([
        { name: 'Mensal', description: 'Plano mensal básico', price: 99.90, duration_months: 1 },
        { name: 'Trimestral', description: 'Plano de 3 meses com desconto', price: 269.70, duration_months: 3 },
        { name: 'Semestral', description: 'Plano de 6 meses com desconto', price: 509.40, duration_months: 6 },
        { name: 'Anual', description: 'Plano anual com maior desconto', price: 959.00, duration_months: 12 }
      ])
      .select();

    if (error) {
      console.log('   ERRO ao criar planos:', error.message);
    } else {
      console.log('   OK - Planos criados:', data.length);
    }
  } else {
    console.log('   OK - Planos ja existem:', existingPlans.length);
  }

  // 2. Verificar membros
  console.log('\n2. Verificando membros...');
  const { count: membersCount } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true });

  console.log('   Total de membros:', membersCount || 0);

  // 3. Verificar frequência
  console.log('\n3. Verificando frequencia...');
  const { count: attendanceCount } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true });

  console.log('   Total de check-ins:', attendanceCount || 0);

  // 4. Verificar pagamentos
  console.log('\n4. Verificando pagamentos...');
  const { count: paymentsCount } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true });

  console.log('   Total de pagamentos:', paymentsCount || 0);

  // 5. Verificar treinos
  console.log('\n5. Verificando treinos...');
  const { count: trainingsCount } = await supabase
    .from('trainings')
    .select('*', { count: 'exact', head: true });

  console.log('   Total de treinos:', trainingsCount || 0);

  console.log('\n=================================');
  console.log('Configuracao concluida!');
  console.log('=================================\n');
  console.log('Agora voce pode:');
  console.log('1. Acessar http://localhost:8080/members/new');
  console.log('2. Cadastrar um novo membro');
  console.log('3. Os planos ja estao disponiveis!');
}

setupInitialData();
