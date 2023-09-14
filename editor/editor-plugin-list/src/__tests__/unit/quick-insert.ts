import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, li, ol, p, ul } from '@atlaskit/editor-test-helpers/doc-builder';

import { pluginKey } from '../../pm-plugins/main';

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

    beforeEach(async () => {
      const { editorView: _editorView, typeAheadTool } = editor(doc(p('{<>}')));

      await typeAheadTool
        .searchQuickInsert('Numbered List')
        ?.insert({ index: 0 });

      editorView = _editorView;
    });

    it('should insert a numbered list', () => {
      expect(editorView.state.doc).toEqualDocument(doc(ol()(li(p('{<>}')))));
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

    beforeEach(async () => {
      const { editorView: _editorView, typeAheadTool } = editor(doc(p('{<>}')));

      await typeAheadTool.searchQuickInsert('bullet')?.insert({ index: 0 });

      editorView = _editorView;
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
