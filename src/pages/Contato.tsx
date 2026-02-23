import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, Send } from 'lucide-react';

const Contato = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    });
    
    setNome('');
    setEmail('');
    setTelefone('');
    setMensagem('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <header className="bg-black text-white px-6 py-4 flex justify-between items-center w-full fixed top-0 z-50 border-b border-gray-800">
        <Link to="/login" className="flex items-center space-x-2 text-lg font-semibold">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TA</span>
          </div>
          <span className="text-xl font-bold">TurAcademia</span>
        </Link>
        <nav className="space-x-6 hidden md:flex items-center text-sm text-gray-300">
          <Link to="/login" className="hover:text-white">Home</Link>
          <Link to="/sobre" className="hover:text-white">Sobre</Link>
          <Link to="/servicos" className="hover:text-white">Serviços</Link>
          <Link to="/contato" className="text-white font-semibold">Contato</Link>
          <Link to="/signup">
            <Button className="bg-white text-black px-4 py-1 rounded-full hover:bg-gray-200 text-sm">
              Cadastrar-se
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Estamos prontos para atender você. Entre em contato e tire todas as suas dúvidas.
          </p>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Formulário */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Envie uma mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-1">
                    Nome completo
                  </label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-1">
                    Telefone
                  </label>
                  <Input
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-gray-300 mb-1">
                    Mensagem
                  </label>
                  <Textarea
                    id="mensagem"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Como podemos ajudar?"
                    required
                    rows={5}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                >
                  {isLoading ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações de contato */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Endereço</h3>
                    <p className="text-gray-400">
                      Rua das Academias, 123<br />
                      Centro - Cuiabá, MT<br />
                      CEP: 78000-000
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Telefone</h3>
                    <p className="text-gray-400">
                      (65) 99999-9999<br />
                      (65) 3333-3333
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">E-mail</h3>
                    <p className="text-gray-400">
                      contato@turacademia.com.br<br />
                      atendimento@turacademia.com.br
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Horário de Funcionamento</h3>
                    <p className="text-gray-400">
                      Segunda a Sexta: 5h às 23h<br />
                      Sábados: 7h às 18h<br />
                      Domingos e Feriados: 8h às 14h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Redes Sociais */}
            <div className="flex justify-center space-x-4 pt-4">
              <a 
                href="https://instagram.com/turacademia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <Instagram className="h-6 w-6 text-white" />
              </a>
              <a 
                href="https://facebook.com/turacademia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <Facebook className="h-6 w-6 text-white" />
              </a>
              <a 
                href="https://youtube.com/@turacademia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <Youtube className="h-6 w-6 text-white" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-gray-800">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3843.2844815474787!2d-56.09676892477661!3d-15.595853585104774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x939db1d1b8f0d1f5%3A0x7d1d1d1d1d1d1d1d!2sCuiab%C3%A1%2C%20MT!5e0!3m2!1spt-BR!2sbr!4v1635000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização TurAcademia"
              className="grayscale"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 px-6 py-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2024 TurAcademia. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contato;
