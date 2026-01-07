
import React from 'react';
import { MOODS } from '../types';

interface MoodPickerProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
}

const MoodPicker: React.FC<MoodPickerProps> = ({ selectedMood, onMoodSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {MOODS.map((mood) => (
        <button
          key={mood}
          onClick={() => onMoodSelect(mood)}
          className={`px-4 py-3 rounded-2xl border text-sm transition-all duration-200 ${
            selectedMood === mood
              ? 'bg-[#c67b5c] text-white border-[#c67b5c] scale-105 shadow-md'
              : 'bg-white border-[#e8e2d9] text-[#5d4a44] hover:bg-[#fdf7f2]'
          }`}
        >
          {mood}
        </button>
      ))}
    </div>
  );
};

export default MoodPicker;
