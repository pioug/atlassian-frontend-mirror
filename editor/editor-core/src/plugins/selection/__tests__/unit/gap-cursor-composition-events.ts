import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { setGapCursorSelection } from '@atlaskit/editor-common/selection';
import { Side } from '../../../../plugins/selection/gap-cursor-selection';

import type { BlockNodesKeys, LeafBlockNodesKeys } from './_gap-cursor-utils';
import { blockNodes, leafBlockNodes } from './_gap-cursor-utils';
import { gapCursorPluginKey } from '../../pm-plugins/gap-cursor-plugin-key';

const deleteContentBackward = (view: EditorView) => {
  view.dom.dispatchEvent(
    new (window as any).InputEvent('beforeinput', {
      isComposing: false,
      inputType: 'deleteContentBackward',
    }),
  );
};

describe('gap-cursor: composition events', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        allowExtension: true,
        allowPanel: true,
        allowRule: true,
        allowTasksAndDecisions: true,
        allowTables: true,
        media: { allowMediaSingle: true },
      },
      pluginKey: gapCursorPluginKey,
    });

  describe('when cursor is after a block node', () => {
    describe(`when pressing Backspace`, () => {
      (Object.keys(blockNodes) as BlockNodesKeys).forEach((nodeName) => {
        describe(nodeName, () => {
          it(`should delete the ${nodeName}`, () => {
            const { editorView, refs } = editor(
              doc((blockNodes[nodeName] as any)(), '{pos}'),
            );
            setGapCursorSelection(editorView, refs.pos, Side.RIGHT);
            deleteContentBackward(editorView);

            expect(editorView.state.doc).toEqualDocument(doc(p('')));
          });
        });
      });

      (Object.keys(leafBlockNodes) as LeafBlockNodesKeys).forEach(
        (nodeName) => {
          describe(nodeName, () => {
            it(`should delete the ${nodeName}`, () => {
              const { editorView, refs } = editor(
                doc(leafBlockNodes[nodeName], '{pos}'),
              );
              setGapCursorSelection(editorView, refs.pos, Side.RIGHT);
              deleteContentBackward(editorView);

              expect(editorView.state.doc).toEqualDocument(doc(p('')));
            });
          });
        },
      );
    });
  });
});
