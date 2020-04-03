import { useContext, createContext } from 'react';
import { CardContext } from './types';
import { SmartCardProvider, ProviderProps } from './provider';

export const SmartCardContext = createContext<CardContext | undefined>(
  undefined,
);

export function useSmartLinkContext() {
  const context = useContext(SmartCardContext);
  if (!context) {
    throw Error('useSmartCard() must be wrapped in <SmartCardProvider>');
  }
  return context;
}
export { SmartCardProvider, ProviderProps, CardContext };
export default SmartCardContext;
