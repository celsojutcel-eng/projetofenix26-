
import React, { useState, useEffect } from 'react';
import { View, DailyEntry } from './types';
import { Icons } from './constants';
import DailyEntryView from './components/DailyEntryView';
import HistoryView from './components/HistoryView';
import InsightsView from './components/InsightsView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.TODAY);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [entries, setEntries] = useState<DailyEntry[]>(() => {
    const saved = localStorage.getItem('projeto_fenix_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem('projeto_fenix_data', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleSaveEntry = (updatedEntry: DailyEntry) => {
    setIsSaving(true);
    setEntries(prev => {
      const filtered = prev.filter(e => e.date !== updatedEntry.date);
      return [...filtered, updatedEntry];
    });
    setTimeout(() => setIsSaving(false), 800);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.TODAY:
        return (
          <DailyEntryView 
            date={selectedDate} 
            onDateChange={setSelectedDate}
            entries={entries} 
            onSave={handleSaveEntry}
          />
        );
      case View.HISTORY:
        return (
          <HistoryView 
            entries={entries} 
            onSelectDate={(date) => {
              setSelectedDate(date);
              setCurrentView(View.TODAY);
            }} 
          />
        );
      case View.INSIGHTS:
        return <InsightsView entries={entries} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] selection:bg-[#f0e6da]">
      {/* Header simplificado para App */}
      <header className="sticky top-0 z-50 bg-[#fdfbf7]/90 backdrop-blur-lg border-b border-[#e8e2d9]/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#c67b5c] tracking-tight">Fênix <span className="font-light italic opacity-60">2026</span></h1>
        </div>
        
        <div className="flex gap-3">
          {deferredPrompt && (
            <button 
              onClick={handleInstallClick}
              className="p-2 bg-[#c67b5c] text-white rounded-full shadow-lg animate-bounce"
            >
              <Icons.Install />
            </button>
          )}
          <button 
            onClick={() => {
              const dataStr = JSON.stringify(entries);
              const blob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `fenix-backup-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="p-2 text-[#c67b5c] rounded-full border border-[#e8e2d9]"
          >
            <Icons.Download />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-2xl mx-auto w-full px-5 py-6 animate-app-in">
        {renderContent()}
      </main>

      {/* Navigation Inferior Estilo App */}
      <nav className="fixed-bottom fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[#e8e2d9]/40 flex justify-around items-center py-3 pb-8 md:pb-4 z-[100] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
        <button 
          onClick={() => setCurrentView(View.TODAY)} 
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${currentView === View.TODAY ? 'text-[#c67b5c] scale-110' : 'text-[#a89f91]'}`}
        >
          <div className={`${currentView === View.TODAY ? 'bg-[#fdf7f2] p-2 rounded-2xl' : ''}`}>
            <Icons.Home />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Diário</span>
        </button>
        
        <button 
          onClick={() => setCurrentView(View.HISTORY)} 
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${currentView === View.HISTORY ? 'text-[#c67b5c] scale-110' : 'text-[#a89f91]'}`}
        >
          <div className={`${currentView === View.HISTORY ? 'bg-[#fdf7f2] p-2 rounded-2xl' : ''}`}>
            <Icons.History />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Memórias</span>
        </button>
        
        <button 
          onClick={() => setCurrentView(View.INSIGHTS)} 
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${currentView === View.INSIGHTS ? 'text-[#c67b5c] scale-110' : 'text-[#a89f91]'}`}
        >
          <div className={`${currentView === View.INSIGHTS ? 'bg-[#fdf7f2] p-2 rounded-2xl' : ''}`}>
            <Icons.Insights />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Insights</span>
        </button>
      </nav>

      {/* Toast de Salvamento */}
      <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 bg-[#5d4a44] text-[#fdfbf7] px-6 py-2.5 rounded-full text-xs font-bold tracking-wide shadow-2xl z-[110] transition-all duration-300 pointer-events-none ${isSaving ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        ✨ Guardando na alma...
      </div>
    </div>
  );
};

export default App;
