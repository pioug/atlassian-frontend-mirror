import type { SortOrder } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export type TableSortMeta = Record<
	string,
	{
		direction: SortOrder;
		index: number;
		order: {
			index: number;
			value: number;
		}[];
	}
>;

export interface ViewModeSortPluginState {
	allTables: HoverTableMeta[];
	decorations: DecorationSet;
	sort: TableSortMeta;
}

type HoverTableMeta = [string, PMNode, number];
