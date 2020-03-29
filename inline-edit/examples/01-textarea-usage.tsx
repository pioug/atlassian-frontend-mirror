import React from 'react';
import TextArea from '@atlaskit/textarea';
import { gridSize, fontSize } from '@atlaskit/theme';

import InlineEdit from '../src';
import styled from 'styled-components';

const minRows = 2;
const textAreaLineHeightFactor = 2.5;
const ReadViewContainer = styled.div`
  line-height: ${(gridSize() * textAreaLineHeightFactor) / fontSize()};
  min-height: ${gridSize() * textAreaLineHeightFactor * minRows}px;
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
  word-break: break-word;
`;

interface State {
  editValue: string;
}

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    editValue: 'Field Value',
  };

  onConfirm = (value: string) => {
    this.setState({
      editValue: value,
    });
  };

  render() {
    return (
      <div
        style={{
          padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
          width: '70%',
        }}
      >
        <InlineEdit
          defaultValue={this.state.editValue}
          label="Inline edit textarea + keep edit view open on blur"
          editView={(fieldProps, ref) => (
            // @ts-ignore - textarea does not currently correctly pass through ref as a prop
            <TextArea {...fieldProps} ref={ref} />
          )}
          readView={() => (
            <ReadViewContainer>
              {this.state.editValue || 'Click to enter value'}
            </ReadViewContainer>
          )}
          onConfirm={this.onConfirm}
          keepEditViewOpenOnBlur
          readViewFitContainerWidth
        />
      </div>
    );
  }
}
