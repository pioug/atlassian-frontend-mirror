import { ReactNode } from 'react';

export interface WithShowControlMethodProp {
  showControls?: () => void;
}

export interface ContextViewModel {
  icon?: ReactNode;
  text: string;
}

export type InlinePreloaderStyle =
  | 'on-left-with-skeleton'
  | 'on-right-without-skeleton';
