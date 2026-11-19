import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { ASK_ROVO_MENU_ITEM } from '@atlaskit/editor-common/quick-insert/keys';
import type { RegisteredItemRankResolver } from '@atlaskit/editor-common/registered-menu/item-rank';
import { resolveRegisteredItemRank } from '@atlaskit/editor-common/registered-menu/resolve-item-rank';
import type {
	MenuItemMatchContext,
	RegisterComponent,
	RegisterMenuItem,
	SurfaceContext,
} from '@atlaskit/editor-ui-control-model/types';

import { normalizeQuickInsertMatchResult } from '../normalizeQuickInsertMatchResult';

export type RegistryElementBrowserSection = { key: string };

export type RegistryElementBrowserItem = {
	description?: string;
	registration: RegisterMenuItem;
};

type Placement = {
	ranks: number[];
	registration: RegisterMenuItem;
	sectionKey: string;
};

type RegistryElementBrowserModel = {
	effectiveSection?: string;
	fallbackItems?: RegistryElementBrowserItem[];
	items: RegistryElementBrowserItem[];
	recommendedItems: RegistryElementBrowserItem[];
	sections: RegistryElementBrowserSection[];
};

const compareRanks = (left: number[], right: number[]): number => {
	for (let index = 0; index < Math.max(left.length, right.length); index++) {
		const difference = (left[index] ?? 0) - (right[index] ?? 0);
		if (difference !== 0) {
			return difference;
		}
	}

	return 0;
};

const getChildren = (
	components: RegisterComponent[],
	parentKey: string,
	surfaceContext?: SurfaceContext,
) =>
	components.flatMap((component) => {
		const parent = component.parents?.find(({ key }) => key === parentKey);
		return parent && component.isHidden?.({ surfaceContext }) !== true
			? [{ component, parent }]
			: [];
	});

const earliestPlacementByKey = (placements: Placement[]): Map<string, Placement> => {
	const byKey = new Map<string, Placement>();
	for (const placement of placements) {
		const { key } = placement.registration;
		const existing = byKey.get(key);
		if (!existing || compareRanks(placement.ranks, existing.ranks) < 0) {
			byKey.set(key, placement);
		}
	}
	return byKey;
};

const searchPlacements = (
	placements: Placement[],
	query: string,
	formatMessage: MenuItemMatchContext['formatMessage'],
): Placement[] => {
	const matches = placements.flatMap((placement) => {
		const { registration } = placement;
		const result = registration.match?.({ formatMessage, itemKey: registration.key, query });
		return result ? [{ ...placement, ...normalizeQuickInsertMatchResult(result) }] : [];
	});
	const prioritized = matches.filter(({ priorityGroup }) => priorityGroup !== undefined);
	const unprioritized = matches.filter(({ priorityGroup }) => priorityGroup === undefined);

	return [
		...prioritized.sort(
			(left, right) =>
				(right.priorityGroup ?? 0) - (left.priorityGroup ?? 0) ||
				left.score - right.score ||
				compareRanks(left.ranks, right.ranks) ||
				left.registration.key.localeCompare(right.registration.key),
		),
		...unprioritized.sort(
			(left, right) =>
				(left.ranks[0] ?? 0) - (right.ranks[0] ?? 0) ||
				left.score - right.score ||
				compareRanks(left.ranks, right.ranks) ||
				left.registration.key.localeCompare(right.registration.key),
		),
	];
};

/** Builds a view from the resolved Quick Insert registry without changing registrations. */
export const createRegistryElementBrowserModel = (
	components: RegisterComponent[],
	{
		footerKey,
		formatMessage,
		getItemRank,
		overflowKeys,
		query,
		recommendedRegistrations = [],
		recommendedSectionKey,
		rootKey,
		section,
		surfaceContext,
	}: {
		footerKey: string;
		formatMessage: MenuItemMatchContext['formatMessage'];
		getItemRank?: RegisteredItemRankResolver;
		overflowKeys: Set<string>;
		query: string;
		recommendedRegistrations?: RegisterMenuItem[];
		recommendedSectionKey: string;
		rootKey: string;
		section?: string;
		surfaceContext?: SurfaceContext;
	},
): RegistryElementBrowserModel => {
	const isBrowse = query === '';
	const rankOverride = isBrowse ? getItemRank : undefined;
	const excludedKeys = new Set([footerKey, recommendedSectionKey, ...overflowKeys]);
	const visibleComponents = components.filter(({ key }) => !excludedKeys.has(key));
	const categories = getChildren(visibleComponents, rootKey, surfaceContext)
		.filter(({ component }) => component.type === 'menu-section')
		.sort((left, right) => left.parent.rank - right.parent.rank);

	const getPlacements = (
		parentKey: string,
		sectionKey: string,
		ancestorRanks: number[],
	): Placement[] =>
		getChildren(visibleComponents, parentKey, surfaceContext).flatMap(({ component, parent }) => {
			const ranks = [...ancestorRanks, resolveRegisteredItemRank(component, parent, rankOverride)];
			if (component.type === 'menu-item') {
				return component.component ? [{ ranks, registration: component, sectionKey }] : [];
			}
			return getPlacements(component.key, sectionKey, ranks);
		});

	const placements = categories.flatMap(({ component, parent }) =>
		getPlacements(component.key, component.key, [
			resolveRegisteredItemRank(component, parent, rankOverride),
		]),
	);
	const populatedSectionKeys = new Set(placements.map(({ sectionKey }) => sectionKey));
	const sections = categories
		.filter(({ component }) => populatedSectionKeys.has(component.key))
		.map(({ component: { key } }) => ({ key }));
	const effectiveSection = getInitialRegistryElementBrowserSection(sections, section);
	if (isBrowse) {
		placements.sort((left, right) => compareRanks(left.ranks, right.ranks));
	}

	const allByKey = earliestPlacementByKey(placements);
	const categoryPlacements = effectiveSection
		? placements.filter(({ sectionKey }) => sectionKey === effectiveSection)
		: placements;
	const recommendedKeys = new Set(
		isBrowse && !effectiveSection ? recommendedRegistrations.map(({ key }) => key) : [],
	);
	const recommended = [...recommendedKeys].flatMap((key) => allByKey.get(key) ?? []);
	const normalizedQuery = query.trim();

	let results: Placement[];
	if (isBrowse) {
		const byKey = effectiveSection ? earliestPlacementByKey(categoryPlacements) : allByKey;
		results = [...byKey.values()].filter(
			({ registration }) => !recommendedKeys.has(registration.key),
		);
	} else {
		// A category filters search by membership. Each item's earliest path still ranks its match.
		const categoryKeys = new Set(categoryPlacements.map(({ registration }) => registration.key));
		const candidates = [...allByKey.values()]
			.filter(({ registration }) => categoryKeys.has(registration.key))
			.sort((left, right) => compareRanks(left.ranks, right.ranks));
		results = normalizedQuery
			? searchPlacements(candidates, normalizedQuery, formatMessage)
			: candidates;
	}
	const withDescription = ({ registration }: Placement): RegistryElementBrowserItem => ({
		registration,
		description: createQuickInsertMatcher.getDescription?.(registration.match, formatMessage),
	});
	const fallback = allByKey.get(ASK_ROVO_MENU_ITEM.key);
	return {
		effectiveSection,
		fallbackItems: fallback ? [{ registration: fallback.registration }] : undefined,
		items: results.map(withDescription),
		recommendedItems: recommended.map(withDescription),
		sections,
	};
};

export type RecommendedTileSize = 'regular' | 'wide';

/**
 * Lays out Recommended so every row is full: wide tiles take half a row and regular tiles a third.
 * An odd count of three or more ends with a row of three regular tiles; every other tile is wide.
 */
export const getRecommendedTileSize = (index: number, count: number): RecommendedTileSize =>
	count >= 3 && count % 2 === 1 && index >= count - 3 ? 'regular' : 'wide';

export const getInitialRegistryElementBrowserSection = (
	sections: RegistryElementBrowserSection[],
	requestedSection?: string,
): string | undefined =>
	sections.some(({ key }) => key === requestedSection) ? requestedSection : undefined;
