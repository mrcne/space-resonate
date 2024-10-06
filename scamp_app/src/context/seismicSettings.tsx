import {createContext, useState, ReactNode, useContext} from 'react';
import {SeismicSettings} from '../types/seismicSettings';

interface SeismicSettingsContextProps {
  settings: SeismicSettings;
  setSettings: (settings: SeismicSettings) => void;
}

const SeismicSettingsContext = createContext<SeismicSettingsContextProps | undefined>(undefined);

export const SeismicSettingsProvider = ({children}: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SeismicSettings>({
    dataSet: 'lunar',
    dataSource: 'all',
    event: '',
  });

  return (
    <SeismicSettingsContext.Provider value={{settings, setSettings}}>
      {children}
    </SeismicSettingsContext.Provider>
  );
};

export const useSeismicSettings = () => {
  const context = useContext(SeismicSettingsContext);
  if (context === undefined) {
    throw new Error('useSeismicSettings must be used within a SeismicSettingsProvider');
  }
  return context;
};
