const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://irjnaybcxoibhvotylfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_nz7oKH8X_T27CWb98hMzHg_unULMp92";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testMemberCreation() {
  console.log('Testando cadastro de membro...\n');

  // 1. Fazer login primeiro
  console.log('1. Fazendo login...');
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: 'rodrigo.h4ss1s@gmail.com',
    password: 'RDG max149'
  });

  if (loginError) {
    console.log('ERRO no login:', loginError.message);
    return;
  }
  console.log('   OK - Login realizado\n');

  // 2. Buscar planos
  console.log('2. Buscando planos...');
  const { data: plans, error: plansError } = await supabase
    .from('plans')
    .select('*');

  if (plansError) {
    console.log('ERRO:', plansError.message);
    return;
  }
  console.log(`   OK - ${plans.length} planos encontrados\n`);

  // 3. Tentar cadastrar um membro de teste
  console.log('3. Cadastrando membro de teste...');
  const memberData = {
    full_name: 'João da Silva',
    cpf_id: '12345678901',
    phone: '11999999999',
    entry_date: new Date().toISOString().split('T')[0],
    plan_id: plans[0].id, // Plano Mensal
    status: true,
    notes: 'Membro de teste'
  };

  const { data: newMember, error: memberError } = await supabase
    .from('members')
    .insert([memberData])
    .select();

  if (memberError) {
    console.log('ERRO ao cadastrar:', memberError.message);
    console.log('Detalhes:', memberError);
    return;
  }

  console.log('   OK - Membro cadastrado!');
  console.log('   ID:', newMember[0].id);
  console.log('   Nome:', newMember[0].full_name);
  console.log('   Plano:', plans[0].name);

  // 4. Verificar se foi salvo
  console.log('\n4. Verificando membros cadastrados...');
  const { data: members, error: checkError } = await supabase
    .from('members')
    .select('*');

  if (checkError) {
    console.log('ERRO:', checkError.message);
    return;
  }

  console.log(`   OK - Total de membros: ${members.length}`);
  members.forEach(m => {
    console.log(`   - ${m.full_name} (${m.cpf_id})`);
  });

  console.log('\n=================================');
  console.log('TESTE CONCLUIDO COM SUCESSO!');
  console.log('=================================');
  console.log('\nAgora voce pode:');
  console.log('1. Acessar http://localhost:8080/members');
  console.log('2. Ver o membro cadastrado');
  console.log('3. Cadastrar mais membros pela interface');
}

testMemberCreation();
