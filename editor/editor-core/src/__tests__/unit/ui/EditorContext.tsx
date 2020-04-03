import { mount } from 'enzyme';
import React from 'react';
import PropTypes from 'prop-types';
import EditorContext from '../../../ui/EditorContext';
import EditorActions from '../../../actions';

class EditorContextReceiver extends React.Component {
  static contextTypes = {
    editorActions: PropTypes.object,
  };

  render() {
    return null;
  }
}

describe('EditorContext', () => {
  it('should create new EditorActions and pass it down using context', () => {
    const wrapper = mount(
      <EditorContext>
        <EditorContextReceiver />
      </EditorContext>,
    );
    expect(
      wrapper.find(EditorContextReceiver).instance().context.editorActions,
    ).toBeDefined();
    wrapper.unmount();
  });

  it('should re-use EditorActions passed as a property', () => {
    const editorActions = new EditorActions();
    const wrapper = mount(
      <EditorContext editorActions={editorActions}>
        <EditorContextReceiver />
      </EditorContext>,
    );
    expect(
      wrapper.find(EditorContextReceiver).instance().context.editorActions,
    ).toBe(editorActions);
    wrapper.unmount();
  });
});
