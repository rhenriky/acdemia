import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Users, CheckCircle, AlertCircle, BarChart, TrendingUp, DollarSign, Calendar, Activity, Instagram, Youtube, ExternalLink } from 'lucide-react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  activeMembers: number;
  paidMembers: number;
  expiringPlans: number;
}

interface AttendanceData {
  name: string;
  count: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    activeMembers: 0,
    paidMembers: 0,
    expiringPlans: 0,
  });
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Buscar membros ativos
        const { count: activeCount, error: activeError } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('status', true);

        if (activeError) throw activeError;

        // Buscar pagamentos em dia
        const { count: paidCount, error: paidError } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'paid');

        if (paidError) throw paidError;

        // Buscar planos a vencer (status pendente)
        const { count: expiringCount, error: expiringError } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (expiringError) throw expiringError;

        setStats({
          activeMembers: activeCount ?? 0,
          paidMembers: paidCount ?? 0,
          expiringPlans: expiringCount ?? 0,
        });

        // Agora buscar dados de frequência da semana atual
        const today = new Date();
        // Pega domingo da semana atual (assumindo domingo como início da semana)
        const dayOfWeek = today.getDay(); // 0 (dom) a 6 (sáb)
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - dayOfWeek);

        // Pega sábado da semana atual
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);

        // Formata datas para yyyy-mm-dd
        const startDate = sunday.toISOString().slice(0, 10);
        const endDate = saturday.toISOString().slice(0, 10);

        const { data: attendance, error: attendanceError } = await supabase
          .from('attendance')
          .select('check_in_date')
          .gte('check_in_date', startDate)
          .lte('check_in_date', endDate)
          .order('check_in_date', { ascending: true });

        if (attendanceError) throw attendanceError;

        // Contar presenças por dia da semana
        const countByDate: Record<string, number> = {};
        attendance?.forEach((item) => {
          const day = item.check_in_date?.substring(0, 10); // yyyy-mm-dd
          if (day) countByDate[day] = (countByDate[day] || 0) + 1;
        });

        // Montar array para o gráfico com dias da semana em português
        const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const weeklyData: AttendanceData[] = [];

        for (let i = 0; i < 7; i++) {
          const date = new Date(sunday);
          date.setDate(sunday.getDate() + i);
          const dateStr = date.toISOString().slice(0, 10);
          weeklyData.push({
            name: dayNames[date.getDay()],
            count: countByDate[dateStr] || 0,
          });
        }

        setAttendanceData(weeklyData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fitpro-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Olá, {user?.email?.split('@')[0] || 'Administrador'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-shadow hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Membros Ativos
            </CardTitle>
            <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg">
              <Users className="h-5 w-5 text-fitpro-purple" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeMembers}</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-500 font-medium">
                +12% vs mês passado
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pagamentos em Dia
            </CardTitle>
            <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-white">{stats.paidMembers}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.activeMembers > 0
                ? Math.round((stats.paidMembers / stats.activeMembers) * 100)
                : 0}
              % dos membros ativos
            </p>
          </CardContent>
        </Card>

        <Card className="card-shadow hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Planos a Vencer
            </CardTitle>
            <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-white">{stats.expiringPlans}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Próximos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card className="card-shadow hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Receita Mensal
            </CardTitle>
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dark:text-white">R$ 0,00</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-500 font-medium">
                +8% vs mês passado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-shadow lg:col-span-2 overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-fitpro-purple/10 dark:from-purple-900/30 to-transparent">
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Activity className="h-5 w-5 text-fitpro-purple" />
              Frequência Semanal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#333' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#9b87f5"
                    strokeWidth={3}
                    fill="url(#colorCount)"
                    name="Check-ins"
                    dot={{ fill: '#9b87f5', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#7c3aed' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Calendar className="h-5 w-5 text-fitpro-purple" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700" variant="outline" asChild>
              <a href="/members/new">
                <Users className="h-4 w-4 mr-2" />
                Novo Membro
              </a>
            </Button>
            <Button className="w-full justify-start dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700" variant="outline" asChild>
              <a href="/Frequencia">
                <CheckCircle className="h-4 w-4 mr-2" />
                Registrar Presença
              </a>
            </Button>
            <Button className="w-full justify-start dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700" variant="outline" asChild>
              <a href="/payments">
                <DollarSign className="h-4 w-4 mr-2" />
                Pagamentos
              </a>
            </Button>
            <Button className="w-full justify-start dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700" variant="outline" asChild>
              <a href="/agenda">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Agenda
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Marketing / Redes Sociais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-shadow hover:shadow-lg transition-shadow bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold text-white">
              Instagram
            </CardTitle>
            <div className="bg-white/20 p-2 rounded-lg">
              <Instagram className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 text-sm mb-4">
              Siga nossa academia no Instagram e acompanhe dicas, treinos e novidades!
            </p>
            <Button 
              className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold"
              asChild
            >
              <a href="https://instagram.com/turacademia" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4 mr-2" />
                @turacademia
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-shadow hover:shadow-lg transition-shadow bg-gradient-to-br from-red-600 via-red-500 to-red-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold text-white">
              YouTube
            </CardTitle>
            <div className="bg-white/20 p-2 rounded-lg">
              <Youtube className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 text-sm mb-4">
              Inscreva-se no nosso canal para vídeos de treino, tutoriais e muito mais!
            </p>
            <Button 
              className="w-full bg-white text-red-600 hover:bg-white/90 font-semibold"
              asChild
            >
              <a href="https://youtube.com/@turacademia" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-4 w-4 mr-2" />
                TurAcademia
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
