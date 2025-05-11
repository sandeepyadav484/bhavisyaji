import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
];

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, loading } = useLanguage();
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label htmlFor="language-select" style={{ fontWeight: 'bold' }}>{t('language')}:</label>
      <select
        id="language-select"
        value={language}
        onChange={e => setLanguage(e.target.value)}
        disabled={loading}
        style={{ padding: '4px 8px', borderRadius: 4 }}
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
      {loading && <span style={{ marginLeft: 8 }}>{t('loading')}</span>}
    </div>
  );
};

export default LanguageSelector; 