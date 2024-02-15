import React from 'react';

import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';

import { Box, Inline, Stack, xcss } from '../src';

const alignInlineItems = ['start', 'center', 'end'] as const;
const alignBlockItems = ['start', 'center', 'end', 'baseline'] as const;
const spreadItems = ['space-between'] as const;
const spaceItems = [
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
] as const;

const blockStyles = xcss({ borderRadius: 'border.radius.050' });
const Block = () => (
  <Box
    xcss={blockStyles}
    padding="space.200"
    backgroundColor="color.background.discovery.bold"
  />
);

const pageContainerStyles = xcss({ maxWidth: '900px' });
const spaceNameStyles = xcss({ minWidth: token('space.1000', '80px') });
const containerStyles = xcss({
  display: 'flex',
  borderRadius: 'border.radius.050',
});

export default () => (
  <Box padding="space.200" xcss={pageContainerStyles}>
    <Stack space="space.400">
      <Heading variant="large" as="h2">
        Inline
      </Heading>

      <section>
        <Heading variant="medium" as="h3">
          Align inline
        </Heading>
        {alignInlineItems.map(alignInline => (
          <Stack key={alignInline}>
            {alignInline}
            <Box
              xcss={blockStyles}
              backgroundColor="color.background.neutral"
              padding="space.050"
              style={{
                width: '200px',
              }}
            >
              <Inline alignInline={alignInline} space="space.050">
                <Block />
                <Block />
                <Block />
              </Inline>
            </Box>
          </Stack>
        ))}
      </section>

      <section>
        <Heading variant="medium" as="h3">
          Spread
        </Heading>
        {spreadItems.map(spread => (
          <Stack key={spread}>
            {spread}
            <Box
              xcss={blockStyles}
              backgroundColor="color.background.neutral"
              padding="space.050"
              style={{
                width: '200px',
              }}
            >
              <Inline spread={spread} space="space.050">
                <Block />
                <Block />
                <Block />
              </Inline>
            </Box>
          </Stack>
        ))}
      </section>
      <section>
        <Heading variant="medium" as="h3">
          Align block
        </Heading>
        <Inline space="space.200">
          {alignBlockItems.map(alignBlock => (
            <Stack key={alignBlock} alignInline="center">
              {alignBlock}
              <Box
                backgroundColor="color.background.neutral"
                padding="space.050"
                xcss={containerStyles}
                style={{
                  height: '200px',
                }}
              >
                <Inline space="space.050" alignBlock={alignBlock}>
                  <Box
                    xcss={blockStyles}
                    padding="space.300"
                    backgroundColor="color.background.discovery.bold"
                  ></Box>
                  <Block />
                  <Block />
                </Inline>
              </Box>
            </Stack>
          ))}
        </Inline>
      </section>

      <section>
        <Heading variant="medium" as="h3">
          Space
        </Heading>
        <Stack space="space.050">
          {spaceItems.map(space => (
            <Inline key={space} alignBlock="center">
              <Box xcss={spaceNameStyles}>{space}</Box>
              <Box
                xcss={blockStyles}
                padding="space.050"
                backgroundColor="color.background.neutral"
              >
                <Inline space={space}>
                  <Block />
                  <Block />
                </Inline>
              </Box>
            </Inline>
          ))}
        </Stack>
      </section>

      <section>
        <Heading variant="medium" as="h3">
          Should wrap
        </Heading>
        <Box
          xcss={blockStyles}
          padding="space.050"
          backgroundColor="color.background.neutral"
        >
          <Inline space="space.200" shouldWrap={true}>
            {[...Array(25)].map((_, index) => (
              <Block key={index} />
            ))}
          </Inline>
        </Box>
      </section>

      <section>
        <Heading variant="medium" as="h3">
          Separator
        </Heading>
        <Box
          xcss={blockStyles}
          padding="space.050"
          backgroundColor="color.background.neutral"
        >
          <Inline
            space="space.100"
            shouldWrap={true}
            alignBlock="center"
            separator="/"
          >
            {[...Array(20)].map((_, index) => (
              <Block key={index} />
            ))}
          </Inline>
        </Box>
      </section>
    </Stack>
  </Box>
);
