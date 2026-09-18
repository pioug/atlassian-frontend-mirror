import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import type {
	MenuItemMatchContext,
	RegisterComponent,
	RegisterMenuItem,
} from '@atlaskit/editor-ui-control-model/types';

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
	items: RegistryElementBrowserItem[];
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

const isVisible = (registration: RegisterComponent): boolean => registration.isHidden?.() !== true;

const getChildren = (components: RegisterComponent[], parentKey: string): RegisterComponent[] =>
	components.filter(
		(component) =>
			isVisible(component) && component.parents?.some((parent) => parent.key === parentKey),
	);

const getParentRank = (registration: RegisterComponent, parentKey: string): number =>
	registration.parents?.find((parent) => parent.key === parentKey)?.rank ?? Number.MAX_SAFE_INTEGER;

const getDescendantItems = (
	components: RegisterComponent[],
	parentKey: string,
	ancestorRanks: number[],
	sectionKey: string,
): RegistryElementBrowserItem[] =>
	getChildren(components, parentKey).flatMap((component) => {
		const ranks = [...ancestorRanks, getParentRank(component, parentKey)];
		if (component.type === 'menu-item') {
			return component.component
				? [{ ranks, registration: component, sectionKeys: [sectionKey] }]
				: [];
		}

		return getDescendantItems(components, component.key, ranks, sectionKey);
	});

/**
 * Builds the Element Browser's immutable open-time view of the Quick Insert registry.
 * The caller provides only components rooted at the Quick Insert menu surface.
 */
export const createRegistryElementBrowserModel = (
	components: RegisterComponent[],
	{
		footerKey,
		overflowKeys,
		recommendedSectionKey,
		rootKey,
	}: {
		footerKey: string;
		overflowKeys: Set<string>;
		recommendedSectionKey: string;
		rootKey: string;
	},
): RegistryElementBrowserModel => {
	const excludedKeys = new Set([footerKey, recommendedSectionKey, ...overflowKeys]);
	const visibleComponents = components.filter(
		(component) => isVisible(component) && !excludedKeys.has(component.key),
	);
	const sections = getChildren(visibleComponents, rootKey)
		.filter((component) => component.type === 'menu-section')
		.map((section) => ({ key: section.key, rank: getParentRank(section, rootKey) }))
		.sort((left, right) => left.rank - right.rank);
	const itemByKey = new Map<string, RegistryElementBrowserItem>();

	sections.forEach((section) => {
		getDescendantItems(visibleComponents, section.key, [section.rank], section.key).forEach(
			(item) => {
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
			},
		);
	});

	return {
		items: [...itemByKey.values()].sort((left, right) => compareRanks(left.ranks, right.ranks)),
		sections,
	};
};

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
}): RegistryElementBrowserItem[] => {
	const normalizedQuery = query.trim();
	const items = section
		? model.items.filter((item) => item.sectionKeys.includes(section))
		: model.items;
	const itemsWithDescriptions = items.map((item) => ({
		...item,
		description: createQuickInsertMatcher.getDescription?.(item.registration.match, formatMessage),
	}));

	if (!normalizedQuery) {
		return itemsWithDescriptions;
	}

	return itemsWithDescriptions
		.flatMap((item) => {
			const result = item.registration.match?.({ formatMessage, query: normalizedQuery });
			return result ? [{ ...item, score: Math.min(1, Math.max(0, result.score)) }] : [];
		})
		.sort(
			(left, right) =>
				left.score - right.score ||
				compareRanks(left.ranks, right.ranks) ||
				left.registration.key.localeCompare(right.registration.key),
		);
};
