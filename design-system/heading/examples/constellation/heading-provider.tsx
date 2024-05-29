import React from 'react';

import { Box, Stack, Text } from '@atlaskit/primitives';

import Heading, { HeadingContextProvider } from '../../src';

const Section = ({ size, willRenderAs, children }: any) => (
  <HeadingContextProvider>
      <Stack space="space.100">
        <Heading size={size}>Heading {size} as {willRenderAs}</Heading>
        <Text as="p">
          This section's heading is rendered as a {willRenderAs}, despite being {size}.
        </Text>
        {children}
      </Stack>
  </HeadingContextProvider>
);

export default () => {
  return (
    <HeadingContextProvider value={2}>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <Box style={{ maxWidth: 850, margin: 'auto' }}>
        <Stack testId="headings" space="space.100">
          <Heading size="xxlarge">Heading xxlarge as h2</Heading>
          <Section size="medium" willRenderAs="h3">
            <Section size="medium" willRenderAs="h4"/>
          </Section>
        </Stack>
      </Box>
    </HeadingContextProvider>
  );
};
