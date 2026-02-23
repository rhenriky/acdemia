import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await login(email, password);
      if (error) {
        setError('Login ou senha incorreto. Tente novamente.');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <header className="bg-black text-white px-6 py-4 flex justify-between items-center w-full fixed top-0 z-50">
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TA</span>
          </div>
          <span className="text-xl font-bold">TurAcademia</span>
        </div>
        <nav className="space-x-6 hidden md:flex items-center text-sm text-gray-300">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/sobre" className="hover:text-white">Sobre</Link>
          <Link to="/servicos" className="hover:text-white">Serviços</Link>
          <Link to="/contato" className="hover:text-white">Contato</Link>
          <Link to="/signup">
            <Button className="bg-white text-black px-4 py-1 rounded-full hover:bg-gray-200 text-sm">
              cadastrar-se
            </Button>
          </Link>
        </nav>
      </header>

      {/* Conteúdo principal */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-28 pb-10">
        <div className="grid md:grid-cols-2 w-full max-w-6xl items-center gap-10">
          {/* Lado esquerdo - Imagem de academia */}
          <div className="relative space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Academia TurAcademia" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-sm text-gray-300 mb-2">Bem-vindo à</p>
                <h1 className="text-4xl font-bold leading-tight mb-3">
                  TurAcademia
                </h1>
                <p className="text-gray-300 max-w-md text-sm">
                  Evolua conosco e supere seus limites. Equipamentos de última geração e profissionais qualificados para você alcançar seu potencial máximo.
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 hover:opacity-90">
                Conhecer Planos
              </Button>
              <Link to="/signup" className="text-sm underline text-gray-400 hover:text-white self-center">
                Cadastrar-se agora
              </Link>
            </div>
          </div>

          {/* Card de login */}
          <div className="bg-white text-black rounded-xl shadow-md p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-black">TurAcademia</h1>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Login</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">Senha</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-700">Lembrar-me</label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/reset-password-request')}
                  className="text-sm text-fitpro-purple hover:text-fitpro-darkPurple"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-black text-white hover:bg-gray-900">
                {isLoading ? 'Entrando...' : 'Autenticar'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
