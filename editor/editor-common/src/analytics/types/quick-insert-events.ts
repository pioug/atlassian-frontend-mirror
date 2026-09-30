import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP } from './utils';

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
