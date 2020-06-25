import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { floatingToolbarPlugin, panelPlugin } from '../../../../plugins';
import { FloatingToolbarConfig } from '../../../../plugins/floating-toolbar/types';
import { doc, p, panel } from '@atlaskit/editor-test-helpers/schema-builder';
import { defaultSchema } from '@atlaskit/adf-schema';
import { AllSelection } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { getRelevantConfig } from '../../../../plugins/floating-toolbar';

describe('floating toolbar', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (
    doc: any,
    preset: Preset<LightEditorPlugin> = new Preset<LightEditorPlugin>(),
  ) => {
    preset.add(floatingToolbarPlugin);
    preset.add(panelPlugin);
    return createEditor({
      doc,
      preset: preset,
    });
  };

  describe('floating toolbar', () => {
    describe('getRelevantConfig', () => {
      it('gets correct config for text selection', () => {
        const { editorView } = editor(doc(p('{<}test{>}')));
        const selection = editorView.state.selection;
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
          const { editorView } = editor(doc(p('{<}test{>}')));
          const selection = new AllSelection(editorView.state.doc);

          expectToolbarConfig(
            getRelevantConfig(selection, [testConfig]),
            testConfig,
            editorView.state.doc.firstChild as Node,
            0,
          );
        });

        it('when document contains matching node nested inside other node', () => {
          const { editorView } = editor(doc(panel()(p('{<}text{>}'))));

          const selection = new AllSelection(editorView.state.doc);
          expectToolbarConfig(
            getRelevantConfig(selection, [testConfig]),
            testConfig,
            editorView.state.doc.firstChild!.firstChild as Node,
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
