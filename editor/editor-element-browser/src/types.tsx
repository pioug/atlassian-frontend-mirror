import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadItem } from '@atlaskit/editor-common/types';

export type QuickInsertPanelItem = TypeAheadItem;
export type SideInsertPanelItem = TypeAheadItem;

type StructureSubcategory =
	| 'text structure'
	| 'page structure'
	| 'connect pages'
	| 'navigation'
	| 'search';

type DataSubcategory = 'charts' | 'gadgets' | 'jira' | 'labels' | 'reports' | 'timelines';

type ElementCategory = 'media' | 'collaborate' | 'apps' | 'data' | 'structure';

export type InsertPanelItem = TypeAheadItem & {
	category?: ElementCategory;
	subCategory?: StructureSubcategory | DataSubcategory;
	shouldDisplayAtTop?: boolean; // some elements have to be displayed at the top of the category/subcategory
	shouldDisplay?: boolean; // some items should not be displayed in new Quick Insert and Right Rail (AI, lists)
	tempKey: number; // index in the items array
};

export type OnSelectItem = (props: { index: number }) => void;

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

	setSelectedItem?: OnSelectItem;
}

export type SideInsertPanelProps = {
	/**
	 * The full list of items that can be displayed in the SideInsertPanel
	 */
	items: SideInsertPanelItem[];

	onItemInsert: (mode: SelectItemMode, index: number) => void;
};
