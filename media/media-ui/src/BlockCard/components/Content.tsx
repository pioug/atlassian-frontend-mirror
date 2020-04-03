/** @jsx jsx */
import { jsx } from '@emotion/core';
import { gs } from '../utils';

export interface ContentProps {
  children: React.ReactNode;
}

export const Content = ({ children }: ContentProps) => (
  <div
    css={{
      padding: gs(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexGrow: 1,
    }}
  >
    {children}
  </div>
);
