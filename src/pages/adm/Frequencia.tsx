import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  fetchMembers,
  fetchAttendanceByDate,
  registerAttendance,
  deleteAttendance,
} from '@/lib/supabase';

interface Member {
  id: string;
  full_name: string;
}

interface Attendance {
  member_id: string;
}

// Spinner simples para loading
const Spinner = () => (
  <svg
    className="animate-spin h-6 w-6 text-indigo-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
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
);

const Frequencia = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [presence, setPresence] = useState<Record<string, boolean>>({});
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Carrega membros e presença inicial
    const loadData = async () => {
      setLoading(true);
      try {
        const membersData = await fetchMembers();
        setMembers(membersData);
        const attendanceData = await fetchAttendanceByDate(date);
        const presenceMap: Record<string, boolean> = {};
        attendanceData.forEach(a => {
          presenceMap[a.member_id] = true;
        });
        setPresence(presenceMap);
      } catch {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    // Atualiza presença quando a data muda
    const loadPresenceByDate = async () => {
      setLoading(true);
      try {
        const attendanceData = await fetchAttendanceByDate(date);
        const presenceMap: Record<string, boolean> = {};
        attendanceData.forEach(a => {
          presenceMap[a.member_id] = true;
        });
        setPresence(presenceMap);
      } catch {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as presenças da data selecionada.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    loadPresenceByDate();
  }, [date]);

  const togglePresence = (memberId: string) => {
    setPresence(prev => ({ ...prev, [memberId]: !prev[memberId] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Busca IDs marcados
      const selectedIds = Object.entries(presence)
        .filter(([, checked]) => checked)
        .map(([id]) => id);

      const attendanceData = await fetchAttendanceByDate(date);
      const currentlyRegistered = attendanceData.map(a => a.member_id);

      // Diferença para criar e deletar
      const toCreate = selectedIds.filter(id => !currentlyRegistered.includes(id));
      const toDelete = currentlyRegistered.filter(id => !selectedIds.includes(id));

      await Promise.all([
        ...toCreate.map(id => registerAttendance(id, date)),
        ...toDelete.map(id => deleteAttendance(id, date)),
      ]);

      toast({
        title: 'Sucesso',
        description: 'Presenças atualizadas com sucesso!',
      });
    } catch {
      toast({
        title: 'Erro',
        description: 'Falha ao salvar presenças. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Controle de Frequência
        </h1>
        <p className="text-sm text-gray-500">
          Registre a presença dos membros
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <label htmlFor="date" className="text-sm font-medium text-gray-700">
            Selecionar Data
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            disabled={loading || saving}
            className="border border-gray-300 rounded-lg px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-fitpro-purple focus:border-fitpro-purple
              transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Selecionar data para frequência"
          />
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full table-auto border-collapse"
            role="table"
            aria-label="Tabela de membros para frequência"
          >
            <thead className="bg-gray-50 border-b">
              <tr>
                <th
                  scope="col"
                  className="text-left px-6 py-3 font-semibold text-gray-700 select-none"
                >
                  Nome
                </th>
                <th
                  scope="col"
                  className="text-center px-6 py-3 font-semibold text-gray-700 select-none"
                >
                  Presente
                </th>
              </tr>
            </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="py-16 text-center text-indigo-600 flex justify-center">
                  <Spinner />
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="py-16 text-center text-gray-400 italic select-none"
                >
                  Nenhum membro encontrado
                </td>
              </tr>
            ) : (
              members.map((member, i) => (
                <tr
                  key={member.id}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 text-gray-800 font-medium select-text border-b">
                    {member.full_name}
                  </td>
                  <td className="px-6 py-4 text-center border-b">
                    <input
                      type="checkbox"
                      id={`presence-${member.id}`}
                      checked={!!presence[member.id]}
                      onChange={() => togglePresence(member.id)}
                      disabled={loading || saving}
                      className="w-5 h-5 rounded border-gray-300 text-fitpro-purple
                        focus:ring-fitpro-purple cursor-pointer transition"
                      aria-label={`Marcar presença de ${member.full_name}`}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading || saving}
            className="px-6 py-2"
            aria-live="polite"
          >
            {(saving && 'Salvando...') || 'Salvar Presença'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Frequencia;
