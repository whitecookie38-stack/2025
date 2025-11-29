
import React, { useState, useEffect } from 'react';
import { Character } from '../types';
import { loadCharacters, deleteCharacter } from '../services/api';
import { LS_API_KEY, NAMES_KOREAN, NAMES_ENGLISH, NAMES_ASIAN } from '../constants';

interface Props {
  onSelectCharacter: (char: Character | null) => void;
}

const Dashboard: React.FC<Props> = ({ onSelectCharacter }) => {
  const [apiUrl, setApiUrl] = useState(localStorage.getItem(LS_API_KEY) || '');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedName, setGeneratedName] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const fetchChars = async () => {
    if (!apiUrl) return;
    setLoading(true);
    setError('');
    try {
      const chars = await loadCharacters(apiUrl);
      // Sort by updated date desc
      chars.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setCharacters(chars);
      localStorage.setItem(LS_API_KEY, apiUrl);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다. URL을 확인하거나 구글 스크립트 배포를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If no API URL is saved, open config automatically
    if (!apiUrl) {
        setShowConfig(true);
    } else {
        fetchChars();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(!window.confirm("정말로 이 탐사자 시트를 삭제하시겠습니까? (복구 불가)")) return;
      
      setLoading(true);
      try {
          await deleteCharacter(apiUrl, id);
          await fetchChars();
      } catch(err) {
          setError('삭제 실패');
      } finally {
          setLoading(false);
      }
  };

  const generateName = (type: 'ko' | 'en' | 'asia') => {
      const list = type === 'ko' ? NAMES_KOREAN : type === 'en' ? NAMES_ENGLISH : NAMES_ASIAN;
      const name = list[Math.floor(Math.random() * list.length)];
      setGeneratedName(name);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 font-sans selection:bg-coc-red selection:text-white relative">
      
      {/* Floating Settings Button */}
      <div className="absolute top-6 right-6 z-50">
        <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold shadow-2xl border border-gray-700 transition-all transform hover:scale-105 ${
                apiUrl 
                ? 'bg-[#2a2a2a] text-gray-300 hover:bg-gray-700 hover:border-gray-500' 
                : 'bg-coc-red text-white hover:bg-red-700 animate-pulse border-red-500'
            }`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {apiUrl ? '서버 설정' : '서버 연동 필요'}
        </button>
      </div>

      {/* Config Modal/Drawer */}
      {showConfig && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 animate-fade-in" onClick={() => setShowConfig(false)}>
            <div className="bg-[#1e1e1e] border border-gray-700 p-8 rounded-lg shadow-2xl max-w-2xl w-full mx-4 relative" onClick={e => e.stopPropagation()}>
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coc-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Google Sheets 서버 연결
                 </h3>
                 <p className="text-gray-400 text-sm mb-6">
                    데이터 저장을 위해 <b>Google Apps Script 웹 앱 URL</b>이 필요합니다.<br/>
                    배포된 스크립트 주소를 아래에 입력하고 '연동 확인'을 눌러주세요.
                 </p>

                 <div className="flex flex-col md:flex-row gap-3 items-center mb-4">
                    <input 
                        type="text" 
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="https://script.google.com/macros/s/.../exec"
                        className="flex-1 w-full bg-[#111] border border-gray-600 rounded px-4 py-3 text-gray-200 focus:outline-none focus:border-coc-red text-sm font-mono shadow-inner"
                    />
                    <button 
                        onClick={fetchChars}
                        disabled={loading}
                        className="w-full md:w-auto bg-coc-red hover:bg-red-700 text-white px-6 py-3 rounded font-bold transition disabled:opacity-50 whitespace-nowrap shadow-lg"
                    >
                        {loading ? '확인 중...' : '연동 확인'}
                    </button>
                </div>
                
                {error && (
                    <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded text-sm text-center mb-4">
                        ⚠️ {error}
                    </div>
                )}

                <div className="text-center">
                    <button onClick={() => setShowConfig(false)} className="text-gray-500 hover:text-white text-sm underline">
                        닫기
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 md:p-12 pt-16">
        {/* Title Header */}
        <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-coc-red mb-2 tracking-tighter opacity-90 drop-shadow-lg">
                Call of Cthulhu
            </h1>
            <div className="flex items-center justify-center gap-4">
                <div className="h-[1px] w-12 bg-gray-600"></div>
                <p className="text-gray-400 font-serif italic tracking-widest text-sm uppercase">Investigator Management System</p>
                <div className="h-[1px] w-12 bg-gray-600"></div>
            </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Create New */}
            <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-[#1e1e1e] to-[#252525] p-6 rounded-sm shadow-2xl border border-gray-800 hover:border-coc-red/50 transition duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-coc-red" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-serif font-bold mb-6 text-gray-100 border-l-4 border-coc-red pl-3">
                        새 탐사자 등록
                    </h2>

                    <div className="mb-8 space-y-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">빠른 이름 생성</p>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => generateName('ko')} className="border border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-300 py-2 rounded-sm text-xs transition">한국식</button>
                                <button onClick={() => generateName('en')} className="border border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-300 py-2 rounded-sm text-xs transition">영어권</button>
                                <button onClick={() => generateName('asia')} className="border border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-300 py-2 rounded-sm text-xs transition">동양권</button>
                            </div>
                        </div>
                        
                        <div className="h-10 flex items-end">
                             {generatedName ? (
                                <div className="text-xl font-serif text-amber-500 border-b border-amber-500/30 w-full pb-1 animate-fade-in">
                                    {generatedName}
                                </div>
                             ) : (
                                 <div className="text-sm text-gray-600 italic border-b border-gray-800 w-full pb-1">
                                     이름이 이곳에 표시됩니다...
                                 </div>
                             )}
                        </div>
                    </div>

                    <button 
                        onClick={() => onSelectCharacter(null)}
                        className="w-full bg-coc-red hover:bg-red-900 text-white font-bold py-4 rounded-sm shadow-lg transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-red-900/20"
                    >
                        <span>작성 시작하기</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Right Column: Character List */}
            <div className="lg:col-span-2">
                 <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-800">
                    <h2 className="text-xl font-serif text-gray-300">보관소 (Archives)</h2>
                    <button onClick={fetchChars} className="text-gray-500 hover:text-white transition" title="목록 새로고침">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                 </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {characters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-800 rounded-lg text-gray-600 bg-[#151515]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm">저장된 기록이 없습니다.</p>
                            {!apiUrl && <button onClick={() => setShowConfig(true)} className="text-xs text-coc-red mt-2 hover:underline cursor-pointer font-bold">* 서버 연동이 필요합니다 (클릭)</button>}
                        </div>
                    ) : (
                        characters.map(char => (
                            <div 
                                key={char.id}
                                onClick={() => onSelectCharacter(char)}
                                className="group bg-[#1e1e1e] p-4 rounded-r-sm border-l-4 border-gray-700 hover:border-coc-red hover:bg-[#252525] cursor-pointer transition-all duration-200 flex justify-between items-center shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-lg ${char.isLost ? 'bg-red-900/30 text-red-500' : 'bg-gray-800 text-gray-400 group-hover:text-white'}`}>
                                        {char.name ? char.name.charAt(0) : '?'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-200 group-hover:text-white flex items-center gap-2">
                                            {char.name || "무명 (Nameless)"}
                                            {char.isLost && <span className="text-[10px] bg-red-950 text-red-500 px-1.5 py-0.5 rounded border border-red-900/50 tracking-wider">LOST</span>}
                                        </h3>
                                        <div className="text-xs text-gray-500 group-hover:text-gray-400 flex gap-2 mt-1">
                                            <span>{char.occupation || "직업 불명"}</span>
                                            <span className="text-gray-700">|</span>
                                            <span>{char.age}세</span>
                                            <span className="text-gray-700">|</span>
                                            <span className={char.san.current < 20 ? 'text-coc-red' : ''}>SAN: {char.san.current}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => handleDelete(e, char.id)}
                                    className="p-2 text-gray-700 hover:text-red-500 hover:bg-red-900/10 rounded transition opacity-0 group-hover:opacity-100"
                                    title="영구 삭제"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
