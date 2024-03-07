import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { createTable } from '@atlaskit/editor-tables/utils';

import { TABLE_MAX_WIDTH } from '../pm-plugins/table-resizing/utils';

export const createTableWithWidth =
  (
    isFullWidthModeEnabled?: boolean,
    getEditorFeatureFlags?: GetEditorFeatureFlags,
    createTableProps?: {
      rowsCount?: number;
      colsCount?: number;
    },
  ) =>
  (schema: Schema) => {
    const { tablePreserveWidth = false } = getEditorFeatureFlags?.() || {};

    if (tablePreserveWidth && isFullWidthModeEnabled) {
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
