import React from 'react';
import styled from 'styled-components';
import TextArea from '../src';

const Div = styled.div`
  max-width: 500px;
`;

export default class extends React.Component {
  private textareaElement: HTMLTextAreaElement | undefined;

  private focus = () => {
    if (this.textareaElement) {
      this.textareaElement.focus();
    }
  };

  render() {
    return (
      <Div>
        <p>Disabled:</p>
        <TextArea value="hello" name="text" isDisabled />
        <p>Invalid, resize: auto, compact:</p>
        <TextArea resize="auto" name="area" isInvalid isCompact />
        <p>Smart, ref:</p>
        <div id="smart">
          {/*
          // @ts-ignore */}
          <TextArea
            ref={(ref: any) => {
              this.textareaElement = ref;
            }}
          />
        </div>
        <button onClick={this.focus}>focus</button>
      </Div>
    );
  }
}
