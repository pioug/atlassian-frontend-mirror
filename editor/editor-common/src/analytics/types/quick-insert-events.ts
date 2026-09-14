import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP } from './utils';

export type CategoryInformation = {
	internalMacroCount: number;
	internalAppCount: number;
	internalAppMacroMax: number;
	ecosystemMacroCount: number;
	ecosystemAppCount: number;
	ecosystemAppMacroMax: number;
	allMacroCount: number;
	allAppCount: number;
	allAppMacroMax: number;
};

export type CategoryKey =
	| 'blockTemplates'
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
	category: Record<CategoryKey, CategoryInformation>;
	legacyCategory: Record<LegacyCategoryKey, CategoryInformation>;
	allCategories: CategoryInformation;
};

export type QuickInsertInformationAEP = OperationalAEP<
	ACTION.QUICK_INSERT_INFORMATION,
	ACTION_SUBJECT.QUICK_INSERT,
	undefined,
	QuickInsertInformationAttributes
>;

export type QuickInsertInformationEventPayload = QuickInsertInformationAEP;
