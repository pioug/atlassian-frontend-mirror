import { mount } from 'enzyme';
import React from 'react';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import ToolbarMention from '../../../../../plugins/mentions/ui/ToolbarMention';

describe('ToolbarMention', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: { mentionProvider: new Promise(() => {}) },
    });

  it('should create a typeAheadQuery by clicking on the ToolbarMention icon', () => {
    const { editorView } = editor(doc(p('{<>}')));
    const toolbarMention = mount(<ToolbarMention editorView={editorView} />);
    toolbarMention.find(MentionIcon).simulate('click');
    const { state } = editorView;
    expect(
      state.doc.rangeHasMark(0, 2, state.schema.marks.typeAheadQuery),
    ).toBe(true);
    toolbarMention.unmount();
  });
});
