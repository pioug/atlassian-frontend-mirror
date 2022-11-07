import { fragment } from '@atlaskit/adf-schema';
import { defaultSchemaConfig } from '@atlaskit/adf-schema/schema-default';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  th,
  layoutSection,
  layoutColumn,
  fragmentMark,
  extension,
  inlineExtension,
  panel,
  expand,
  bodiedExtension,
  DocBuilder,
  BuilderContent,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { pluginKey as fragmentMarkPluginKey } from '../../plugin-key';
import fragmentMarkPlugin from '../../index';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import extensionPlugin from '../../../extension';
import layoutPlugin from '../../../layout';
import expandPlugin from '../../../expand';
import panelPlugin from '../../../panel';

function mockExtension(localId?: string) {
  return extension({
    extensionKey: 'test-key-extension',
    extensionType: 'com.atlassian.extensions.update',
    parameters: { count: 0 },
    layout: 'default',
    localId: localId || 'test-extension-local-id',
  })();
}

function mockInlineExtension(localId?: string) {
  return inlineExtension({
    extensionKey: 'test-key-inline-extension',
    extensionType: 'com.atlassian.extensions.update',
    parameters: { count: 0 },
    localId: localId || 'test-inline-extension-local-id',
  })();
}

function mockBodiedExtension(content: BuilderContent = p(), localId?: string) {
  return bodiedExtension({
    extensionKey: 'test-key-bodied-extension',
    extensionType: 'com.atlassian.extensions.update',
    parameters: { count: 0 },
    layout: 'default',
    localId: localId || 'test-bodied-extension-local-id',
  })(content);
}

function mockTable(
  thContent: BuilderContent = p(),
  tdContent: BuilderContent = p(),
) {
  return table({ localId: 'test-table-local-id' })(
    tr(th({})(thContent)),
    tr(td({})(tdContent)),
  );
}

function mockLayout(content: BuilderContent = p()) {
  return layoutSection(
    layoutColumn({ width: 50 })(content),
    layoutColumn({ width: 50 })(p()),
  );
}

describe('fragment plugin', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>();

    preset.add(fragmentMarkPlugin);
    preset.add([tablesPlugin, { tableOptions: {} }]);
    preset.add(extensionPlugin);
    preset.add(layoutPlugin);
    preset.add(expandPlugin);
    preset.add(panelPlugin);

    return createEditor({
      doc,
      preset,
      pluginKey: fragmentMarkPluginKey,
    });
  };

  function expectDocValidity(builder: DocBuilder) {
    const config = defaultSchemaConfig;

    config.customMarkSpecs = {
      fragment,
    };

    const createDoc = () => editor(builder);

    expect(createDoc).not.toThrow();
    const { editorView } = createDoc();

    expect(editorView.state.doc).toEqualDocument(builder);
  }

  describe('Fragment mark', () => {
    it('can be present on inline extension nodes inside a panel', () => {
      expectDocValidity(
        doc(
          panel()(
            p(
              fragmentMark({ localId: 'test-fragment-id' })(
                mockInlineExtension(),
              ),
            ),
          ),
        ),
      );
    });

    describe('nesting inside table', () => {
      it('can be present on extension nodes inside table cells', () => {
        expectDocValidity(
          doc(
            mockTable(
              fragmentMark({ localId: 'test-fragment-id-1' })(
                mockExtension('unique-id-within-document-1'),
              ),
              fragmentMark({ localId: 'test-fragment-id-2' })(
                mockExtension('unique-id-within-document-2'),
              ),
            ),
          ),
        );
      });

      // bodied extension nodes aren't supported in table cells

      it('can be present on inline extension nodes inside table cells', () => {
        expectDocValidity(
          doc(
            mockTable(
              fragmentMark({ localId: 'test-fragment-id-1' })(
                p(mockInlineExtension('unique-id-within-document-1')),
              ),
              p(
                fragmentMark({ localId: 'test-fragment-id-2' })(
                  mockInlineExtension('unique-id-within-document-2'),
                ),
              ),
            ),
          ),
        );
      });
    });

    it('can be present on a top-level table', () => {
      expectDocValidity(
        doc(fragmentMark({ localId: 'test-fragment-id' })(mockTable())),
      );
    });

    it('can be present on an inline extension inside paragraph', () => {
      expectDocValidity(
        doc(
          p(
            fragmentMark({ localId: 'test-fragment-id' })(
              mockInlineExtension(),
            ),
          ),
        ),
      );
    });

    it('cannot be present on a table row', () => {
      // This test prevents `fragment` from being unintentionally added to
      // `table` node again until we properly support it
      expect(() => {
        editor(
          doc(
            table({ localId: 'test-table-local-id' })(
              fragmentMark({ localId: 'test-fragment-id' })(tr(td({})(p()))),
              tr(td({})(p())),
            ),
          ),
        );
      }).toThrow();
    });

    describe('nesting inside bodied extension', () => {
      it('can be present on table nodes inside a bodied extension', () => {
        expectDocValidity(
          doc(
            mockBodiedExtension(
              fragmentMark({ localId: 'test-fragment-id' })(mockTable()),
            ),
          ),
        );
      });

      it('can be present on inline extension nodes inside a bodied extension', () => {
        expectDocValidity(
          doc(
            mockBodiedExtension(
              p(
                fragmentMark({ localId: 'test-fragment-id' })(
                  mockInlineExtension(),
                ),
              ),
            ),
          ),
        );
      });
    });

    describe('nesting inside layout', () => {
      it('can be present on extension nodes inside layout', () => {
        expectDocValidity(
          doc(
            mockLayout(
              fragmentMark({ localId: 'test-fragment-id' })(mockExtension()),
            ),
          ),
        );
      });

      it('can be present on table nodes inside layout', () => {
        expectDocValidity(
          doc(
            mockLayout(
              fragmentMark({ localId: 'test-fragment-id' })(mockTable()),
            ),
          ),
        );
      });

      it('can be present on bodied extension nodes inside layout', () => {
        expectDocValidity(
          doc(
            mockLayout(
              fragmentMark({ localId: 'test-fragment-id' })(
                mockBodiedExtension(),
              ),
            ),
          ),
        );
      });
    });

    describe('nesting inside expand', () => {
      it('can be present on table nodes inside expand', () => {
        expectDocValidity(
          doc(
            expand({ title: 'Expand with extension + fragment mark' })(
              fragmentMark({ localId: 'test-fragment-id' })(mockTable()),
            ),
          ),
        );
      });
      it('can be present on extension nodes inside expand', () => {
        expectDocValidity(
          doc(
            expand({ title: 'Expand with extension + fragment mark' })(
              fragmentMark({ localId: 'test-fragment-id' })(mockExtension()),
            ),
          ),
        );
      });

      // bodied extension nodes aren't supported in expands
    });
  });
});
