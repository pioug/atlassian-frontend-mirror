import React from 'react';

import Heading from '@atlaskit/heading';

import { Stack, Text } from '../src';

const variants = ['body.small', 'body', 'body.large'] as const;

const weights = ['regular', 'medium', 'semibold', 'bold'] as const;

export default () => {
  return (
    <Stack space="space.300">
      <section>
        <Stack space="space.100">
          <Heading variant="medium" as="h3">
            Variants
          </Heading>
          {variants.map(variant => (
            <Text key={variant} variant={variant}>
              Text variant {variant}
            </Text>
          ))}
        </Stack>
      </section>
      <section>
        <Stack space="space.100">
          <Heading variant="medium" as="h3">
            Weights
          </Heading>
          {weights.map(weight => (
            <Text key={weight} weight={weight}>
              Text weight {weight}
            </Text>
          ))}
        </Stack>
      </section>
      <section>
        <Stack space="space.100">
          <Heading variant="medium" as="h3">
            Rendered element
          </Heading>
          <Text variant="body" as="strong">
            Text as strong tag
          </Text>
          <Text variant="body" as="em">
            Text as em tag
          </Text>
          <Text variant="body">
            Text is rendered as a {'<span>'} by default
          </Text>
        </Stack>
      </section>
    </Stack>
  );
};
