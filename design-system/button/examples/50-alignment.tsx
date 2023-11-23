import React from 'react';

import capitalize from 'lodash/capitalize';

import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { Box, Stack } from '@atlaskit/primitives';

import spacing from '../src/utils/spacing';
import variants from '../src/utils/variants';

/**
 * Tests alignment of Button with inline text
 */
export default function ButtonAlignmentExample() {
  return (
    <Stack space="space.300">
      {variants.map(({ name, Component }) => (
        <Stack key={name} space="space.150">
          <h2>{name}</h2>
          {spacing.map((space) => (
            <Stack key={space} space="space.100">
              <h3>{capitalize(space)} spacing</h3>
              <Stack key={space} space="space.100">
                <Box>
                  <Box as="span">Text before</Box>
                  <Component spacing={space}>Button</Component>
                  <Box as="span">Text after</Box>
                </Box>
                <Box>
                  <Box as="span">Text before with icon</Box>
                  <Component iconBefore={ChevronDownIcon} spacing={space}>
                    Button
                  </Component>
                  <Box as="span">Text after with icon</Box>
                </Box>
                <Box>
                  <Box as="span">Text before with icon</Box>
                  <Component iconAfter={ChevronDownIcon} spacing={space}>
                    Button
                  </Component>
                  <Box as="span">Text after with icon</Box>
                </Box>
              </Stack>
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
