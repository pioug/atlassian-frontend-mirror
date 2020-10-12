import { ReactNode } from 'react';

export type OverflowProviderProps = {
  children: ReactNode;
  isVisible: boolean;
  openOverflowMenu: () => void;
  closeOverflowMenu: () => void;
};
