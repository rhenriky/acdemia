import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { supabase } from '@/lib/supabase';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface EventData {
  id?: number | string;
  title: string;
  date: string;
  time: string;
  responsible: string;
  status?: 'active' | 'denied';
}

const emptyEvent: EventData = {
  id: undefined,
  title: '',
  date: '',
  time: '',
  responsible: '',
  status: 'active',
};

const AgendaAdm: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [eventData, setEventData] = useState<EventData>(emptyEvent);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'denied'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('agenda').select('*');
    if (error) {
      console.error('Erro ao buscar eventos:', error.message);
      setToastMessage('Erro ao buscar eventos.');
      return;
    }

    if (data) {
      const formatted = data.map((event: any) => ({
        id: event.id?.toString(),
        title: event.title,
        start: `${event.date}T${event.time}`,
        extendedProps: { ...event },
        classNames: event.status === 'denied' ? ['denied'] : ['active'],
      }));
      setEvents(formatted);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedDate = selectInfo.startStr.split('T')[0];
    setEventData({ ...emptyEvent, date: selectedDate });
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const props = event.extendedProps as EventData;

    setEventData({
      id: props.id,
      title: props.title,
      date: event.startStr.split('T')[0],
      time: event.startStr.split('T')[1]?.substring(0, 8) || '',
      responsible: props.responsible,
      status: props.status || 'active',
    });

    setModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, title, date, time, responsible, status } = eventData;

    if (!title || !date || !time || !responsible) {
      alert('Preencha todos os campos.');
      return;
    }

    if (id) {
      const { error } = await supabase
        .from('agenda')
        .update({ title, date, time, responsible, status })
        .eq('id', Number(id));

      if (error) {
        alert('Erro ao atualizar evento: ' + error.message);
        return;
      }
      setToastMessage('Evento atualizado com sucesso!');
    } else {
      const { error } = await supabase
        .from('agenda')
        .insert([{ title, date, time, responsible, status }]);

      if (error) {
        alert('Erro ao criar evento: ' + error.message);
        return;
      }
      setToastMessage('Evento criado com sucesso!');
    }

    await fetchEvents();
    setModalOpen(false);
    setEventData(emptyEvent);
  };

  const handleDelete = async () => {
    if (!eventData.id) return;
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    const { error } = await supabase.from('agenda').delete().eq('id', Number(eventData.id));
    if (error) {
      alert('Erro ao excluir evento: ' + error.message);
      return;
    }

    setToastMessage('Evento excluído.');
    await fetchEvents();
    setModalOpen(false);
    setEventData(emptyEvent);
  };

  const handleDeny = async () => {
    if (!eventData.id) return;

    const { error } = await supabase
      .from('agenda')
      .update({ status: 'denied' })
      .eq('id', Number(eventData.id));

    if (error) {
      alert('Erro ao negar evento: ' + error.message);
      return;
    }

    setToastMessage('Evento negado.');
    await fetchEvents();
    setModalOpen(false);
    setEventData(emptyEvent);
  };

  const handleEventDrop = async (info: EventDropArg) => {
    const event = info.event;
    const id = event.extendedProps.id;
    const date = event.startStr.split('T')[0];
    const time = event.startStr.split('T')[1]?.substring(0, 8) || '';

    const { error } = await supabase
      .from('agenda')
      .update({ date, time })
      .eq('id', Number(id));

    if (error) {
      alert('Erro ao atualizar evento: ' + error.message);
      info.revert();
    } else {
      setToastMessage('Evento atualizado.');
      fetchEvents();
    }
  };

  const renderEventContent = (eventInfo: { event: EventInput & { extendedProps: EventData } }) => {
    const { title, extendedProps } = eventInfo.event;
    return (
      <Tippy
        content={
          <div className="text-sm">
            <div><strong>Responsável:</strong> {extendedProps.responsible}</div>
            <div><strong>Status:</strong> {extendedProps.status === 'denied' ? 'Negado' : 'Ativo'}</div>
            <div><strong>Hora:</strong> {extendedProps.time}</div>
          </div>
        }
        placement="top"
        delay={200}
      >
        <div>{title}</div>
      </Tippy>
    );
  };

  const filteredEvents = events.filter(ev => filterStatus === 'all' || ev.classNames?.includes(filterStatus));

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary" style={{color: 'hsl(var(--primary))'}}>
        Agenda da Academia
      </h1>

      <div className="mb-6 flex flex-wrap justify-center items-center gap-4">
        <label htmlFor="filterStatus" className="font-semibold text-primary" style={{color: 'hsl(var(--primary))'}}>
          Filtrar por status:
        </label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as 'all' | 'active' | 'denied')}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          style={{
            borderColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary))',
          }}
        >
          <option value="all">Todos</option>
          <option value="active">Ativos</option>
          <option value="denied">Negados</option>
        </select>
        <button
          className="ml-auto px-4 py-2 rounded text-white font-semibold transition-all"
          style={{
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
          }}
          onClick={() => {
            setEventData(emptyEvent);
            setModalOpen(true);
          }}
          title="Adicionar Evento"
        >
          + Novo Evento
        </button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable
        select={handleDateSelect}
        events={filteredEvents}
        eventClick={handleEventClick}
        locale={ptBrLocale}
        headerToolbar={{
          left: 'prevYear,prev,next,nextYear today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
        }}
        height="auto"
        editable
        eventResizableFromStart
        eventDrop={handleEventDrop}
        eventContent={renderEventContent}
        eventClassNames={(arg) =>
          arg.event.extendedProps.status === 'denied' ? ['denied'] : ['active']
        }
        dayMaxEvents={3}
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-primary" style={{color: 'hsl(var(--primary))'}}>
              {eventData.id ? 'Editar Evento' : 'Cadastrar Novo Evento'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Título</label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Data</label>
                  <input
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Hora</label>
                  <input
                    type="time"
                    name="time"
                    value={eventData.time}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Responsável</label>
                <input
                  type="text"
                  name="responsible"
                  value={eventData.responsible}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={eventData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Ativo</option>
                  <option value="denied">Negado</option>
                </select>
              </div>

              <div className="flex justify-between mt-6">
                {eventData.id && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 rounded bg-destructive text-destructive-foreground font-semibold transition-all hover:brightness-90"
                    style={{
                      backgroundColor: 'hsl(var(--destructive))',
                      color: 'hsl(var(--destructive-foreground))',
                    }}
                  >
                    Excluir
                  </button>
                )}

                <div className="ml-auto flex gap-2">
                  {eventData.id && (
                    <button
                      type="button"
                      onClick={handleDeny}
                      className="px-4 py-2 rounded border border-primary text-primary font-semibold transition-all hover:bg-primary hover:text-primary-foreground"
                      style={{
                        borderColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary))',
                      }}
                    >
                      Negar
                    </button>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold transition-all hover:brightness-90"
                    style={{
                      backgroundColor: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))',
                    }}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>

            <button
              onClick={() => setModalOpen(false)}
              aria-label="Fechar"
              className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-all"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div
          className="fixed bottom-5 right-5 bg-primary text-primary-foreground px-5 py-3 rounded shadow-lg"
          style={{
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
          }}
          onClick={() => setToastMessage(null)}
        >
          {toastMessage}
        </div>
      )}

      <style jsx global>{`
        .active {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: 1px solid hsl(var(--primary));
          border-radius: 0.3rem;
        }
        .denied {
          background-color: #e0e0e0;
          color: #a0a0a0;
          border: 1px solid #b0b0b0;
          border-radius: 0.3rem;
          text-decoration: line-through;
          opacity: 0.7;
        }
        /* Focus styles */
        input:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 3px hsla(var(--primary), 0.5);
        }
      `}</style>
    </div>
  );
};

export default AgendaAdm;
