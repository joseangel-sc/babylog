import { useCallback } from 'react';
import { setLanguage, getCurrentLanguage } from '~/src/utils/translate';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
];

export function LanguageSelector() {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    window.location.reload();
  }, []);

  return (
    <select 
      onChange={handleChange} 
      defaultValue={getCurrentLanguage()}
      className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm"
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code} className="bg-gray-800 text-white">
          {lang.name}
        </option>
      ))}
    </select>
  );
} 