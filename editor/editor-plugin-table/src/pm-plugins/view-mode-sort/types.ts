import type { SortOrder } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export type TableSortMeta = Record<
  string,
  {
    index: number;
    order: {
      index: number;
      value: number;
    }[];
    direction: SortOrder;
  }
>;

export interface ViewModeSortPluginState {
  decorations: DecorationSet;
  sort: TableSortMeta;
  allTables: HoverTableMeta[];
}

export type HoverTableMeta = [string, PMNode, number];
