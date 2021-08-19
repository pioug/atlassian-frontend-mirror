/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import TextArea from '../src';

const wrapperStyles = css({
  maxWidth: 500,
});

export default () => (
  <div id="appearance" css={wrapperStyles}>
    <TextArea
      placeholder="standard"
      appearance="standard"
      testId="standardId"
    />
    <TextArea placeholder="subtle" appearance="subtle" testId="subtleId" />
    <TextArea placeholder="none" appearance="none" testId="noneId" />
  </div>
);
