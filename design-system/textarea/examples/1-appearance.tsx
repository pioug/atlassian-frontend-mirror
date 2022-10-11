/** @jsx jsx */
import { css, jsx } from '@emotion/react';

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
    <TextArea
      placeholder="standard, disabled"
      appearance="standard"
      testId="standardId"
      isDisabled
    />
    <TextArea placeholder="subtle" appearance="subtle" testId="subtleId" />
    <TextArea
      placeholder="subtle, disabled"
      appearance="subtle"
      testId="subtleId"
      isDisabled
    />
    <TextArea placeholder="none" appearance="none" testId="noneId" />
    <TextArea
      placeholder="none, disabled"
      appearance="none"
      testId="noneId"
      isDisabled
    />
  </div>
);
