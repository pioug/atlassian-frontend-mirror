import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  caption,
  doc,
  media,
  mediaSingle,
  p,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { pluginKey } from './plugin-key';
import { setTextSelection } from '../../../utils/selection';
import { Schema } from 'prosemirror-model';

describe('Caption plugin', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: (schema: Schema) => RefsNode, opts = {}) =>
    createEditor({
      doc,
      pluginKey: pluginKey,
      ...opts,
    });

  it('should not remove caption when there is content', () => {
    const {
      editorView,
      refs: { movePos },
    } = editor(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('Test{<>}'),
        ),
        p('Line {movePos}two'),
      ),
      {
        editorProps: {
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
        },
      },
    );
    setTextSelection(editorView, movePos);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('Test'),
        ),
        p('Line two'),
      ),
    );
  });

  it('should remove caption when there is no content', () => {
    const {
      editorView,
      refs: { movePos },
    } = editor(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('{<>}'),
        ),
        p('Line {movePos}two'),
      ),
      {
        editorProps: {
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
        },
      },
    );
    setTextSelection(editorView, movePos);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
        ),
        p('Line two'),
      ),
    );
  });
});
