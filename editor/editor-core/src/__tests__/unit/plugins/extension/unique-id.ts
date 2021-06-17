import { safeInsert } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';

import { uuid } from '@atlaskit/adf-schema';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

const createEditor = createEditorFactory();

describe('allowLocalIdGeneration', () => {
  describe('enabled', () => {
    beforeEach(() => {
      uuid.setStatic('local-uuid');
    });

    afterEach(() => {
      uuid.setStatic(false);
    });

    it('should generate an unique localId when a new extension node is inserted', () => {
      const { editorView } = createEditor({
        doc: doc(p('{<>}')),
        editorProps: {
          allowExtension: true,
        },
      });

      const { extension } = editorView.state.schema.nodes;
      const node = extension.createChecked({
        extensionType: 'inc.acme.extension',
        extensionKey: 'awesome-extension',
      });

      expect(node.attrs.localId).toBe(null);
      editorView.dispatch(
        // NOTE: Same way `EditorAction.replaceSelection` works
        // but `replaceSelection` takes ADF as input
        safeInsert(node)(editorView.state.tr).scrollIntoView(),
      );

      expect(editorView.state.selection.toJSON()).toEqual({
        anchor: 0,
        type: 'node',
      });
      expect(
        (editorView.state.selection as NodeSelection).node.attrs.localId,
      ).toBe('local-uuid');
    });

    it('should generate an unique localId when a new inline extension node is inserted', () => {
      const { editorView } = createEditor({
        doc: doc(p('{<>}')),
        editorProps: {
          allowExtension: true,
        },
      });

      const { inlineExtension } = editorView.state.schema.nodes;
      const node = inlineExtension.createChecked({
        extensionType: 'inc.acme.extension',
        extensionKey: 'awesome-extension',
      });

      expect(node.attrs.localId).toBe(null);
      editorView.dispatch(
        // NOTE: Same way `EditorAction.replaceSelection` works
        // but `replaceSelection` takes ADF as input
        safeInsert(node)(editorView.state.tr).scrollIntoView(),
      );

      expect(editorView.state.selection.toJSON()).toEqual({
        anchor: 1,
        type: 'node',
      });
      expect(
        (editorView.state.selection as NodeSelection).node.attrs.localId,
      ).toBe('local-uuid');
    });
  });
});
