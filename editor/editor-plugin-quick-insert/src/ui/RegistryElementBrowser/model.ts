import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { ASK_ROVO_MENU_ITEM } from '@atlaskit/editor-common/quick-insert/keys';
import type {
	MenuItemMatchContext,
	RegisterComponent,
	RegisterMenuItem,
	SurfaceContext,
} from '@atlaskit/editor-ui-control-model/types';

import { normalizeQuickInsertMatchResult } from '../normalizeQuickInsertMatchResult';

export type RegistryElementBrowserSection = {
	key: string;
	rank: number;
};

export type RegistryElementBrowserItem = {
	description?: string;
	ranks: number[];
	registration: RegisterMenuItem;
	sectionKeys: string[];
};

export type RegistryElementBrowserModel = {
	fallbackItems?: RegistryElementBrowserItem[];
	items: RegistryElementBrowserItem[];
	/** Recommended items that are also available in a browser category, in recommendation order. */
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
): RegisterComponent[] =>
	components.filter(
		(component) =>
			component.parents?.some((parent) => parent.key === parentKey) &&
			component.isHidden?.({ surfaceContext }) !== true,
	);

const getParentRank = (registration: RegisterComponent, parentKey: string): number =>
	registration.parents?.find((parent) => parent.key === parentKey)?.rank ?? Number.MAX_SAFE_INTEGER;

const getDescendantItems = (
	components: RegisterComponent[],
	parentKey: string,
	ancestorRanks: number[],
	sectionKey: string,
	surfaceContext?: SurfaceContext,
): RegistryElementBrowserItem[] =>
	getChildren(components, parentKey, surfaceContext).flatMap((component) => {
		const ranks = [...ancestorRanks, getParentRank(component, parentKey)];
		if (component.type === 'menu-item') {
			return component.component
				? [{ ranks, registration: component, sectionKeys: [sectionKey] }]
				: [];
		}

		return getDescendantItems(components, component.key, ranks, sectionKey, surfaceContext);
	});

/**
 * Builds the Element Browser's view of the resolved Quick Insert registry.
 * The caller provides only components rooted at the Quick Insert menu surface.
 */
export const createRegistryElementBrowserModel = (
	components: RegisterComponent[],
	{
		footerKey,
		overflowKeys,
		recommendedRegistrations = [],
		recommendedSectionKey,
		rootKey,
		surfaceContext,
	}: {
		footerKey: string;
		overflowKeys: Set<string>;
		recommendedRegistrations?: RegisterMenuItem[];
		recommendedSectionKey: string;
		rootKey: string;
		surfaceContext?: SurfaceContext;
	},
): RegistryElementBrowserModel => {
	const excludedKeys = new Set([footerKey, recommendedSectionKey, ...overflowKeys]);
	const visibleComponents = components.filter((component) => !excludedKeys.has(component.key));
	const sections = getChildren(visibleComponents, rootKey, surfaceContext)
		.filter((component) => component.type === 'menu-section')
		.map((section) => ({ key: section.key, rank: getParentRank(section, rootKey) }))
		.sort((left, right) => left.rank - right.rank);
	const itemByKey = new Map<string, RegistryElementBrowserItem>();

	sections.forEach((section) => {
		getDescendantItems(
			visibleComponents,
			section.key,
			[section.rank],
			section.key,
			surfaceContext,
		).forEach((item) => {
			const existing = itemByKey.get(item.registration.key);
			if (!existing) {
				itemByKey.set(item.registration.key, item);
				return;
			}
			const sectionKeys = [...new Set([...existing.sectionKeys, ...item.sectionKeys])];
			itemByKey.set(
				item.registration.key,
				compareRanks(item.ranks, existing.ranks) < 0
					? { ...item, sectionKeys }
					: { ...existing, sectionKeys },
			);
		});
	});

	const items = [...itemByKey.values()].sort((left, right) =>
		compareRanks(left.ranks, right.ranks),
	);
	const fallbackItems = items.filter(
		({ registration }) => registration.key === ASK_ROVO_MENU_ITEM.key,
	);

	const recommendedItems = [...new Set(recommendedRegistrations.map(({ key }) => key))].flatMap(
		(key) => itemByKey.get(key) ?? [],
	);

	return {
		fallbackItems: fallbackItems.length > 0 ? fallbackItems : undefined,
		items,
		recommendedItems,
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
	model: RegistryElementBrowserModel,
	requestedSection?: string,
): string | undefined =>
	model.sections.some((section) => section.key === requestedSection) ? requestedSection : undefined;

export const getRegistryElementBrowserItems = ({
	formatMessage,
	model,
	query,
	section,
}: {
	formatMessage: MenuItemMatchContext['formatMessage'];
	model: RegistryElementBrowserModel;
	query: string;
	section?: string;
}): {
	items: RegistryElementBrowserItem[];
	/** Shown above `items` under a Recommended heading; empty unless browsing All. */
	recommendedItems: RegistryElementBrowserItem[];
} => {
	const withDescription = (item: RegistryElementBrowserItem): RegistryElementBrowserItem => ({
		...item,
		description: createQuickInsertMatcher.getDescription?.(item.registration.match, formatMessage),
	});

	if (section === undefined && query === '') {
		const recommendedKeys = new Set(
			model.recommendedItems.map(({ registration }) => registration.key),
		);
		return {
			items: model.items
				.filter(({ registration }) => !recommendedKeys.has(registration.key))
				.map(withDescription),
			recommendedItems: model.recommendedItems.map(withDescription),
		};
	}

	const normalizedQuery = query.trim();
	const itemsWithDescriptions = (
		section ? model.items.filter((item) => item.sectionKeys.includes(section)) : model.items
	).map(withDescription);

	if (!normalizedQuery) {
		return { items: itemsWithDescriptions, recommendedItems: [] };
	}

	const matches = itemsWithDescriptions.flatMap((item) => {
		const result = item.registration.match?.({
			formatMessage,
			itemKey: item.registration.key,
			query: normalizedQuery,
		});
		return result ? [{ ...item, ...normalizeQuickInsertMatchResult(result) }] : [];
	});
	const prioritized = matches.filter(({ priorityGroup }) => priorityGroup !== undefined);
	const unprioritized = matches.filter(({ priorityGroup }) => priorityGroup === undefined);

	return {
		items: [
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
		],
		recommendedItems: [],
	};
};
