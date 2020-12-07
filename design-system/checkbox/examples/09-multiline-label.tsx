/**  @jsx jsx */

import { css, jsx } from '@emotion/core';

import { Checkbox } from '../src';

export default function MultilineLabelExample() {
  return (
    <Checkbox
      label={
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
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
