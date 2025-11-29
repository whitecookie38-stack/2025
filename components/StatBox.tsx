
import React from 'react';
import { calculateHalf, calculateFifth } from '../utils/cocRules';

interface StatBoxProps {
  label: string;
  rawValue?: number; // The user input (Dice roll)
  finalValue: number; // The calculated final stat
  onChange?: (val: number) => void; // Handler for Dice roll change
  onFinalChange?: (val: number) => void; // Handler for Manual Final value change
  highlight?: boolean;
  formula?: string; // e.g., "x5"
}

const StatBox: React.FC<StatBoxProps> = ({ label, rawValue, finalValue, onChange, onFinalChange, highlight, formula }) => {
  const half = calculateHalf(finalValue);
  const fifth = calculateFifth(finalValue);
  const hasInput = rawValue !== undefined && onChange !== undefined;

  return (
    <div className={`flex flex-col border transition-colors duration-300 ${highlight ? 'border-coc-red bg-red-900/10 shadow-[0_0_15px_rgba(138,28,28,0.2)]' : 'border-gray-700 bg-[#1e1e1e] hover:border-gray-500'} rounded p-3 h-full justify-between relative group`}>
      <div className={`text-center font-bold text-xs uppercase tracking-widest mb-2 ${highlight ? 'text-coc-red' : 'text-gray-400'}`}>
        {label}
      </div>
      
      <div className="flex items-center justify-between gap-2 px-1 mb-3">
        {/* Left Side: Input (Dice Roll) */}
        {hasInput && (
            <div className="flex flex-col items-center justify-center w-1/3 relative">
                <span className="text-[9px] text-gray-500 font-bold uppercase mb-1">주사위</span>
                <input
                    type="number"
                    value={rawValue || ''}
                    onChange={(e) => onChange && onChange(parseInt(e.target.value) || 0)}
                    className="w-full text-lg font-serif text-center border-b border-gray-600 focus:outline-none focus:border-coc-red bg-transparent text-gray-300 placeholder-gray-700 transition-colors"
                    min="0"
                    max="99"
                    placeholder="0"
                />
                {formula && <span className="text-[8px] text-gray-600 absolute -bottom-3 whitespace-nowrap">{formula}</span>}
            </div>
        )}

        {/* Arrow Indicator if input exists */}
        {hasInput && (
            <div className="text-gray-600 pt-3 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </div>
        )}

        {/* Right Side: Final Value (Big Number, now Editable) */}
        <div className={`flex flex-col items-center justify-center ${hasInput ? 'w-1/2' : 'w-full'}`}>
            {hasInput && <span className="text-[10px] text-coc-red font-bold uppercase mb-1">최종</span>}
            <input
                type="number"
                value={finalValue}
                onChange={(e) => onFinalChange && onFinalChange(parseInt(e.target.value) || 0)}
                className={`w-full font-serif font-black text-center bg-transparent focus:outline-none focus:border-b-2 focus:border-coc-red transition-all
                    ${hasInput ? 'text-3xl' : 'text-4xl'} 
                    ${rawValue !== undefined && finalValue !== (formula?.includes('+6') ? (rawValue+6)*5 : rawValue*5) ? 'text-coc-red' : 'text-gray-100'}
                `}
            />
        </div>
      </div>

      {/* Footer: Hard/Extreme Values */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-700 pt-2 bg-[#252525] -mx-3 -mb-3 px-3 pb-2 rounded-b">
        <div className="flex flex-col items-center w-1/2 border-r border-gray-700">
          <span className="text-[9px] text-gray-500">어려운(1/2)</span>
          <span className="font-bold text-gray-300 text-sm">{half}</span>
        </div>
        <div className="flex flex-col items-center w-1/2">
          <span className="text-[9px] text-gray-500">극단적(1/5)</span>
          <span className="font-bold text-gray-300 text-sm">{fifth}</span>
        </div>
      </div>
    </div>
  );
};

export default StatBox;
