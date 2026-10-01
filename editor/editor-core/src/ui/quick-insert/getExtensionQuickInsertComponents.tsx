import React from 'react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { MenuItem } from '@atlaskit/editor-common/extensions';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { getQuickInsertMenuItemParents } from '@atlaskit/editor-common/quick-insert/get-menu-item-parents';
import {
	DATA_AND_CHARTS_SECTION,
	EMBED_SECTION,
	MEDIA_SECTION,
	OTHER_SECTION,
	STRUCTURE_SECTION,
} from '@atlaskit/editor-common/quick-insert/keys';
import {
	CREATE_SECTION_RANK,
	EXTENSION_ITEM_RANK,
	MEDIA_SECTION_RANK,
} from '@atlaskit/editor-common/quick-insert/rank';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import type {
	CommonComponentProps,
	RegisterMenuItem,
} from '@atlaskit/editor-ui-control-model/types';

import type EditorActions from '../../actions';
import { ExtensionQuickInsertMenuItem } from './ExtensionQuickInsertMenuItem';

type ExtensionQuickInsertComponentProps = CommonComponentProps & {
	onInsert?: () => void;
};

const structureExtensionItemKeyRanks: Readonly<Record<string, number>> = {
	'toc:toc': 600,
	'native-tabs:native-tabs': 1900,
	'cards:quick-insert': 2000,
	'carousel:quick-insert': 2100,
	'spotlight:quick-insert': 2200,
	'create-from-template:create-from-template': 2700,
	'anchor:anchor': 2900,
	'smart-button:quick-insert': 3000,
};
const UNRECOGNIZED_STRUCTURE_EXTENSION_ITEM_RANK = 3100;
const APP_DATA_AND_CHARTS_ITEM_RANK = 2700;
const APP_EMBED_ITEM_RANK = EXTENSION_ITEM_RANK;
const APP_MEDIA_ITEM_RANK = Math.max(...Object.values(MEDIA_SECTION_RANK)) + 100;
const APP_OTHER_ITEM_RANK = EXTENSION_ITEM_RANK;

const getStructureExtensionItemRank = (item: MenuItem): number | undefined =>
	structureExtensionItemKeyRanks[item.key];

const isExtensionItemInSection = (item: MenuItem, sectionKey: string): boolean =>
	getQuickInsertMenuItemParents({
		category: item.category,
		legacyCategories: item.categories,
		rank: 0,
	}).some((parent) => parent.key === sectionKey);

const compareMenuItemsByTitleAndKey = (firstItem: MenuItem, secondItem: MenuItem): number =>
	firstItem.title.localeCompare(secondItem.title) || firstItem.key.localeCompare(secondItem.key);

const getAlphabeticalItemRanks = (
	items: MenuItem[],
	isRankedItem: (item: MenuItem) => boolean,
	firstRank: number,
): Map<MenuItem, number> =>
	new Map(
		items
			.filter(isRankedItem)
			.sort(compareMenuItemsByTitleAndKey)
			.map((item, index): [MenuItem, number] => [item, firstRank + index]),
	);

const hasNoNegativePriority = (item: MenuItem): boolean =>
	item.priority === undefined || item.priority >= 0;

const getSectionAlphabeticalItemRanks = (
	items: MenuItem[],
	sectionKey: string,
	firstRank: number,
	isRankedItem: (item: MenuItem) => boolean = hasNoNegativePriority,
): Map<MenuItem, number> =>
	getAlphabeticalItemRanks(
		items,
		(item) => isExtensionItemInSection(item, sectionKey) && isRankedItem(item),
		firstRank,
	);

// Rank each parent section separately so a macro in multiple categories gets the right order in each.
const createExtensionItemRanker = (items: MenuItem[]) => {
	const sections: Array<[string, number, ((item: MenuItem) => boolean)?]> = [
		[EMBED_SECTION.key, APP_EMBED_ITEM_RANK],
		[MEDIA_SECTION.key, APP_MEDIA_ITEM_RANK],
		[OTHER_SECTION.key, APP_OTHER_ITEM_RANK],
		[
			STRUCTURE_SECTION.key,
			UNRECOGNIZED_STRUCTURE_EXTENSION_ITEM_RANK,
			(item) => getStructureExtensionItemRank(item) === undefined,
		],
		[
			DATA_AND_CHARTS_SECTION.key,
			APP_DATA_AND_CHARTS_ITEM_RANK,
			(item) => item.priority === undefined,
		],
	];
	const ranksBySection = new Map(
		sections.map(([sectionKey, firstRank, isRankedItem]): [string, Map<MenuItem, number>] => [
			sectionKey,
			getSectionAlphabeticalItemRanks(items, sectionKey, firstRank, isRankedItem),
		]),
	);

	return ({
		index,
		knownRank,
		item,
		sectionKey,
	}: {
		index: number;
		item: MenuItem;
		knownRank?: number;
		sectionKey: string;
	}): number => {
		if (knownRank !== undefined) {
			return knownRank;
		}
		const sectionRank = ranksBySection.get(sectionKey)?.get(item);
		return sectionRank ?? EXTENSION_ITEM_RANK + (item.priority ?? index);
	};
};

export const getExtensionQuickInsertComponents = ({
	apiRef,
	createAnalyticsEvent,
	editorActions,
	items,
}: {
	apiRef: React.MutableRefObject<PublicPluginAPI<[ExtensionPlugin]> | undefined>;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	editorActions: EditorActions;
	items: MenuItem[];
}): RegisterMenuItem<ExtensionQuickInsertComponentProps>[] => {
	const getExtensionItemRank = createExtensionItemRanker(items);

	return items.map((item, index) => {
		const structureRank = getStructureExtensionItemRank(item);
		const isStructureItem = structureRank !== undefined;
		const categories = isStructureItem ? ['structure'] : item.categories;
		const parents = getQuickInsertMenuItemParents({
			category: item.category,
			legacyCategories: categories,
			rank: 0,
		});

		return {
			type: 'menu-item',
			key: item.key,
			parents: parents.map((parent) => ({
				...parent,
				rank: getExtensionItemRank({
					index,
					knownRank: CREATE_SECTION_RANK[item.key] ?? structureRank,
					item,
					sectionKey: parent.key,
				}),
			})),
			match: createQuickInsertMatcher(() => ({
				description: item.description,
				keywords: item.keywords,
				title: item.title,
			})),
			component: (props) => {
				return (
					<ExtensionQuickInsertMenuItem
						apiRef={apiRef}
						createAnalyticsEvent={createAnalyticsEvent}
						editorActions={editorActions}
						item={item}
						onInsert={props.onInsert}
					/>
				);
			},
		};
	});
};
