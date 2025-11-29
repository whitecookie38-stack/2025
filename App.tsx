import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import CharacterSheet from './components/CharacterSheet';
import { Character } from './types';
import { saveCharacter } from './services/api';
import { LS_API_KEY } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [selectedChar, setSelectedChar] = useState<Character | undefined>(undefined);

  const handleSelectCharacter = (char: Character | null) => {
    setSelectedChar(char || undefined);
    setView('editor');
  };

  const handleSave = async (char: Character) => {
    const url = localStorage.getItem(LS_API_KEY);
    if (!url) {
      alert("API URL이 설정되지 않았습니다. 대시보드에서 설정해주세요.");
      return;
    }
    
    // Add logic to save timestamp
    const charToSave = { ...char, updatedAt: new Date().toISOString() };
    
    try {
        await saveCharacter(url, charToSave);
        alert("저장되었습니다.");
        setView('dashboard');
    } catch (e) {
        alert("저장 중 오류가 발생했습니다. 구글 시트 스크립트 로그를 확인하세요.");
        console.error(e);
    }
  };

  return (
    <div>
      {view === 'dashboard' ? (
        <Dashboard onSelectCharacter={handleSelectCharacter} />
      ) : (
        <CharacterSheet 
            initialData={selectedChar} 
            onSave={handleSave} 
            onBack={() => setView('dashboard')} 
        />
      )}
    </div>
  );
};

export default App;