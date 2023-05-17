import { PluginKey } from 'prosemirror-state';

import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  table,
  tr,
  td,
  tdEmpty,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';

import tablePlugin from '../../../plugins/table/index';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import { TablePluginState } from '../../../plugins/table/types';
import { addColumnAt } from '../../../plugins/table/commands/insert';
import widthPlugin from '@atlaskit/editor-core/src/plugins/width';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('table plugin: insert', () => {
  describe('addColumnAt', () => {
    // We override the body as the table resizing logic uses it via the width plugin
    // to calculate if a table should overflow
    const mockBodyOffsetWidth = 1000;
    const getEditorContainerWidth: GetEditorContainerWidth = () => {
      return {
        width: mockBodyOffsetWidth,
      };
    };

    const createEditor = createProsemirrorEditorFactory();

    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add([
        tablePlugin,
        {
          tableOptions: {},
        },
      ])
      .add(widthPlugin);

    const editor = (doc: DocBuilder) =>
      createEditor<TablePluginState, PluginKey>({
        doc,
        preset,
        pluginKey,
      });

    it('does scale cells in tables which are not overflowing', () => {
      const { editorView } = editor(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              td({ colwidth: [230] })(p('')),
              td({ colwidth: [230] })(p('')),
              td({ colwidth: [230] })(p('')),
            ),
          ),
        ),
      );
      const { state } = editorView;
      const transaction = state.tr;
      const lastTableCellNode =
        transaction.doc.content.firstChild?.firstChild?.lastChild;

      const updatedTransaction = addColumnAt(getEditorContainerWidth)(
        2,
        true,
        editorView,
      )(transaction);

      const updatedLastTableCellNode =
        updatedTransaction.doc.content.firstChild?.firstChild?.lastChild;

      expect(updatedLastTableCellNode?.attrs.colwidth[0]).not.toBe(
        lastTableCellNode?.attrs.colwidth[0],
      );
    });

    it('does not scale cells in tables which are overflowing', () => {
      const { editorView } = editor(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(
              td({ colwidth: [mockBodyOffsetWidth] })(p('')),
              tdEmpty,
              tdEmpty,
            ),
          ),
        ),
      );
      const { state } = editorView;
      const transaction = state.tr;

      const updatedTransaction = addColumnAt(getEditorContainerWidth)(
        2,
        true,
        editorView,
      )(transaction);

      const tablePMNode = updatedTransaction.doc.content.firstChild;
      const tableRowNode = tablePMNode?.firstChild;
      const firstTableCellNode = tableRowNode?.firstChild;

      expect(firstTableCellNode?.attrs.colwidth[0]).toBe(mockBodyOffsetWidth);
    });
  });
});
