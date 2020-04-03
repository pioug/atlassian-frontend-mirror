import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import EditorView from '../editorView';
import { EditorContainer } from '../styles';

describe('<EditorView />', () => {
  it('should be closed by Esc and not propagate event up the dom', () => {
    const event = {
      nativeEvent: { stopImmediatePropagation: jest.fn() },
      key: 'Escape',
      keyCode: 27,
    };
    const onKeyDown = jest.fn();
    const onCancel = jest.fn();
    const editorView = mount(
      <div onKeyDown={onKeyDown}>
        <IntlProvider locale="en">
          <EditorView
            imageUrl="file://./atlassian.png"
            onCancel={onCancel}
            onSave={jest.fn()}
            onError={jest.fn()}
          />
        </IntlProvider>
      </div>,
    );

    editorView.find(EditorContainer).simulate('keydown', event);

    expect(event.nativeEvent.stopImmediatePropagation).toBeCalled();
    expect(onCancel).toBeCalled();
    expect(onKeyDown).not.toBeCalled();
  });
});
