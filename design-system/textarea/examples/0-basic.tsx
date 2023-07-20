import React from 'react';

import Button from '@atlaskit/button';
import { Label } from '@atlaskit/form';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import TextArea from '../src';

import { docsText } from './common';

const wrapperStyles = xcss({
  maxWidth: '500px',
  padding: 'space.100',
});
export default () => {
  let textareaElement: HTMLTextAreaElement | undefined;

  const focus = () => {
    if (textareaElement) {
      textareaElement.focus();
    }
  };

  return (
    <Stack xcss={wrapperStyles} space="space.100">
      <Label htmlFor="disabled">
        Disabled
        <TextArea
          id="disabled"
          value="hello"
          name="text"
          isDisabled
          isCompact
          testId="disabledTextArea"
        />
      </Label>

      <Label htmlFor="invalidTextArea">
        Invalid & Compact
        <TextArea
          id="invalidTextArea"
          name="area"
          isInvalid
          isCompact
          testId="invalidTextArea"
        />
      </Label>

      <Label htmlFor="minimumRowsTextArea">
        Resize:smart
        <TextArea
          id="minimumRowsTextArea"
          resize="smart"
          name="area"
          defaultValue={docsText}
          testId="minimumRowsTextArea"
        />
      </Label>

      <Label htmlFor="monospacedTextArea">
        Monospaced & MinimumRows: 3
        <TextArea
          id="monospacedTextArea"
          name="area"
          isMonospaced
          defaultValue="Text in monospaced code font"
          testId="monospacedTextArea"
          minimumRows={3}
        />
      </Label>

      <Label htmlFor="autoResizeTextArea">
        Resize: auto, MaxHeight: 20vh & ReadOnly
        <TextArea
          id="autoResizeTextArea"
          resize="auto"
          maxHeight="20vh"
          name="area"
          isReadOnly
          defaultValue="The default text is readonly"
          testId="autoResizeTextArea"
        />
      </Label>

      <Box id="smart">
        <Label htmlFor="smartArea">Focus & required</Label>
        <TextArea
          id="smartArea"
          isRequired
          ref={(ref: any) => {
            textareaElement = ref;
          }}
        />
      </Box>
      <Button onClick={focus} type="button" style={{ alignSelf: 'flex-start' }}>
        focus
      </Button>
    </Stack>
  );
};
