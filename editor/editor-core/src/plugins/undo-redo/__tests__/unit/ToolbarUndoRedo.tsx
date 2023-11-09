import React from 'react';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { render, fireEvent } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, doc } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';

import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { historyPlugin } from '@atlaskit/editor-plugin-history';
import undoRedoPlugin from '../../index';
import { ToolbarUndoRedo } from '../../ui/ToolbarUndoRedo';
import {
  ACTION_SUBJECT,
  ACTION,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';

import { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';

// TODO - update these using the testId prefix being added in ED-11415
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
        .add(typeAheadPlugin)
        .add(historyPlugin)
        .add(undoRedoPlugin),
    });

  it('should disable Undo / Redo buttons when there is no undo / redo history', () => {
    const { editorAPI } = editor(doc(p('some text')));

    const { getByTestId } = render(
      // @ts-ignore
      <ToolbarUndoRedo intl={mockIntl} api={editorAPI} />,
    );

    expect(getByTestId(undoSelector)).toHaveAttribute('disabled');
    expect(getByTestId(redoSelector)).toHaveAttribute('disabled');
  });

  it('should enable the Undo button when there is an undo history', () => {
    const { editorView, editorAPI } = editor(doc(p('some text')));
    const tr = editorView.state.tr;
    tr.insertText('more text', 0);
    editorView.dispatch(tr);

    const { getByTestId } = render(
      // @ts-ignore
      <ToolbarUndoRedo intl={mockIntl} api={editorAPI} />,
    );

    expect(getByTestId(undoSelector)).not.toHaveAttribute('disabled');
    expect(getByTestId(redoSelector)).toHaveAttribute('disabled');
  });

  it('should disable the Undo button and enable the Redo button when Undo is clicked', async () => {
    const { editorView, editorAPI } = editor(doc(p('some text')));
    const tr = editorView.state.tr;
    tr.insertText('more', 0);
    editorView.dispatch(tr);

    const { getByTestId, rerender } = render(
      <ToolbarUndoRedo
        editorView={editorView}
        api={editorAPI}
        // @ts-ignore
        intl={mockIntl}
      />,
    );

    const undoButton = getByTestId(undoSelector);
    const redoButton = getByTestId(redoSelector);
    fireEvent.click(undoButton);

    rerender(
      <ToolbarUndoRedo
        editorView={editorView}
        api={editorAPI}
        // @ts-ignore
        intl={mockIntl}
      />,
    );

    expect(undoButton).toHaveAttribute('disabled');
    expect(redoButton).not.toHaveAttribute('disabled');
  });

  it('should enable the Undo button and disable the Redo button when Redo is clicked', async () => {
    const { editorView, editorAPI } = editor(doc(p('some text')));
    const tr = editorView.state.tr;
    tr.insertText('more', 0);
    editorView.dispatch(tr);

    const { getByTestId, rerender } = render(
      <ToolbarUndoRedo
        editorView={editorView}
        api={editorAPI}
        // @ts-ignore
        intl={mockIntl}
      />,
    );

    const undoButton = getByTestId(undoSelector);
    const redoButton = getByTestId(redoSelector);

    fireEvent.click(undoButton);

    // We need to rerender here before firing the redoButton click
    // otherwise the redoButton is still disabled
    rerender(
      <ToolbarUndoRedo
        editorView={editorView}
        api={editorAPI}
        // @ts-ignore
        intl={mockIntl}
      />,
    );

    fireEvent.click(redoButton);

    rerender(
      <ToolbarUndoRedo
        editorView={editorView}
        api={editorAPI}
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
      const { editorView, editorAPI } = editor(doc(p('some text')));
      const tr = editorView.state.tr;
      tr.insertText('more', 0);
      editorView.dispatch(tr);

      const { getByTestId, rerender } = render(
        <AnalyticsListener onEvent={onEvent} channel={FabricChannel.editor}>
          <ToolbarUndoRedo
            editorView={editorView}
            api={editorAPI}
            // @ts-ignore
            intl={mockIntl}
          />
        </AnalyticsListener>,
      );

      const undoButton = getByTestId(undoSelector);
      const redoButton = getByTestId(redoSelector);
      fireEvent.click(undoButton);
      onEvent.mockClear();

      rerender(
        <AnalyticsListener onEvent={onEvent} channel={FabricChannel.editor}>
          <ToolbarUndoRedo
            editorView={editorView}
            api={editorAPI}
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
      const { editorView, editorAPI } = editor(doc(p('some text')));
      const tr = editorView.state.tr;
      tr.insertText('more', 0);
      editorView.dispatch(tr);

      const { getByTestId } = render(
        <AnalyticsListener onEvent={onEvent} channel={FabricChannel.editor}>
          <ToolbarUndoRedo
            editorView={editorView}
            api={editorAPI}
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

  describe('keyboard shortcuts', () => {
    it('should have ARIA keyshortcuts attribute', () => {
      const { editorView, editorAPI } = editor(doc(p('some text')));

      const { getByTestId } = render(
        <ToolbarUndoRedo
          editorView={editorView}
          api={editorAPI}
          // @ts-ignore
          intl={mockIntl}
        />,
      );

      expect(
        getByTestId('ak-editor-toolbar-button-undo').getAttribute(
          'aria-keyshortcuts',
        ),
      ).toEqual('Control+z');
      expect(
        getByTestId('ak-editor-toolbar-button-redo').getAttribute(
          'aria-keyshortcuts',
        ),
      ).toEqual('Control+y');
    });
  });
});
