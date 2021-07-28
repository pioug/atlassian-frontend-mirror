import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { FloatingToolbarConfig } from '../types';
import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';
import { AllSelection } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { getRelevantConfig } from '../index';
import { defaultSchema } from '@atlaskit/adf-schema';

describe('floating toolbar', () => {
  describe('floating toolbar', () => {
    describe('getRelevantConfig', () => {
      it('gets correct config for text selection', () => {
        const editorState = createEditorState(doc(p('{<}test{>}')));
        const selection = editorState.selection;
        const testConfig: FloatingToolbarConfig = {
          title: 'test toolbar',
          nodeType: defaultSchema.nodes['paragraph'],
          items: [],
        };
        const expectedNode = selection.$from.node();
        const expectedConfig = getRelevantConfig(selection, [
          testConfig,
        ]) as any;
        expect(expectedConfig.config).toBe(testConfig);
        expect(expectedConfig.node).toBe(expectedNode);
        expect(expectedConfig.pos).toBe(1);
      });

      describe('gets correct config for all selection', () => {
        let testConfig: FloatingToolbarConfig;

        beforeEach(() => {
          testConfig = {
            title: 'test toolbar',
            nodeType: defaultSchema.nodes['paragraph'],
            items: [],
          };
        });

        it('when document contains node matching toolbar configuration', () => {
          const editorState = createEditorState(doc(p('{<}test{>}')));
          const selection = new AllSelection(editorState.doc);

          expectToolbarConfig(
            getRelevantConfig(selection, [testConfig]),
            testConfig,
            editorState.doc.firstChild as Node,
            0,
          );
        });

        it('when document contains matching node nested inside other node', () => {
          const editorState = createEditorState(doc(panel()(p('{<}text{>}'))));

          const selection = new AllSelection(editorState.doc);
          expectToolbarConfig(
            getRelevantConfig(selection, [testConfig]),
            testConfig,
            editorState.doc.firstChild!.firstChild as Node,
            0,
          );
        });

        function expectToolbarConfig(
          toolbarConfig: any,
          expectedConfig: FloatingToolbarConfig,
          expectedNode: Node,
          pos: number,
        ) {
          expect(toolbarConfig.config).toBe(expectedConfig);
          expect(toolbarConfig.node).toBe(expectedNode);
          expect(toolbarConfig.pos).toBe(pos);
        }
      });
    });
  });
});
