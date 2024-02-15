import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import type { TableDirection } from '../../types';
import { DragInMotionIcon } from '../icons/DragInMotionIcon';

const boxStyles = xcss({
  borderColor: 'color.border.focused',
  borderStyle: 'solid',
  borderRadius: 'border.radius.100',
  borderWidth: 'border.width.outline',
  backgroundColor: 'color.blanket.selected',
});

export const DragPreview = ({
  direction,
  width,
  height,
}: {
  direction: TableDirection;
  width: number;
  height: number;
}) => {
  let marginLeft = direction === 'row' ? -14 : width / 2 - 14;
  let marginTop = direction === 'row' ? height / 2 - 14 : -10;
  let transform = direction === 'row' ? 'rotate(90deg)' : 'none';
  return (
    <Box
      xcss={boxStyles}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <DragInMotionIcon
        style={{
          position: 'absolute',
          marginLeft: `${marginLeft}px`,
          marginTop: `${marginTop}px`,
          transform: transform,
        }}
      />
    </Box>
  );
};
