import type { DocBuilder } from '@atlaskit/editor-common/types';
import selectionPlugin from '@atlaskit/editor-core/src/plugins/selection';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { findTable } from '@atlaskit/editor-tables/utils';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  tdCursor,
  tdEmpty,
  th,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import { containsHeaderColumn } from '../../../plugins/table/utils/nodes';

describe('table merging logic', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(selectionPlugin)
        .add(tablePlugin),
      pluginKey,
    });

  describe('#containsHeaderColumn', () => {
    it('should return true when first col is all tableHeaders', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, tdCursor, tdEmpty),
            tr(thEmpty, tdEmpty, tdEmpty),
            tr(thEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      const TableWithPos = findTable(editorView.state.selection)!;
      expect(containsHeaderColumn(TableWithPos.node)).toEqual(true);
    });

    it('should return true when first col has a rowspan', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, tdCursor, tdEmpty),
            tr(th({ rowspan: 2 })(p()), tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty),
          ),
        ),
      );

      const TableWithPos = findTable(editorView.state.selection)!;
      expect(containsHeaderColumn(TableWithPos.node)).toEqual(true);
    });
  });
});
