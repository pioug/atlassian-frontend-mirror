import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP, TrackAEP } from './utils';

export type CategoryInformation = {
	allAppCount: number;
	allAppMacroMax: number;
	allMacroCount: number;
	ecosystemAppCount: number;
	ecosystemAppMacroMax: number;
	ecosystemMacroCount: number;
	internalAppCount: number;
	internalAppMacroMax: number;
	internalMacroCount: number;
};

export type CategoryKey =
	| 'blockTemplates'
	| 'create'
	| 'dataAndCharts'
	| 'embed'
	| 'media'
	| 'other'
	| 'rovo'
	| 'structure'
	| 'textFormatting';

export type LegacyCategoryKey =
	| 'admin'
	| 'ai'
	| 'block-templates'
	| 'communication'
	| 'confluence-content'
	| 'data-and-charts'
	| 'development'
	| 'embed'
	| 'external-content'
	| 'formatting'
	| 'media'
	| 'navigation'
	| 'other'
	| 'reporting'
	| 'skills'
	| 'structure'
	| 'text-formatting'
	| 'uncategorized'
	| 'visuals';

export type QuickInsertInformationAttributes = {
	allCategories: CategoryInformation;
	category: Record<CategoryKey, CategoryInformation>;
	legacyCategory: Record<LegacyCategoryKey, CategoryInformation>;
};

export type QuickInsertInformationAEP = OperationalAEP<
	ACTION.QUICK_INSERT_INFORMATION,
	ACTION_SUBJECT.QUICK_INSERT,
	undefined,
	QuickInsertInformationAttributes
>;

export type QuickInsertInformationEventPayload = QuickInsertInformationAEP;

export type QuickInsertSurface = 'typeahead' | 'toolbar' | 'element-browser';

export type QuickInsertSearchOutcomeAttributes = {
	category?: string;
	isEmpty: boolean;
	queryLength: number;
	resultCount: number;
	surface: QuickInsertSurface;
};

export type QuickInsertSearchOutcomeAEP = TrackAEP<
	ACTION.SEARCHED,
	ACTION_SUBJECT.QUICK_INSERT,
	undefined,
	QuickInsertSearchOutcomeAttributes,
	undefined
>;

export type QuickInsertSearchOutcomeEventPayload = QuickInsertSearchOutcomeAEP;

export type QuickInsertOpenedAttributes = {
	surface: QuickInsertSurface;
};

export type QuickInsertOpenedAEP = TrackAEP<
	ACTION.OPENED,
	ACTION_SUBJECT.QUICK_INSERT,
	undefined,
	QuickInsertOpenedAttributes,
	undefined
>;

export type QuickInsertItemSelectedAttributes = {
	/** Whether the item is in this editor's recommended set, wherever it was picked from. */
	isRecommendedItem: boolean;
	/**
	 * The element for native items (`table` for `quick-insert-table-menu-item` in `keys.ts`),
	 * `manifestKey:moduleKey` for extensions, the macro name for Confluence macros, `skill` for
	 * Skills, `ecosystem` for third-party (Forge and Connect) apps, and `unknown` otherwise.
	 */
	itemName: string;
	surface: QuickInsertSurface;
};

export type QuickInsertItemSelectedAEP = TrackAEP<
	ACTION.SELECTED,
	ACTION_SUBJECT.QUICK_INSERT,
	undefined,
	QuickInsertItemSelectedAttributes,
	undefined
>;

export type QuickInsertMenuEventPayload = QuickInsertOpenedAEP | QuickInsertItemSelectedAEP;
