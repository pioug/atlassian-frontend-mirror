/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import { Box, Stack } from '@atlaskit/primitives';

import Heading, { HeadingContextProvider } from '../src';

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
          <Heading level="h900">h900 and H1</Heading>
          <Section level="h800">
            <Section level="h700">
              <Section level="h600" />
            </Section>
            <Section level="h700" />
          </Section>
          <Section level="h600">
            <Section level="h700">
              <Section level="h800" />
            </Section>
          </Section>
        </Stack>
      </Box>
    </HeadingContextProvider>
  );
};
