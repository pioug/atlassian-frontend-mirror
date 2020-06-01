import { EditorView } from 'prosemirror-view';
import {
  doc,
  p,
  annotation,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { getPluginState } from '../../pm-plugins/inline-comment';
import { inlineCommentPluginKey } from '../../pm-plugins/plugin-factory';
import { inlineCommentProvider } from '../_utils';
import annotationPlugin, { AnnotationUpdateEmitter } from '../..';
import { flushPromises } from '../../../../__tests__/__helpers/utils';

const updateSubscriber = new AnnotationUpdateEmitter();

const annotationPreset = new Preset<LightEditorPlugin>().add([
  annotationPlugin,
  { inlineComment: { ...inlineCommentProvider, updateSubscriber } },
]);

describe('annotation emitter', () => {
  const createEditor = createProsemirrorEditorFactory();
  let editorView: EditorView;

  const editor = (doc: any) => {
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
});
