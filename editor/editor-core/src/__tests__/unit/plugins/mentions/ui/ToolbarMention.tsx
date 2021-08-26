import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  DocBuilder,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { pluginKey } from '../../../../../plugins/panel/types';
import ToolbarMention from '../../../../../plugins/mentions/ui/ToolbarMention';
import { TypeAheadHandler } from '../../../../../plugins/type-ahead/types';
import { EditorView } from 'prosemirror-view';
import { createTypeAheadTools } from '../../../../../plugins/type-ahead/api';

// HELPERS
const testId = 'toolbar-mention-test';
const getToolbarMention = (editorView: EditorView) => {
  return mount(<ToolbarMention testId={testId} editorView={editorView} />);
};
const clickToolbarMention = (toolbarMention: ReactWrapper) => {
  return toolbarMention
    .find(`[data-testid="${testId}"]`)
    .first()
    .simulate('click');
};
const checkMentionTypeaheadTriggered = (
  typeAheadTool: ReturnType<typeof createTypeAheadTools>,
) => {
  return expect((typeAheadTool.isOpen() as TypeAheadHandler).trigger).toEqual(
    '@',
  );
};

describe('ToolbarMention', () => {
  let toolbarMention: ReactWrapper;
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { mentionProvider: new Promise(() => {}), allowPanel: true },
      pluginKey,
    });

  afterEach(() => {
    if (toolbarMention) {
      toolbarMention.unmount();
    }
  });

  it('should create a typeAheadQuery by clicking on the ToolbarMention icon', () => {
    const { editorView, typeAheadTool } = editor(doc(p('{<>}')));
    toolbarMention = getToolbarMention(editorView);
    expect(typeAheadTool.isOpen()).toBe(false);
    clickToolbarMention(toolbarMention);
    checkMentionTypeaheadTriggered(typeAheadTool);
  });

  it('should replace text selection range when ToolbarMention icon is clicked', () => {
    const { editorView, typeAheadTool } = editor(
      doc(p('Admiral of the {<}Black gunwalls.{>}')),
    );
    toolbarMention = getToolbarMention(editorView);
    expect(typeAheadTool.isOpen()).toBe(false);
    clickToolbarMention(toolbarMention);
    checkMentionTypeaheadTriggered(typeAheadTool);
    expect(editorView.state.doc).toEqualDocument(doc(p('Admiral of the ')));
  });

  it('should not change content if cursor selection', () => {
    const { editorView, typeAheadTool } = editor(
      doc(p('Admiral of the {<>}Black gunwalls.')),
    );
    toolbarMention = getToolbarMention(editorView);
    expect(typeAheadTool.isOpen()).toBe(false);
    clickToolbarMention(toolbarMention);
    checkMentionTypeaheadTriggered(typeAheadTool);
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Admiral of the Black gunwalls.')),
    );
  });

  it('should not open mention trigger if a node selection', () => {
    const { editorView, typeAheadTool } = editor(
      doc('{<node>}', panel()(p('text'))),
    );
    toolbarMention = getToolbarMention(editorView);
    expect(typeAheadTool.isOpen()).toBe(false);
    clickToolbarMention(toolbarMention);
    expect(typeAheadTool.isOpen()).toBe(false);
    expect(editorView.state.doc).toEqualDocument(doc(panel()(p('text'))));
  });
});
