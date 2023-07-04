/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';

import TextArea from '../../src';

const wrapperStyles = xcss({
  maxWidth: '500px',
});

export default () => (
  <Box id="resize" xcss={wrapperStyles}>
    <p>Resize: auto</p>
    <TextArea resize="auto" name="area" testId="autoResizeTextArea" />
    <p>Resize: vertical</p>
    <TextArea resize="vertical" name="area" testId="verticalResizeTextArea" />
    <p>Resize: horizontal</p>
    <TextArea
      resize="horizontal"
      name="area"
      testId="horizontalResizeTextArea"
    />
    <p>Resize: smart (default)</p>
    <TextArea name="area" testId="smartResizeTextArea" />
    <p>Resize: none</p>
    <TextArea resize="none" name="area" testId="noneResizeTextArea" />
  </Box>
);
