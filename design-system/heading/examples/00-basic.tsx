import React from 'react';

import { B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Heading from '../src';

export default () => {
  return (
    <div id="headings">
      <Heading level="h100">h100</Heading>
      <Heading level="h200">h200</Heading>
      <Heading level="h300">h300</Heading>
      <Heading level="h400">h400</Heading>
      <Heading level="h500">h500</Heading>
      <Heading level="h600">h600</Heading>
      <Heading level="h700">h700</Heading>
      <Heading level="h800">h800</Heading>
      <Heading level="h900">h900</Heading>
      <div
        style={{
          backgroundColor: token('color.background.brand.bold', B400),
        }}
      >
        <Heading level="h900" color="inverse">
          inverse
        </Heading>
      </div>
    </div>
  );
};
