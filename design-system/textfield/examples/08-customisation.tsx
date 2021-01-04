/** @jsx jsx */

import { jsx } from '@emotion/core';

import TextField from '../src';

export default function OverrideStyleExample() {
  return (
    <TextField
      testId="testOverride"
      width="large"
      css={{
        padding: 5,
        border: '2px solid orange',
        '& > [data-ds--text-field--input]': {
          fontSize: 20,
          border: '2px solid green',
        },
      }}
      defaultValue="CSS overrides via data-attributes"
    />
  );
}
