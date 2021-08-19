import {
  doc,
  p,
  table,
  tr,
  td,
  th,
  layoutSection,
  layoutColumn,
  dataConsumer,
  extension,
  expand,
  bodiedExtension,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

const docWithNestedExtensions = () =>
  doc(
    p('Layout with extension + data consumer mark'),
    layoutSection(
      layoutColumn({ width: 50 })(
        dataConsumer({ sources: ['mochi-is-fluffy'] })(
          extension({
            extensionKey: 'test-key-123',
            extensionType: 'com.atlassian.extensions.update',
            parameters: { count: 0 },
            layout: 'default',
            localId: 'testId0',
          })(),
        ),
      ),
      layoutColumn({ width: 50 })(p()),
    ),
    p('Table (header + body cells) with extension + data consumer mark'),
    table({ localId: 'mochi-is-fluffy' })(
      tr(
        th({})(
          dataConsumer({ sources: ['mochi-is-fluffy'] })(
            extension({
              extensionKey: 'test-key-123',
              extensionType: 'com.atlassian.extensions.update',
              parameters: { count: 0 },
              layout: 'default',
              localId: 'testId1',
            })(),
          ),
        ),
      ),
      tr(
        td({})(
          dataConsumer({ sources: ['mochi-is-fluffy'] })(
            extension({
              extensionKey: 'test-key-123',
              extensionType: 'com.atlassian.extensions.update',
              parameters: { count: 0 },
              layout: 'default',
              localId: 'testId2',
            })(),
          ),
        ),
      ),
    ),
    expand({ title: 'Expand with extension + data consumer mark' })(
      dataConsumer({ sources: ['mochi-is-fluffy'] })(
        extension({
          extensionKey: 'test-key-123',
          extensionType: 'com.atlassian.extensions.update',
          parameters: { count: 0 },
          layout: 'default',
          localId: 'testId3',
        })(),
      ),
    ),
    p('Bodied extension with extension + data consumer mark'),
    bodiedExtension({
      extensionKey: 'bodied-eh',
      extensionType: 'com.atlassian.confluence.macro.core',
      parameters: {
        macroParams: {},
        macroMetadata: { placeholder: [{ data: { url: '' }, type: 'icon' }] },
      },
      layout: 'default',
      localId: 'testId4',
    })(
      dataConsumer({ sources: ['mochi-is-fluffy'] })(
        extension({
          extensionKey: 'test-key-123',
          extensionType: 'com.atlassian.extensions.update',
          parameters: { count: 0 },
          layout: 'default',
          localId: 'testId5',
        })(),
      ),
    ),
  );
describe('data consumer plugin', () => {
  /**
   * Use `createEditorFactory` here when `allowReferentiliaty: true`, as
   * `createProsemirrorEditorFactory` has some issues with correctly mimicking
   * old state for the unique localId plugin
   */
  const createEditor = createEditorFactory<{}>();
  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        allowExtension: true,
        allowTables: true,
        allowLayouts: true,
        allowExpand: true,
      },
    });
  };

  describe('Data consumer mark', () => {
    describe('with data consumer mark in various nesting scenarios', () => {
      it('should create nodes without failing', () => {
        const { editorView } = editor(docWithNestedExtensions());

        expect(editorView.state.doc).toEqualDocument(docWithNestedExtensions());
      });
    });
  });
});
