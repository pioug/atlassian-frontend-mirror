/** @jsx jsx */
import { jsx } from '@emotion/core';
import { gs, mq } from '../utils';

export interface ContentFooterProps {
  children: React.ReactNode;
  hasSpaceBetween?: boolean;
}

export const contentFooterClassName = 'smart-link-content-footer';

export const ContentFooter = ({
  children,
  hasSpaceBetween = false,
}: ContentFooterProps) => (
  <div
    css={mq({
      display: 'flex',
      flexDirection: ['column', 'row'],
      flexGrow: [1, 'unset'],
      justifyContent: [
        hasSpaceBetween ? 'space-between' : 'flex-end',
        'space-between',
      ],
      alignItems: ['unset', 'center'],
      marginTop: [gs(1), gs(1.5)],
    })}
    className={contentFooterClassName}
  >
    {children}
  </div>
);
