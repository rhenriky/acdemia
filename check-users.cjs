const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://irjnaybcxoibhvotylfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_nz7oKH8X_T27CWb98hMzHg_unULMp92";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🔍 Verificando usuários cadastrados...\n');

async function checkUsers() {
  try {
    // Listar todos os usuários (requer permissões de admin, mas vamos tentar)
    console.log('📋 Verificando usuários na autenticação...');
    
    // Como não temos acesso admin, vamos verificar apenas as tabelas
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('*');
    
    if (membersError) {
      console.log('❌ Erro ao buscar membros:', membersError.message);
    } else {
      console.log(`\n✅ Membros cadastrados: ${members.length}`);
      if (members.length > 0) {
        console.log('\n📋 Lista de membros:');
        members.forEach(m => {
          console.log(`   - ${m.full_name} (CPF: ${m.cpf_id})`);
        });
      }
    }
    
    // Verificar planos
    const { data: plans, error: plansError } = await supabase
      .from('plans')
      .select('*');
    
    if (!plansError) {
      console.log(`\n📦 Planos cadastrados: ${plans.length}`);
      if (plans.length > 0) {
        console.log('\n💰 Planos disponíveis:');
        plans.forEach(p => {
          console.log(`   - ${p.name}: R$ ${p.price} (${p.duration_months} meses)`);
        });
      }
    }
    
    // Verificar sessão atual
    console.log('\n🔐 Status de autenticação:');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('✅ Usuário logado:', session.user.email);
    } else {
      console.log('❌ Nenhum usuário logado no momento');
      console.log('\n💡 Para criar um login:');
      console.log('   1. Acesse: http://localhost:8080/signup');
      console.log('   2. Cadastre um novo usuário');
      console.log('   3. Use o email e senha para fazer login');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkUsers();
