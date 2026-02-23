import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Member, Plan } from '@/lib/supabase';
import {
  PlusCircle, Search, MoreHorizontal, Edit, Eye, UserX, UserCheck, ArrowUpDown,
  Dumbbell, Heart, Zap, Target, Flame, Clock
} from 'lucide-react';

// Sugestões de treino
const workoutSuggestions = [
  {
    id: 1,
    title: 'Treino de Peito',
    icon: 'chest',
    color: 'from-red-500 to-orange-500',
    exercises: ['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Crossover'],
    duration: '45-60 min',
    level: 'Intermediário'
  },
  {
    id: 2,
    title: 'Treino de Perna',
    icon: 'leg',
    color: 'from-blue-500 to-cyan-500',
    exercises: ['Agachamento', 'Leg Press', 'Extensora', 'Flexora'],
    duration: '50-70 min',
    level: 'Avançado'
  },
  {
    id: 3,
    title: 'Treino de Braço',
    icon: 'arm',
    color: 'from-purple-500 to-pink-500',
    exercises: ['Rosca Direta', 'Tríceps Pulley', 'Rosca Martelo', 'Tríceps Testa'],
    duration: '40-50 min',
    level: 'Iniciante'
  },
  {
    id: 4,
    title: 'Treino Full Body',
    icon: 'fullbody',
    color: 'from-green-500 to-emerald-500',
    exercises: ['Burpees', 'Flexões', 'Agachamento', 'Prancha', 'Remada'],
    duration: '60-80 min',
    level: 'Todos os níveis'
  },
  {
    id: 5,
    title: 'Treino de Costas',
    icon: 'back',
    color: 'from-indigo-500 to-violet-500',
    exercises: ['Puxada Frontal', 'Remada Curvada', 'Pulldown', 'Serrote'],
    duration: '45-55 min',
    level: 'Intermediário'
  },
  {
    id: 6,
    title: 'Treino de Ombros',
    icon: 'shoulders',
    color: 'from-amber-500 to-yellow-500',
    exercises: ['Desenvolvimento', 'Elevação Lateral', 'Elevação Frontal', 'Encolhimento'],
    duration: '35-45 min',
    level: 'Iniciante'
  }
];

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch members & plans once
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('*')
          .order('full_name', { ascending: true });
        if (membersError) throw membersError;

        const { data: plansData, error: plansError } = await supabase
          .from('plans')
          .select('*');
        if (plansError) throw plansError;

        // Fallback fake data se vazio (remove em produção)
        setMembers(membersData?.length ? membersData : [
          { id: '1', full_name: 'Ana Silva', cpf_id: '123.456.789-00', phone: '(11) 98765-4321', entry_date: '2023-01-15', plan_id: 1, status: true, created_at: '2023-01-15T10:00:00Z' },
          { id: '2', full_name: 'Bruno Oliveira', cpf_id: '987.654.321-00', phone: '(11) 91234-5678', entry_date: '2023-02-20', plan_id: 2, status: true, created_at: '2023-02-20T14:30:00Z' },
          { id: '3', full_name: 'Carolina Lima', cpf_id: '456.789.123-00', phone: '(11) 97890-1234', entry_date: '2023-03-10', plan_id: 1, status: false, created_at: '2023-03-10T09:15:00Z' }
        ]);
        setPlans(plansData?.length ? plansData : [
          { id: 1, name: 'Mensal', description: 'Plano mensal básico', price: 100, duration_months: 1 },
          { id: 2, name: 'Trimestral', description: 'Plano trimestral com desconto', price: 270, duration_months: 3 },
          { id: 3, name: 'Anual', description: 'Plano anual com grande desconto', price: 960, duration_months: 12 }
        ]);
      } catch (error) {
        console.error('Erro ao carregar membros:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os membros.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // Ordena membros ao clicar no cabeçalho Nome
  const toggleSort = () => setSortAsc(!sortAsc);

  // Função para buscar nome do plano
  const getPlanName = (planId: number) => plans.find(p => p.id === planId)?.name ?? 'Desconhecido';

  // Toggle status com feedback e atualização local
  const handleToggleStatus = async (member: Member) => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ status: !member.status })
        .eq('id', member.id);
      if (error) throw error;

      setMembers(members.map(m => m.id === member.id ? { ...m, status: !m.status } : m));

      toast({
        title: "Sucesso!",
        description: `Membro ${member.status ? 'desativado' : 'ativado'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do membro.",
        variant: "destructive",
      });
    }
  };

  // Filtra membros conforme busca (nome e CPF)
  const filteredMembers = useMemo(() => {
    return members.filter(member =>
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.cpf_id.includes(searchTerm)
    );
  }, [members, searchTerm]);

  // Ordena lista filtrada pelo nome asc/desc
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) =>
      sortAsc
        ? a.full_name.localeCompare(b.full_name)
        : b.full_name.localeCompare(a.full_name)
    );
  }, [filteredMembers, sortAsc]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2 select-none" tabIndex={0}>
          Membros
          <button
            aria-label="Ordenar membros por nome"
            onClick={toggleSort}
            className="text-gray-400 hover:text-fitpro-purple dark:hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-fitpro-purple rounded"
            title={`Ordenar por nome (${sortAsc ? 'ascendente' : 'descendente'})`}
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </h1>
        <Button
          onClick={() => navigate('/members/new')}
          className="flex items-center gap-2 bg-fitpro-purple hover:bg-fitpro-darkPurple focus:ring-4 focus:ring-fitpro-purple/50"
          aria-label="Adicionar novo membro"
          title="Adicionar novo membro"
        >
          <PlusCircle className="h-5 w-5" />
          Novo Membro
        </Button>
      </header>

      <div className="max-w-md relative">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200
            ${searchTerm ? 'text-fitpro-purple' : 'text-gray-400 dark:text-gray-500'}`}
          aria-hidden="true"
        />
        <Input
          placeholder="Pesquisar por nome ou CPF/ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:border-fitpro-purple focus:ring-2 focus:ring-fitpro-purple transition"
          aria-label="Campo de busca de membros"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <Table className="min-w-[720px]">
          <TableHeader className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 select-none">
            <TableRow>
              <TableHead className="py-3 px-6 text-left text-gray-700 dark:text-gray-300">Nome</TableHead>
              <TableHead className="py-3 px-6 text-left text-gray-700 dark:text-gray-300">Plano</TableHead>
              <TableHead className="py-3 px-6 text-left text-gray-700 dark:text-gray-300">Entrada</TableHead>
              <TableHead className="py-3 px-6 text-left text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="py-3 px-6 text-right text-gray-700 dark:text-gray-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <svg
                    className="animate-spin mx-auto h-10 w-10 text-fitpro-purple"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-label="Carregando"
                    role="img"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <p className="mt-4 text-fitpro-purple font-semibold animate-pulse">Carregando membros...</p>
                </TableCell>
              </TableRow>
            ) : sortedMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2 select-none">
                  <Search className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  Nenhum membro encontrado
                </TableCell>
              </TableRow>
            ) : (
              sortedMembers.map((member, idx) => (
                <TableRow
                  key={member.id}
                  className={`transition-colors duration-200
                    ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
                    hover:bg-fitpro-purple/10 dark:hover:bg-purple-900/30 focus-within:bg-fitpro-purple/20`}
                  tabIndex={0}
                  role="row"
                  aria-rowindex={idx + 2}
                >
                  <TableCell className="font-semibold py-4 px-6 dark:text-white">{member.full_name}</TableCell>
                  <TableCell className="py-4 px-6 dark:text-gray-300">{getPlanName(member.plan_id)}</TableCell>
                  <TableCell className="py-4 px-6 dark:text-gray-300">{new Date(member.entry_date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge
                      variant={member.status ? "default" : "outline"}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium
                        ${member.status
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 animate-pulse'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
                      aria-label={member.status ? "Membro ativo" : "Membro inativo"}
                    >
                      {member.status ? (
                        <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <UserX className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      )}
                      {member.status ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-4 px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-300"
                          aria-label={`Abrir menu de ações para ${member.full_name}`}
                        >
                          <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 min-w-[140px]"
                      >
                        <DropdownMenuItem
                          onClick={() => navigate(`/members/view/${member.id}`)}
                          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-gray-200"
                        >
                          <Eye className="h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/members/edit/${member.id}`)}
                          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-gray-200"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(member)}
                          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-gray-200"
                        >
                          {member.status ? (
                            <>
                              <UserX className="h-4 w-4 text-red-600" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 text-green-600" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Seção de Sugestões de Treino */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-fitpro-purple to-purple-600 p-2 rounded-lg">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Sugestões de Treino</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutSuggestions.map((workout) => (
            <Card 
              key={workout.id} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <div className={`h-2 bg-gradient-to-r ${workout.color}`} />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 dark:text-white">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${workout.color}`}>
                      <Dumbbell className="h-4 w-4 text-white" />
                    </div>
                    {workout.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                    {workout.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{workout.duration}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exercícios:</p>
                  <div className="flex flex-wrap gap-2">
                    {workout.exercises.map((exercise, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                      >
                        {exercise}
                      </span>
                    ))}
                  </div>
                </div>
                <Button 
                  className={`w-full bg-gradient-to-r ${workout.color} text-white hover:opacity-90 transition-opacity`}
                  onClick={() => navigate('/trainings')}
                >
                  <Flame className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Members;
