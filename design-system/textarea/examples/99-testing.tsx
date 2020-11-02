/** @jsx jsx */
import { jsx } from '@emotion/core';

import TextArea from '../src';

export default () => (
  <div
    css={{
      maxWidth: 500,
    }}
  >
    <p>Basic:</p>
    <TextArea value="I have a data-testid" testId="MyTextAreaTestId" />
  </div>
);
