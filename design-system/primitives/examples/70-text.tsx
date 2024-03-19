import React from 'react';

import Heading from '@atlaskit/heading';

import { Stack, Text } from '../src';

const sizes = ['small', 'UNSAFE_small', 'medium', 'large'] as const;
const weights = ['regular', 'medium', 'semibold', 'bold'] as const;

export default () => {
  return (
    <Stack space="space.300">
      <section>
        <Stack space="space.100">
          <Heading size="medium" as="h3">
            Sizes
          </Heading>
          {sizes.map(size => (
            <Text key={size} size={size}>
              Text size: {size}
            </Text>
          ))}
        </Stack>
      </section>
      <section>
        <Stack space="space.100">
          <Heading size="medium" as="h3">
            Weights
          </Heading>
          {weights.map(weight => (
            <Text key={weight} weight={weight}>
              Text weight: {weight}
            </Text>
          ))}
        </Stack>
      </section>
      <section>
        <Stack space="space.100">
          <Heading size="medium" as="h3">
            Rendered element
          </Heading>
          <Text as="strong">Text as strong tag</Text>
          <Text as="em">Text as em tag</Text>
          <Text>Text is rendered as a {'<span>'} by default</Text>
        </Stack>
      </section>
    </Stack>
  );
};
