const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://irjnaybcxoibhvotylfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_nz7oKH8X_T27CWb98hMzHg_unULMp92";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testLogin() {
  try {
    console.log('Testando login...');
    console.log('Email: rodrigo.h4ss1s@gmail.com');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'rodrigo.h4ss1s@gmail.com',
      password: 'RDG max149'
    });

    if (error) {
      console.log('ERRO:', error.message);
      
      if (error.message.includes('Email not confirmed')) {
        console.log('\n⚠️ PROBLEMA: Email não confirmado!');
        console.log('\n💡 SOLUÇÃO:');
        console.log('1. Acesse: https://supabase.com/dashboard/project/irjnaybcxoibhvotylfd');
        console.log('2. Vá em: Authentication → Providers → Email');
        console.log('3. Desabilite "Confirm email"');
        console.log('4. Salve as alterações');
        console.log('5. Tente criar a conta novamente');
      } else if (error.message.includes('Invalid login credentials')) {
        console.log('\n⚠️ PROBLEMA: Credenciais inválidas');
        console.log('\n💡 Possíveis causas:');
        console.log('1. Usuário não foi criado ainda');
        console.log('2. Email ou senha incorretos');
        console.log('3. Usuário precisa confirmar o email');
      }
    } else {
      console.log('✅ Login realizado com sucesso!');
      console.log('📧 Email:', data.user.email);
      console.log('🆔 ID:', data.user.id);
      console.log('✅ Confirmado:', data.user.email_confirmed_at ? 'Sim' : 'Não');
    }
  } catch (err) {
    console.log('❌ Erro:', err.message);
  }
}

testLogin();
