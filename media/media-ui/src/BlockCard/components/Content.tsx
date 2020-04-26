/** @jsx jsx */
import { jsx } from '@emotion/core';
import { gs, mq } from '../utils';

export interface ContentProps {
  children: React.ReactNode;
}

export const Content = ({ children }: ContentProps) => (
  <div
    css={mq({
      padding: gs(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: ['unset', 'space-between'],
      flexGrow: 1,
    })}
  >
    {children}
  </div>
);
