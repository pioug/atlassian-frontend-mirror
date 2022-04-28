import { useContext, createContext } from 'react';
import { FlexibleUiDataContext } from './types';

/**
 * This provides the data that will be used by Smart Links Flexible UI to populate it's
 * underlying elements.
 */
export const FlexibleUiContext = createContext<
  FlexibleUiDataContext | undefined
>(undefined);

export const useFlexibleUiContext = () => useContext(FlexibleUiContext);
