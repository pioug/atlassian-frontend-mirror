import React, { useState } from 'react';

import Heading from '@atlaskit/heading';
import {
  Box,
  type BoxProps,
  Flex,
  Inline,
  Stack,
  xcss,
} from '@atlaskit/primitives';
import Range from '@atlaskit/range';

const boxStyles = xcss({
  display: 'block',
  justifyContent: 'start',
  color: 'color.text',
  borderColor: 'color.border.discovery',
  borderStyle: 'solid',
  borderRadius: 'border.radius',
  borderWidth: 'border.width.outline',
});

const spacingValues: BoxProps['padding'][] = [
  'space.0',
  'space.025',
  'space.050',
  'space.075',
  'space.100',
  'space.150',
  'space.200',
  'space.250',
  'space.300',
  'space.400',
  'space.500',
  'space.600',
  'space.800',
  'space.1000',
];

export default function Example() {
  const [padding, setPadding] = useState(6);
  const [paddingInline, setPaddingInline] = useState(6);
  const [paddingInlineStart, setPaddingInlineStart] = useState(6);
  const [paddingInlineEnd, setPaddingInlineEnd] = useState(6);
  const [paddingBlock, setPaddingBlock] = useState(6);
  const [paddingBlockStart, setPaddingBlockStart] = useState(6);
  const [paddingBlockEnd, setPaddingBlockEnd] = useState(6);

  return (
    <Inline space="space.200">
      <Stack grow="fill">
        <Heading level="h600">padding</Heading>
        <Box>{spacingValues[padding]}</Box>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={padding}
          onChange={padding => setPadding(padding)}
        />

        <Flex>
          <Box
            backgroundColor="color.background.discovery"
            xcss={boxStyles}
            padding={spacingValues[padding]}
          >
            Content
          </Box>
        </Flex>
      </Stack>

      <Stack grow="fill">
        <Heading level="h600">paddingInline</Heading>
        <Box>{spacingValues[paddingInline]}</Box>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingInline}
          onChange={paddingInline => setPaddingInline(paddingInline)}
        />

        <Heading level="h600">paddingBlock</Heading>
        <Box>{spacingValues[paddingBlock]}</Box>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingBlock}
          onChange={paddingBlock => setPaddingBlock(paddingBlock)}
        />

        <Flex>
          <Box
            backgroundColor="color.background.discovery"
            xcss={boxStyles}
            paddingInline={spacingValues[paddingInline]}
            paddingBlock={spacingValues[paddingBlock]}
          >
            Content
          </Box>
        </Flex>
      </Stack>

      <Stack grow="fill">
        <Heading level="h600">paddingInlineStart</Heading>
        <Box>{spacingValues[paddingInlineStart]}</Box>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingInlineStart}
          onChange={paddingInlineStart =>
            setPaddingInlineStart(paddingInlineStart)
          }
        />

        <Heading level="h600">paddingInlineEnd</Heading>
        <Box>{spacingValues[paddingInlineEnd]}</Box>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingInlineEnd}
          onChange={paddingInlineEnd => setPaddingInlineEnd(paddingInlineEnd)}
        />

        <Heading level="h600">paddingBlockStart</Heading>
        <Box>{spacingValues[paddingBlockStart]}</Box>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingBlockStart}
          onChange={paddingBlockStart =>
            setPaddingBlockStart(paddingBlockStart)
          }
        />

        <Heading level="h600">paddingBlockEnd</Heading>
        <Box>{spacingValues[paddingBlockEnd]}</Box>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingBlockEnd}
          onChange={paddingBlockEnd => setPaddingBlockEnd(paddingBlockEnd)}
        />

        <Flex>
          <Box
            backgroundColor="color.background.discovery"
            xcss={boxStyles}
            paddingBlockStart={spacingValues[paddingBlockStart]}
            paddingBlockEnd={spacingValues[paddingBlockEnd]}
            paddingInlineStart={spacingValues[paddingInlineStart]}
            paddingInlineEnd={spacingValues[paddingInlineEnd]}
          >
            Content
          </Box>
        </Flex>
      </Stack>
    </Inline>
  );
}
