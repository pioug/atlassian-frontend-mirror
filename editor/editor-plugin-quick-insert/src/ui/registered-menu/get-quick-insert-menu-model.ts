import type { IntlShape } from 'react-intl';

import {
	ASK_ROVO_MENU_ITEM,
	MENU,
	SEARCH_RESULTS_SECTION,
} from '@atlaskit/editor-common/quick-insert/keys';
import type {
	RegisteredMenuModel,
	RegisteredMenuSection,
} from '@atlaskit/editor-common/registered-menu';
import {
	applyRegisteredItemRanks,
	type RegisteredItemRankResolver,
} from '@atlaskit/editor-common/registered-menu/item-rank';
import { isMenuFooterSectionKey } from '@atlaskit/editor-common/type-ahead-is-menu-footer-section-key';
import { isSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-is-section-overflow-item-key';
import {
	getComponentIdentity,
	resolveSurface,
	willComponentRender,
} from '@atlaskit/editor-ui-control-model/surface-renderer';
import type {
	ChildrenMap,
	SurfaceIdentifier,
} from '@atlaskit/editor-ui-control-model/surface-renderer/types';
import type {
	RegisterComponent,
	RegisterMenuItem,
	RegisterMenuSection,
	SurfaceContext,
} from '@atlaskit/editor-ui-control-model/types';

import { QuickInsertSearchResultsSection } from './QuickInsertSearchResultsSection';
import type { QuickInsertCategoryItemSelectionPolicy } from './selectQuickInsertCategoryItems';

type QuickInsertMenuContent = Pick<RegisteredMenuModel, 'fallbackItems' | 'sections'>;

const SEARCH_TOP_MATCH_LIMIT = 5;

const SEARCH_RESULTS_HEADING: RegisterMenuSection = {
	key: SEARCH_RESULTS_SECTION.key,
	type: SEARCH_RESULTS_SECTION.type,
	component: QuickInsertSearchResultsSection,
	parents: [{ key: MENU.key, type: MENU.type, rank: 0 }],
};

type MatchedItem = {
	identity: string;
	item: RegisterMenuItem;
	itemRank: number;
	priorityGroup?: number;
	score: number;
	sectionRank: number;
	sourceIndex: number;
};

const getParentRank = (component: RegisterComponent, parentKey: string): number =>
	component.parents?.find((parent) => parent.key === parentKey)?.rank ?? Number.MAX_SAFE_INTEGER;

const compareMatchedItems = (a: MatchedItem, b: MatchedItem): number =>
	a.sectionRank - b.sectionRank ||
	a.score - b.score ||
	a.itemRank - b.itemRank ||
	a.sourceIndex - b.sourceIndex ||
	a.identity.localeCompare(b.identity);

const compareSearchResults = (a: MatchedItem, b: MatchedItem): number =>
	a.score - b.score ||
	a.sectionRank - b.sectionRank ||
	a.itemRank - b.itemRank ||
	a.sourceIndex - b.sourceIndex ||
	a.identity.localeCompare(b.identity);

const comparePrioritizedSearchResults = (a: MatchedItem, b: MatchedItem): number =>
	(b.priorityGroup ?? 0) - (a.priorityGroup ?? 0) || compareSearchResults(a, b);

const getSearchResults = (matches: MatchedItem[]): RegisterMenuItem[] => {
	const topMatches = Array.from(matches)
		.sort(compareSearchResults)
		.slice(0, SEARCH_TOP_MATCH_LIMIT);
	const topMatchIdentities = new Set(topMatches.map(({ identity }) => identity));
	const tailMatches = matches.filter(({ identity }) => !topMatchIdentities.has(identity));

	return [...topMatches, ...tailMatches].map(({ item }) => item);
};

const getRenderedMenuItems = (
	section: RegisterMenuSection,
	childrenMap: ChildrenMap,
	surfaceContext?: SurfaceContext,
): RegisterMenuItem[] =>
	(childrenMap.get(getComponentIdentity(section)) ?? []).filter(
		(child): child is RegisterMenuItem =>
			child.type === 'menu-item' && willComponentRender(child, childrenMap, surfaceContext),
	);

const buildBrowseSections = ({
	childrenMap,
	contentSections,
	selectCategoryItems,
	surfaceContext,
}: {
	childrenMap: ChildrenMap;
	contentSections: RegisterMenuSection[];
	selectCategoryItems?: QuickInsertCategoryItemSelectionPolicy;
	surfaceContext?: SurfaceContext;
}): QuickInsertMenuContent => {
	const sections: RegisteredMenuSection[] = [];

	for (const section of contentSections) {
		const children = getRenderedMenuItems(section, childrenMap, surfaceContext);
		const overflowItems = children.filter((child) => isSectionOverflowItemKey(child.key));
		const viewMoreItem = overflowItems[overflowItems.length - 1];
		const items = children.filter((child) => !isSectionOverflowItemKey(child.key));

		if (items.length === 0) {
			continue;
		}

		const selectedItems =
			viewMoreItem !== undefined && selectCategoryItems !== undefined
				? selectCategoryItems(items)
				: items;
		if (selectedItems.length < items.length && viewMoreItem !== undefined) {
			sections.push([section, ...selectedItems, viewMoreItem]);
		} else {
			sections.push([section, ...selectedItems]);
		}
	}

	return { fallbackItems: [], sections };
};

const buildSearchSections = ({
	childrenMap,
	components,
	contentSections,
	formatMessage,
	query,
	root,
	surfaceContext,
}: {
	childrenMap: ChildrenMap;
	components: RegisterComponent[];
	contentSections: RegisterMenuSection[];
	formatMessage: IntlShape['formatMessage'];
	query: string;
	root: RegisterComponent;
	surfaceContext?: SurfaceContext;
}): QuickInsertMenuContent => {
	const matches = new Map<string, MatchedItem>();
	const sourceIndexByComponent = new Map(components.map((component, index) => [component, index]));

	for (const section of contentSections) {
		for (const item of getRenderedMenuItems(section, childrenMap, surfaceContext)) {
			if (isSectionOverflowItemKey(item.key)) {
				continue;
			}

			const match = item.match?.({ formatMessage, itemKey: item.key, query });
			if (item.match && match === null) {
				continue;
			}

			const candidate: MatchedItem = {
				identity: `${item.type}:${item.key}`,
				item,
				itemRank: getParentRank(item, section.key),
				priorityGroup:
					match?.priorityGroup !== undefined && Number.isFinite(match.priorityGroup)
						? match.priorityGroup
						: undefined,
				score: Math.min(1, Math.max(0, match?.score ?? 0)),
				sourceIndex: sourceIndexByComponent.get(item) ?? Number.MAX_SAFE_INTEGER,
				sectionRank: getParentRank(section, root.key),
			};
			const existing = matches.get(candidate.identity);
			if (!existing || compareMatchedItems(candidate, existing) < 0) {
				matches.set(candidate.identity, candidate);
			}
		}
	}

	const uniqueMatches = Array.from(matches.values()).sort(compareMatchedItems);
	const prioritizedMatches = uniqueMatches.filter(
		({ priorityGroup }) => priorityGroup !== undefined,
	);
	const unprioritizedMatches = uniqueMatches.filter(
		({ priorityGroup }) => priorityGroup === undefined,
	);
	const orderedSearchResults = [
		...prioritizedMatches.sort(comparePrioritizedSearchResults).map(({ item }) => item),
		...getSearchResults(unprioritizedMatches),
	];
	if (orderedSearchResults.length > 0) {
		return { fallbackItems: [], sections: [[SEARCH_RESULTS_HEADING, ...orderedSearchResults]] };
	}

	const fallbackItem = contentSections
		.flatMap((section) => childrenMap.get(getComponentIdentity(section)) ?? [])
		.find(
			(component): component is RegisterMenuItem =>
				component.type === ASK_ROVO_MENU_ITEM.type &&
				component.key === ASK_ROVO_MENU_ITEM.key &&
				willComponentRender(component, childrenMap, surfaceContext),
		);

	return {
		fallbackItems: fallbackItem ? [fallbackItem] : [],
		sections: [],
	};
};

/**
 * Builds the registered quick-insert menu model. An empty query browses every
 * category; a non-empty query returns ranked matches. The footer is shared by both.
 */
export const getQuickInsertMenuModel = ({
	components,
	formatMessage,
	getItemRank,
	query,
	rootComponent,
	selectCategoryItems,
	surfaceContext,
}: {
	components: RegisterComponent[];
	formatMessage: IntlShape['formatMessage'];
	getItemRank?: RegisteredItemRankResolver;
	query: string;
	rootComponent: SurfaceIdentifier;
	selectCategoryItems?: QuickInsertCategoryItemSelectionPolicy;
	surfaceContext?: SurfaceContext;
}): RegisteredMenuModel => {
	const rankedComponents = applyRegisteredItemRanks(components, getItemRank);
	const {
		childrenMap,
		root,
		topLevelChildren = [],
	} = resolveSurface(rankedComponents, rootComponent);
	if (!root || !willComponentRender(root, childrenMap, surfaceContext)) {
		return { fallbackItems: [], footer: undefined, root: undefined, sections: [] };
	}

	const renderedSections = topLevelChildren.filter(
		(section): section is RegisterMenuSection =>
			section.type === 'menu-section' && willComponentRender(section, childrenMap, surfaceContext),
	);
	const footerSection = renderedSections.find(({ key }) => isMenuFooterSectionKey(key));
	const contentSections = renderedSections.filter(({ key }) => !isMenuFooterSectionKey(key));

	const content =
		query === ''
			? buildBrowseSections({ childrenMap, contentSections, selectCategoryItems, surfaceContext })
			: buildSearchSections({
					childrenMap,
					components: rankedComponents,
					contentSections,
					formatMessage,
					query,
					root,
					surfaceContext,
				});
	const footer = footerSection
		? getRenderedMenuItems(footerSection, childrenMap, surfaceContext)[0]
		: undefined;

	return { ...content, footer, root };
};
