/** @jest-environment node */

import { rule } from '../rules/apply-engine-vocabulary-conflicts';
/* eslint-disable */
import { tsRuleTester } from './utils/_tester';

const filename = 'vocabulary.ts';
const header = "import type { VocabularyPart } from './types';\n";

describe('apply-engine-vocabulary-conflicts', () => {
	tsRuleTester.run('apply-engine-vocabulary-conflicts', rule, {
		valid: [
			{
				filename,
				code: `${header}
export const DOC: VocabularyPart = { transportWrappers: ['doc'] };
export const TABLES: VocabularyPart = {
	transportWrappers: ['table', 'tableRow'],
	containerFor: { tableRow: ['table'], tableCell: ['tableRow', 'table'] },
};
export const LISTS: VocabularyPart = {
	containerFor: { listItem: ['bulletList'] },
	itemFor: { bulletList: 'listItem', 'orderedList': 'listItem' },
	variants: [['panel', 'panel_c1']],
	refusalHints: (c) => null,
};`,
			},
			{
				// The same fact twice is not a conflict.
				filename,
				code: `${header}
export const A: VocabularyPart = { containerFor: { tableCell: ['tableRow', 'table'] }, variants: [['expand', 'nestedExpand']] };
export const B: VocabularyPart = { containerFor: { tableCell: ['tableRow', 'table'] }, variants: [['expand', 'nestedExpand']] };`,
			},
			{
				filename,
				code: `${header}
export const A = { itemFor: { taskList: 'taskItem' } } satisfies VocabularyPart;`,
			},
			{
				// Objects that aren't vocabulary parts are not checked.
				filename,
				code: `const other = { containerFor: { tableCell: ['table'] } };
const another = { containerFor: { tableCell: ['tableRow'] } };`,
			},
		],
		invalid: [
			{
				filename,
				code: `${header}
export const TABLES: VocabularyPart = { containerFor: { tableCell: ['tableRow', 'table'] } };
export const OTHER: VocabularyPart = { containerFor: { tableCell: ['table'] } };`,
				errors: [{ messageId: 'conflict' }],
			},
			{
				filename,
				code: `${header}
export const LISTS: VocabularyPart = { itemFor: { bulletList: 'listItem' } };
export const TASKS: VocabularyPart = { itemFor: { bulletList: 'taskItem' } };`,
				errors: [{ messageId: 'conflict' }],
			},
			{
				filename,
				code: `${header}
export const PANELS: VocabularyPart = { variants: [['panel', 'panel_c1']] };
export const OTHER: VocabularyPart = { variants: [['panel', 'expand']] };`,
				errors: [{ messageId: 'variantConflict' }],
			},
			{
				filename,
				code: `${header}
const CHAIN = ['tableRow', 'table'];
export const TABLES: VocabularyPart = { containerFor: { tableCell: CHAIN } };`,
				errors: [{ messageId: 'notLiteral' }],
			},
			{
				filename,
				code: `${header}
const BASE = { tableRow: ['table'] };
export const TABLES: VocabularyPart = { containerFor: { ...BASE } };`,
				errors: [{ messageId: 'notLiteral' }],
			},
			{
				filename,
				code: `${header}
const WRAPPERS = ['table'];
export const TABLES: VocabularyPart = { transportWrappers: WRAPPERS };`,
				errors: [{ messageId: 'notLiteral' }],
			},
		],
	});
});
