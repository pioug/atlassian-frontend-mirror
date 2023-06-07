/**  @jsx jsx */

import { css, jsx } from '@emotion/react';

import { Checkbox } from '../src';

const displayStyles = css({
  display: 'flex',
  flexDirection: 'column',
});

export default function MultilineLabelExample() {
  return (
    <Checkbox
      label={
        <div css={displayStyles}>
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
