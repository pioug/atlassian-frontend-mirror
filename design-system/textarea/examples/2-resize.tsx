/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button, { ButtonGroup } from '@atlaskit/button';

import TextArea from '../src';
import { TextAreaProps } from '../src/types';

const wrapperStyles = css({
  maxWidth: 500,
});
export default () => {
  const [text, setText] = useState<string | undefined>();

  const handleChange: TextAreaProps['onChange'] = (e) =>
    setText(e.currentTarget.value);

  const longText =
    'A text area lets users enter long form text which spans over multiple lines. The `resize` prop provides control of how the text area will handle resizing to fit content. Setting this prop to `smart` will automatically increase and decrease the height of the text area to fit text';

  const exampleProps = {
    value: text,
    onChange: handleChange,
    name: 'area',
  };

  return (
    <div id="resize" css={wrapperStyles}>
      {/* Buttons are required to test resize works when
      the value prop is changed, rather than only onChange events */}
      <ButtonGroup>
        <Button onClick={() => setText('')} testId="clearTextButton">
          Clear
        </Button>
        <Button
          appearance="primary"
          onClick={() => setText(longText)}
          testId="insertTextButton"
        >
          Insert text
        </Button>
      </ButtonGroup>

      <p>Resize: auto</p>
      <TextArea {...exampleProps} resize="auto" testId="autoResizeTextArea" />
      <p>Resize: vertical</p>
      <TextArea
        {...exampleProps}
        resize="vertical"
        testId="verticalResizeTextArea"
      />
      <p>Resize: horizontal</p>
      <TextArea
        {...exampleProps}
        resize="horizontal"
        testId="horizontalResizeTextArea"
      />
      <p>Resize: smart (default)</p>
      <TextArea {...exampleProps} name="area" testId="smartResizeTextArea" />
      <p>Resize: none</p>
      <TextArea {...exampleProps} resize="none" testId="noneResizeTextArea" />
    </div>
  );
};
