import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import { EditorView } from 'prosemirror-view';

import { setGapCursorSelection } from '../../../../utils';
import { Side } from '../../../../plugins/gap-cursor';

import {
  blockNodes,
  leafBlockNodes,
  BlockNodesKeys,
  LeafBlockNodesKeys,
} from './_utils';
import { pluginKey } from '../../../../plugins/gap-cursor/pm-plugins/plugin-key';

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

  const editor = (doc: any, trackEvent?: () => {}) =>
    createEditor({
      doc,
      editorProps: {
        analyticsHandler: trackEvent,
        allowExtension: true,
        allowPanel: true,
        allowRule: true,
        allowTasksAndDecisions: true,
        allowTables: true,
        media: { allowMediaSingle: true },
      },
      pluginKey,
    });

  describe('when cursor is after a block node', () => {
    describe(`when pressing Backspace`, () => {
      (Object.keys(blockNodes) as BlockNodesKeys).forEach(nodeName => {
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

      (Object.keys(leafBlockNodes) as LeafBlockNodesKeys).forEach(nodeName => {
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
      });
    });
  });
});
