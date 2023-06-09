import React from 'react';
import { Editor } from '../src';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

type State = {
  dropzoneRef?: HTMLElement;
};

const mediaProvider = storyMediaProviderFactory();

class DemoEditor extends React.PureComponent<any, State> {
  state: State = {};

  private handleDropzoneRef = (ref: HTMLDivElement) => {
    this.setState({ dropzoneRef: ref });
  };

  render() {
    const { dropzoneRef } = this.state;
    const editor = !dropzoneRef ? null : (
      <Editor
        appearance="comment"
        quickInsert={true}
        media={{
          provider: mediaProvider,
          customDropzoneContainer: dropzoneRef,
        }}
      />
    );

    return (
      <div>
        <div
          ref={this.handleDropzoneRef}
          style={{
            background: '#172B4D',
            height: 80,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px',
            borderRadius: '25px',
          }}
        >
          <h4 style={{ textAlign: 'center', color: '#FFF' }}>
            Drag and Drop files here
          </h4>
        </div>
        {editor}
      </div>
    );
  }
}

export default function Example() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '10px' }}>
        <DemoEditor />
      </div>
      <div style={{}}>
        <DemoEditor />
      </div>
    </div>
  );
}
