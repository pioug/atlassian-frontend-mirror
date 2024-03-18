import React from 'react';

import { Box, Stack, Text } from '@atlaskit/primitives';

import Heading, { HeadingContextProvider } from '../../src';

const Section = ({ size, children }: any) => (
  <HeadingContextProvider>
    <Box paddingInlineStart="space.100">
      <Stack space="space.100">
        <Heading size={size}>Heading {size}</Heading>
        <Text as="p">
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
          <Heading size="xxlarge">Heading xxlarge as H1</Heading>
          <Section size="medium">
            <Section size="large">
              <Section size="xxlarge" />
            </Section>
          </Section>
        </Stack>
      </Box>
    </HeadingContextProvider>
  );
};
