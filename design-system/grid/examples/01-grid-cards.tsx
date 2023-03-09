/** @jsx jsx */
import { jsx } from '@emotion/react';

import Box, { BoxProps } from '@atlaskit/ds-explorations/box';

import Grid, { GridItem, GridProps } from '../src';

const itemProps: BoxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'elevation.surface.sunken',
  borderColor: 'color.border',
  borderWidth: '3px',
  borderStyle: 'solid',
  height: 'size.600',
} as const;

export default ({
  maxWidth,
  hasInlinePadding,
}: {
  maxWidth?: GridProps['maxWidth'];
  hasInlinePadding?: GridProps['hasInlinePadding'];
}) => {
  return (
    <Grid maxWidth={maxWidth} hasInlinePadding={hasInlinePadding} testId="grid">
      <GridItem>
        <Box {...itemProps} />
      </GridItem>
      {Array.from({ length: 8 }).map((_, i) => (
        <GridItem span={{ sm: 4, lg: 3 }} key={`small-items-${i}`}>
          <Box {...itemProps}>{i + 1}</Box>
        </GridItem>
      ))}

      <GridItem start={{ md: 4 }} span={{ md: 6 }}>
        <Box {...itemProps}>Offset Longer</Box>
      </GridItem>

      {Array.from({ length: 8 }).map((_, i) => (
        <GridItem span={{ sm: 6 }} key={`medium-items-${i}`}>
          <Box {...itemProps} />
        </GridItem>
      ))}
    </Grid>
  );
};
