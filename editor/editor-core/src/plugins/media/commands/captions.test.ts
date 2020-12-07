import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  caption,
  doc,
  media,
  mediaSingle,
  p,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { Schema } from 'prosemirror-model';
import {
  insertAndSelectCaptionFromMediaSinglePos,
  selectCaptionFromMediaSinglePos,
} from './captions';

describe('Caption plugin', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: (schema: Schema) => RefsNode, opts = {}) =>
    createEditor({
      doc,
      ...opts,
    });

  it('should insert the caption node and select it', () => {
    const { editorView } = editor(
      doc(
        '{<node>}',
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
        ),
        p('Line two'),
      ),
      {
        editorProps: {
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
        },
      },
    );
    insertAndSelectCaptionFromMediaSinglePos(0, editorView.state.doc.child(0))(
      editorView.state,
      editorView.dispatch,
    );
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('{<>}'),
        ),
        p('Line two'),
      ),
    );
  });

  it('should not insert the caption node when it exists already', () => {
    const { editorView } = editor(
      doc(
        '{<node>}',
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('test'),
        ),
        p('Line two'),
      ),
      {
        editorProps: {
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
        },
      },
    );
    expect(
      insertAndSelectCaptionFromMediaSinglePos(
        0,
        editorView.state.doc.child(0),
      )(editorView.state, editorView.dispatch),
    ).toBeFalsy();
  });

  it('should move selection to an existing caption node', () => {
    const { editorView } = editor(
      doc(
        '{<node>}',
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('hello world'),
        ),
        p('Line two'),
      ),
      {
        editorProps: {
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
        },
      },
    );
    selectCaptionFromMediaSinglePos(0, editorView.state.doc.child(0))(
      editorView.state,
      editorView.dispatch,
    );
    expect(editorView.state).toEqualDocumentAndSelection(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('hello world{<>}'),
        ),
        p('Line two'),
      ),
    );
  });

  it('should not move selection to a non existing caption node', () => {
    const { editorView } = editor(
      doc(
        '{<node>}',
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
        ),
        p('Line two'),
      ),
      {
        editorProps: {
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
        },
      },
    );
    expect(
      selectCaptionFromMediaSinglePos(0, editorView.state.doc.child(0))(
        editorView.state,
        editorView.dispatch,
      ),
    ).toBeFalsy();
  });
});
