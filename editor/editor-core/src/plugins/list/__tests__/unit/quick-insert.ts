import { pluginKey } from '../../pm-plugins/main';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import {
  doc,
  ol,
  ul,
  li,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorView } from 'prosemirror-view';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

describe('lists plugin -> quick insert', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        appearance: 'full-page',
        allowAnalyticsGASV3: true,
        quickInsert: true,
      },
      createAnalyticsEvent,
      pluginKey,
    });
  };

  describe('Numbered list', () => {
    let editorView: EditorView;
    let sel: number;

    beforeEach(() => {
      ({ editorView, sel } = editor(doc(p('{<>}'))));

      insertText(editorView, '/Numbered List', sel);
      sendKeyToPm(editorView, 'Enter');
    });

    it('should insert a numbered list', () => {
      expect(editorView.state.doc).toEqualDocument(doc(ol(li(p('{<>}')))));
    });

    it('should fire Analytics GAS V3 events', () => {
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'list',
        eventType: 'track',
        actionSubjectId: 'numberedList',
        attributes: expect.objectContaining({
          inputMethod: 'quickInsert',
        }),
      });
    });
  });

  describe('Unordered list', () => {
    let editorView: EditorView;
    let sel: number;

    beforeEach(() => {
      ({ editorView, sel } = editor(doc(p('{<>}'))));

      insertText(editorView, '/bullet', sel);
      sendKeyToPm(editorView, 'Enter');
    });

    it('should insert an unordered list', () => {
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('{<>}')))));
    });

    it('should fire Analytics GAS V3 events when inserting a unordered list', () => {
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'list',
        eventType: 'track',
        actionSubjectId: 'bulletedList',
        attributes: expect.objectContaining({
          inputMethod: 'quickInsert',
        }),
      });
    });
  });
});
