import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import { uuid } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

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

    /**
     * The interaction w/ new typeahead & inserting items that are extensions
     * can result in the previous localId behaviour not inserting a localId upon
     * insertion.
     *
     * This results in some incorrect assumptions (that all extensions have
     * localIds); hopefully this ensures this doesn't regress
     */
    it('should generate an unique localId when extension nodes are inserted via complex transactions', () => {
      const { editorView, refs } = createEditor({
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

      // Insert extension as a replace step.
      // - typeahead generates transactions like this
      const cursor = refs['<>'];
      const slice = new Slice(Fragment.from(node), 0, 0);
      const stepWithExtension = new ReplaceStep(
        cursor + 1,
        cursor + 1,
        slice,
        false,
      );
      const pseudoTypeaheadStep = new ReplaceStep(
        cursor + 1,
        cursor + 1,
        Slice.empty,
      );
      const replaceStepTr = editorView.state.tr
        .step(stepWithExtension)
        .step(pseudoTypeaheadStep);
      editorView.dispatch(replaceStepTr.scrollIntoView());

      // select new node, usually handled when not manually creating above case
      editorView.dispatch(
        editorView.state.tr.setSelection(
          new NodeSelection(editorView.state.doc.resolve(cursor + 1)),
        ),
      );

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
