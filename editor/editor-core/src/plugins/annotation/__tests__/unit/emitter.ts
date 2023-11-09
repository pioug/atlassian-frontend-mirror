import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, annotation } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { inlineCommentPluginKey, getPluginState } from '../../utils';
import { inlineCommentProvider } from '../_utils';
import annotationPlugin, { AnnotationUpdateEmitter } from '../..';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  RESOLVE_METHOD,
} from '@atlaskit/editor-common/analytics';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

describe('annotation emitter', () => {
  let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  const updateSubscriber = new AnnotationUpdateEmitter();
  const annotationPreset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([
      annotationPlugin,
      { inlineComment: { ...inlineCommentProvider, updateSubscriber } },
    ])
    .add([analyticsPlugin, { createAnalyticsEvent }]);

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
      expect(pluginState?.annotations).toStrictEqual({
        'id-0': true,
        'id-1': false,
      });
    });

    it('new annotations', () => {
      updateSubscriber.emit('resolve', 'id-3');

      const pluginState = getPluginState(editorView.state);
      expect(pluginState?.annotations).toStrictEqual({
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
      expect(pluginState?.annotations).toStrictEqual({
        'id-0': false,
        'id-1': true,
      });
    });

    it('new annotations', () => {
      updateSubscriber.emit('unresolve', 'id-3');

      const pluginState = getPluginState(editorView.state);
      expect(pluginState?.annotations).toStrictEqual({
        'id-0': false,
        'id-1': false,
        'id-3': false,
      });
    });
  });

  it('create annotation', () => {
    updateSubscriber.emit('create', 'id-3');

    const pluginState = getPluginState(editorView.state);
    expect(pluginState?.annotations).toStrictEqual({
      'id-0': false,
      'id-1': false,
      'id-3': false,
    });
  });

  it('delete annotation', () => {
    updateSubscriber.emit('delete', 'id-0');

    const pluginState = getPluginState(editorView.state);
    expect(pluginState?.annotations).toStrictEqual({
      'id-0': true,
      'id-1': false,
    });
  });

  it('sets annotation', () => {
    updateSubscriber.emit('setselectedannotation', 'id-0');

    const pluginState = getPluginState(editorView.state);
    expect(pluginState?.selectedAnnotations).toStrictEqual([
      {
        id: 'id-0',
        type: AnnotationTypes.INLINE_COMMENT,
      },
    ]);
  });

  it('deselects annotation', () => {
    updateSubscriber.emit('setselectedannotation', undefined);

    const pluginState = getPluginState(editorView.state);
    expect(pluginState?.selectedAnnotations).toStrictEqual([]);
  });
});
