import { createContext } from 'react';

export const { Consumer, Provider } = createContext({
  mode: 'light',
});
