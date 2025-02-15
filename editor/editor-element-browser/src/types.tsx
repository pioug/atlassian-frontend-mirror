// import type { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadItem } from '@atlaskit/editor-common/types';

export type QuickInsertPanelItem = TypeAheadItem;
export type SideInsertPanelItem = TypeAheadItem;

export interface QuickInsertPanelProps {
	/**
	 * The full list of items that can be displayed in the QuickInsertPanel
	 */
	items: QuickInsertPanelItem[];

	/**
	 * If not an empty string, the query should be used to display search results
	 */
	query: string;

	onItemInsert: (mode: SelectItemMode, index: number) => void;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests */
	testId?: string;
}

export type SideInsertPanelProps = {
	/**
	 * The full list of items that can be displayed in the SideInsertPanel
	 */
	items: SideInsertPanelItem[];

	onItemInsert: (mode: SelectItemMode, index: number) => void;
};
