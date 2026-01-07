import React from "react";

const DailyEntryView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Diário do Dia</h2>
      <textarea className="w-full p-4 border rounded-lg" placeholder="Escreva aqui..."></textarea>
    </div>
  );
};

export default DailyEntryView;
