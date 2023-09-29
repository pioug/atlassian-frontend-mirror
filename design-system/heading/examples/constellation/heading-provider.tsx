import React from 'react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import { Box, Stack } from '@atlaskit/primitives';

import Heading, { HeadingContextProvider } from '../../src';

const Section = ({ variant, children }: any) => (
  <HeadingContextProvider>
    <Box paddingInlineStart="space.100">
      <Stack space="space.100">
        <Heading variant={variant}>{variant}</Heading>
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
          <Heading variant="xxlarge">xxlarge and H2</Heading>
          <Section variant="medium">
            <Section variant="large">
              <Section variant="xxlarge" />
            </Section>
          </Section>
        </Stack>
      </Box>
    </HeadingContextProvider>
  );
};
