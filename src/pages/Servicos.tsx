import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Users, Heart, Zap, Clock, Award, CheckCircle } from 'lucide-react';

const servicos = [
  {
    icon: Dumbbell,
    title: 'Musculação',
    description: 'Equipamentos de última geração para treinos de força e hipertrofia.',
    features: ['Máquinas modernas', 'Pesos livres', 'Área funcional', 'Acompanhamento profissional']
  },
  {
    icon: Heart,
    title: 'Cardio',
    description: 'Área completa para exercícios cardiovasculares e queima de gordura.',
    features: ['Esteiras', 'Bicicletas', 'Elípticos', 'Simuladores de escada']
  },
  {
    icon: Users,
    title: 'Aulas em Grupo',
    description: 'Diversas modalidades de aulas coletivas para todos os gostos.',
    features: ['Spinning', 'Zumba', 'Pilates', 'Yoga']
  },
  {
    icon: Zap,
    title: 'Treino Funcional',
    description: 'Exercícios dinâmicos que trabalham todo o corpo.',
    features: ['CrossFit', 'HIIT', 'Circuitos', 'TRX']
  },
  {
    icon: Award,
    title: 'Personal Trainer',
    description: 'Acompanhamento individual para resultados mais rápidos.',
    features: ['Avaliação física', 'Treino personalizado', 'Acompanhamento nutricional', 'Metas definidas']
  },
  {
    icon: Clock,
    title: 'Horários Flexíveis',
    description: 'Academia aberta em horários convenientes para você.',
    features: ['Segunda a Sexta: 5h às 23h', 'Sábados: 7h às 18h', 'Domingos: 8h às 14h', 'Feriados: 8h às 12h']
  }
];

const planos = [
  {
    nome: 'Mensal',
    preco: 99.90,
    periodo: '/mês',
    features: ['Acesso à musculação', 'Área de cardio', 'Vestiários completos', 'Avaliação física inicial'],
    destaque: false
  },
  {
    nome: 'Trimestral',
    preco: 89.90,
    periodo: '/mês',
    features: ['Tudo do plano Mensal', 'Aulas em grupo', '1 sessão de Personal', 'Desconto de 10%'],
    destaque: true
  },
  {
    nome: 'Anual',
    preco: 79.90,
    periodo: '/mês',
    features: ['Tudo do plano Trimestral', '3 sessões de Personal', 'Acesso ilimitado', 'Desconto de 20%'],
    destaque: false
  }
];

const Servicos = () => {
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
          <Link to="/servicos" className="text-white font-semibold">Serviços</Link>
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
            Nossos Serviços
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Oferecemos uma estrutura completa para você alcançar seus objetivos de saúde e fitness.
          </p>
        </div>
      </section>

      {/* Serviços */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos.map((servico, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <servico.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">{servico.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">{servico.description}</p>
                <ul className="space-y-2">
                  {servico.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section className="px-6 pb-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto py-16">
          <h2 className="text-3xl font-bold mb-4 text-center">Nossos Planos</h2>
          <p className="text-gray-400 text-center mb-12">Escolha o plano ideal para você</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {planos.map((plano, index) => (
              <Card 
                key={index} 
                className={`bg-gray-900 border-2 ${plano.destaque ? 'border-purple-500 scale-105' : 'border-gray-800'} relative`}
              >
                {plano.destaque && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm px-4 py-1 rounded-full">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-white text-2xl">{plano.nome}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">R$ {plano.preco.toFixed(2).replace('.', ',')}</span>
                    <span className="text-gray-400">{plano.periodo}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plano.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup">
                    <Button 
                      className={`w-full ${plano.destaque 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90' 
                        : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                      Escolher Plano
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ainda tem dúvidas?</h2>
          <p className="text-gray-400 mb-8">
            Entre em contato conosco e tire todas as suas dúvidas sobre nossos serviços e planos.
          </p>
          <Link to="/contato">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 text-lg hover:opacity-90">
              Fale Conosco
            </Button>
          </Link>
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

export default Servicos;
