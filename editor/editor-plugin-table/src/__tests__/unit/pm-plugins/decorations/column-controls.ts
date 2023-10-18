import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { buildColumnControlsDecorations } from '../../../../plugins/table/pm-plugins/decorations/utils';
import { TableDecorations } from '../../../../plugins/table/types';

describe('tables: column controls decorations', () => {
  describe(`should return a decorationSet with 2 ${TableDecorations.COLUMN_CONTROLS_DECORATIONS} type`, () => {
    ffTest(
      'platform.editor.table.drag-and-drop',
      () => {
        const decorationKey = TableDecorations.COLUMN_CONTROLS_DECORATIONS;
        const state = createEditorState(doc(table()(tr(tdCursor, tdEmpty))));
        const nextDecorationSet = buildColumnControlsDecorations({
          decorationSet: DecorationSet.empty,
          tr: state.tr,
        });

        const decorations = nextDecorationSet.find(
          undefined,
          undefined,
          (spec: any) => spec.key.indexOf(decorationKey) > -1,
        );

        expect(decorations).toHaveLength(2);
      },
      () => {
        const decorationKey = TableDecorations.COLUMN_CONTROLS_DECORATIONS;
        const state = createEditorState(doc(table()(tr(tdCursor, tdEmpty))));
        const nextDecorationSet = buildColumnControlsDecorations({
          decorationSet: DecorationSet.empty,
          tr: state.tr,
        });

        const decorations = nextDecorationSet.find(
          undefined,
          undefined,
          (spec: any) => spec.key.indexOf(decorationKey) > -1,
        );

        expect(decorations).toHaveLength(2);
      },
    );
  });
});
