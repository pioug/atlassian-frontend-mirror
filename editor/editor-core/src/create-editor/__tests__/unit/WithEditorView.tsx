import React, { ReactNode } from 'react';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { WithEditorView } from '../../WithEditorView';
import EditorActions from '../../../actions';
import { EventDispatcher } from '../../../event-dispatcher';
import EditorContext from '../../../ui/EditorContext';

describe('WithEditorView', () => {
  const createEditor = createProsemirrorEditorFactory();

  function setup(options: { editorView: EditorView; child: ReactNode }) {
    const editorActions = new EditorActions();

    editorActions._privateRegisterEditor(
      options.editorView,
      new EventDispatcher(),
    );

    const wrapper = mount(
      <EditorContext editorActions={editorActions}>
        {options.child}
      </EditorContext>,
    );

    return wrapper;
  }

  it('should pass the editorView', () => {
    const { editorView } = createEditor({
      preset: new Preset<LightEditorPlugin>(),
    });

    const DummyComponent = (props: { editorView: EditorView | undefined }) => {
      return null;
    };

    const DummyComponentWithFlags = WithEditorView(DummyComponent);

    const wrapper = setup({
      editorView,
      child: <DummyComponentWithFlags />,
    });

    const dummyComponent = wrapper.find(DummyComponent);

    expect(dummyComponent.prop('editorView')).toEqual(editorView);
  });
});
