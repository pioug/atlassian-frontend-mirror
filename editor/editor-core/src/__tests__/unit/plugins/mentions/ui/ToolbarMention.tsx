import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  DocBuilder,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { pluginKey } from '../../../../../plugins/panel/types';
import ToolbarMention from '../../../../../plugins/mentions/ui/ToolbarMention';
import { TypeAheadHandler } from '../../../../../plugins/type-ahead/types';

// HELPERS
const testId = 'toolbar-mention-test';

describe('ToolbarMention', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { mentionProvider: new Promise(() => {}), allowPanel: true },
      pluginKey,
    });

  it('should create a typeAheadQuery by clicking on the ToolbarMention icon', async () => {
    const { editorView, typeAheadTool } = editor(doc(p('{<>}')));
    renderWithIntl(<ToolbarMention testId={testId} editorView={editorView} />);
    expect(typeAheadTool.isOpen()).toBe(false);

    // click toolbar mention button
    const toolbarMentionButton = screen.getByTestId(testId);
    await userEvent.click(toolbarMentionButton);

    // check mention typeahead triggered
    const typeAheadHandler = typeAheadTool.isOpen() as TypeAheadHandler;
    expect(typeAheadHandler.trigger).toEqual('@');
  });

  it('should replace text selection range when ToolbarMention icon is clicked', async () => {
    const { editorView, typeAheadTool } = editor(
      doc(p('Admiral of the {<}Black gunwalls.{>}')),
    );
    renderWithIntl(<ToolbarMention testId={testId} editorView={editorView} />);
    expect(typeAheadTool.isOpen()).toBe(false);

    // click toolbar mention button
    const toolbarMentionButton = screen.getByTestId(testId);
    await userEvent.click(toolbarMentionButton);

    // check mention typeahead triggered
    const typeAheadHandler = typeAheadTool.isOpen() as TypeAheadHandler;
    expect(typeAheadHandler.trigger).toEqual('@');

    expect(editorView.state.doc).toEqualDocument(doc(p('Admiral of the ')));
  });

  it('should not change content if cursor selection', async () => {
    const { editorView, typeAheadTool } = editor(
      doc(p('Admiral of the {<>}Black gunwalls.')),
    );
    renderWithIntl(<ToolbarMention testId={testId} editorView={editorView} />);
    expect(typeAheadTool.isOpen()).toBe(false);

    // click toolbar mention button
    const toolbarMentionButton = screen.getByTestId(testId);
    await userEvent.click(toolbarMentionButton);

    // check mention typeahead triggered
    const typeAheadHandler = typeAheadTool.isOpen() as TypeAheadHandler;
    expect(typeAheadHandler.trigger).toEqual('@');

    expect(editorView.state.doc).toEqualDocument(
      doc(p('Admiral of the Black gunwalls.')),
    );
  });

  it('should not open mention trigger if a node selection', async () => {
    const { editorView, typeAheadTool } = editor(
      doc('{<node>}', panel()(p('text'))),
    );
    renderWithIntl(<ToolbarMention testId={testId} editorView={editorView} />);
    expect(typeAheadTool.isOpen()).toBe(false);

    // click toolbar mention button
    const toolbarMentionButton = screen.getByTestId(testId);
    await userEvent.click(toolbarMentionButton);

    expect(typeAheadTool.isOpen()).toBe(false);
    expect(editorView.state.doc).toEqualDocument(doc(panel()(p('text'))));
  });
});
