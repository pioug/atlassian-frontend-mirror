import React from 'react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { MenuItem } from '@atlaskit/editor-common/extensions';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { getQuickInsertMenuItemParents } from '@atlaskit/editor-common/quick-insert/get-menu-item-parents';
import { STRUCTURE_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import { EXTENSION_ITEM_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import type {
	CommonComponentProps,
	RegisterMenuItem,
} from '@atlaskit/editor-ui-control-model/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

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
	'com.atlassian.linking-platform.create:linking-platform-create-jira-issue': 2500,
	'com.atlassian.linking-platform.create:linking-platform-create-confluence-page': 2600,
	'create-from-template:create-from-template': 2700,
	'anchor:anchor': 2900,
	'smart-button:quick-insert': 3000,
};

const UNRECOGNIZED_STRUCTURE_EXTENSION_ITEM_RANK = 3100;
const APP_DATA_AND_CHARTS_ITEM_RANK = 2700;
const APP_EMBED_ITEM_RANK = EXTENSION_ITEM_RANK;

const getStructureExtensionItemRank = (item: MenuItem): number | undefined =>
	structureExtensionItemKeyRanks[item.key];

const isStructureExtensionItem = (item: MenuItem): boolean =>
	getQuickInsertMenuItemParents({
		category: item.category,
		legacyCategories: item.categories,
		rank: 0,
	}).some((parent) => parent.key === STRUCTURE_SECTION.key);

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

const getUnrecognizedStructureItemRanks = (items: MenuItem[]): Map<MenuItem, number> =>
	isExperimentEnabled('platform_editor_slash_command')
		? getAlphabeticalItemRanks(
				items,
				(item) =>
					isStructureExtensionItem(item) && getStructureExtensionItemRank(item) === undefined,
				UNRECOGNIZED_STRUCTURE_EXTENSION_ITEM_RANK,
			)
		: new Map();

const getUnrecognizedDataAndChartsItemRanks = (items: MenuItem[]): Map<MenuItem, number> =>
	isExperimentEnabled('platform_editor_slash_command')
		? getAlphabeticalItemRanks(
				items,
				(item) => item.category === 'data-and-charts' && item.priority === undefined,
				APP_DATA_AND_CHARTS_ITEM_RANK,
			)
		: new Map();

const getEmbedAppItemRanks = (items: MenuItem[]): Map<MenuItem, number> =>
	isExperimentEnabled('platform_editor_slash_command')
		? getAlphabeticalItemRanks(
				items,
				(item) => item.category === 'embed' && (item.priority === undefined || item.priority >= 0),
				APP_EMBED_ITEM_RANK,
			)
		: new Map();

const getFallbackRank = ({
	index,
	embedAppItemRanks,
	item,
	unrecognizedDataAndChartsItemRanks,
	unrecognizedStructureItemRanks,
}: {
	index: number;
	embedAppItemRanks: Map<MenuItem, number>;
	item: MenuItem;
	unrecognizedDataAndChartsItemRanks: Map<MenuItem, number>;
	unrecognizedStructureItemRanks: Map<MenuItem, number>;
}): number =>
	embedAppItemRanks.get(item) ??
	unrecognizedStructureItemRanks.get(item) ??
	unrecognizedDataAndChartsItemRanks.get(item) ??
	EXTENSION_ITEM_RANK + (item.priority ?? index);

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
	const embedAppItemRanks = getEmbedAppItemRanks(items);
	const unrecognizedStructureItemRanks = getUnrecognizedStructureItemRanks(items);
	const unrecognizedDataAndChartsItemRanks = getUnrecognizedDataAndChartsItemRanks(items);

	return items.map((item, index) => {
		const structureRank = getStructureExtensionItemRank(item);
		const isStructureItem = structureRank !== undefined;
		const categories = isStructureItem ? ['structure'] : item.categories;
		const fallbackRank = getFallbackRank({
			index,
			embedAppItemRanks,
			item,
			unrecognizedDataAndChartsItemRanks,
			unrecognizedStructureItemRanks,
		});

		return {
			type: 'menu-item',
			key: item.key,
			parents: getQuickInsertMenuItemParents({
				category: item.category,
				legacyCategories: categories,
				rank: structureRank ?? fallbackRank,
			}),
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
