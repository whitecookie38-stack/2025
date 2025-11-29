
import { Character } from '../types';

export const saveCharacter = async (url: string, character: Character): Promise<any> => {
  const payload = {
    action: 'save',
    data: character
  };

  // Google Apps Script Web App requests requires specific handling to avoid CORS preflight errors.
  // Using 'text/plain' allows a simple POST request which GAS can handle easily.
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload)
  });
  
  return response.json();
};

export const loadCharacters = async (url: string): Promise<Character[]> => {
  const response = await fetch(`${url}?action=list`);
  const data = await response.json();
  return data.items || [];
};

export const deleteCharacter = async (url: string, id: string): Promise<any> => {
    const payload = {
        action: 'delete',
        id: id
    };
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload)
    });
    return response.json();
}
