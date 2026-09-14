import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

import {
	getBlockSearchText,
	getTableStandInParts,
	holdsRevealableContent,
} from '../../../../ui/utils/expand-search-text';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expandNode = (content: any[]) =>
	defaultSchema.nodeFromJSON({
		type: 'expand',
		attrs: { title: 'Outer' },
		content,
	});

const paragraph = (text: string) => ({
	type: 'paragraph',
	content: [{ type: 'text', text }],
});

/** The placeholder Confluence substitutes when authored nesting exceeds what the schema allows. */
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const migrationExtension = (nestedContent: any) => ({
	type: 'extension',
	attrs: {
		extensionType: 'com.atlassian.confluence.migration',
		extensionKey: 'unsupported-content',
		text: 'Unsupported content',
		parameters: { nestedContent },
	},
});

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adfDoc = (content: any[]) => ({ type: 'doc', version: 1, content });

/**
 * The placeholder Confluence actually stores when it coerces nesting the schema cannot represent.
 * `attrs.text` is empty and the storage-format markup is kept alongside the ADF in
 * `parameters.cxhtml` — both as captured from a real page.
 */
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyContentExtension = (cxhtml: string, nestedContent: any) => ({
	type: 'extension',
	attrs: {
		extensionType: 'com.atlassian.confluence.migration',
		extensionKey: 'legacy-content',
		text: '',
		parameters: { cxhtml, nestedContent },
	},
});

/** A single-cell table, the shape the nested-expand test pages use at every level. */
const table1x1 = (text: string) => ({
	type: 'table',
	attrs: { isNumberColumnEnabled: false, layout: 'default' },
	content: [
		{
			type: 'tableRow',
			content: [{ type: 'tableCell', attrs: {}, content: [paragraph(text)] }],
		},
	],
});

describe('getBlockSearchText', () => {
	it('returns the text of the body', () => {
		expect(getBlockSearchText(expandNode([paragraph('Hello world')]))).toBe('Hello world');
	});

	it('separates adjacent blocks so phrases cannot fuse across boundaries', () => {
		const text = getBlockSearchText(expandNode([paragraph('first'), paragraph('second')]));

		expect(text).toBe('first second');
		expect(text).not.toContain('firstsecond');
	});

	it('reaches text at any nesting depth', () => {
		const text = getBlockSearchText(
			expandNode([
				{
					type: 'table',
					attrs: { isNumberColumnEnabled: false, layout: 'default' },
					content: [
						{
							type: 'tableRow',
							content: [
								{
									type: 'tableCell',
									attrs: {},
									content: [
										{
											type: 'bulletList',
											content: [{ type: 'listItem', content: [paragraph('deeply nested item')] }],
										},
									],
								},
							],
						},
					],
				},
			]),
		);

		expect(text).toContain('deeply nested item');
	});

	describe('leaf nodes', () => {
		it('recovers text carried in leaf attrs', () => {
			const text = getBlockSearchText(
				expandNode([
					{
						type: 'paragraph',
						content: [
							{ type: 'text', text: 'by ' },
							{
								type: 'mention',
								attrs: { id: '123', text: '@Priya Raman', accessLevel: '' },
							},
							{ type: 'text', text: ' status ' },
							{ type: 'status', attrs: { text: 'DONE', color: 'green', localId: 'a' } },
						],
					},
				]),
			);

			// textContent drops these entirely: no ADF node declares a `leafText` spec.
			expect(text).toContain('@Priya Raman');
			expect(text).toContain('DONE');
		});

		it('recovers emoji text', () => {
			const text = getBlockSearchText(
				expandNode([
					{
						type: 'paragraph',
						content: [
							{ type: 'text', text: 'shipped ' },
							{ type: 'emoji', attrs: { shortName: ':rocket:', id: '1f680', text: '🚀' } },
						],
					},
				]),
			);

			expect(text).toContain('🚀');
		});

		it('contributes nothing for leaves that carry no text attr', () => {
			const text = getBlockSearchText(
				expandNode([paragraph('before'), { type: 'rule' }, paragraph('after')]),
			);

			// A rule has no textual content to recover; it must not inject a stray separator run.
			expect(text).toBe('before after');
		});
	});

	describe('coerced extensions (parameters.nestedContent)', () => {
		it('reaches ADF stashed in a migration extension', () => {
			const text = getBlockSearchText(
				expandNode([
					paragraph('Level 3 is nested below, still collapsed'),
					migrationExtension(adfDoc([paragraph('stashed level 3 body')])),
				]),
			);

			expect(text).toContain('Level 3 is nested below, still collapsed');
			expect(text).toContain('stashed level 3 body');
		});

		it('recurses through repeatedly coerced levels', () => {
			const deepest = adfDoc([paragraph('deepest level text')]);
			const middle = adfDoc([paragraph('middle level text'), migrationExtension(deepest)]);
			const text = getBlockSearchText(
				expandNode([
					paragraph('outer body'),
					migrationExtension(
						adfDoc([paragraph('first stashed level'), migrationExtension(middle)]),
					),
				]),
			);

			expect(text).toContain('outer body');
			expect(text).toContain('first stashed level');
			expect(text).toContain('middle level text');
			expect(text).toContain('deepest level text');
		});

		// Shape captured from pug staging page 456532295882 — five expand levels authored one inside
		// the next with a 1x1 table at each. Confluence stores it as: level 2 demoted to
		// `nestedExpand`; the level 2 table coerced to a `legacy-content` extension because
		// `nestedExpand` cannot hold a table; and levels 3-5 coerced wholesale into a second
		// extension, whose `nestedContent` holds real `expand`/`nestedExpand` nodes again — raw ADF
		// is never schema-checked, so the nesting resumes inside it. The text has to cross that
		// boundary or find-in-page misses four of the five levels.
		it('reaches the deepest level of a five-level authored nesting', () => {
			const level5 = {
				type: 'expand',
				attrs: { title: 'Level 5 of 5' },
				content: [table1x1('L5.T1'), paragraph('Deepest level reached.')],
			};
			const level4 = {
				type: 'nestedExpand',
				attrs: { title: 'Level 4 of 5' },
				content: [table1x1('L4.T1'), level5],
			};
			const level3 = {
				type: 'expand',
				attrs: { title: 'Level 3 of 5' },
				content: [table1x1('L3.T1'), level4],
			};

			const text = getBlockSearchText(
				expandNode([
					table1x1('L1.T1'),
					{
						type: 'nestedExpand',
						attrs: { title: 'Level 2 of 5' },
						content: [
							legacyContentExtension(
								'<table><tbody>…L2.T1…</tbody></table>',
								adfDoc([table1x1('L2.T1')]),
							),
							legacyContentExtension(
								'<ac:structured-macro ac:name="expand">…levels 3-5…</ac:structured-macro>',
								adfDoc([level3]),
							),
						],
					},
				]),
			);

			expect(text).toContain('Deepest level reached.');
			for (const level of [1, 2, 3, 4, 5]) {
				expect(text).toContain(`L${level}.T1`);
			}
			// `parameters.cxhtml` carries the same content as storage-format markup. Reading it too
			// would duplicate every level and leak tag names into the text.
			expect(text).not.toContain('structured-macro');
			expect(text).not.toContain('tbody');
		});

		it('prefers the stashed subtree over the placeholder label', () => {
			const text = getBlockSearchText(
				expandNode([migrationExtension(adfDoc([paragraph('real content')]))]),
			);

			expect(text).toContain('real content');
			expect(text).not.toContain('Unsupported content');
		});

		it('recovers leaf attr text from inside the stashed subtree', () => {
			const text = getBlockSearchText(
				expandNode([
					migrationExtension(
						adfDoc([
							{
								type: 'paragraph',
								content: [
									{ type: 'text', text: 'assigned to ' },
									{ type: 'mention', attrs: { id: '9', text: '@Sam Okafor', accessLevel: '' } },
								],
							},
						]),
					),
				]),
			);

			expect(text).toContain('assigned to');
			expect(text).toContain('@Sam Okafor');
		});

		it('does not throw on stashed ADF with no content', () => {
			expect(() =>
				getBlockSearchText(expandNode([migrationExtension({ type: 'doc', version: 1 })])),
			).not.toThrow();
		});

		it('falls back to the extension label when there is no stashed ADF', () => {
			const text = getBlockSearchText(
				expandNode([
					{
						type: 'extension',
						attrs: {
							extensionType: 'com.atlassian.confluence.macro.core',
							extensionKey: 'jira-issues',
							text: 'Jira issues fallback text',
							parameters: {},
						},
					},
				]),
			);

			expect(text).toContain('Jira issues fallback text');
		});
	});

	describe('inline comments', () => {
		it('withholds the text so the block stays rendered for comment navigation', () => {
			const node = expandNode([
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'commented',
							marks: [
								{
									type: 'annotation',
									attrs: { id: 'annotation-1', annotationType: 'inlineComment' },
								},
							],
						},
					],
				},
			]);

			expect(getBlockSearchText(node)).toBeUndefined();
		});

		it('detects a comment nested deep in the body, not just at the top level', () => {
			const node = expandNode([
				{
					type: 'table',
					attrs: { isNumberColumnEnabled: false, layout: 'default' },
					content: [
						{
							type: 'tableRow',
							content: [
								{
									type: 'tableCell',
									attrs: {},
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'buried comment',
													marks: [
														{
															type: 'annotation',
															attrs: { id: 'annotation-3', annotationType: 'inlineComment' },
														},
													],
												},
											],
										},
									],
								},
							],
						},
					],
				},
			]);

			expect(getBlockSearchText(node)).toBeUndefined();
		});

		it('does not see comments inside a coerced extension, which owns its own renderer', () => {
			const node = expandNode([
				paragraph('outer body'),
				migrationExtension(
					adfDoc([
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'stashed commented text',
									marks: [
										{
											type: 'annotation',
											attrs: { id: 'annotation-4', annotationType: 'inlineComment' },
										},
									],
								},
							],
						},
					]),
				),
			]);

			// Known and accepted: `parameters.nestedContent` is rendered by a nested renderer, whose
			// own expands make this same decision for themselves. Marks in raw ADF are not visible to
			// findChildrenByMark, so this expand still gets text.
			expect(getBlockSearchText(node)).toContain('stashed commented text');
		});

		it('still returns text for other annotation types', () => {
			const node = expandNode([
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'highlighted',
							marks: [
								{
									type: 'annotation',
									attrs: { id: 'annotation-2', annotationType: 'someOtherType' },
								},
							],
						},
					],
				},
			]);

			expect(getBlockSearchText(node)).toContain('highlighted');
		});
	});

	describe('caching', () => {
		it('caches per node so repeated calls do not re-walk the subtree', () => {
			const node = expandNode([paragraph('cached body')]);
			const textBetweenSpy = jest.spyOn(node, 'textBetween');

			const first = getBlockSearchText(node);
			const second = getBlockSearchText(node);

			expect(first).toBe(second);
			expect(textBetweenSpy).toHaveBeenCalledTimes(1);

			textBetweenSpy.mockRestore();
		});

		it('caches the withheld result too, rather than re-scanning for annotations', () => {
			const node = expandNode([
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'commented',
							marks: [
								{
									type: 'annotation',
									attrs: { id: 'annotation-5', annotationType: 'inlineComment' },
								},
							],
						},
					],
				},
			]);
			const textBetweenSpy = jest.spyOn(node, 'textBetween');

			expect(getBlockSearchText(node)).toBeUndefined();
			expect(getBlockSearchText(node)).toBeUndefined();

			// `null` is cached, so the second call must not fall through to a fresh walk.
			expect(textBetweenSpy).not.toHaveBeenCalled();

			textBetweenSpy.mockRestore();
		});

		it('keys on the node, so a structurally identical node is computed separately', () => {
			const first = expandNode([paragraph('same text')]);
			const second = expandNode([paragraph('same text')]);
			const secondSpy = jest.spyOn(second, 'textBetween');

			getBlockSearchText(first);
			getBlockSearchText(second);

			expect(secondSpy).toHaveBeenCalledTimes(1);

			secondSpy.mockRestore();
		});
	});
});

const nestedExpandJson = (title: string) => ({
	type: 'nestedExpand',
	attrs: { title },
	content: [paragraph('nested body')],
});

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tableOfRows = (rows: any[][]) => ({
	type: 'table',
	attrs: { isNumberColumnEnabled: false, layout: 'default' },
	content: rows.map((cells) => ({
		type: 'tableRow',
		content: cells.map((content) => ({ type: 'tableCell', attrs: {}, content: [content] })),
	})),
});

// A table stands in for its own rows, keeping only the rows that hold an expand. Standing in for the
// whole table would take that expand with it, and it needs a real element for find to reveal.
describe('getTableStandInParts', () => {
	it('joins the text of a table with nothing to keep into one run', () => {
		const table = defaultSchema.nodeFromJSON(
			tableOfRows([[paragraph('first row')], [paragraph('second row')]]),
		);

		expect(getTableStandInParts(table)).toEqual(['first row second row']);
	});

	it('keeps the row that holds a nested expand, and the text either side of it', () => {
		const table = defaultSchema.nodeFromJSON(
			tableOfRows([
				[paragraph('before')],
				[nestedExpandJson('In a cell')],
				[paragraph('after')],
				[paragraph('last')],
			]),
		);

		// The kept row is named by index, so the table can hand back the row the serializer built.
		expect(getTableStandInParts(table)).toEqual(['before', 1, 'after last']);
	});

	// The row puts its own text in the DOM, so repeating it in the run would match twice and the
	// second match would open the wrong expand.
	it('leaves the text of a kept row out of the runs around it', () => {
		const table = defaultSchema.nodeFromJSON(
			tableOfRows([[paragraph('before')], [nestedExpandJson('In a cell')], [paragraph('after')]]),
		);

		expect(getTableStandInParts(table)).not.toContain('nested body');
	});

	it('keeps a row holding an extension with stashed ADF', () => {
		const table = defaultSchema.nodeFromJSON(
			tableOfRows([
				[paragraph('before')],
				[legacyContentExtension('<p/>', adfDoc([paragraph('stashed')]))],
			]),
		);

		expect(getTableStandInParts(table)).toEqual(['before', 1]);
	});

	// Comment navigation scrolls to the commented text, so that text has to stay a real element.
	it('keeps a row holding an inline comment', () => {
		const table = defaultSchema.nodeFromJSON(
			tableOfRows([
				[paragraph('before')],
				[
					{
						type: 'paragraph',
						content: [
							{
								type: 'text',
								text: 'commented',
								marks: [
									{
										type: 'annotation',
										attrs: { id: 'annotation-7', annotationType: 'inlineComment' },
									},
								],
							},
						],
					},
				],
			]),
		);

		expect(getTableStandInParts(table)).toEqual(['before', 1]);
	});

	it('caches per table so repeated renders do not re-walk the rows', () => {
		const table = defaultSchema.nodeFromJSON(tableOfRows([[paragraph('only row')]]));

		expect(getTableStandInParts(table)).toBe(getTableStandInParts(table));
	});
});

// A block that holds an expand has to be rendered even while collapsed, because that expand needs a
// real element of its own for browser find to reveal. Everything else can show its text.
describe('holdsRevealableContent', () => {
	const nestedExpand = nestedExpandJson;

	it('is false for ordinary content, however deeply nested', () => {
		expect(holdsRevealableContent(defaultSchema.nodeFromJSON(paragraph('plain')))).toBe(false);
		expect(holdsRevealableContent(defaultSchema.nodeFromJSON(table1x1('in a table')))).toBe(false);
	});

	it('is true for an expand itself', () => {
		expect(holdsRevealableContent(defaultSchema.nodeFromJSON(nestedExpand('Nested')))).toBe(true);
	});

	it('is true for a block holding an expand, so the block keeps rendering', () => {
		const tableWithExpand = defaultSchema.nodeFromJSON({
			type: 'table',
			attrs: { isNumberColumnEnabled: false, layout: 'default' },
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {},
							content: [paragraph('in the cell'), nestedExpand('In a cell')],
						},
					],
				},
			],
		});

		// Costs the saving for this table, and buys the reader one search instead of two.
		expect(holdsRevealableContent(tableWithExpand)).toBe(true);
	});

	it('is true for an extension holding stashed ADF a nested renderer mounts expands from', () => {
		const extension = defaultSchema.nodeFromJSON(
			legacyContentExtension('<p/>', adfDoc([paragraph('stashed')])),
		);

		expect(holdsRevealableContent(extension)).toBe(true);
	});

	it('is false for an extension with no stashed ADF', () => {
		const extension = defaultSchema.nodeFromJSON({
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'jira-issues',
				text: 'Jira issues',
				parameters: {},
			},
		});

		expect(holdsRevealableContent(extension)).toBe(false);
	});
});
