import { createTransformer } from '@atlaskit/codemod-utils';
import { createMigratesFromEntryPointChangeRequests } from './helpers/entry-points';
import type { EntryPointChangeRequest } from './types/entry-points';

const DEFAULT_ADF_UTILS_IMPORT = '@atlaskit/adf-utils';

const types: EntryPointChangeRequest = {
	importSpecifiers: ['ADFEntity', 'ADFEntityMark', 'Visitor', 'VisitorCollection'],
	oldEntryPointsToRemove: [DEFAULT_ADF_UTILS_IMPORT],
	newEntryPoint: `${DEFAULT_ADF_UTILS_IMPORT}/types`,
	shouldBeTypeImport: true,
};

const validatorTypes: EntryPointChangeRequest = {
	importSpecifiers: [
		'Content',
		'ErrorCallback',
		'Output',
		'ValidationError',
		'ValidationErrorMap',
		'ValidationErrorType',
		'ValidationMode',
		'ValidationOptions',
		'ErrorCallbackOptions',
		'Validate',
		'NodeValidationResult',
		'ValidatorSpec',
		'AttributesSpec',
		'ValidatorContent',
		'MarkValidationResult',
		'SpecValidatorResult',
		'Err',
	],
	oldEntryPointsToRemove: [DEFAULT_ADF_UTILS_IMPORT, `${DEFAULT_ADF_UTILS_IMPORT}/validator`],
	newEntryPoint: `${DEFAULT_ADF_UTILS_IMPORT}/validatorTypes`,
	shouldBeTypeImport: true,
};

const transforms: EntryPointChangeRequest = {
	importSpecifiers: [
		'transformMediaLinkMarks',
		'transformTextLinkCodeMarks',
		'transformDedupeMarks',
		'transformNodesMissingContent',
		'transformIndentationMarks',
	],
	oldEntryPointsToRemove: [DEFAULT_ADF_UTILS_IMPORT],
	newEntryPoint: `${DEFAULT_ADF_UTILS_IMPORT}/transforms`,
	shouldBeTypeImport: false,
};

const traverse: EntryPointChangeRequest = {
	importSpecifiers: ['traverse', 'map', 'reduce', 'filter'],
	oldEntryPointsToRemove: [DEFAULT_ADF_UTILS_IMPORT],
	newEntryPoint: `${DEFAULT_ADF_UTILS_IMPORT}/traverse`,
	shouldBeTypeImport: false,
};

const builders: EntryPointChangeRequest = {
	importSpecifiers: [
		'a',
		'alignment',
		'b',
		'blockCard',
		'blockQuote',
		'bodiedExtension',
		'br',
		'breakout',
		'bulletList',
		'code',
		'codeBlock',
		'date',
		'decisionItem',
		'decisionList',
		'doc',
		'em',
		'embedCard',
		'emoji',
		'expand',
		'extension',
		'hardBreak',
		'heading',
		'hr',
		'indentation',
		'inlineCard',
		'inlineExtension',
		'layoutColumn',
		'layoutSection',
		'li',
		'link',
		'listItem',
		'media',
		'mediaGroup',
		'mediaSingle',
		'mention',
		'nestedExpand',
		'ol',
		'orderedList',
		'p',
		'panel',
		'paragraph',
		'placeholder',
		'rule',
		'status',
		'strike',
		'strong',
		'subsup',
		'table',
		'tableCell',
		'tableHeader',
		'tableRow',
		'taskItem',
		'taskList',
		'td',
		'text',
		'textColor',
		'th',
		'tr',
		'u',
		'ul',
		'underline',
		'dataConsumer',
	],
	oldEntryPointsToRemove: [DEFAULT_ADF_UTILS_IMPORT],
	newEntryPoint: `${DEFAULT_ADF_UTILS_IMPORT}/builders`,
	shouldBeTypeImport: false,
};

const emptyAdf: EntryPointChangeRequest = {
	importSpecifiers: ['getEmptyADF'],
	oldEntryPointsToRemove: [DEFAULT_ADF_UTILS_IMPORT],
	newEntryPoint: `${DEFAULT_ADF_UTILS_IMPORT}/empty-adf`,
	shouldBeTypeImport: false,
};

const validator: EntryPointChangeRequest = {
	importSpecifiers: ['validator', 'validateAttrs'],
	oldEntryPointsToRemove: [DEFAULT_ADF_UTILS_IMPORT],
	newEntryPoint: `${DEFAULT_ADF_UTILS_IMPORT}/validator`,
	shouldBeTypeImport: false,
};

const scrub: EntryPointChangeRequest = {
	importSpecifiers: ['scrubAdf'],
	oldEntryPointsToRemove: [DEFAULT_ADF_UTILS_IMPORT],
	newEntryPoint: `${DEFAULT_ADF_UTILS_IMPORT}/scrub`,
	shouldBeTypeImport: false,
};

const entryPointChangeRequests: EntryPointChangeRequest[] = [
	transforms,
	validatorTypes,
	types,
	traverse,
	builders,
	validator,
	emptyAdf,
	scrub,
];

export const entryPointChangeMigrates =
	createMigratesFromEntryPointChangeRequests(entryPointChangeRequests);

const transformer = createTransformer(entryPointChangeMigrates);

export default transformer;
