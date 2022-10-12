import { findTable } from '@atlaskit/editor-tables/utils';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { bodiedExtensionData } from '@atlaskit/editor-test-helpers/mock-extension-data';

import {
  doc,
  p,
  table,
  tr,
  td,
  th,
  tdCursor,
  tdEmpty,
  bodiedExtension,
  layoutSection,
  layoutColumn,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { TableLayout } from '@atlaskit/adf-schema';
import {
  PermittedLayoutsDescriptor,
  TablePluginState,
} from '../../plugins/table/types';
import { toggleTableLayout } from '../../plugins/table/commands';
import { isLayoutSupported } from '../../plugins/table/utils';
import { getPluginState } from '../../plugins/table/pm-plugins/plugin-factory';
import { pluginKey as tablePluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import tablePlugin from '../../plugins/table-plugin';
import expandPlugin from '@atlaskit/editor-core/src/plugins/expand';
import extensionPlugin from '@atlaskit/editor-core/src/plugins/extension';
import layoutPlugin from '@atlaskit/editor-core/src/plugins/layout';
import { PluginKey } from 'prosemirror-state';

describe('table toolbar', () => {
  const tableOptions = {
    allowNumberColumn: true,
    allowHeaderRow: true,
    allowHeaderColumn: true,
    permittedLayouts: 'all' as PermittedLayoutsDescriptor,
  };

  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add([tablePlugin, { tableOptions }])
    .add(expandPlugin)
    .add(extensionPlugin)
    .add(layoutPlugin);

  const editor = (doc: DocBuilder) => {
    return createEditor<TablePluginState, PluginKey>({
      doc,
      preset,
      pluginKey: tablePluginKey,
    });
  };

  describe('table layouts', () => {
    it('should update the table node layout attribute', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );

      const nodeInitial = findTable(editorView.state.selection)!.node;
      expect(nodeInitial).toBeDefined();
      expect(nodeInitial!.attrs.layout).toBe('default');

      toggleTableLayout(editorView.state, editorView.dispatch);

      const { node } = findTable(editorView.state.selection)!;

      expect(node).toBeDefined();
      expect(node!.attrs.layout).toBe('wide');
    });

    it('can set the data-layout attribute on the table DOM element', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );

      let tableElement = editorView.dom.querySelector('table');
      expect(tableElement!.getAttribute('data-layout')).toBe('default');

      toggleTableLayout(editorView.state, editorView.dispatch);
      tableElement = editorView.dom.querySelector('table');
      expect(tableElement!.getAttribute('data-layout')).toBe('wide');
    });

    it('applies the initial data-layout attribute on the table DOM element', () => {
      const { editorView } = editor(
        doc(table({ layout: 'full-width' })(tr(tdCursor, tdEmpty, tdEmpty))),
      );

      const tables = editorView.dom.getElementsByTagName('table');
      expect(tables.length).toBe(1);
      const tableElement = tables[0];

      expect(tableElement.getAttribute('data-layout')).toBe('full-width');
    });

    ['default', 'wide', 'full-width'].forEach((currentLayout) => {
      describe(`#toggleTableLayout`, () => {
        it('should toggle table layout attribute', () => {
          const { editorView } = editor(
            doc(
              table({ layout: currentLayout as TableLayout })(
                tr(tdCursor, tdEmpty, tdEmpty),
              ),
            ),
          );
          toggleTableLayout(editorView.state, editorView.dispatch);
          const { tableNode } = getPluginState(editorView.state);
          let nextLayout;
          switch (currentLayout) {
            case 'default':
              nextLayout = 'wide';
              break;
            case 'wide':
              nextLayout = 'full-width';
              break;
            case 'full-width':
              nextLayout = 'default';
              break;
          }
          expect(tableNode).toBeDefined();
          expect(tableNode!.attrs.layout).toBe(nextLayout);
        });
      });
    });

    it('applies the initial data-layout attribute on the table DOM element', () => {
      const { editorView } = editor(
        doc(table({ layout: 'full-width' })(tr(tdCursor, tdEmpty, tdEmpty))),
      );

      const tables = editorView.dom.getElementsByTagName('table');
      expect(tables.length).toBe(1);
      const tableElement = tables[0];

      expect(tableElement.getAttribute('data-layout')).toBe('full-width');
    });
  });

  describe('#isLayoutSupported', () => {
    (['default', 'wide', 'full-width'] as TableLayout[]).forEach((layout) => {
      describe(`when called with "${layout}"`, () => {
        it('returns true if permittedLayouts="all"', () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(th()(p('{<>}1')), th()(p('2'))),
                tr(td()(p('3')), td()(p('4'))),
              ),
            ),
          );

          expect(isLayoutSupported(editorView.state)).toBe(true);
        });
        it('returns false if table is nested in bodiedExtension', () => {
          const { editorView } = editor(
            doc(
              bodiedExtension(bodiedExtensionData[0].attrs)(
                table()(
                  tr(th()(p('{<>}1')), th()(p('2'))),
                  tr(td()(p('3')), td()(p('4'))),
                ),
              ),
            ),
          );

          expect(isLayoutSupported(editorView.state)).toBe(false);
        });
        it('returns false if table is nested in Columns', () => {
          const { editorView } = editor(
            doc(
              layoutSection(
                layoutColumn({ width: 50 })(
                  table()(
                    tr(th()(p('{<>}1')), th()(p('2'))),
                    tr(td()(p('3')), td()(p('4'))),
                  ),
                ),
                layoutColumn({ width: 50 })(p('text')),
              ),
            ),
          );
          expect(isLayoutSupported(editorView.state)).toBe(false);
        });
      });
    });
  });
});
