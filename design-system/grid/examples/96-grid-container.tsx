/** @jsx jsx */
import { jsx } from '@emotion/react';

// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import Box, { BoxProps } from '@atlaskit/ds-explorations/box';

import Grid, { GridContainer, GridItem } from '../src';

const itemProps: BoxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'elevation.surface.raised',
  borderColor: 'color.border',
  borderWidth: '3px',
  borderStyle: 'solid',
  height: 'size.600',
  padding: 'space.200',
} as const;

const NestedGrid = () => {
  return (
    <div>
      {/* set maxWidth and hasInlinePadding on GridContainer instead of Grid */}
      <GridContainer maxWidth={undefined} hasInlinePadding={true}>
        <Grid>
          <GridItem span={{ xxs: 4 }}>
            <Box {...itemProps}>
              <p style={{ textAlign: 'center' }}>span 4</p>
            </Box>
          </GridItem>
          <GridItem span={{ xxs: 4 }}>
            <Box {...itemProps}>
              <p style={{ textAlign: 'center' }}>span 4</p>
            </Box>
          </GridItem>
          <GridItem span={{ xxs: 4 }}>
            <Box {...itemProps}>
              <p style={{ textAlign: 'center' }}>span 4</p>
            </Box>
          </GridItem>
        </Grid>

        <Grid>
          <GridItem span={{ xxs: 4 }}>
            <Box {...itemProps}>
              <p style={{ textAlign: 'center' }}>span 4</p>
            </Box>
          </GridItem>
          <GridItem span={{ xxs: 8 }}>
            <Box {...itemProps}>
              <p style={{ textAlign: 'center' }}>span 8</p>
            </Box>
          </GridItem>
          <GridItem span={{ xxs: 4 }}>
            <Box {...itemProps}>
              <p style={{ textAlign: 'center' }}>span 4</p>
            </Box>
          </GridItem>
        </Grid>

        <Grid>
          <GridItem span={{ xxs: 4 }}>
            <Box {...itemProps}>
              <p style={{ textAlign: 'center' }}>span 4</p>
            </Box>
          </GridItem>
          <GridItem span={{ xxs: 8 }}>
            <Box {...itemProps}>
              <p style={{ textAlign: 'center' }}>span 8</p>
            </Box>
          </GridItem>
          <GridItem span={{ xxs: 4 }}>
            <Box {...itemProps}>
              <p style={{ textAlign: 'center' }}>span 4</p>
            </Box>
          </GridItem>
        </Grid>
      </GridContainer>
    </div>
  );
};

export default NestedGrid;
