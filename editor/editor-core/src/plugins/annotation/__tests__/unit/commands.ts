import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type {
  RefsNode,
  DocBuilder,
  PublicPluginAPI,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AnnotationTypes } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  annotation,
  strong,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { getPluginState, inlineCommentPluginKey } from '../../utils';
import {
  setInlineCommentDraftState,
  updateInlineCommentResolvedState,
  closeComponent,
  setSelectedAnnotation,
} from '../../commands';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  RESOLVE_METHOD,
} from '@atlaskit/editor-common/analytics';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import * as pluginFactory from '../../pm-plugins/plugin-factory';
import { inlineCommentProvider } from '../_utils';
import type { AnnotationInfo } from '../..';
import annotationPlugin from '../..';
import { ACTIONS } from '../../pm-plugins/types';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

describe('commands', () => {
  let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  const createCommandSpy = jest.spyOn(pluginFactory, 'createCommand');
  const helloWorldDoc = doc(p('Hel{<}lo wo{>}rld'));
  const helloWorldNoSelectionDoc = doc(p('Hello world'));

  const createEditor = createProsemirrorEditorFactory();
  const annotationPreset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, { createAnalyticsEvent }])
    .add(textFormattingPlugin)
    .add([annotationPlugin, { inlineComment: { ...inlineCommentProvider } }]);

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      pluginKey: inlineCommentPluginKey,
      preset: annotationPreset,
    });

  const nextTick = async () => {
    // Let the getState promise resolve
    await new Promise((resolve) => {
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
      const { editorView, editorAPI } = editor(helloWorldDoc);

      setInlineCommentDraftState(editorAPI?.analytics?.actions)(
        true,
        INPUT_METHOD.TOOLBAR,
      )(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.OPENED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod: INPUT_METHOD.TOOLBAR,
          overlap: 0,
        }),
      });

      await nextTick();
    });

    it('sends analytics when opening draft comment', async () => {
      const { editorView, editorAPI } = editor(helloWorldDoc);

      setInlineCommentDraftState(editorAPI?.analytics?.actions)(
        true,
        INPUT_METHOD.TOOLBAR,
      )(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.OPENED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod: INPUT_METHOD.TOOLBAR,
          overlap: 0,
        }),
      });

      await nextTick();
    });

    it('sends analytics when opening draft comment from keyboard shortcut', async () => {
      const { editorView, editorAPI } = editor(helloWorldDoc);

      setInlineCommentDraftState(editorAPI?.analytics?.actions)(
        true,
        INPUT_METHOD.SHORTCUT,
      )(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.OPENED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod: INPUT_METHOD.SHORTCUT,
          overlap: 0,
        }),
      });

      await nextTick();
    });

    it('sends analytics when closing draft comment', async () => {
      const { editorView, editorAPI } = editor(helloWorldDoc);

      setInlineCommentDraftState(editorAPI?.analytics?.actions)(false)(
        editorView.state,
        editorView.dispatch,
      );
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.CLOSED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({}),
      });

      await nextTick();
    });

    describe('with overlap', () => {
      it('when adding annotation inside existing annotation sends analytics with overlap 1', () => {
        // using formatted text for annotation to make it split into multiple nodes
        // to make sure this does not increase overlap value
        const commentedDoc = doc(
          p(
            annotation({
              id: 'comment-1',
              annotationType: AnnotationTypes.INLINE_COMMENT,
            })('This {<}line is a ', strong('formatted'), ' comment{>}'),
          ),
        );
        const { editorView, editorAPI } = editor(commentedDoc);

        setInlineCommentDraftState(editorAPI?.analytics?.actions)(
          true,
          INPUT_METHOD.TOOLBAR,
        )(editorView.state, editorView.dispatch);
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.OPENED,
          actionSubject: ACTION_SUBJECT.ANNOTATION,
          actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
          eventType: EVENT_TYPE.TRACK,
          attributes: expect.objectContaining({
            inputMethod: INPUT_METHOD.TOOLBAR,
            overlap: 1,
          }),
        });
      });

      it('when adding annotation across 2 existing annotations sends analytics with overlap 2', () => {
        const commentedADF = doc(
          p(
            annotation({
              id: 'comment-1',
              annotationType: AnnotationTypes.INLINE_COMMENT,
            })('This {<}line is a comment'),
          ),
          p(
            annotation({
              id: 'comment-2',
              annotationType: AnnotationTypes.INLINE_COMMENT,
            })('This line is another comment{>}'),
          ),
        );
        const { editorView, editorAPI } = editor(commentedADF);

        setInlineCommentDraftState(editorAPI?.analytics?.actions)(
          true,
          INPUT_METHOD.TOOLBAR,
        )(editorView.state, editorView.dispatch);
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.OPENED,
          actionSubject: ACTION_SUBJECT.ANNOTATION,
          actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
          eventType: EVENT_TYPE.TRACK,
          attributes: expect.objectContaining({
            inputMethod: INPUT_METHOD.TOOLBAR,
            overlap: 2,
          }),
        });
      });
    });

    it('calls dispatch just once', async () => {
      const { editorView, editorAPI } = editor(helloWorldDoc);
      await nextTick();
      const dispatchSpy = jest.spyOn(editorView, 'dispatch');
      setInlineCommentDraftState(editorAPI?.analytics?.actions)(
        true,
        INPUT_METHOD.TOOLBAR,
      )(editorView.state, editorView.dispatch);
      let inlineCommentTransactionCalls = 0;
      dispatchSpy.mock.calls.forEach((call) => {
        call.forEach((tr) => {
          tr.getMeta(inlineCommentPluginKey) && inlineCommentTransactionCalls++;
        });
      });
      expect(inlineCommentTransactionCalls).toBe(1);
    });
  });

  describe('setInlineCommentDraftState to resolve', () => {
    function setInlineCommentDraftStateWithSetup(
      isDraft: boolean,
      doc: (schema: Schema<any, any>) => RefsNode,
    ) {
      const { editorView, editorAPI } = editor(doc);
      setInlineCommentDraftState(editorAPI?.analytics?.actions)(isDraft)(
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

  describe('updateInlineCommentResolvedState', () => {
    let editorView: EditorView;
    let editorAPI: PublicPluginAPI<[AnalyticsPlugin]>;
    beforeEach(() => {
      ({ editorView, editorAPI } = editor(helloWorldDoc));
    });

    it('calls dispatch just once', async () => {
      await nextTick();
      const dispatchSpy = jest.spyOn(editorView, 'dispatch');
      updateInlineCommentResolvedState(undefined)(
        { testId: true },
        RESOLVE_METHOD.COMPONENT,
      )(editorView.state, editorView.dispatch);
      let inlineCommentTransactionCalls = 0;
      dispatchSpy.mock.calls.forEach((call) => {
        call.forEach((tr) => {
          tr.getMeta(inlineCommentPluginKey) && inlineCommentTransactionCalls++;
        });
      });
      expect(inlineCommentTransactionCalls).toBe(1);
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
        updateInlineCommentResolvedState(editorAPI?.analytics?.actions)(
          { testId: true },
          resolveMethod,
        )(editorView.state, editorView.dispatch);
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'resolved',
          actionSubject: ACTION_SUBJECT.ANNOTATION,
          actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
          eventType: EVENT_TYPE.TRACK,
          attributes: expect.objectContaining({ method: resolveMethod }),
        });
        await nextTick();
      });
    });
  });

  describe('closeComponent', () => {
    it('clears annotations in selection', async () => {
      const annotationInfo: AnnotationInfo = {
        id: 'annotation-id',
        type: AnnotationTypes.INLINE_COMMENT,
      };

      const { editorView } = editor(
        doc(
          p(
            'Hello ',
            annotation({
              id: annotationInfo.id,
              annotationType: annotationInfo.type,
            })('th{<>}ere'),
            ' friends',
          ),
        ),
      );
      expect(getPluginState(editorView.state)?.selectedAnnotations).toEqual([
        annotationInfo,
      ]);
      closeComponent()(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state)?.selectedAnnotations).toEqual([]);
    });
  });

  describe('setSelectedAnnotation', () => {
    it('sets the correct annotation', async () => {
      const { editorView } = editor(
        doc(
          p(
            'Hello ',
            annotation({
              id: 'comment-1',
              annotationType: AnnotationTypes.INLINE_COMMENT,
            })('there'),
            ' friends',
          ),
        ),
      );

      expect(getPluginState(editorView.state)?.selectedAnnotations).toEqual([]);
      setSelectedAnnotation('comment-1')(editorView.state, editorView.dispatch);
      expect(getPluginState(editorView.state)?.selectedAnnotations).toEqual([
        {
          id: 'comment-1',
          type: AnnotationTypes.INLINE_COMMENT,
        },
      ]);
    });
  });
});
