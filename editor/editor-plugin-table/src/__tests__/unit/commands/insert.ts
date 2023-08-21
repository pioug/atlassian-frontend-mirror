import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  doc,
  p,
  table,
  td,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table';
import { addColumnAt } from '../../../plugins/table/commands/insert';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import type { TablePluginState } from '../../../plugins/table/types';

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
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add([
        tablePlugin,
        {
          tableOptions: {},
        },
      ]);

    const editor = (doc: DocBuilder) =>
      createEditor<TablePluginState, PluginKey, typeof preset>({
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
