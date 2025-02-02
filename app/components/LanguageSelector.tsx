import { useCallback } from 'react';
import { setLanguage, getCurrentLanguage } from '~/src/utils/translate';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
];

export function LanguageSelector() {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    // Force reload to update all translations
    window.location.reload();
  }, []);

  return (
    <select 
      onChange={handleChange} 
      defaultValue={getCurrentLanguage()}
      className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm"
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
} 