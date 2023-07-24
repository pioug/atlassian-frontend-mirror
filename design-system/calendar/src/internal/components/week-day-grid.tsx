/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/react';

import { Grid } from '@atlaskit/primitives';

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
  // TODO: Determine if there is a better way to render the row (should be
  // fixed with introduction of keyboard accessibility of Calendar in DSP-9939) (DSP-11588)
  <Grid
    testId={testId}
    templateColumns="repeat(7, minmax(max-content, 1fr))"
    role="row"
  >
    {children}
  </Grid>
);
export default WeekDayGrid;
