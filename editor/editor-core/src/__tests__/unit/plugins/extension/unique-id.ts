import { uuid } from '@atlaskit/adf-schema';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';

const createEditor = createEditorFactory();

describe('allowLocalIdGeneration', () => {
  describe('enabled', () => {
    beforeEach(() => {
      uuid.setStatic('local-uuid');
    });

    afterEach(() => {
      uuid.setStatic(false);
    });

    it('should generate an unique localId when a new node is inserted', () => {
      const { editorView, sel } = createEditor({
        doc: doc(p('{<>}')),
        editorProps: {
          allowExtension: {
            allowLocalIdGeneration: true,
          },
        },
      });

      const { extension } = editorView.state.schema.nodes;
      const node = extension.createChecked({
        extensionType: 'inc.acme.extension',
        extensionKey: 'awesome-extension',
      });

      expect(node.attrs.localId).toBe('');
      const tr = editorView.state.tr.insert(sel, node);
      editorView.dispatch(tr);
      const extensionNode = editorView.state.doc.nodeAt(sel + 1)!;
      expect(extensionNode.type).toBe(extension);
      expect(extensionNode.attrs.localId).toBe('local-uuid');
    });
  });

  describe('disabled', () => {
    it('should not generate an unique localId when a new node is inserted', () => {
      const { editorView, sel } = createEditor({
        doc: doc(p('{<>}')),
        editorProps: {
          allowExtension: {
            allowLocalIdGeneration: false,
          },
        },
      });

      const { extension } = editorView.state.schema.nodes;
      const node = extension.createChecked({
        extensionType: 'inc.acme.extension',
        extensionKey: 'awesome-extension',
      });

      expect(node.attrs.localId).toBeUndefined();
      const tr = editorView.state.tr.insert(sel, node);
      editorView.dispatch(tr);
      const extensionNode = editorView.state.doc.nodeAt(sel + 1)!;
      expect(extensionNode.type).toBe(extension);
      expect(extensionNode.attrs.localId).toBeUndefined();
    });
  });
});
