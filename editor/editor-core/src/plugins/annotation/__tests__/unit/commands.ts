import { RESOLVE_METHOD } from './../../../analytics/types/inline-comment-events';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import {
  setInlineCommentDraftState,
  resolveInlineComment,
} from '../../commands';
import { inlineCommentPluginKey } from '../../pm-plugins/plugin-factory';
import { EditorView } from 'prosemirror-view';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../../../analytics/types/enums';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import analyticsPlugin from '../../../analytics/plugin';

describe('commands', () => {
  const createEditor = createProsemirrorEditorFactory();

  let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  const editor = (doc: any) =>
    createEditor({
      doc,
      pluginKey: inlineCommentPluginKey,
      preset: new Preset<LightEditorPlugin>().add([
        analyticsPlugin,
        { createAnalyticsEvent: createAnalyticsEvent },
      ]),
    });

  describe('setInlineCommentDraftState', () => {
    let editorView: EditorView<any>;
    beforeEach(() => {
      const editorData = editor(doc(p('Hel{<}lo wo{>}rld')));
      editorView = editorData.editorView;
    });

    afterEach(() => {
      createAnalyticsEvent.mockClear();
    });

    it.each([
      [
        'sends analytics when resolving comment from component',
        {
          resolveMethod: RESOLVE_METHOD.COMPONENT,
        },
      ],
      [
        'sends analytics when resolving comment by deleting text',
        {
          resolveMethod: RESOLVE_METHOD.ORPHANED,
        },
      ],
    ])('%s', (name, { resolveMethod }) => {
      resolveInlineComment('testId', resolveMethod)(
        editorView.state,
        editorView.dispatch,
      );
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'resolved',
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: { method: resolveMethod },
      });
    });

    it.each([
      [
        'sends analytics when opening draft comment',
        {
          isDraft: true,
          expectedAction: ACTION.OPENED,
          expectedAttributes: { inputMethod: INPUT_METHOD.TOOLBAR, overlap: 0 },
        },
      ],
      [
        'sends analytics when closing draft comment',
        {
          isDraft: false,
          expectedAction: ACTION.CLOSED,
          expectedAttributes: {},
        },
      ],
    ])('%s', (name, { isDraft, expectedAction, expectedAttributes }) => {
      setInlineCommentDraftState(isDraft)(
        editorView.state,
        editorView.dispatch,
      );
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: expectedAction,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: expectedAttributes,
      });
    });
  });
});
