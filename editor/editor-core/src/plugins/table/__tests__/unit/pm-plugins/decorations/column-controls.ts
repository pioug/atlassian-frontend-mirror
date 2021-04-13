import { DecorationSet } from 'prosemirror-view';

import {
  doc,
  table,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';

import { buildColumnControlsDecorations } from '../../../../pm-plugins/decorations/utils';
import { TableDecorations } from '../../../../types';

describe('tables: column controls decorations', () => {
  describe('#buildColumnControlsDecorations', () => {
    const decorationKey = TableDecorations.COLUMN_CONTROLS_DECORATIONS;
    it(`should return a decorationSet with 2 ${decorationKey} type`, () => {
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
    });
  });
});
