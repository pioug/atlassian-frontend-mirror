/* eslint-disable @repo/internal/react/consistent-css-prop-usage */
/**  @jsx jsx */

import { jsx } from '@emotion/react';

import { Checkbox } from '../src';

export default function MultilineLabelExample() {
  return (
    <Checkbox
      label={
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>This is spread over</span>
          <span>multiple lines</span>
        </div>
      }
      value="Multiline Label Checkbox"
      name="multiline-label"
      testId="multiline-label"
    />
  );
}
