import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { RefsNode } from '@atlaskit/editor-test-helpers';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  doc,
  p,
  annotation,
  strong,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { RESOLVE_METHOD } from './../../../analytics/types/inline-comment-events';
import { inlineCommentPluginKey } from '../../pm-plugins/plugin-factory';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../../../analytics/types/enums';
import analyticsPlugin from '../../../analytics/plugin';
import textFormatting from '../../../text-formatting';
import * as pluginFactory from '../../pm-plugins/plugin-factory';
import {
  setInlineCommentDraftState,
  resolveInlineComment,
} from '../../commands';
import { ACTIONS } from '../../pm-plugins/actions';
import { inlineCommentProvider, nullComponent } from '../_utils';
import annotationPlugin from '../..';

jest.useFakeTimers();

describe('commands', () => {
  let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  const createCommandSpy = jest.spyOn(pluginFactory, 'createCommand');
  const helloWorldDoc = doc(p('Hel{<}lo wo{>}rld'));
  const helloWorldNoSelectionDoc = doc(p('Hello world'));

  const createEditor = createProsemirrorEditorFactory();
  const annotationPreset = new Preset<LightEditorPlugin>()
    .add([analyticsPlugin, { createAnalyticsEvent: createAnalyticsEvent }])
    .add(textFormatting)
    .add([
      annotationPlugin,
      {
        createComponent: nullComponent,
        viewComponent: nullComponent,
        providers: { inlineComment: inlineCommentProvider },
      },
    ]);

  const editor = (doc: any) =>
    createEditor({
      doc,
      pluginKey: inlineCommentPluginKey,
      preset: annotationPreset,
    });

  const nextTick = async () => {
    // Let the getState promise resolve
    jest.runOnlyPendingTimers();
    await new Promise(resolve => {
      process.nextTick(resolve);
    });
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setInlineCommentDraftState', () => {
    afterEach(() => {
      createAnalyticsEvent.mockClear();
    });

    it('sends analytics when resolving comment from component', async () => {
      const editorView = editor(helloWorldDoc).editorView;

      setInlineCommentDraftState(true, INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.OPENED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: { inputMethod: INPUT_METHOD.TOOLBAR, overlap: 0 },
      });

      await nextTick();
    });

    it('sends analytics when opening draft comment', async () => {
      const editorView = editor(helloWorldDoc).editorView;

      setInlineCommentDraftState(true, INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.OPENED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: { inputMethod: INPUT_METHOD.TOOLBAR, overlap: 0 },
      });

      await nextTick();
    });

    it('sends analytics when opening draft comment from keyboard shortcut', async () => {
      const editorView = editor(helloWorldDoc).editorView;

      setInlineCommentDraftState(true, INPUT_METHOD.SHORTCUT)(
        editorView.state,
        editorView.dispatch,
      );
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.OPENED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: { inputMethod: INPUT_METHOD.SHORTCUT, overlap: 0 },
      });

      await nextTick();
    });

    it('sends analytics when closing draft comment', async () => {
      const editorView = editor(helloWorldDoc).editorView;

      setInlineCommentDraftState(false)(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.CLOSED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: {},
      });

      await nextTick();
    });

    describe('with overlap', () => {
      it('with 1 overlap', () => {
        const commentedDoc = doc(
          p(
            annotation({ id: 'comment-1', annotationType: 'inlineComment' })(
              'This {<}line is an ',
              strong('UNRESOLVED'),
              ' comment{>}',
            ),
          ),
        );
        const editorView = editor(commentedDoc).editorView;

        setInlineCommentDraftState(true, INPUT_METHOD.TOOLBAR)(
          editorView.state,
          editorView.dispatch,
        );
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.OPENED,
          actionSubject: ACTION_SUBJECT.ANNOTATION,
          actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
          eventType: EVENT_TYPE.TRACK,
          attributes: { inputMethod: INPUT_METHOD.TOOLBAR, overlap: 1 },
        });
      });

      it('with 2 overlaps', () => {
        const commentedADF = doc(
          p(
            annotation({ id: 'comment-1', annotationType: 'inlineComment' })(
              'This {<}line is an ',
              strong('UNRESOLVED'),
              ' comment',
            ),
          ),
          p(
            annotation({ id: 'comment-2', annotationType: 'inlineComment' })(
              'This line is an ',
              strong('RESOLVED'),
              ' comment{>}',
            ),
          ),
        );
        const editorView = editor(commentedADF).editorView;

        setInlineCommentDraftState(true, INPUT_METHOD.TOOLBAR)(
          editorView.state,
          editorView.dispatch,
        );
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.OPENED,
          actionSubject: ACTION_SUBJECT.ANNOTATION,
          actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
          eventType: EVENT_TYPE.TRACK,
          attributes: { inputMethod: INPUT_METHOD.TOOLBAR, overlap: 2 },
        });
      });
    });
  });

  describe('resolveInlineComment', () => {
    function setInlineCommentDraftStateWithSetup(
      isDraft: boolean,
      doc: (schema: Schema<any, any>) => RefsNode,
    ) {
      const editorView = editor(doc).editorView;
      setInlineCommentDraftState(isDraft)(
        editorView.state,
        editorView.dispatch,
      );

      return editorView;
    }

    function expectDraftCommandAction(
      editorView: EditorView,
      expectedAction: any,
    ) {
      expect(createCommandSpy).toHaveBeenCalled();
      const action = createCommandSpy.mock.calls[0];
      expect(action[0]).toBeInstanceOf(Function);
      expect((action[0] as Function)(editorView.state)).toEqual(expectedAction);
    }

    it('executes action when selection is valid', async () => {
      const editorView = setInlineCommentDraftStateWithSetup(
        true,
        helloWorldDoc,
      );
      expectDraftCommandAction(editorView, {
        data: {
          drafting: true,
          editorState: editorView.state,
        },
        type: ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE,
      });

      await nextTick();
    });

    describe('when selection is empty', () => {
      it('does not execute action when drafting is true', async () => {
        const editorView = setInlineCommentDraftStateWithSetup(
          true,
          helloWorldNoSelectionDoc,
        );
        expectDraftCommandAction(editorView, false);

        await nextTick();
      });

      it('executes action when drafting is false', async () => {
        const editorView = setInlineCommentDraftStateWithSetup(
          false,
          helloWorldNoSelectionDoc,
        );
        expectDraftCommandAction(editorView, false);

        await nextTick();
      });
    });
  });

  describe('analytics', () => {
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
    ])('%s', async (name, { resolveMethod }) => {
      let editorView: EditorView<any> = editor(helloWorldDoc).editorView;
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

      await nextTick();
    });
  });
});
