import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, CreditCard, Barcode, Save } from 'lucide-react';

interface Member {
  id: string;
  full_name: string;
  plan_id: number;
}

interface Plan {
  id: number;
  name: string;
  price: number;
}

const Pagamento = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'boleto' | 'pix' | ''>('');
  const [paymentCode, setPaymentCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      const { data: membersData, error: memError } = await supabase
        .from('members')
        .select('id, full_name, plan_id')
        .order('full_name');
      if (memError) {
        toast({ title: 'Erro', description: 'Erro ao carregar membros.', variant: 'destructive' });
        return;
      }
      setMembers(membersData || []);

      const { data: plansData, error: planError } = await supabase
        .from('plans')
        .select('*');
      if (planError) {
        toast({ title: 'Erro', description: 'Erro ao carregar planos.', variant: 'destructive' });
        return;
      }
      setPlans(plansData || []);
    }
    fetchData();
  }, [toast]);

  useEffect(() => {
    if (selectedMemberId) {
      const member = members.find(m => m.id === selectedMemberId);
      if (member) {
        const plan = plans.find(p => p.id === member.plan_id);
        setSelectedPlan(plan || null);
      } else {
        setSelectedPlan(null);
      }
      setPaymentMethod('');
      setPaymentCode('');
    }
  }, [selectedMemberId, members, plans]);

  const generatePaymentCode = () => {
    if (!selectedPlan || !paymentMethod) {
      toast({ title: 'Aviso', description: 'Selecione plano e método de pagamento.' });
      return;
    }
    if (paymentMethod === 'boleto') {
      const code = Array.from({ length: 47 }, () => Math.floor(Math.random() * 10)).join('');
      setPaymentCode(code);
    } else if (paymentMethod === 'pix') {
      const code = `PIXQR-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
      setPaymentCode(code);
    }
  };

  const handleSavePayment = async () => {
    if (!selectedMemberId || !selectedPlan || !paymentMethod || !paymentCode) {
      toast({ title: 'Erro', description: 'Preencha todos os campos e gere o código.' });
      return;
    }

    setIsLoading(true);
    try {
      const today = new Date();
      const nextPayment = new Date();
      nextPayment.setMonth(today.getMonth() + 1);

      const { error } = await supabase
        .from('payments')
        .insert([{
          member_id: selectedMemberId,
          amount: selectedPlan.price,
          status: 'pending',
          payment_date: today.toISOString(),
          next_payment_date: nextPayment.toISOString(),
          created_at: today.toISOString()
        }]);

      if (error) throw error;

      toast({ title: 'Sucesso', description: 'Pagamento criado com sucesso!' });
      setPaymentMethod('');
      setPaymentCode('');
    } catch {
      toast({ title: 'Erro', description: 'Falha ao salvar pagamento.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Pagamentos</h1>
        <p className="text-sm text-gray-500">Gere códigos de pagamento para os membros</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Membro */}
        <div>
          <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
            <User className="w-4 h-4 text-fitpro-purple" /> Selecionar Membro
          </label>
          <select
            value={selectedMemberId}
            onChange={e => setSelectedMemberId(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full
              focus:outline-none focus:ring-2 focus:ring-fitpro-purple focus:border-fitpro-purple
              transition"
          >
            <option value="">Escolha um membro</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.full_name}</option>
            ))}
          </select>
        </div>

        {/* Plano */}
        <div>
          <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
            <CreditCard className="w-4 h-4 text-fitpro-purple" /> Plano Selecionado
          </label>
          <Input
            value={selectedPlan ? `${selectedPlan.name} - R$ ${selectedPlan.price.toFixed(2)}` : 'Nenhum plano selecionado'}
            readOnly
            className="bg-gray-50"
          />
        </div>

        {/* Método de Pagamento */}
        <div>
          <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
            <Barcode className="w-4 h-4 text-fitpro-purple" /> Método de Pagamento
          </label>
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value as 'boleto' | 'pix' | '')}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full
              focus:outline-none focus:ring-2 focus:ring-fitpro-purple focus:border-fitpro-purple
              transition"
            disabled={!selectedPlan}
          >
            <option value="">Escolha o método de pagamento</option>
            <option value="boleto">Boleto Bancário</option>
            <option value="pix">PIX</option>
          </select>
        </div>

        {/* Gerar código */}
        <Button
          onClick={generatePaymentCode}
          disabled={!paymentMethod || !selectedPlan}
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
          <Barcode className="w-4 h-4" />
          Gerar Código de Pagamento
        </Button>

        {/* Código gerado */}
        {paymentCode && (
          <div className="border-2 border-fitpro-purple rounded-lg p-4 bg-purple-50">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Código Gerado - {paymentMethod === 'pix' ? 'Chave PIX' : 'Código de Barras'}
            </label>
            <div className="bg-white rounded-lg px-4 py-3 font-mono text-sm text-center break-all border">
              {paymentCode}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Copie este código para realizar o pagamento
            </p>
          </div>
        )}

        {/* Salvar */}
        <Button
          onClick={handleSavePayment}
          disabled={isLoading || !paymentCode}
          className="w-full flex items-center justify-center gap-2 bg-fitpro-purple hover:bg-fitpro-darkPurple"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Salvando...' : 'Registrar Pagamento'}
        </Button>
      </div>
    </div>
  );
};

export default Pagamento;
