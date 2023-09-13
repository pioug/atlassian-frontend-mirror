import React from 'react';

import { Stack } from '@atlaskit/primitives';

import Heading from '../../../src/components/heading';

export default () => {
  return (
    <Stack space="space.100">
      <Heading level="xxl">XXL (I'm h1)</Heading>
      <Heading level="xl">XL (I'm h2)</Heading>
      <Heading level="lg">LG (I'm h3)</Heading>
      <Heading level="md">MD (I'm h4)</Heading>
      <Heading level="sm">SM (I'm h5)</Heading>
      <Heading level="xs">XS (I'm h6)</Heading>
      <Heading level="xxs">XXS (I'm a div)</Heading>
    </Stack>
  );
};
