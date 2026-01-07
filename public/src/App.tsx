import React, { useState, useEffect } from "react";
import MoodPicker from "./MoodPicker";
import HistoryView from "./HistoryView";
import InsightsView from "./InsightsView";
import DailyEntryView from "./dailyEntryView";

const App: React.FC = () => {
  const [view, setView] = useState<'today'|'history'|'insights'>('today');

  return (
    <div className="min-h-screen">
      {view === 'today' && <DailyEntryView />}
      {view === 'history' && <HistoryView />}
      {view === 'insights' && <InsightsView />}
      <MoodPicker />
      {/* Aqui você pode colocar a navegação */}
    </div>
  );
};

export default App;
