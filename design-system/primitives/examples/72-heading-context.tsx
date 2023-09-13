import React from 'react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import { Box, Stack } from '@atlaskit/primitives';

import Heading from '../src/components/heading';
import HeadingContextProvider from '../src/components/heading-context';

const Section = ({ level, children }: any) => (
  <HeadingContextProvider>
    <Box paddingInlineStart="space.100">
      <Stack space="space.100">
        <Heading level={level}>{level}</Heading>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic adipisci,
          fuga perferendis nam neque doloribus velit eveniet? Distinctio
          explicabo autem est. Temporibus sunt non beatae quis minus rem
          deleniti repellat consequuntur laboriosam eius mollitia repudiandae.
        </Text>
        {children}
      </Stack>
    </Box>
  </HeadingContextProvider>
);

export default () => {
  return (
    <HeadingContextProvider>
      <Box style={{ maxWidth: 850, margin: 'auto' }}>
        <Stack testId="headings" space="space.100">
          <Heading level="xxl">h900 and H1</Heading>
          <Section level="xl">
            <Section level="lg">
              <Section level="md" />
            </Section>
            <Section level="lg" />
          </Section>
          <Section level="md">
            <Section level="lg">
              <Section level="xxl" />
            </Section>
          </Section>
        </Stack>
      </Box>
    </HeadingContextProvider>
  );
};
