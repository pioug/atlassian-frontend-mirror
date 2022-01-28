import { useContext, createContext } from 'react';
import { FlexibleUiDataContext } from './types';

export const FlexibleUiContext = createContext<
  FlexibleUiDataContext | undefined
>(undefined);

export const useFlexibleUiContext = () => useContext(FlexibleUiContext);
