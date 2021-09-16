/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import TextField from '../src';

const overrideStyles = css({
  padding: 5,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  border: '2px solid orange',
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > [data-ds--text-field--input]': {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    border: '2px solid green',
    fontSize: 20,
  },
});

export default function OverrideStyleExample() {
  return (
    <TextField
      aria-label="customized text field"
      testId="testOverride"
      width="large"
      css={overrideStyles}
      defaultValue="CSS overrides via data-attributes"
    />
  );
}
