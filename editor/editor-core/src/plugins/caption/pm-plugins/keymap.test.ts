import {
  createEditorFactory,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import {
  caption,
  doc,
  media,
  mediaSingle,
  p,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { Schema } from 'prosemirror-model';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';

const createEditorTestingLibrary = createEditorFactory();
const editor = (doc: (schema: Schema<any, any>) => RefsNode) =>
  createEditorTestingLibrary({
    doc,
    editorProps: {
      media: { allowMediaSingle: true, featureFlags: { captions: true } },
    },
  });

describe('caption keymap', () => {
  it('should go to caption on tab', () => {
    const { editorView } = editor(
      doc(
        '{<node>}',
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('Hello'),
        ),
      ),
    );
    sendKeyToPm(editorView, 'Tab');
    const captionParentNode = findParentNodeOfType(
      editorView.state.schema.nodes.caption,
    )(editorView.state.selection);
    expect(editorView.state.selection instanceof TextSelection).toBe(true);
    expect(captionParentNode).toBeDefined();
  });

  it('should select caption on arrow down', () => {
    const { editorView } = editor(
      doc(
        '{<node>}',
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('Hello'),
        ),
        p(''),
      ),
    );
    sendKeyToPm(editorView, 'ArrowDown');
    const captionParentNode = findParentNodeOfType(
      editorView.state.schema.nodes.caption,
    )(editorView.state.selection);
    expect(editorView.state.selection instanceof TextSelection).toBe(true);
    expect(captionParentNode).toBeDefined();
  });

  it('should select media from paragraph below on arrow up', () => {
    const { editorView } = editor(
      doc(
        mediaSingle({
          layout: 'center',
        })(
          media({
            id: 'abc',
            type: 'file',
            collection: 'xyz',
          })(),
          caption('hello'),
        ),
        p('{<>}something'),
      ),
    );

    sendKeyToPm(editorView, 'ArrowUp');
    expect(editorView.state.selection instanceof NodeSelection).toBe(true);
  });

  it('should remove first character without replacing it with empty nodes', () => {
    const { editorView } = editor(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('H{<>}'),
        ),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');
    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption(''),
        ),
      ),
    );
  });

  it('safely removes caption text on cmd + backspace', () => {
    const { editorView } = editor(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption('Hello{<>}'),
        ),
      ),
    );

    sendKeyToPm(editorView, 'Mod-Backspace');
    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle()(
          media({
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
          })(),
          caption(''),
        ),
      ),
    );
  });
});
