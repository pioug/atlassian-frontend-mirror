import React from 'react';

import Avatar from '@atlaskit/avatar';
import Heading from '@atlaskit/heading';

import { Inline, Stack } from '../../../src';

export default function Example() {
  return (
    <Inline spread="space-between">
      <Stack space="space.100">
        <Heading level="h400">Start aligment</Heading>
        <Inline space="space.200" alignBlock="start">
          <Avatar size="small" />
          <Avatar size="medium" />
          <Avatar size="large" />
        </Inline>
      </Stack>
      <Stack space="space.100">
        <Heading level="h400">Center aligment</Heading>
        <Inline space="space.200" alignBlock="center">
          <Avatar size="small" />
          <Avatar size="medium" />
          <Avatar size="large" />
        </Inline>
      </Stack>
      <Stack space="space.100">
        <Heading level="h400">End aligment</Heading>
        <Inline space="space.200" alignBlock="end">
          <Avatar size="small" />
          <Avatar size="medium" />
          <Avatar size="large" />
        </Inline>
      </Stack>
    </Inline>
  );
}
