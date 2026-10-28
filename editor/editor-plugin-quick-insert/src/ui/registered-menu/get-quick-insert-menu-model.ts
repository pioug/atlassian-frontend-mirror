import type { IntlShape } from 'react-intl';

import {
	ASK_ROVO_MENU_ITEM,
	MENU,
	RECOMMENDED_SECTION,
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

type ContentSection = {
	items: RegisterMenuItem[];
	section: RegisterMenuSection;
	viewMoreItem?: RegisterMenuItem;
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

const getSearchResults = (matches: MatchedItem[]): MatchedItem[] => {
	const topMatches = Array.from(matches)
		.sort(compareSearchResults)
		.slice(0, SEARCH_TOP_MATCH_LIMIT);
	const topMatchIdentities = new Set(topMatches.map(({ identity }) => identity));

	return [...topMatches, ...matches.filter(({ identity }) => !topMatchIdentities.has(identity))];
};

/** Recommended uses resolved items rather than registered children. */
const readMenuSections = ({
	childrenMap,
	recommendedItems = [],
	sections,
	surfaceContext,
}: {
	childrenMap: ChildrenMap;
	recommendedItems?: RegisterMenuItem[];
	sections: RegisterComponent[];
	surfaceContext?: SurfaceContext;
}): ContentSection[] => {
	const renderedSections: ContentSection[] = [];
	for (const section of sections) {
		if (section.type !== 'menu-section') {
			continue;
		}
		if (surfaceContext ? section.isHidden?.({ surfaceContext }) : section.isHidden?.()) {
			continue;
		}
		if (section.key === RECOMMENDED_SECTION.key) {
			renderedSections.push({ section, items: recommendedItems });
			continue;
		}
		const children = childrenMap.get(getComponentIdentity(section)) ?? [];
		const items: RegisterMenuItem[] = [];
		let viewMoreItem: RegisterMenuItem | undefined;
		for (const child of children) {
			if (child.type !== 'menu-item' || !willComponentRender(child, childrenMap, surfaceContext)) {
				continue;
			}
			if (isSectionOverflowItemKey(child.key)) {
				viewMoreItem ??= child;
			} else {
				items.push(child);
			}
		}
		// Empty registrations are visible leaves; containers need a visible child.
		if (children.length === 0 || items.length > 0 || viewMoreItem) {
			renderedSections.push({ section, items, viewMoreItem });
		}
	}
	return renderedSections;
};

const getOwnerSectionKey = (
	item: RegisterMenuItem,
	isRecommendedItem: (item: RegisterMenuItem) => boolean,
): string | undefined => (isRecommendedItem(item) ? RECOMMENDED_SECTION.key : item.parents[0]?.key);

const buildBrowseSections = ({
	contentSections,
	isRecommendedItem,
	selectCategoryItems,
}: {
	contentSections: ContentSection[];
	isRecommendedItem: (item: RegisterMenuItem) => boolean;
	selectCategoryItems?: QuickInsertCategoryItemSelectionPolicy;
}): QuickInsertMenuContent => {
	const sections: RegisteredMenuSection[] = [];

	for (const { items, section, viewMoreItem } of contentSections) {
		const ownedItems = items.filter(
			(item) => getOwnerSectionKey(item, isRecommendedItem) === section.key,
		);
		if (ownedItems.length === 0) {
			continue;
		}
		const selectedItems =
			viewMoreItem && selectCategoryItems ? selectCategoryItems(ownedItems) : ownedItems;
		sections.push([
			section,
			...selectedItems,
			...(viewMoreItem && selectedItems.length < ownedItems.length ? [viewMoreItem] : []),
		]);
	}

	return { fallbackItems: [], sections };
};

const buildSearchSections = ({
	components,
	contentSections,
	formatMessage,
	isRecommendedItem,
	query,
	root,
}: {
	components: RegisterComponent[];
	contentSections: ContentSection[];
	formatMessage: IntlShape['formatMessage'];
	isRecommendedItem: (item: RegisterMenuItem) => boolean;
	query: string;
	root: RegisterComponent;
}): QuickInsertMenuContent => {
	const sourceIndexByComponent = new Map(components.map((component, index) => [component, index]));
	const matches = new Map<string, MatchedItem>();
	let fallbackItem: RegisterMenuItem | undefined;

	for (const { items, section } of contentSections) {
		const sectionRank = getParentRank(section, root.key);
		for (const item of items) {
			if (item.key === ASK_ROVO_MENU_ITEM.key) {
				fallbackItem ??= item;
			}
			const match = item.match?.({ formatMessage, itemKey: item.key, query });
			if (
				(item.match && match === null) ||
				getOwnerSectionKey(item, isRecommendedItem) !== section.key
			) {
				continue;
			}
			const candidate: MatchedItem = {
				identity: getComponentIdentity(item),
				item,
				itemRank: getParentRank(item, section.key),
				priorityGroup:
					match?.priorityGroup !== undefined && Number.isFinite(match.priorityGroup)
						? match.priorityGroup
						: undefined,
				score: Math.min(1, Math.max(0, match?.score ?? 0)),
				sectionRank,
				sourceIndex: sourceIndexByComponent.get(item) ?? Number.MAX_SAFE_INTEGER,
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
		...getSearchResults(unprioritizedMatches).map(({ item }) => item),
	];
	if (orderedSearchResults.length > 0) {
		return { fallbackItems: [], sections: [[SEARCH_RESULTS_HEADING, ...orderedSearchResults]] };
	}

	return {
		fallbackItems: fallbackItem ? [fallbackItem] : [],
		sections: [],
	};
};

/**
 * Resolves the Recommended items for a browse. Receives the unranked components so a resolver
 * can look recommendations up by their registered keys.
 */
export type RecommendedItemsResolver = (params: {
	components: RegisterComponent[];
	surfaceContext?: SurfaceContext;
}) => RegisterMenuItem[];

/**
 * Builds the registered quick-insert menu model. An empty query browses every
 * category; a non-empty query returns ranked matches. The footer is shared by both.
 */
export const getQuickInsertMenuModel = ({
	components,
	formatMessage,
	getItemRank,
	getRecommendedItems,
	query,
	rootComponent,
	selectCategoryItems,
	surfaceContext,
}: {
	components: RegisterComponent[];
	formatMessage: IntlShape['formatMessage'];
	getItemRank?: RegisteredItemRankResolver;
	/** Fills Recommended when browsing. Search never shows Recommended. */
	getRecommendedItems?: RecommendedItemsResolver;
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
	if (!root || (surfaceContext ? root.isHidden?.({ surfaceContext }) : root.isHidden?.())) {
		return { fallbackItems: [], footer: undefined, root: undefined, sections: [] };
	}

	const isBrowse = query === '';
	const renderedSections = readMenuSections({
		sections: topLevelChildren,
		childrenMap,
		surfaceContext,
		recommendedItems: isBrowse ? getRecommendedItems?.({ components, surfaceContext }) : undefined,
	});
	if (topLevelChildren.length > 0 && renderedSections.length === 0) {
		return { fallbackItems: [], footer: undefined, root: undefined, sections: [] };
	}
	const footerSection = renderedSections.find(({ section }) => isMenuFooterSectionKey(section.key));
	const contentSections = renderedSections.filter(
		({ section }) =>
			!isMenuFooterSectionKey(section.key) && (isBrowse || section.key !== RECOMMENDED_SECTION.key),
	);
	const recommendedIdentities = new Set(
		contentSections
			.find(({ section }) => section.key === RECOMMENDED_SECTION.key)
			?.items.map(getComponentIdentity),
	);
	const isRecommendedItem = (item: RegisterMenuItem) =>
		recommendedIdentities.has(getComponentIdentity(item));

	const content = isBrowse
		? buildBrowseSections({ contentSections, isRecommendedItem, selectCategoryItems })
		: buildSearchSections({
				components: rankedComponents,
				contentSections,
				formatMessage,
				isRecommendedItem,
				query,
				root,
			});
	const footer = footerSection?.items[0];

	return { ...content, footer, root };
};
