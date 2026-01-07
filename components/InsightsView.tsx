
import React from 'react';
import { DailyEntry } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface InsightsViewProps {
  entries: DailyEntry[];
}

const InsightsView: React.FC<InsightsViewProps> = ({ entries }) => {
  if (entries.length < 2) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-2xl font-serif text-gray-800 mb-2">Quase lá...</h2>
        <p className="italic text-gray-400 max-w-xs">
          Continue escrevendo por mais alguns dias para que possamos mapear os padrões da sua alma.
        </p>
      </div>
    );
  }

  // Process mood data
  const moodCounts: Record<string, number> = {};
  entries.forEach(e => {
    if (e.mood) {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    }
  });

  const chartData = Object.entries(moodCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#c67b5c', '#8ba68b', '#5d4a44', '#a89f91', '#e8e2d9', '#d4c5b9'];

  const keywords = entries
    .filter(e => e.keyword)
    .map(e => e.keyword)
    .slice(-12);

  return (
    <div className="animate-fade-in space-y-8">
      <h2 className="text-3xl font-serif text-gray-800 text-center">O Mapa da sua Alma</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e8e2d9] rounded-[2rem] p-8 shadow-sm">
          <h3 className="font-serif text-xl font-bold border-b pb-4 mb-4">Suas Emoções</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {chartData.sort((a,b) => b.value - a.value).map((mood, idx) => (
              <div key={mood.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-gray-600 font-medium">{mood.name}</span>
                </div>
                <span className="font-bold text-[#c67b5c]">{Math.round((mood.value / entries.length) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#f7f0e8]/30 border border-[#f0e6da] rounded-[2rem] p-8 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="font-serif text-xl font-bold mb-6 text-center">Âncoras de Renascimento</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {keywords.length > 0 ? (
                keywords.map((word, i) => (
                  <span 
                    key={`${word}-${i}`}
                    className="px-5 py-2 bg-white border border-[#e8e2d9] rounded-2xl text-sm text-[#c67b5c] font-bold shadow-sm hover:scale-110 transition-transform cursor-default"
                  >
                    {word}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 italic">Nenhuma palavra âncora registrada ainda.</p>
              )}
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-[10px] uppercase tracking-widest text-[#a89f91] font-bold mb-2">Conselho da Fênix</p>
            <p className="font-serif italic text-[#5d4a44]">
              "Suas palavras são as sementes do seu amanhã."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsView;
