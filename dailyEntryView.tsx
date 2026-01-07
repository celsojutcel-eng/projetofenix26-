
import React, { useState, useEffect } from 'react';
import { DailyEntry } from '../types';
import { generateDailyContent, generateWritingInsight } from '../services/gemini';
import MoodPicker from './MoodPicker';

interface DailyEntryViewProps {
  date: string;
  onDateChange: (date: string) => void;
  entries: DailyEntry[];
  onSave: (entry: DailyEntry) => void;
}

const DailyEntryView: React.FC<DailyEntryViewProps> = ({ date, onDateChange, entries, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<DailyEntry | null>(null);

  useEffect(() => {
    const fetchOrInitEntry = async () => {
      setLoading(true);
      const existing = entries.find(e => e.date === date);
      
      if (existing) {
        setCurrentEntry(existing);
      } else {
        const content = await generateDailyContent();
        const newEntry: DailyEntry = {
          date,
          phrase: content.phrase,
          question: content.question,
          mood: '',
          reconnection: '',
          writing: '',
          selfcare: '',
          keyword: '',
        };
        setCurrentEntry(newEntry);
        onSave(newEntry);
      }
      setLoading(false);
    };

    fetchOrInitEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, entries.length]);

  const handleChange = (field: keyof DailyEntry, value: string) => {
    if (!currentEntry) return;
    const updated = { ...currentEntry, [field]: value };
    setCurrentEntry(updated);
    onSave(updated);
  };

  const handleWritingBlur = async () => {
    if (!currentEntry || currentEntry.aiInsight || currentEntry.writing.length < 50) return;
    
    setAnalyzing(true);
    const insight = await generateWritingInsight(currentEntry.writing);
    if (insight) {
      handleChange('aiInsight', insight);
    }
    setAnalyzing(false);
  };

  if (loading || !currentEntry) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-pulse">
        <div className="w-12 h-12 border-4 border-[#c67b5c] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="italic font-serif text-gray-500">Preparando seu espaço sagrado...</p>
      </div>
    );
  }

  const d = new Date(date + 'T12:00:00');
  const dayName = d.toLocaleDateString('pt-BR', { weekday: 'long' });
  const formattedDate = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-serif text-gray-800 capitalize">{dayName}</h2>
          <p className="text-gray-400 uppercase text-xs tracking-widest mt-1">{formattedDate}</p>
        </div>
        <input 
          type="date" 
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-bold text-[#c67b5c] outline-none hover:border-[#c67b5c] transition-colors" 
        />
      </div>

      <div className="bg-gradient-to-br from-[#f7f0e8] to-white p-10 rounded-[2.5rem] border border-[#f0e6da] shadow-sm text-center">
        <p className="text-[10px] uppercase tracking-widest text-[#c67b5c] font-black mb-4">Inspiração Fênix</p>
        <blockquote className="text-2xl md:text-3xl font-serif italic text-[#5d4a44] leading-tight">
          "{currentEntry.phrase}"
        </blockquote>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <h3 className="font-serif font-bold text-lg">Check-in Emocional</h3>
        </div>
        <MoodPicker 
          selectedMood={currentEntry.mood} 
          onMoodSelect={(mood) => handleChange('mood', mood)} 
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪞</span>
          <h3 className="font-serif font-bold text-lg">Reflexão Profunda</h3>
        </div>
        <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
          <p className="text-[#5d4a44] font-serif italic text-lg leading-relaxed">{currentEntry.question}</p>
          <textarea 
            value={currentEntry.reconnection}
            onChange={(e) => handleChange('reconnection', e.target.value)}
            className="w-full bg-[#fdfbf7] border border-[#e8e2d9] rounded-2xl p-4 min-h-[100px] outline-none focus:border-[#c67b5c] transition-all resize-none" 
            placeholder="Sua alma responde..."
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">✍️</span>
          <h3 className="font-serif font-bold text-lg">Escrita Terapêutica</h3>
        </div>
        <div className="relative">
          <textarea 
            value={currentEntry.writing}
            onChange={(e) => handleChange('writing', e.target.value)}
            onBlur={handleWritingBlur}
            className="w-full bg-[#fdfbf7] border border-[#e8e2d9] rounded-2xl p-6 min-h-[300px] outline-none focus:border-[#c67b5c] transition-all shadow-inner" 
            placeholder="Escreva livremente, sem filtros..."
          />
          
          {(analyzing || currentEntry.aiInsight) && (
            <div className={`mt-4 p-5 bg-[#f0f4f0] border-l-4 border-[#8ba68b] text-[#4a5d4a] text-sm italic rounded-r-2xl transition-all ${analyzing ? 'animate-pulse' : ''}`}>
              {analyzing ? 'Sintonizando insight...' : `💡 ${currentEntry.aiInsight}`}
            </div>
          )}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h3 className="font-serif font-bold">Autocuidado</h3>
          <textarea 
            value={currentEntry.selfcare}
            onChange={(e) => handleChange('selfcare', e.target.value)}
            className="w-full bg-[#fdfbf7] border border-[#e8e2d9] rounded-2xl p-4 h-24 outline-none focus:border-[#c67b5c] transition-all resize-none" 
            placeholder="Uma pequena ação hoje..."
          />
        </section>
        <section className="space-y-4">
          <h3 className="font-serif font-bold">Âncora do Dia</h3>
          <input 
            type="text" 
            value={currentEntry.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
            className="w-full bg-white border border-[#e8e2d9] rounded-2xl p-4 font-bold text-center text-[#c67b5c] text-lg outline-none focus:border-[#c67b5c] transition-all" 
            placeholder="Ex: Pausa"
          />
        </section>
      </div>
    </div>
  );
};

export default DailyEntryView;
