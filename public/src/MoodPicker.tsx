import React from "react";

const MOODS = ['Leve','Cansada','Inspirada','Ansiosa','Grata','Presente'];

const MoodPicker: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4">
      {MOODS.map(m => (
        <button key={m} className="px-4 py-2 border rounded-full bg-white shadow text-sm">{m}</button>
      ))}
    </div>
  );
};

export default MoodPicker;
