import { findTable } from '@atlaskit/editor-tables/utils';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import {
  doc,
  table,
  tr,
  tdCursor,
  tdEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { TableLayout } from '@atlaskit/adf-schema';
import {
  PermittedLayoutsDescriptor,
  TablePluginState,
} from '../../plugins/table/types';
import { toggleTableLayout } from '../../plugins/table/commands';
import { getPluginState } from '../../plugins/table/pm-plugins/plugin-factory';
import { pluginKey as tablePluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import tablePlugin from '../../plugins/table-plugin';
import { PluginKey } from 'prosemirror-state';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

describe('table toolbar', () => {
  const tableOptions = {
    allowNumberColumn: true,
    allowHeaderRow: true,
    allowHeaderColumn: true,
    permittedLayouts: 'all' as PermittedLayoutsDescriptor,
  };

  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add(contentInsertionPlugin)
    .add(decorationsPlugin)
    .add(widthPlugin)
    .add([tablePlugin, { tableOptions }]);

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
});
