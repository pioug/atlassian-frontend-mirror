/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import TextArea from '../src';

const wrapperStyles = css({
  maxWidth: 500,
});
export default () => (
  <div css={wrapperStyles}>
    <p>Basic:</p>
    <TextArea value="I have a data-testid" testId="MyTextAreaTestId" />
  </div>
);
