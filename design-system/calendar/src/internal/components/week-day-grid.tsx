/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

const gridStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(max-content, 1fr))',
});

interface WeekDayGridProps extends React.HTMLAttributes<HTMLElement> {
  testId?: string;
  children: ReactNode;
}

/**
 * __Week day grid__
 *
 * A week day grid aligns elements in a 7 wide grid layout.
 *
 */
const WeekDayGrid = ({ testId, children }: WeekDayGridProps) => (
  // eslint-disable-next-line @repo/internal/react/use-primitives
  <div data-testid={testId} css={gridStyles}>
    {children}
  </div>
);
export default WeekDayGrid;
