import React, { useState } from 'react';

import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { Box, type BoxProps, Inline, Stack } from '@atlaskit/primitives';

const backgroundColors: BoxProps['backgroundColor'][] = [
  'color.background.neutral',
  'color.background.warning',
  'color.background.selected',
  'color.background.danger',
  'color.background.success',
  'color.background.discovery',
  'color.background.information',
];

export default function Example() {
  const [backgroundColor, setBackgroundColor]: [
    BoxProps['backgroundColor'],
    Function,
  ] = useState('color.background.discovery');

  return (
    <Stack space="space.200" alignInline="start">
      <Inline alignBlock="center" space="space.100">
        <Box padding="space.400" backgroundColor={backgroundColor} />
        {backgroundColor}
      </Inline>
      <DropdownMenu trigger="Choose a background color">
        {backgroundColors.map(bgValue => (
          <DropdownItem
            isSelected={bgValue === backgroundColor}
            onClick={() => setBackgroundColor(bgValue)}
          >
            {bgValue}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Stack>
  );
}
