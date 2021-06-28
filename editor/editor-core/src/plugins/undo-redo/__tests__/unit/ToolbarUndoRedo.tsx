import React from 'react';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { render, fireEvent } from '@testing-library/react';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { p, doc, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';

import historyPlugin from '../../../history';
import { historyPluginKey } from '../../../history';
import undoRedoPlugin from '../../index';
import { ToolbarUndoRedo } from '../../ui/ToolbarUndoRedo';
import {
  ACTION_SUBJECT,
  ACTION,
  EVENT_TYPE,
} from '../../../analytics/types/enums';

import { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';

// TODO - update these using the testId prefix being add in ED-11415
const undoSelector = 'ak-editor-toolbar-button-undo';
const redoSelector = 'ak-editor-toolbar-button-redo';

// @ts-ignore
const mockIntl = { formatMessage: (text) => text };

describe('ToolbarUndoRedo', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(historyPlugin)
        .add(undoRedoPlugin),
    });

  it('should disable Undo / Redo buttons when there is no undo / redo history', () => {
    const { editorView } = editor(doc(p('some text')));
    const historyState = historyPluginKey.getState(editorView.state);

    const { getByTestId } = render(
      // @ts-ignore
      <ToolbarUndoRedo historyState={historyState} intl={mockIntl} />,
    );

    expect(getByTestId(undoSelector)).toHaveAttribute('disabled');
    expect(getByTestId(redoSelector)).toHaveAttribute('disabled');
  });

  it('should enable the Undo button when there is an undo history', () => {
    const { editorView } = editor(doc(p('some text')));
    const tr = editorView.state.tr;
    tr.insertText('more text', 0);
    editorView.dispatch(tr);

    const historyState = historyPluginKey.getState(editorView.state);

    const { getByTestId } = render(
      // @ts-ignore
      <ToolbarUndoRedo historyState={historyState} intl={mockIntl} />,
    );

    expect(getByTestId(undoSelector)).not.toHaveAttribute('disabled');
    expect(getByTestId(redoSelector)).toHaveAttribute('disabled');
  });

  it('should disable the Undo button and enable the Redo button when Undo is clicked', async () => {
    const { editorView } = editor(doc(p('some text')));
    const tr = editorView.state.tr;
    tr.insertText('more', 0);
    editorView.dispatch(tr);

    const historyState = historyPluginKey.getState(editorView.state);

    const { getByTestId, rerender } = render(
      <ToolbarUndoRedo
        editorView={editorView}
        historyState={historyState}
        // @ts-ignore
        intl={mockIntl}
      />,
    );

    const undoButton = getByTestId(undoSelector);
    const redoButton = getByTestId(redoSelector);
    fireEvent.click(undoButton);

    const newHistoryState = historyPluginKey.getState(editorView.state);

    rerender(
      <ToolbarUndoRedo
        editorView={editorView}
        historyState={newHistoryState}
        // @ts-ignore
        intl={mockIntl}
      />,
    );

    expect(undoButton).toHaveAttribute('disabled');
    expect(redoButton).not.toHaveAttribute('disabled');
  });

  it('should enable the Undo button and disable the Redo button when Redo is clicked', async () => {
    const { editorView } = editor(doc(p('some text')));
    const tr = editorView.state.tr;
    tr.insertText('more', 0);
    editorView.dispatch(tr);

    const historyState = historyPluginKey.getState(editorView.state);

    const { getByTestId, rerender } = render(
      <ToolbarUndoRedo
        editorView={editorView}
        historyState={historyState}
        // @ts-ignore
        intl={mockIntl}
      />,
    );

    const undoButton = getByTestId(undoSelector);
    const redoButton = getByTestId(redoSelector);

    fireEvent.click(undoButton);
    let newHistoryState = historyPluginKey.getState(editorView.state);

    // We need to rerender here before firing the redoButton click
    // otherwise the redoButton is still disabled
    rerender(
      <ToolbarUndoRedo
        editorView={editorView}
        historyState={newHistoryState}
        // @ts-ignore
        intl={mockIntl}
      />,
    );

    fireEvent.click(redoButton);
    newHistoryState = historyPluginKey.getState(editorView.state);

    rerender(
      <ToolbarUndoRedo
        editorView={editorView}
        historyState={newHistoryState}
        // @ts-ignore
        intl={mockIntl}
      />,
    );

    expect(undoButton).not.toHaveAttribute('disabled');
    expect(redoButton).toHaveAttribute('disabled');
  });

  describe('analytics events', () => {
    it('should fire the analytics event with the redo toolbar button id', () => {
      const onEvent = jest.fn();
      const { editorView } = editor(doc(p('some text')));
      const tr = editorView.state.tr;
      tr.insertText('more', 0);
      editorView.dispatch(tr);

      const historyState = historyPluginKey.getState(editorView.state);
      const { getByTestId, rerender } = render(
        <AnalyticsListener onEvent={onEvent} channel={FabricChannel.editor}>
          <ToolbarUndoRedo
            editorView={editorView}
            historyState={historyState}
            // @ts-ignore
            intl={mockIntl}
          />
        </AnalyticsListener>,
      );

      const undoButton = getByTestId(undoSelector);
      const redoButton = getByTestId(redoSelector);
      fireEvent.click(undoButton);
      onEvent.mockClear();

      let newHistoryState = historyPluginKey.getState(editorView.state);
      rerender(
        <AnalyticsListener onEvent={onEvent} channel={FabricChannel.editor}>
          <ToolbarUndoRedo
            editorView={editorView}
            historyState={newHistoryState}
            // @ts-ignore
            intl={mockIntl}
          />
        </AnalyticsListener>,
      );

      fireEvent.click(redoButton);

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            action: ACTION.CLICKED,
            actionSubject: ACTION_SUBJECT.TOOLBAR_BUTTON,
            actionSubjectId: TOOLBAR_BUTTON.REDO,
            eventType: EVENT_TYPE.UI,
            attributes: expect.any(Object),
          },
        }),
        'editor',
      );
    });

    it('should fire the analytics event with the undo toolbar button id', () => {
      const onEvent = jest.fn();
      const { editorView } = editor(doc(p('some text')));
      const tr = editorView.state.tr;
      tr.insertText('more', 0);
      editorView.dispatch(tr);

      const historyState = historyPluginKey.getState(editorView.state);
      const { getByTestId } = render(
        <AnalyticsListener onEvent={onEvent} channel={FabricChannel.editor}>
          <ToolbarUndoRedo
            editorView={editorView}
            historyState={historyState}
            // @ts-ignore
            intl={mockIntl}
          />
          ,
        </AnalyticsListener>,
      );

      const undoButton = getByTestId(undoSelector);

      fireEvent.click(undoButton);
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            action: ACTION.CLICKED,
            actionSubject: ACTION_SUBJECT.TOOLBAR_BUTTON,
            actionSubjectId: TOOLBAR_BUTTON.UNDO,
            eventType: EVENT_TYPE.UI,
            attributes: expect.any(Object),
          },
        }),
        'editor',
      );
    });
  });
});
