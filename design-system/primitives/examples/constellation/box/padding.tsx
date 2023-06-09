import React, { useState } from 'react';

import Heading from '@atlaskit/heading';
import { Box, type BoxProps, Inline, Stack, xcss } from '@atlaskit/primitives';
import Range from '@atlaskit/range';

const containerStyles = xcss({ display: 'flex' });
const boxStyles = xcss({
  display: 'block',
  justifyContent: 'start',
  color: 'color.text.inverse',
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
        <div>{spacingValues[padding]}</div>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={padding}
          onChange={padding => setPadding(padding)}
        />

        <Box xcss={containerStyles}>
          <Box
            backgroundColor="color.background.discovery.bold"
            xcss={boxStyles}
            padding={spacingValues[padding]}
          >
            Content
          </Box>
        </Box>
      </Stack>

      <Stack grow="fill">
        <Heading level="h600">paddingInline</Heading>
        <div>{spacingValues[paddingInline]}</div>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingInline}
          onChange={paddingInline => setPaddingInline(paddingInline)}
        />

        <Heading level="h600">paddingBlock</Heading>
        <div>{spacingValues[paddingBlock]}</div>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingBlock}
          onChange={paddingBlock => setPaddingBlock(paddingBlock)}
        />

        <Box xcss={containerStyles}>
          <Box
            backgroundColor="color.background.discovery.bold"
            xcss={boxStyles}
            paddingInline={spacingValues[paddingInline]}
            paddingBlock={spacingValues[paddingBlock]}
          >
            Content
          </Box>
        </Box>
      </Stack>

      <Stack grow="fill">
        <Heading level="h600">paddingInlineStart</Heading>
        <div>{spacingValues[paddingInlineStart]}</div>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingInlineStart}
          onChange={paddingInlineStart =>
            setPaddingInlineStart(paddingInlineStart)
          }
        />

        <Heading level="h600">paddingInlineEnd</Heading>
        <div>{spacingValues[paddingInlineEnd]}</div>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingInlineEnd}
          onChange={paddingInlineEnd => setPaddingInlineEnd(paddingInlineEnd)}
        />

        <Heading level="h600">paddingBlockStart</Heading>
        <div>{spacingValues[paddingBlockStart]}</div>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingBlockStart}
          onChange={paddingBlockStart =>
            setPaddingBlockStart(paddingBlockStart)
          }
        />

        <Heading level="h600">paddingBlockEnd</Heading>
        <div>{spacingValues[paddingBlockEnd]}</div>
        <Range
          max={spacingValues.length - 1}
          step={1}
          value={paddingBlockEnd}
          onChange={paddingBlockEnd => setPaddingBlockEnd(paddingBlockEnd)}
        />

        <Box xcss={containerStyles}>
          <Box
            backgroundColor="color.background.discovery.bold"
            xcss={boxStyles}
            paddingBlockStart={spacingValues[paddingBlockStart]}
            paddingBlockEnd={spacingValues[paddingBlockEnd]}
            paddingInlineStart={spacingValues[paddingInlineStart]}
            paddingInlineEnd={spacingValues[paddingInlineEnd]}
          >
            Content
          </Box>
        </Box>
      </Stack>
    </Inline>
  );
}
