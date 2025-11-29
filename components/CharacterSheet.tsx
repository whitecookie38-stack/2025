
import React, { useState, useEffect } from 'react';
import { Character, Skill, Stats } from '../types';
import { BASE_SKILLS } from '../constants';
import { calculateDamageBonusAndBuild, calculateMoveRate, getAgeRuleDescription, calculateBaseStats, calculateHalf, calculateFifth } from '../utils/cocRules';
import StatBox from './StatBox';

interface Props {
  initialData?: Character;
  onSave: (char: Character) => void;
  onBack: () => void;
}

const CharacterSheet: React.FC<Props> = ({ initialData, onSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'skills' | 'bg'>('stats');
  
  // Extra state for Occupation Points Budget
  const [maxOccPoints, setMaxOccPoints] = useState<number>(300);

  // State for Custom Skill Addition
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillBase, setNewSkillBase] = useState(0);

  // Initialize Character State
  const [char, setChar] = useState<Character>(() => {
    if (initialData) {
      // Compatibility check: if old data doesn't have 'stats' field, generate it
      if (!initialData.stats) {
         return {
             ...initialData,
             stats: calculateBaseStats(initialData.rawStats)
         };
      }
      return initialData;
    }
    
    // Default New Character
    const defaultRaw = { str: 10, con: 10, siz: 7, dex: 10, app: 10, int: 7, pow: 10, edu: 7, luck: 10 };
    return {
      id: crypto.randomUUID(),
      name: '',
      player: '',
      occupation: '',
      age: 25,
      gender: '',
      birthplace: '',
      residence: '',
      isLost: false,
      rawStats: defaultRaw,
      stats: calculateBaseStats(defaultRaw),
      hp: { current: 10, max: 10 },
      mp: { current: 10, max: 10 },
      san: { current: 50, start: 50, max: 99 },
      luck: { current: 50 },
      damageBonus: '0',
      build: 0,
      moveRate: 8,
      tempInsanity: false,
      indefInsanity: false,
      insanityDescription: '',
      skills: BASE_SKILLS.map(s => ({ ...s, occupationPoints: 0, interestPoints: 0, growth: 0 })),
      backstory: '',
      gear: '',
      updatedAt: new Date().toISOString()
    };
  });

  // Effect: Calculate Derived Stats (HP, MP, DB, Build, Move) based on FINAL stats (char.stats)
  // This runs whenever char.stats changes (whether by dice or manual edit)
  useEffect(() => {
    const { str, siz, dex, con, pow } = char.stats;
    const { db, build } = calculateDamageBonusAndBuild(str, siz);
    const mov = calculateMoveRate(dex, str, siz, char.age);
    
    setChar(prev => ({
      ...prev,
      damageBonus: db,
      build,
      moveRate: mov,
      hp: { ...prev.hp, max: Math.floor((con + siz) / 10) },
      mp: { ...prev.mp, max: Math.floor(pow / 5) },
    }));
  }, [char.stats, char.age]);

  // Handle Dice Roll Input (Raw)
  // When Dice changes, we RECALCULATE standard final stats (overwriting manual edits)
  const handleRawStatChange = (stat: keyof Stats, val: number) => {
    setChar(prev => {
        const newRawStats = { ...prev.rawStats, [stat]: val };
        
        // Calculate what the final value SHOULD be based on dice
        // Note: SIZ/INT/EDU are (dice+6)*5, others dice*5
        let newFinalValue = 0;
        const specialStats: (keyof Stats)[] = ['siz', 'int', 'edu'];
        if (specialStats.includes(stat)) {
            newFinalValue = (val + 6) * 5;
        } else {
            newFinalValue = val * 5;
        }
        
        // Update stats
        const newStats = { ...prev.stats, [stat]: newFinalValue };

        // Handle Special Side Effects (Sanity, Luck)
        let newSan = prev.san;
        if (stat === 'pow') {
             const newBasePow = newFinalValue;
             // If SAN hasn't diverged from start, update it? Or just update start.
             // Usually initial SAN = POW.
             newSan = { ...prev.san, start: newBasePow, current: newBasePow };
        }
        
        let newLuckObj = prev.luck;
        if (stat === 'luck') {
            newLuckObj = { current: newFinalValue };
        }

        return { ...prev, rawStats: newRawStats, stats: newStats, san: newSan, luck: newLuckObj };
    });
  };

  // Handle Manual Final Stat Override
  const handleFinalStatChange = (stat: keyof typeof char.stats, val: number) => {
      setChar(prev => ({
          ...prev,
          stats: { ...prev.stats, [stat]: val }
      }));
  };

  const handleSkillChange = (index: number, field: 'occupationPoints' | 'interestPoints' | 'growth', val: number) => {
    const newSkills = [...char.skills];
    newSkills[index] = { ...newSkills[index], [field]: val };
    setChar(prev => ({ ...prev, skills: newSkills }));
  };

  const handleAddSkill = () => {
      if (!newSkillName.trim()) {
          alert("기능 이름을 입력해주세요.");
          return;
      }
      // Check duplicate
      if (char.skills.some(s => s.name === newSkillName.trim())) {
          alert("이미 존재하는 기능 이름입니다.");
          return;
      }
      
      const newSkill: Skill = {
          name: newSkillName.trim(),
          base: newSkillBase,
          occupationPoints: 0,
          interestPoints: 0,
          growth: 0,
          isCustom: true
      };
      
      setChar(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill]
      }));
      setNewSkillName('');
      setNewSkillBase(0);
  };

  // Point Budgets
  const maxInterestPoints = char.stats.int * 2;
  const usedInterestPoints = char.skills.reduce((acc, s) => acc + (s.interestPoints || 0), 0);
  const usedOccPoints = char.skills.reduce((acc, s) => acc + (s.occupationPoints || 0), 0);
  
  const ageRule = getAgeRuleDescription(char.age);

  return (
    <div className="bg-[#121212] min-h-screen pb-20 font-sans text-gray-200 selection:bg-coc-red selection:text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#1e1e1e]/90 backdrop-blur-md border-b border-gray-800 p-4 shadow-xl flex justify-between items-center">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          돌아가기
        </button>
        <h1 className="text-xl md:text-2xl font-serif font-bold tracking-widest uppercase truncate max-w-md mx-2 text-gray-100">
            {char.name || <span className="text-gray-600 italic">이름 없는 탐사자</span>}
            {char.isLost && <span className="ml-3 text-[10px] align-middle bg-red-950 text-red-500 border border-red-900 px-1.5 py-0.5 rounded tracking-wider">LOST</span>}
        </h1>
        <button 
            onClick={() => onSave(char)}
            className="bg-coc-red hover:bg-red-700 text-white px-5 py-2 rounded-sm shadow-lg text-sm font-bold transition whitespace-nowrap flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          저장
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        
        {/* Basic Info */}
        <div className="bg-[#1e1e1e] p-6 shadow-xl border border-gray-800 rounded-sm mb-8 relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-coc-red opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">이름</label>
                    <input 
                        type="text" 
                        value={char.name} 
                        onChange={e => setChar({...char, name: e.target.value})}
                        className="w-full bg-transparent border-b border-gray-700 focus:border-coc-red outline-none py-1 font-serif text-2xl text-white placeholder-gray-700 transition-colors"
                        placeholder="탐사자 이름 입력"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">직업</label>
                    <input 
                        type="text" 
                        value={char.occupation} 
                        onChange={e => setChar({...char, occupation: e.target.value})}
                        className="w-full bg-transparent border-b border-gray-700 focus:border-coc-red outline-none py-1 text-gray-300 placeholder-gray-700 transition-colors"
                        placeholder="직업 입력"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">플레이어</label>
                    <input 
                        type="text" 
                        value={char.player} 
                        onChange={e => setChar({...char, player: e.target.value})}
                        className="w-full bg-transparent border-b border-gray-700 focus:border-coc-red outline-none py-1 text-gray-300 placeholder-gray-700 transition-colors"
                        placeholder="플레이어 닉네임"
                    />
                </div>
                
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">나이</label>
                        <input 
                            type="number" 
                            value={char.age} 
                            onChange={e => setChar({...char, age: parseInt(e.target.value) || 15})}
                            className="w-full bg-transparent border-b border-gray-700 focus:border-coc-red outline-none py-1 text-gray-300 transition-colors"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">성별</label>
                        <input 
                            type="text" 
                            value={char.gender} 
                            onChange={e => setChar({...char, gender: e.target.value})}
                            className="w-full bg-transparent border-b border-gray-700 focus:border-coc-red outline-none py-1 text-gray-300 placeholder-gray-700 transition-colors"
                            placeholder="성별"
                        />
                    </div>
                </div>
                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">거주지/출신지</label>
                    <input 
                        type="text" 
                        value={char.residence} 
                        onChange={e => setChar({...char, residence: e.target.value})}
                        className="w-full bg-transparent border-b border-gray-700 focus:border-coc-red outline-none py-1 text-gray-300 placeholder-gray-700 transition-colors"
                        placeholder="아컴, 매사추세츠"
                    />
                </div>
            </div>

            {/* Age Rule Display */}
            {ageRule && (
                <div className="mt-6 p-4 bg-yellow-900/10 border border-yellow-900/30 rounded-sm text-sm text-yellow-600 flex gap-3 items-start">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <span className="font-bold text-yellow-500 block mb-1">연령 조정 규칙 적용 필요</span>
                        {ageRule}
                        <div className="text-xs text-yellow-700 mt-2 opacity-75">※ 아래 특성치 섹션에서 [최종] 값을 클릭하여 직접 수정하세요.</div>
                    </div>
                </div>
            )}
            
            <div className="absolute top-4 right-4">
                 <button 
                    onClick={() => setChar({...char, isLost: !char.isLost})}
                    className={`px-3 py-1 rounded text-[10px] font-bold border transition-all uppercase tracking-wider ${
                        char.isLost 
                        ? 'bg-red-950 text-red-500 border-red-800 shadow-[0_0_10px_rgba(220,38,38,0.3)]' 
                        : 'bg-transparent text-gray-600 border-gray-700 hover:border-gray-500'
                    }`}
                 >
                    {char.isLost ? '☠ Status: LOST' : 'Mark as Lost'}
                 </button>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 border-b border-gray-800 overflow-x-auto gap-8">
            <button onClick={() => setActiveTab('stats')} className={`pb-3 px-1 font-bold whitespace-nowrap transition-all text-sm uppercase tracking-widest ${activeTab === 'stats' ? 'text-coc-red border-b-2 border-coc-red' : 'text-gray-500 hover:text-gray-300'}`}>특성치 & 상태</button>
            <button onClick={() => setActiveTab('skills')} className={`pb-3 px-1 font-bold whitespace-nowrap transition-all text-sm uppercase tracking-widest ${activeTab === 'skills' ? 'text-coc-red border-b-2 border-coc-red' : 'text-gray-500 hover:text-gray-300'}`}>기능 (Skills)</button>
            <button onClick={() => setActiveTab('bg')} className={`pb-3 px-1 font-bold whitespace-nowrap transition-all text-sm uppercase tracking-widest ${activeTab === 'bg' ? 'text-coc-red border-b-2 border-coc-red' : 'text-gray-500 hover:text-gray-300'}`}>백스토리 & 장비</button>
        </div>

        {/* STATS TAB */}
        {activeTab === 'stats' && (
            <div className="space-y-8 animate-fade-in">
                {/* Main Stats */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    <StatBox 
                        label="근력 (STR)" 
                        rawValue={char.rawStats.str} 
                        finalValue={char.stats.str} 
                        onChange={(v) => handleRawStatChange('str', v)} 
                        onFinalChange={(v) => handleFinalStatChange('str', v)}
                        formula="x5" 
                    />
                    <StatBox 
                        label="건강 (CON)" 
                        rawValue={char.rawStats.con} 
                        finalValue={char.stats.con} 
                        onChange={(v) => handleRawStatChange('con', v)} 
                        onFinalChange={(v) => handleFinalStatChange('con', v)}
                        formula="x5" 
                    />
                    <StatBox 
                        label="크기 (SIZ)" 
                        rawValue={char.rawStats.siz} 
                        finalValue={char.stats.siz} 
                        onChange={(v) => handleRawStatChange('siz', v)} 
                        onFinalChange={(v) => handleFinalStatChange('siz', v)}
                        formula="(+6)x5" 
                    />
                    <StatBox 
                        label="민첩 (DEX)" 
                        rawValue={char.rawStats.dex} 
                        finalValue={char.stats.dex} 
                        onChange={(v) => handleRawStatChange('dex', v)} 
                        onFinalChange={(v) => handleFinalStatChange('dex', v)}
                        formula="x5" 
                    />
                    <StatBox 
                        label="외모 (APP)" 
                        rawValue={char.rawStats.app} 
                        finalValue={char.stats.app} 
                        onChange={(v) => handleRawStatChange('app', v)} 
                        onFinalChange={(v) => handleFinalStatChange('app', v)}
                        formula="x5" 
                    />
                    
                    <StatBox 
                        label="지능 (INT)" 
                        rawValue={char.rawStats.int} 
                        finalValue={char.stats.int} 
                        onChange={(v) => handleRawStatChange('int', v)} 
                        onFinalChange={(v) => handleFinalStatChange('int', v)}
                        formula="(+6)x5" 
                    />
                    <StatBox 
                        label="정신 (POW)" 
                        rawValue={char.rawStats.pow} 
                        finalValue={char.stats.pow} 
                        onChange={(v) => handleRawStatChange('pow', v)} 
                        onFinalChange={(v) => handleFinalStatChange('pow', v)}
                        formula="x5" 
                    />
                    <StatBox 
                        label="교육 (EDU)" 
                        rawValue={char.rawStats.edu} 
                        finalValue={char.stats.edu} 
                        onChange={(v) => handleRawStatChange('edu', v)} 
                        onFinalChange={(v) => handleFinalStatChange('edu', v)}
                        formula="(+6)x5" 
                    />
                    
                    <StatBox 
                        label="행운 (LUCK)" 
                        rawValue={char.rawStats.luck} 
                        finalValue={char.stats.luck} 
                        onChange={(v) => handleRawStatChange('luck', v)} 
                        onFinalChange={(v) => handleFinalStatChange('luck', v)}
                        highlight 
                        formula="x5" 
                    />
                    <div className="hidden md:flex items-center justify-center p-4">
                        <span className="text-gray-700 text-xs italic text-center">
                           "The most merciful thing in the world, I think, is the inability of the human mind to correlate all its contents."
                        </span>
                    </div>
                </div>
                
                <p className="text-xs text-gray-500 text-center italic bg-[#1e1e1e] p-3 rounded-sm border border-gray-800">
                    💡 [주사위] 칸에 굴린 값을 입력하면 [최종]값이 자동 계산됩니다. 나이/상황에 따른 조정이 필요하면 [최종] 숫자를 클릭해 직접 수정하세요.
                </p>

                {/* Derived Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Health & Magic */}
                    <div className="bg-[#1e1e1e] p-5 rounded-sm border border-gray-800 space-y-5">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-300">체력 (HP)</span>
                                <div className="flex items-center gap-2 text-sm">
                                    <input 
                                        type="number" 
                                        className="w-12 text-center bg-[#111] border border-gray-700 text-white p-1 rounded font-bold focus:border-green-500 outline-none" 
                                        value={char.hp.current} 
                                        onChange={(e) => setChar({...char,hp: {...char.hp, current: parseInt(e.target.value)}})}
                                    />
                                    <span className="text-gray-500">/ {char.hp.max}</span>
                                </div>
                            </div>
                            <div className="w-full bg-[#111] h-2 rounded-full overflow-hidden border border-gray-700">
                                <div className="bg-green-700 h-full transition-all duration-500" style={{ width: `${Math.min(100, (char.hp.current / char.hp.max) * 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-300">마력 (MP)</span>
                                <div className="flex items-center gap-2 text-sm">
                                    <input 
                                        type="number" 
                                        className="w-12 text-center bg-[#111] border border-gray-700 text-white p-1 rounded font-bold focus:border-blue-500 outline-none" 
                                        value={char.mp.current} 
                                        onChange={(e) => setChar({...char, mp: {...char.mp, current: parseInt(e.target.value)}})}
                                    />
                                    <span className="text-gray-500">/ {char.mp.max}</span>
                                </div>
                            </div>
                             <div className="w-full bg-[#111] h-2 rounded-full overflow-hidden border border-gray-700">
                                <div className="bg-blue-700 h-full transition-all duration-500" style={{ width: `${Math.min(100, (char.mp.current / char.mp.max) * 100)}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Sanity */}
                    <div className="bg-[#1e1e1e] p-5 rounded-sm border border-gray-800 space-y-3 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-2 bg-[#252525] rounded-bl text-[10px] font-mono text-gray-500 border-l border-b border-gray-800">START: {char.san.start}</div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-coc-red text-lg">이성 (SAN)</span>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    className="w-16 text-center bg-[#111] border border-red-900/50 text-coc-red p-2 rounded font-bold focus:border-coc-red outline-none text-xl" 
                                    value={char.san.current} 
                                    onChange={(e) => setChar({...char, san: {...char.san, current: parseInt(e.target.value)}})}
                                />
                                <span className="text-gray-600 font-bold">/ 99</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 mb-4">
                             <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[#252525] p-2 rounded transition flex-1 border border-transparent hover:border-gray-700">
                                <input 
                                    type="checkbox" 
                                    className="accent-coc-red w-4 h-4"
                                    checked={char.tempInsanity} 
                                    onChange={e => setChar({...char, tempInsanity: e.target.checked})}
                                />
                                <span className={char.tempInsanity ? 'text-red-400 font-bold' : 'text-gray-400'}>일시적 광기</span>
                             </label>
                             <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[#252525] p-2 rounded transition flex-1 border border-transparent hover:border-gray-700">
                                <input 
                                    type="checkbox" 
                                    className="accent-coc-red w-4 h-4"
                                    checked={char.indefInsanity} 
                                    onChange={e => setChar({...char, indefInsanity: e.target.checked})}
                                />
                                <span className={char.indefInsanity ? 'text-red-400 font-bold' : 'text-gray-400'}>장기적 광기</span>
                             </label>
                        </div>

                        {/* Insanity Description Input */}
                        <div className="pt-2 border-t border-gray-800">
                             <input 
                                type="text"
                                className="w-full text-sm border-b border-gray-700 focus:border-coc-red focus:outline-none placeholder-gray-600 bg-transparent py-2 text-gray-300 transition-colors"
                                placeholder="광기 내용 (예: 폐쇄공포증, 편집증) 입력..."
                                value={char.insanityDescription || ''}
                                onChange={(e) => setChar({...char, insanityDescription: e.target.value})}
                             />
                        </div>
                    </div>
                </div>

                {/* Combat Stats */}
                <div className="bg-[#1a1a1a] p-6 rounded-sm flex justify-around text-center border border-gray-800 shadow-inner">
                    <div className="flex flex-col gap-1">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">피해 보너스</div>
                        <div className="text-2xl font-black text-gray-200">{char.damageBonus}</div>
                    </div>
                    <div className="w-px bg-gray-700 h-10 self-center"></div>
                    <div className="flex flex-col gap-1">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">체구 (Build)</div>
                        <div className="text-2xl font-black text-gray-200">{char.build}</div>
                    </div>
                    <div className="w-px bg-gray-700 h-10 self-center"></div>
                    <div className="flex flex-col gap-1">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">이동력 (MOV)</div>
                        <div className="text-2xl font-black text-gray-200">{char.moveRate}</div>
                    </div>
                </div>
            </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
            <div className="animate-fade-in">
                
                {/* Points Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Occupation Points */}
                    <div className="bg-[#1e1e1e] p-4 rounded-sm border border-gray-800 shadow-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-sm text-gray-300">직업 기능 점수</span>
                            <span className={`font-mono font-bold ${usedOccPoints > maxOccPoints ? 'text-red-500' : 'text-green-500'}`}>
                                {usedOccPoints} / {maxOccPoints}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#111] p-2 rounded border border-gray-700">
                            <span>총 한도 설정:</span>
                            <input 
                                type="number" 
                                value={maxOccPoints}
                                onChange={(e) => setMaxOccPoints(parseInt(e.target.value) || 0)}
                                className="w-16 p-0.5 bg-transparent border-b border-gray-600 text-center text-white focus:outline-none focus:border-coc-red"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Interest Points */}
                    <div className="bg-[#1e1e1e] p-4 rounded-sm border border-gray-800 shadow-lg">
                        <div className="flex justify-between items-center h-full">
                            <div>
                                <span className="font-bold text-sm text-gray-300 block mb-1">관심 기능 점수</span>
                                <span className="text-xs text-gray-500">(지능 × 2)</span>
                            </div>
                            <div className="text-lg font-mono">
                                <span className={`font-bold ${usedInterestPoints > maxInterestPoints ? 'text-red-500' : 'text-green-500'}`}>
                                    {usedInterestPoints}
                                </span>
                                <span className="mx-1 text-gray-600">/</span>
                                <span className="text-gray-400">{maxInterestPoints}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded border border-gray-800 shadow-xl pb-1">
                    <table className="w-full text-sm text-gray-300 min-w-[500px] md:min-w-full">
                        <thead className="bg-[#2a2a2a] text-gray-400 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-2 md:p-3 text-left sticky left-0 z-10 bg-[#2a2a2a] shadow-[2px_0_5px_rgba(0,0,0,0.3)]">기능명</th>
                                <th className="p-2 md:p-3 w-16 text-center hidden md:table-cell">기본</th>
                                <th className="p-2 md:p-3 w-16 md:w-20 text-center text-gray-200">직업</th>
                                <th className="p-2 md:p-3 w-16 md:w-20 text-center text-yellow-100/70">관심</th>
                                <th className="p-2 md:p-3 w-16 md:w-20 text-center text-blue-100/70">성장</th>
                                <th className="p-2 md:p-3 w-14 md:w-16 text-center bg-[#333] text-white">합계</th>
                                <th className="p-2 md:p-3 w-12 text-center text-yellow-500/70">1/2</th>
                                <th className="p-2 md:p-3 w-12 text-center text-green-500/70">1/5</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 bg-[#1e1e1e]">
                            {char.skills.map((skill, idx) => {
                                const total = skill.base + (skill.occupationPoints || 0) + (skill.interestPoints || 0) + (skill.growth || 0);
                                // Override base for Dodge and Mother Tongue using char.stats
                                let displayBase = skill.base;
                                if (skill.name === '회피') displayBase = Math.floor(char.stats.dex / 2);
                                if (skill.name === '모국어') displayBase = char.stats.edu;
                                
                                const finalTotal = Math.max(displayBase + (skill.occupationPoints || 0) + (skill.interestPoints || 0) + (skill.growth || 0), 0);

                                return (
                                    <tr key={skill.name} className={`hover:bg-[#252525] transition-colors ${skill.isCustom ? 'bg-blue-900/10' : ''}`}>
                                        <td className={`p-2 md:p-3 font-bold group sticky left-0 z-10 bg-[#1e1e1e] shadow-[2px_0_5px_rgba(0,0,0,0.3)] ${skill.isCustom ? 'text-blue-400' : 'text-gray-300'}`}>
                                            <div className="flex flex-col">
                                                <span>{skill.name}</span>
                                                <span className="text-[9px] text-gray-600 md:hidden font-normal">Base: {displayBase}</span>
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-3 text-center text-gray-600 text-xs hidden md:table-cell">{displayBase}</td>
                                        <td className="p-1">
                                            <input 
                                                type="number" 
                                                className="w-full min-w-[40px] text-center border border-gray-700 rounded bg-[#111] text-gray-300 focus:bg-[#000] focus:border-coc-red focus:outline-none py-1.5 md:py-1 text-sm md:text-base"
                                                value={skill.occupationPoints || ''}
                                                onChange={(e) => handleSkillChange(idx, 'occupationPoints', parseInt(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-1">
                                             <input 
                                                type="number" 
                                                className="w-full min-w-[40px] text-center border border-gray-700 rounded bg-[#111] text-gray-300 focus:bg-[#000] focus:border-yellow-600 focus:outline-none py-1.5 md:py-1 text-sm md:text-base"
                                                value={skill.interestPoints || ''}
                                                onChange={(e) => handleSkillChange(idx, 'interestPoints', parseInt(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-1">
                                             <input 
                                                type="number" 
                                                className="w-full min-w-[40px] text-center border border-gray-700 rounded bg-[#111] text-gray-300 focus:bg-[#000] focus:border-blue-600 focus:outline-none py-1.5 md:py-1 text-sm md:text-base"
                                                value={skill.growth || ''}
                                                onChange={(e) => handleSkillChange(idx, 'growth', parseInt(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-2 md:p-3 text-center font-black text-white bg-[#252525] border-l border-r border-gray-800">{finalTotal}</td>
                                        <td className="p-2 md:p-3 text-center text-yellow-400 font-bold text-xs">{calculateHalf(finalTotal)}</td>
                                        <td className="p-2 md:p-3 text-center text-green-400 font-bold text-xs">{calculateFifth(finalTotal)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Add Custom Skill Section */}
                <div className="mt-6 bg-[#1a1a1a] p-5 rounded-sm border border-gray-800 flex flex-col md:flex-row gap-4 items-center">
                    <h3 className="font-bold text-sm text-gray-400 whitespace-nowrap">✚ 새로운 기능 (Custom)</h3>
                    <div className="flex gap-2 w-full">
                        <input 
                            type="text" 
                            className="flex-1 p-2 bg-[#111] border border-gray-700 rounded text-sm text-gray-200 focus:outline-none focus:border-coc-red placeholder-gray-600"
                            placeholder="기능 이름 (예: 운전-전투기)"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                        />
                        <div className="flex items-center gap-1 bg-[#111] border border-gray-700 rounded px-3">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Base</span>
                            <input 
                                type="number" 
                                className="w-12 p-1 text-center font-bold bg-transparent text-white focus:outline-none"
                                value={newSkillBase}
                                onChange={(e) => setNewSkillBase(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <button 
                            onClick={handleAddSkill}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded text-sm font-bold transition shadow-lg"
                        >
                            추가
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* BACKSTORY TAB */}
        {activeTab === 'bg' && (
            <div className="space-y-8 animate-fade-in">
                <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-wider">백스토리</label>
                    <textarea 
                        className="w-full h-80 p-6 bg-[#1e1e1e] border border-gray-800 rounded-sm shadow-inner focus:outline-none focus:border-coc-red font-serif leading-relaxed text-gray-300 resize-none"
                        placeholder="탐사자의 과거, 신념, 중요한 사람들, 의미있는 장소 등을 기록하세요."
                        value={char.backstory}
                        onChange={(e) => setChar({...char, backstory: e.target.value})}
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-wider">소지품 및 장비</label>
                    <textarea 
                        className="w-full h-48 p-6 bg-[#1e1e1e] border border-gray-800 rounded-sm shadow-inner focus:outline-none focus:border-coc-red font-serif text-gray-300 resize-none"
                        placeholder="무기, 현금, 자산, 기타 물품"
                        value={char.gear}
                        onChange={(e) => setChar({...char, gear: e.target.value})}
                    ></textarea>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default CharacterSheet;
