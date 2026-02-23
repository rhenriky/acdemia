import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Award, Heart, Dumbbell, Clock } from 'lucide-react';

const Sobre = () => {
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
          <Link to="/sobre" className="text-white font-semibold">Sobre</Link>
          <Link to="/servicos" className="hover:text-white">Serviços</Link>
          <Link to="/contato" className="hover:text-white">Contato</Link>
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
            Sobre a TurAcademia
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Somos mais do que uma academia - somos uma comunidade dedicada a transformar vidas através do fitness e bem-estar.
          </p>
        </div>
      </section>

      {/* Imagem da Academia */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
              alt="Interior da TurAcademia" 
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50" />
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
            <p className="text-gray-400 mb-4">
              Fundada em 2020, a TurAcademia nasceu com o objetivo de oferecer um espaço de treinamento completo e acolhedor para todos os níveis de condicionamento físico.
            </p>
            <p className="text-gray-400 mb-4">
              Com equipamentos de última geração e uma equipe de profissionais altamente qualificados, nos tornamos referência em fitness na região.
            </p>
            <p className="text-gray-400">
              Acreditamos que cada pessoa tem o potencial de alcançar seus objetivos, e estamos aqui para guiá-los nessa jornada de transformação.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
                <p className="text-gray-400">Membros Ativos</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">15+</div>
                <p className="text-gray-400">Profissionais</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">5</div>
                <p className="text-gray-400">Anos de Experiência</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
                <p className="text-gray-400">Equipamentos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="px-6 pb-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto py-16">
          <h2 className="text-3xl font-bold mb-12 text-center">Nossos Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compromisso</h3>
              <p className="text-gray-400">Dedicados ao seu sucesso e evolução constante.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunidade</h3>
              <p className="text-gray-400">Um ambiente acolhedor onde todos se sentem em casa.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excelência</h3>
              <p className="text-gray-400">Buscamos sempre o melhor para nossos membros.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Faça Parte da Nossa Família</h2>
          <p className="text-gray-400 mb-8">
            Venha conhecer nossa estrutura e comece sua transformação hoje mesmo.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 text-lg hover:opacity-90">
                Começar Agora
              </Button>
            </Link>
            <Link to="/contato">
              <Button variant="outline" className="border-gray-600 text-white px-8 py-3 text-lg hover:bg-gray-800">
                Fale Conosco
              </Button>
            </Link>
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

export default Sobre;
