// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { setHeading } from '@atlaskit/editor-common/commands';
import {
  INPUT_METHOD,
  ACTION,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  ACTION_SUBJECT,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import { createTable } from '@atlaskit/editor-plugin-table/commands';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

/**
 * Note that the history events are defined within `@atlaskit/adf-schema`.
 * Changes to the implementation within that package may impact the result of these tests.
 *
 * The implementation lives here: `packages/editor/adf-schema/src/steps/analytics.ts`
 * With its own unit test here: `packages/editor/adf-schema/src/steps/__tests__/unit/analytics.ts`
 *
 * These tests serve as a superset.
 */

describe('Analytics Plugin: History Events', () => {
  const createEditor = createEditorFactory();

  const undo = () => sendKeyToPm(editorView, 'Ctrl-z');
  const redo = () => sendKeyToPm(editorView, 'Ctrl-y');

  const do3Times = (fn: Function) =>
    Array(3)
      .fill(null)
      .forEach(() => fn());

  let createAnalyticsEvent: jest.Mock;
  let editorView: EditorView;
  let sel: number;
  let editorAPI: PublicPluginAPI<[AnalyticsPlugin]> | undefined;

  const insertHeading = () =>
    withAnalytics(editorAPI?.analytics?.actions, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
      attributes: {
        inputMethod: INPUT_METHOD.TOOLBAR,
        newHeadingLevel: 1,
        previousHeadingLevel: 0,
      },
    })(setHeading(1))(editorView.state, editorView.dispatch);
  const insertTable = () =>
    withAnalytics(editorAPI?.analytics?.actions, {
      action: ACTION.INSERTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.TABLE,
      attributes: {
        inputMethod: INPUT_METHOD.TOOLBAR,
      },
      eventType: EVENT_TYPE.TRACK,
    })(createTable())(editorView.state, editorView.dispatch);

  beforeEach(() => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} }));
    const editor = createEditor({
      doc: doc(p('{<>}')),
      editorProps: {
        allowAnalyticsGASV3: true,
        allowTables: true,
        allowRule: true,
      },
      createAnalyticsEvent,
    });
    ({ editorView, sel } = editor);
    editorAPI = editor.editorAPI as
      | PublicPluginAPI<[AnalyticsPlugin]>
      | undefined;
  });

  describe('undo', () => {
    it('fires undo analytics event when undo action', () => {
      insertHeading();
      undo();

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'undid',
        actionSubject: 'text',
        actionSubjectId: 'formatted',
        attributes: expect.objectContaining({
          actionSubjectId: 'heading',
          inputMethod: 'toolbar',
          previousHeadingLevel: 0,
          newHeadingLevel: 1,
        }),
        eventType: 'track',
      });
    });

    it('fires each undo analytics event when undo multiple actions', () => {
      insertHeading();
      insertText(editorView, 'My Page Title');
      insertTable();

      createAnalyticsEvent.mockClear();
      do3Times(undo);

      expect(createAnalyticsEvent).toHaveBeenCalledTimes(2);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'undid',
        actionSubject: 'document',
        actionSubjectId: 'inserted',
        attributes: expect.objectContaining({
          actionSubjectId: 'table',
          inputMethod: 'toolbar',
        }),
        eventType: 'track',
      });

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'undid',
        actionSubject: 'text',
        actionSubjectId: 'formatted',
        attributes: expect.objectContaining({
          actionSubjectId: 'heading',
          inputMethod: 'toolbar',
          previousHeadingLevel: 0,
          newHeadingLevel: 1,
        }),
        eventType: 'track',
      });
    });

    it('fires undo analytics event when undo auto-formatting', () => {
      insertText(editorView, '---', sel);
      undo();
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'undid',
        actionSubject: 'document',
        actionSubjectId: 'inserted',
        attributes: expect.objectContaining({
          actionSubjectId: 'divider',
          inputMethod: 'autoformatting',
        }),
        eventType: 'track',
      });
    });

    it('does not fire undo event for "invoked" events', () => {
      withAnalytics(editorAPI?.analytics?.actions, {
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.TYPEAHEAD,
        actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_EMOJI,
        attributes: expect.objectContaining({
          inputMethod: INPUT_METHOD.QUICK_INSERT,
        }),
        eventType: EVENT_TYPE.UI,
      })(setHeading(1))(editorView.state, editorView.dispatch);
      createAnalyticsEvent.mockClear();
      undo();
      expect(createAnalyticsEvent).not.toHaveBeenCalled();
    });

    it('does not fire undo event for "opened" events', () => {
      withAnalytics(editorAPI?.analytics?.actions, {
        action: ACTION.OPENED,
        actionSubject: ACTION_SUBJECT.PICKER,
        actionSubjectId: ACTION_SUBJECT_ID.PICKER_EMOJI,
        attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
        eventType: EVENT_TYPE.UI,
      })(setHeading(1))(editorView.state, editorView.dispatch);
      createAnalyticsEvent.mockClear();
      undo();
      expect(createAnalyticsEvent).not.toHaveBeenCalled();
    });
  });

  describe('redo', () => {
    it('fires redo analytics event when redo action', () => {
      insertHeading();
      undo();
      redo();

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'redid',
        actionSubject: 'text',
        actionSubjectId: 'formatted',
        attributes: expect.objectContaining({
          actionSubjectId: 'heading',
          inputMethod: 'toolbar',
          previousHeadingLevel: 0,
          newHeadingLevel: 1,
        }),
        eventType: 'track',
      });
    });

    it('fires each redo analytics event when redo multiple actions', () => {
      insertHeading();
      insertText(editorView, 'My Page Title');
      insertTable();

      do3Times(undo);
      createAnalyticsEvent.mockClear();
      do3Times(redo);

      expect(createAnalyticsEvent).toHaveBeenCalledTimes(2);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'redid',
        actionSubject: 'document',
        actionSubjectId: 'inserted',
        attributes: expect.objectContaining({
          actionSubjectId: 'table',
          inputMethod: 'toolbar',
        }),
        eventType: 'track',
      });

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'redid',
        actionSubject: 'text',
        actionSubjectId: 'formatted',
        attributes: expect.objectContaining({
          actionSubjectId: 'heading',
          inputMethod: 'toolbar',
          previousHeadingLevel: 0,
          newHeadingLevel: 1,
        }),
        eventType: 'track',
      });
    });
  });
});
