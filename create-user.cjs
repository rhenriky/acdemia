const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://irjnaybcxoibhvotylfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_nz7oKH8X_T27CWb98hMzHg_unULMp92";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createUser() {
  console.log('Criando usuario...');
  
  const { data, error } = await supabase.auth.signUp({
    email: 'rodrigo.h4ss1s@gmail.com',
    password: 'RDG max149',
    options: {
      data: {
        full_name: 'Rodrigo'
      }
    }
  });

  if (error) {
    console.log('ERRO ao criar:', error.message);
    
    if (error.message.includes('already registered')) {
      console.log('\nUsuario ja existe! Tentando login...\n');
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'rodrigo.h4ss1s@gmail.com',
        password: 'RDG max149'
      });
      
      if (loginError) {
        console.log('ERRO no login:', loginError.message);
        
        if (loginError.message.includes('Email not confirmed')) {
          console.log('\nPROBLEMA: Email nao confirmado');
          console.log('SOLUCAO:');
          console.log('1. Acesse: https://supabase.com/dashboard/project/irjnaybcxoibhvotylfd');
          console.log('2. Va em: Authentication > Providers > Email');
          console.log('3. DESABILITE "Confirm email"');
          console.log('4. Salve');
          console.log('5. Va em: Authentication > Users');
          console.log('6. Delete o usuario rodrigo.h4ss1s@gmail.com');
          console.log('7. Execute este script novamente');
        }
      } else {
        console.log('LOGIN OK!');
        console.log('Email:', loginData.user.email);
        console.log('Agora acesse: http://localhost:8080/dashboard');
      }
    }
  } else {
    console.log('Usuario criado!');
    console.log('Email:', data.user.email);
    console.log('Confirmado:', data.user.email_confirmed_at ? 'Sim' : 'Nao - precisa confirmar');
    
    if (!data.user.email_confirmed_at) {
      console.log('\nVoce precisa desabilitar confirmacao de email no Supabase');
      console.log('Ou verificar seu email para confirmar a conta');
    } else {
      console.log('\nAgora pode fazer login em: http://localhost:8080/login');
    }
  }
}

createUser();
