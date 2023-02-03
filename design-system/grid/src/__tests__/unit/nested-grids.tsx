import React from 'react';

import { render } from '@testing-library/react';

import { Grid } from '../../grid';
import { GridItem } from '../../grid-item';

describe('Nested Grids', () => {
  it('does not throw an error when not nested', () => {
    expect(() => render(<Grid />)).not.toThrow();

    expect(() =>
      render(
        <Grid>
          <GridItem />
        </Grid>,
      ),
    ).not.toThrow();
  });

  it('throws an error when a Grid is nested inside of a Grid', () => {
    expect(() =>
      render(
        <Grid>
          <Grid />
        </Grid>,
      ),
    ).toThrow(
      new Error(
        'Invariant failed: @atlaskit/grid: Nesting grids are not supported at this time, please only use a top-level grid.',
      ),
    );

    expect(() =>
      render(
        <Grid>
          <GridItem>
            <Grid>
              <GridItem />
            </Grid>
          </GridItem>
        </Grid>,
      ),
    ).toThrow(
      new Error(
        'Invariant failed: @atlaskit/grid: Nesting grids are not supported at this time, please only use a top-level grid.',
      ),
    );
  });
});
