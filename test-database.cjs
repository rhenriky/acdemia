const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://irjnaybcxoibhvotylfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_nz7oKH8X_T27CWb98hMzHg_unULMp92";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🔍 Testando conexão com Supabase...\n');

async function testDatabase() {
  try {
    // Teste 1: Verificar conexão
    console.log('1️⃣ Testando conexão básica...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('plans')
      .select('count');
    
    if (healthError && healthError.code === 'PGRST116') {
      console.log('❌ Tabela "plans" não existe. Execute o schema.sql primeiro!\n');
      return;
    }
    
    if (healthError) {
      console.log('❌ Erro de conexão:', healthError.message);
      return;
    }
    
    console.log('✅ Conexão estabelecida!\n');

    // Teste 2: Verificar tabelas
    console.log('2️⃣ Verificando tabelas...');
    
    const tables = ['plans', 'members', 'attendance', 'payments', 'trainings'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Tabela "${table}": ${error.message}`);
      } else {
        console.log(`✅ Tabela "${table}": OK`);
      }
    }
    
    console.log('\n3️⃣ Contando registros...');
    
    // Teste 3: Contar registros em cada tabela
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`📊 ${table}: ${count} registro(s)`);
      }
    }
    
    // Teste 4: Verificar autenticação
    console.log('\n4️⃣ Testando autenticação...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('✅ Usuário autenticado:', session.user.email);
    } else {
      console.log('ℹ️ Nenhum usuário autenticado');
    }
    
    console.log('\n✅ Testes concluídos!');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  }
}

testDatabase();
