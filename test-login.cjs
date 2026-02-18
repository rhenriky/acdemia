const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://irjnaybcxoibhvotylfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_nz7oKH8X_T27CWb98hMzHg_unULMp92";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Teste de Login\n');

rl.question('Email: ', (email) => {
  rl.question('Senha: ', async (password) => {
    try {
      console.log('\n🔄 Tentando fazer login...\n');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        console.log('❌ Erro no login:', error.message);
        
        if (error.message.includes('Invalid login credentials')) {
          console.log('\n💡 Possíveis causas:');
          console.log('   1. Email ou senha incorretos');
          console.log('   2. Usuário não confirmou o email');
          console.log('   3. Usuário não existe');
          console.log('\n✅ Tente criar uma nova conta em: http://localhost:8080/signup');
        }
      } else {
        console.log('✅ Login realizado com sucesso!');
        console.log('📧 Email:', data.user.email);
        console.log('🆔 ID:', data.user.id);
        console.log('\n✅ Agora você pode acessar: http://localhost:8080/dashboard');
      }
    } catch (err) {
      console.log('❌ Erro:', err.message);
    }
    
    rl.close();
  });
});
