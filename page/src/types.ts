import { ReactNode } from 'react';

export interface GridColumnProps {
  medium?: number;
  children?: ReactNode;
  theme?: ThemeProps;
}

export interface ThemeProps {
  columns: number;
  spacing: string;
  isNestedGrid?: boolean;
}
