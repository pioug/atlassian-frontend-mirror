import type { TableLayout } from '@atlaskit/adf-schema';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { findTable } from '@atlaskit/editor-tables/utils';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../plugins/table-plugin';
import { toggleTableLayout } from '../../plugins/table/commands';
import { getPluginState } from '../../plugins/table/pm-plugins/plugin-factory';
import { pluginKey as tablePluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import type {
  PermittedLayoutsDescriptor,
  TablePluginState,
} from '../../plugins/table/types';

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
    .add(guidelinePlugin)
    .add(selectionPlugin)
    .add([tablePlugin, { tableOptions }]);

  const editor = (doc: DocBuilder) => {
    return createEditor<TablePluginState, PluginKey, typeof preset>({
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
