import { RESOLVE_METHOD } from './../../../analytics/types/inline-comment-events';
import { EditorView } from 'prosemirror-view';
import {
  doc,
  p,
  annotation,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { inlineCommentPluginKey, getPluginState } from '../../utils';
import { inlineCommentProvider } from '../_utils';
import annotationPlugin, { AnnotationUpdateEmitter } from '../..';
import { flushPromises } from '../../../../__tests__/__helpers/utils';
import analyticsPlugin from '../../../analytics/plugin';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../../analytics/types/enums';

describe('annotation emitter', () => {
  let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  const updateSubscriber = new AnnotationUpdateEmitter();
  const annotationPreset = new Preset<LightEditorPlugin>()
    .add([
      annotationPlugin,
      { inlineComment: { ...inlineCommentProvider, updateSubscriber } },
    ])
    .add([analyticsPlugin, { createAnalyticsEvent: createAnalyticsEvent }]);

  const createEditor = createProsemirrorEditorFactory();
  let editorView: EditorView;

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      pluginKey: inlineCommentPluginKey,
      preset: annotationPreset,
    });
  };

  beforeEach(async () => {
    ({ editorView } = editor(
      doc(
        p(
          annotation({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id: 'id-0',
          })('Trysail Sail'),
          annotation({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id: 'id-1',
          })('Corsair smartly'),
        ),
      ),
    ));

    await flushPromises();
  });

  describe('fires analytics', () => {
    it('on resolve existing annotations', () => {
      updateSubscriber.emit('resolve', 'id-0');
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: ACTION.RESOLVED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          method: RESOLVE_METHOD.CONSUMER,
        }),
      });
    });
  });

  describe('resolves', () => {
    it('existing annotations', () => {
      updateSubscriber.emit('resolve', 'id-0');

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.annotations).toStrictEqual({
        'id-0': true,
        'id-1': false,
      });
    });

    it('new annotations', () => {
      updateSubscriber.emit('resolve', 'id-3');

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.annotations).toStrictEqual({
        'id-0': false,
        'id-1': false,
        'id-3': true,
      });
    });
  });

  describe('unresolves', () => {
    it('existing annotations', () => {
      updateSubscriber.emit('resolve', 'id-0');
      updateSubscriber.emit('resolve', 'id-1');
      updateSubscriber.emit('unresolve', 'id-0');

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.annotations).toStrictEqual({
        'id-0': false,
        'id-1': true,
      });
    });

    it('new annotations', () => {
      updateSubscriber.emit('unresolve', 'id-3');

      const pluginState = getPluginState(editorView.state);
      expect(pluginState.annotations).toStrictEqual({
        'id-0': false,
        'id-1': false,
        'id-3': false,
      });
    });
  });

  it('create annotation', () => {
    updateSubscriber.emit('create', 'id-3');

    const pluginState = getPluginState(editorView.state);
    expect(pluginState.annotations).toStrictEqual({
      'id-0': false,
      'id-1': false,
      'id-3': false,
    });
  });

  it('delete annotation', () => {
    updateSubscriber.emit('delete', 'id-0');

    const pluginState = getPluginState(editorView.state);
    expect(pluginState.annotations).toStrictEqual({
      'id-0': true,
      'id-1': false,
    });
  });
});
