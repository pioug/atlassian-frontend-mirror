import { NodeSelection } from 'prosemirror-state';

import {
  createEditorFactory,
  EditorInstanceWithPlugin,
} from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  media,
  mediaSingle,
  mediaGroup,
  RefsNode,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { Schema } from '@atlaskit/editor-test-helpers/schema';

describe('media selection', () => {
  let editor: (
    doc: (schema: Schema<any, any>) => RefsNode,
  ) => EditorInstanceWithPlugin<any>;

  beforeEach(() => {
    const createEditor = createEditorFactory();
    editor = (doc: (schema: Schema<any, any>) => RefsNode) =>
      createEditor({
        doc,
        editorProps: {
          media: { allowMediaSingle: true, featureFlags: { captions: true } },
        },
      });
  });

  describe('select media node inside mediaSingle', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    beforeEach(() => {
      // paragraph 1-2
      // mediaSingle 3-5
      // media 4-4
      editorInstance = editor(
        doc(
          p('{<>}'),
          mediaSingle()(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
          ),
          p('text{<>}'),
        ),
      );
    });

    it('not change selection when select mediaSingle', () => {
      const editorView = editorInstance.editorView;
      const { state } = editorView;
      const cursorPos = 2;

      editorView.dispatch(
        state.tr.setSelection(new NodeSelection(state.doc.resolve(cursorPos))),
      );

      expect(editorView.state.selection instanceof NodeSelection).toBe(true);

      expect(
        (editorView.state.selection as NodeSelection).node.type.name,
      ).toEqual('mediaSingle');
      expect(editorView.state.selection.$from.pos).toBe(2);
      expect(editorView.state.selection.$to.pos).toBe(5);
    });

    it('change selection when select media', () => {
      const editorView = editorInstance.editorView;
      const { state } = editorView;
      const cursorPos = 3;

      editorView.dispatch(
        state.tr.setSelection(new NodeSelection(state.doc.resolve(cursorPos))),
      );

      expect(editorView.state.selection instanceof NodeSelection).toBe(true);

      expect(
        (editorView.state.selection as NodeSelection).node.type.name,
      ).toEqual('mediaSingle');
      expect(editorView.state.selection.$from.pos).toBe(2);
      expect(editorView.state.selection.$to.pos).toBe(5);
    });
  });

  describe('select media node inside mediaGroup', () => {
    let editorInstance: EditorInstanceWithPlugin<any>;

    beforeEach(() => {
      editorInstance = editor(
        doc(
          mediaGroup(
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
            media({
              id: 'a559980d-cd47-43e2-8377-27359fcb905f',
              type: 'file',
              collection: 'MediaServicesSample',
            })(),
          ),
          p('text{<>}'),
        ),
      );
    });

    it('change selection when select media', () => {
      const editorView = editorInstance.editorView;
      const { state } = editorView;
      const cursorPos = 1;

      editorView.dispatch(
        state.tr.setSelection(new NodeSelection(state.doc.resolve(cursorPos))),
      );

      expect(editorView.state.selection instanceof NodeSelection).toBe(true);

      expect(editorView.state.selection.$from.pos).toBe(cursorPos);
    });
  });
});
