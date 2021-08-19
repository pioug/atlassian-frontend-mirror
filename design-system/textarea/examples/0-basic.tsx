/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { docsText } from '../common';
import TextArea from '../src';

const wrapperStyles = css({
  maxWidth: 500,
});
export default () => {
  let textareaElement: HTMLTextAreaElement | undefined;

  const focus = () => {
    if (textareaElement) {
      textareaElement.focus();
    }
  };

  return (
    <div css={wrapperStyles}>
      <p>Disabled:</p>
      <TextArea
        value="hello"
        name="text"
        isDisabled
        isCompact
        testId="disabledTextArea"
      />
      <p>Invalid & Compact</p>
      <TextArea name="area" isInvalid isCompact testId="invalidTextArea" />
      <p>Resize:smart </p>
      <TextArea
        resize="smart"
        name="area"
        defaultValue={docsText}
        testId="minimumRowsTextArea"
      />
      <p>Monospaced & MinimumRows: 3</p>
      <TextArea
        name="area"
        isMonospaced
        defaultValue="Text in monospaced code font"
        testId="monospacedTextArea"
        minimumRows={3}
      />
      <p>Resize: auto, MaxHeight: 20vh & ReadOnly</p>
      <TextArea
        resize="auto"
        maxHeight="20vh"
        name="area"
        isReadOnly
        defaultValue="The default text is readonly"
        testId="autoResizeTextArea"
      />
      <p>Focus & required</p>
      <div id="smart">
        {/*
          // @ts-ignore */}
        <TextArea
          isRequired
          ref={(ref: any) => {
            textareaElement = ref;
          }}
        />
      </div>
      <button onClick={focus}>focus</button>
    </div>
  );
};
