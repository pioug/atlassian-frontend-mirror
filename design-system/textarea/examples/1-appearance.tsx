/** @jsx jsx */
import { jsx } from '@emotion/core';

import TextArea from '../src';

export default () => (
  <div
    id="appearance"
    css={{
      maxWidth: 500,
    }}
  >
    <TextArea
      placeholder="standard"
      appearance="standard"
      testId="standardId"
    />
    <TextArea placeholder="subtle" appearance="subtle" testId="subtleId" />
    <TextArea placeholder="none" appearance="none" testId="noneId" />
  </div>
);
