
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

  const handleDownloadBackup = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `projeto-fenix-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    <div className="min-h-screen flex flex-col pb-24 md:pb-8">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e8e2d9] transition-all">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-3xl font-bold text-[#c67b5c]">
              Projeto Fênix <span className="text-[#a89f91] font-light italic">2026</span>
            </h1>
            <p className="hidden md:block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] font-bold mt-1">
              Redescubra sua essência diariamente
            </p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <nav className="hidden md:flex items-center gap-8 mr-4">
              <button 
                onClick={() => setCurrentView(View.TODAY)} 
                className={`text-sm font-bold transition-all ${currentView === View.TODAY ? 'text-[#c67b5c] border-b-2 border-[#c67b5c] pb-1' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Diário
              </button>
              <button 
                onClick={() => setCurrentView(View.HISTORY)} 
                className={`text-sm font-bold transition-all ${currentView === View.HISTORY ? 'text-[#c67b5c] border-b-2 border-[#c67b5c] pb-1' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Histórico
              </button>
              <button 
                onClick={() => setCurrentView(View.INSIGHTS)} 
                className={`text-sm font-bold transition-all ${currentView === View.INSIGHTS ? 'text-[#c67b5c] border-b-2 border-[#c67b5c] pb-1' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Insights
              </button>
            </nav>
            
            <div className="flex gap-2">
              {deferredPrompt && (
                <button 
                  onClick={handleInstallClick}
                  title="Instalar Aplicativo"
                  className="flex items-center gap-2 px-3 py-2 bg-[#c67b5c] text-white rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-[#b06a4d] transition-colors shadow-sm"
                >
                  <Icons.Install />
                  <span className="hidden sm:inline">Instalar</span>
                </button>
              )}
              
              <button 
                onClick={handleDownloadBackup}
                title="Baixar Backup"
                className="p-2 rounded-full border border-[#e8e2d9] text-[#c67b5c] hover:bg-[#fdf7f2] transition-colors"
              >
                <Icons.Download />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl w-full mx-auto px-6 py-10 flex-grow">
        {renderContent()}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-100 flex justify-around py-4 md:hidden z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setCurrentView(View.TODAY)} 
          className={`flex flex-col items-center gap-1 transition-all ${currentView === View.TODAY ? 'text-[#c67b5c]' : 'text-gray-300'}`}
        >
          <Icons.Home />
          <span className="text-[10px] font-black uppercase tracking-widest">Hoje</span>
        </button>
        <button 
          onClick={() => setCurrentView(View.HISTORY)} 
          className={`flex flex-col items-center gap-1 transition-all ${currentView === View.HISTORY ? 'text-[#c67b5c]' : 'text-gray-300'}`}
        >
          <Icons.History />
          <span className="text-[10px] font-black uppercase tracking-widest">Histórico</span>
        </button>
        <button 
          onClick={() => setCurrentView(View.INSIGHTS)} 
          className={`flex flex-col items-center gap-1 transition-all ${currentView === View.INSIGHTS ? 'text-[#c67b5c]' : 'text-gray-300'}`}
        >
          <Icons.Insights />
          <span className="text-[10px] font-black uppercase tracking-widest">Insights</span>
        </button>
      </nav>

      {/* Sync Indicator */}
      <div className={`fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-white/90 backdrop-blur border border-gray-100 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-[#c67b5c] shadow-xl z-40 transition-all duration-500 ${isSaving ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        ✨ Sintonizando essência...
      </div>
    </div>
  );
};

export default App;
