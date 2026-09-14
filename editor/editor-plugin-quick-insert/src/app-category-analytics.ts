import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type {
	CategoryInformation,
	CategoryKey,
	LegacyCategoryKey,
	QuickInsertInformationAttributes,
} from '@atlaskit/editor-common/analytics/types/quick-insert-events';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { getQuickInsertMenuItemParents } from '@atlaskit/editor-common/quick-insert/get-menu-item-parents';
import {
	BLOCK_TEMPLATES_SECTION,
	DATA_AND_CHARTS_SECTION,
	EMBED_SECTION,
	MEDIA_SECTION,
	OTHER_SECTION,
	ROVO_SECTION,
	STRUCTURE_SECTION,
	TEXT_FORMATTING_SECTION,
} from '@atlaskit/editor-common/quick-insert/keys';
export const QUICK_INSERT_ITEMS_ANALYTICS_DELAY_MS = 10_000;

type CategorizedLegacyCategoryKey = Exclude<LegacyCategoryKey, 'uncategorized'>;

const GUID_ONLY_APP_KEY_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

const isGuidOnlyAppKey = (appKey: string): boolean => GUID_ONLY_APP_KEY_REGEX.test(appKey);

export type QuickInsertItemsAnalyticsOptions = {
	providedItems: readonly QuickInsertItem[];
};

const sectionCategoryKeys: Record<string, CategoryKey> = {
	[BLOCK_TEMPLATES_SECTION.key]: 'blockTemplates',
	[DATA_AND_CHARTS_SECTION.key]: 'dataAndCharts',
	[EMBED_SECTION.key]: 'embed',
	[MEDIA_SECTION.key]: 'media',
	[OTHER_SECTION.key]: 'other',
	[ROVO_SECTION.key]: 'rovo',
	[STRUCTURE_SECTION.key]: 'structure',
	[TEXT_FORMATTING_SECTION.key]: 'textFormatting',
};

const legacyCategoryKeys = new Set<string>([
	'admin',
	'ai',
	'block-templates',
	'communication',
	'confluence-content',
	'data-and-charts',
	'development',
	'embed',
	'external-content',
	'formatting',
	'media',
	'navigation',
	'other',
	'reporting',
	'skills',
	'structure',
	'text-formatting',
	'visuals',
]);

const isLegacyCategoryKey = (category: string): category is CategorizedLegacyCategoryKey =>
	legacyCategoryKeys.has(category);

export const calculateQuickInsertItemsAttributes = ({
	providedItems,
}: QuickInsertItemsAnalyticsOptions): QuickInsertInformationAttributes => {
	const emptyCategoryInformation = (): CategoryInformation => ({
		internalMacroCount: 0,
		internalAppCount: 0,
		internalAppMacroMax: 0,
		ecosystemMacroCount: 0,
		ecosystemAppCount: 0,
		ecosystemAppMacroMax: 0,
		allMacroCount: 0,
		allAppCount: 0,
		allAppMacroMax: 0,
	});
	const emptyCategoryCounts: Record<CategoryKey, CategoryInformation> = {
		blockTemplates: emptyCategoryInformation(),
		dataAndCharts: emptyCategoryInformation(),
		embed: emptyCategoryInformation(),
		media: emptyCategoryInformation(),
		other: emptyCategoryInformation(),
		rovo: emptyCategoryInformation(),
		structure: emptyCategoryInformation(),
		textFormatting: emptyCategoryInformation(),
	};
	const emptyLegacyCategoryCounts: Record<LegacyCategoryKey, CategoryInformation> = {
		admin: emptyCategoryInformation(),
		ai: emptyCategoryInformation(),
		'block-templates': emptyCategoryInformation(),
		communication: emptyCategoryInformation(),
		'confluence-content': emptyCategoryInformation(),
		'data-and-charts': emptyCategoryInformation(),
		development: emptyCategoryInformation(),
		embed: emptyCategoryInformation(),
		'external-content': emptyCategoryInformation(),
		formatting: emptyCategoryInformation(),
		media: emptyCategoryInformation(),
		navigation: emptyCategoryInformation(),
		other: emptyCategoryInformation(),
		reporting: emptyCategoryInformation(),
		skills: emptyCategoryInformation(),
		structure: emptyCategoryInformation(),
		'text-formatting': emptyCategoryInformation(),
		uncategorized: emptyCategoryInformation(),
		visuals: emptyCategoryInformation(),
	};
	const attributes: QuickInsertInformationAttributes = {
		category: emptyCategoryCounts,
		legacyCategory: emptyLegacyCategoryCounts,
		allCategories: emptyCategoryInformation(),
	};
	type AppMacroCounts = {
		all: Map<string, number>;
		ecosystem: Map<string, number>;
		internal: Map<string, number>;
	};
	const appMacroCounts = new WeakMap<CategoryInformation, AppMacroCounts>();

	const getAppMacroCounts = (category: CategoryInformation): AppMacroCounts => {
		const existingCounts = appMacroCounts.get(category);
		if (existingCounts) {
			return existingCounts;
		}

		const counts: AppMacroCounts = {
			all: new Map(),
			internal: new Map(),
			ecosystem: new Map(),
		};
		appMacroCounts.set(category, counts);
		return counts;
	};

	const countAppMacro = (appKey: string, counts: Map<string, number>) => {
		const appMacroCount = (counts.get(appKey) ?? 0) + 1;
		counts.set(appKey, appMacroCount);
		return appMacroCount;
	};

	const countCategoryItem = (category: CategoryInformation, item: QuickInsertItem) => {
		category.allMacroCount += 1;

		const { key: appKey = 'unknown', source } = item.app ?? {};
		const appMacroKey = isGuidOnlyAppKey(appKey) ? 'unknown' : appKey;
		const counts = getAppMacroCounts(category);
		const allAppMacroCount = countAppMacro(appMacroKey, counts.all);
		category.allAppCount = counts.all.size;
		category.allAppMacroMax = Math.max(category.allAppMacroMax, allAppMacroCount);

		if (source === 'internal') {
			category.internalMacroCount += 1;
			const internalAppMacroCount = countAppMacro(appMacroKey, counts.internal);
			category.internalAppCount = counts.internal.size;
			category.internalAppMacroMax = Math.max(category.internalAppMacroMax, internalAppMacroCount);
		} else if (source === 'ecosystem') {
			category.ecosystemMacroCount += 1;
			const ecosystemAppMacroCount = countAppMacro(appMacroKey, counts.ecosystem);
			category.ecosystemAppCount = counts.ecosystem.size;
			category.ecosystemAppMacroMax = Math.max(
				category.ecosystemAppMacroMax,
				ecosystemAppMacroCount,
			);
		}
	};

	const countItem = (item: QuickInsertItem) => {
		countCategoryItem(attributes.allCategories, item);

		const categories = item.categories ?? [];
		const normalizedCategories = new Set(
			categories?.map((category) => category.trim().toLowerCase()).filter(Boolean) ?? [],
		);
		let hasUnknownCategory = normalizedCategories.size === 0;

		for (const category of normalizedCategories) {
			if (isLegacyCategoryKey(category)) {
				countCategoryItem(attributes.legacyCategory[category], item);
			} else {
				hasUnknownCategory = true;
			}
		}

		if (hasUnknownCategory) {
			countCategoryItem(attributes.legacyCategory.uncategorized, item);
		}

		for (const { key } of getQuickInsertMenuItemParents({
			category: item.category,
			legacyCategories: item.categories,
			rank: 0,
		})) {
			const categoryKey = sectionCategoryKeys[key];
			if (!categoryKey) {
				continue;
			}

			countCategoryItem(attributes.category[categoryKey], item);
		}
	};

	for (const item of providedItems) {
		countItem(item);
	}

	return attributes;
};

export const createQuickInsertItemsAnalyticsScheduler = (
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
): {
	destroy: () => void;
	schedule: (options: QuickInsertItemsAnalyticsOptions) => void;
} => {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	let animationFrameId: number | undefined;
	let idleCallbackId: number | undefined;
	let destroyed = false;
	let scheduled = false;

	const emit = (options: QuickInsertItemsAnalyticsOptions) => {
		if (destroyed) {
			return;
		}
		dispatchAnalyticsEvent({
			action: ACTION.QUICK_INSERT_INFORMATION,
			actionSubject: ACTION_SUBJECT.QUICK_INSERT,
			attributes: calculateQuickInsertItemsAttributes(options),
			eventType: EVENT_TYPE.OPERATIONAL,
		});
	};

	return {
		destroy: () => {
			destroyed = true;
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}
			if (animationFrameId !== undefined && typeof window !== 'undefined') {
				window.cancelAnimationFrame(animationFrameId);
			}
			if (
				idleCallbackId !== undefined &&
				typeof window !== 'undefined' &&
				typeof window.cancelIdleCallback === 'function'
			) {
				window.cancelIdleCallback(idleCallbackId);
			}
		},
		schedule: (options) => {
			if (scheduled || destroyed) {
				return;
			}
			scheduled = true;
			timeoutId = setTimeout(() => {
				if (destroyed || typeof window === 'undefined') {
					return;
				}
				if (typeof window.requestIdleCallback === 'function') {
					idleCallbackId = window.requestIdleCallback(() => emit(options));
				} else if (typeof window.requestAnimationFrame === 'function') {
					animationFrameId = window.requestAnimationFrame(() => emit(options));
				}
			}, QUICK_INSERT_ITEMS_ANALYTICS_DELAY_MS);
		},
	};
};
