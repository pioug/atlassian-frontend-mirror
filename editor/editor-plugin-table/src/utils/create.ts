import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { createTable } from '@atlaskit/editor-tables/utils';

import { TABLE_MAX_WIDTH } from '../pm-plugins/table-resizing/utils';

export const createTableWithWidth =
  (
    isTableScalingEnabled?: boolean,
    isFullWidthModeEnabled?: boolean,
    createTableProps?: {
      rowsCount?: number;
      colsCount?: number;
    },
  ) =>
  (schema: Schema) => {
    if (isTableScalingEnabled && isFullWidthModeEnabled) {
      return createTable({
        schema,
        tableWidth: TABLE_MAX_WIDTH,
        ...createTableProps,
      });
    }
    return createTable({
      schema,
      ...createTableProps,
    });
  };
