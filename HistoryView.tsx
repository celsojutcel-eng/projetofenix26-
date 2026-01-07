
import React from 'react';
import { DailyEntry } from '../types';

interface HistoryViewProps {
  entries: DailyEntry[];
  onSelectDate: (date: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ entries, onSelectDate }) => {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-serif text-gray-800 border-b border-gray-200 pb-4 mb-6">Seu Caminho de Renascimento</h2>
      
      {sorted.length === 0 ? (
        <div className="text-center py-24">
          <p className="italic font-serif text-gray-400 text-lg">Sua história começa aqui...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((e) => {
            const d = new Date(e.date + 'T12:00:00');
            return (
              <div 
                key={e.date}
                onClick={() => onSelectDate(e.date)}
                className="bg-white border border-[#e8e2d9] rounded-3xl p-6 flex justify-between items-center cursor-pointer hover:border-[#c67b5c] hover:shadow-lg transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-[#c67b5c] uppercase">
                    {d.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </p>
                  <h4 className="font-serif text-lg text-gray-800">
                    {d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                  </h4>
                  <p className="text-xs text-gray-400 truncate italic mt-1">
                    "{e.phrase}"
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  {e.mood && (
                    <span className="text-[10px] bg-[#fdf7f2] px-3 py-1 rounded-full text-[#c67b5c] font-bold border border-[#f0e6da]">
                      {e.mood}
                    </span>
                  )}
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-[#c67b5c] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
