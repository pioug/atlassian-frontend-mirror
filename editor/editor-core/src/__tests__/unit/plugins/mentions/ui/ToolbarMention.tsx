import { mount } from 'enzyme';
import React from 'react';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import ToolbarMention from '../../../../../plugins/mentions/ui/ToolbarMention';

describe('ToolbarMention', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { mentionProvider: new Promise(() => {}) },
    });

  it('should create a typeAheadQuery by clicking on the ToolbarMention icon', () => {
    const { editorView } = editor(doc(p('{<>}')));
    const testId = 'toolbar-test';
    const toolbarMention = mount(
      <ToolbarMention testId={testId} editorView={editorView} />,
    );
    toolbarMention.find(`[data-testid="${testId}"]`).first().simulate('click');
    const { state } = editorView;
    expect(
      state.doc.rangeHasMark(0, 2, state.schema.marks.typeAheadQuery),
    ).toBe(true);
    toolbarMention.unmount();
  });
});
