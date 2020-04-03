import { calcTableWidth } from '../../../styles/shared/table';
import { akEditorFullWidthLayoutWidth } from '../../../styles/consts';
import { defaultSchema as schema } from '@atlaskit/adf-schema';
import { calcTableColumnWidths } from '../../../utils/table';

import * as tableMergeResized from '../../__fixtures__/table-merge-resized.adf.json';
import * as defaultTable from '../../__fixtures__/default-table.adf.json';
import * as defaultTableResized from '../../__fixtures__/default-table-resized.adf.json';

describe('@atlaskit/editor-common table utils', () => {
  describe('#calcTableWidth', () => {
    describe('when layout = "full-width"', () => {
      it(`should not exceed ${akEditorFullWidthLayoutWidth}px`, () => {
        const pageWidth = 2000;
        expect(calcTableWidth('full-width', pageWidth)).toEqual(
          `${akEditorFullWidthLayoutWidth}px`,
        );
      });
    });
  });

  describe('#calcTableColumnWidths', () => {
    test('should get the correct array of widths from default table that has been resized', () => {
      const defaultTableFromSchema = schema.nodeFromJSON(defaultTableResized);
      const colWidths = calcTableColumnWidths(
        defaultTableFromSchema.firstChild!,
      );

      expect(colWidths).toEqual([269, 237, 253]); // These are the width in the given adf json
    });

    test('should get the correct array of widths from a table with merge cell', () => {
      const tableMergeResizedFromSchema = schema.nodeFromJSON(
        tableMergeResized,
      );
      const colWidths = calcTableColumnWidths(
        tableMergeResizedFromSchema.firstChild!,
      );

      expect(colWidths).toEqual([94, 95, 181, 48, 56, 173, 48, 64]); // These are the width in the given adf json
    });

    test('should get an array of zeros when getting for non resized table', () => {
      const defaultTableFromSchema = schema.nodeFromJSON(defaultTable);
      const colWidths = calcTableColumnWidths(
        defaultTableFromSchema.firstChild!,
      );

      expect(colWidths).toEqual([0, 0, 0]);
    });
  });
});
