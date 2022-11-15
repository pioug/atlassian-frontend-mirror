/** @jsx jsx */
import { jsx } from '@emotion/react';
import { gs, mq } from '../../common/utils';

export interface ContentProps {
  children: React.ReactNode;
  /* Reduces padding by half to visualize content more compactly */
  isCompact?: boolean;
}

export const blockCardContentClassName = 'block-card-content';

export const Content = ({ children, isCompact = false }: ContentProps) => (
  <div
    css={mq({
      padding: isCompact ? gs(1) : gs(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: isCompact ? 'unset' : ['unset', 'space-between'],
      flexGrow: 1,
    })}
    data-trello-do-not-use-override="block-card-content"
    className={blockCardContentClassName}
  >
    {children}
  </div>
);
