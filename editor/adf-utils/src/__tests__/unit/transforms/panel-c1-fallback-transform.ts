import { createSchema } from '@atlaskit/adf-schema';
import { Node } from '@atlaskit/editor-prosemirror/model';
import { panelC1FallbackTransform } from '../../../transforms/panel-c1-fallback-transform';
import { transformContainerNodes } from '../../../transforms/depth-limited-nesting-container-nodes-transform';
import type { ADFEntity } from '../../../types';

const LEGACY_CONTENT_MACRO_EXTENSION_TYPE = 'com.atlassian.confluence.migration';
const LEGACY_CONTENT_MACRO_EXTENSION_KEY = 'legacy-content';
const PANEL_C1_FALLBACK_MARKER = '__platformEditorPanelC1Fallback';

const tableNode: ADFEntity = {
	type: 'table',
	attrs: { localId: 'table-1' },
	content: [
		{
			type: 'tableRow',
			content: [
				{
					type: 'tableCell',
					attrs: {},
					content: [{ type: 'paragraph', content: [{ type: 'text', text: 'cell' }] }],
				},
			],
		},
	],
};

const isLcmExtension = (node?: ADFEntity): boolean =>
	node?.type === 'extension' &&
	node?.attrs?.extensionType === LEGACY_CONTENT_MACRO_EXTENSION_TYPE &&
	node?.attrs?.extensionKey === LEGACY_CONTENT_MACRO_EXTENSION_KEY;

const getLcmWrappedNode = (node?: ADFEntity): ADFEntity | undefined =>
	node?.attrs?.parameters?.nestedContent?.content?.[0];

const panelC1WithTable: ADFEntity = {
	type: 'panel_c1',
	attrs: { panelType: 'info' },
	content: [
		{ type: 'paragraph', content: [{ type: 'text', text: 'before' }] },
		tableNode,
		{ type: 'paragraph', content: [{ type: 'text', text: 'after' }] },
	],
};

const panelC1WithoutTable: ADFEntity = {
	type: 'panel_c1',
	attrs: { panelType: 'info' },
	content: [{ type: 'paragraph', content: [{ type: 'text', text: 'just text' }] }],
};

const docWithPanelC1WithTable: ADFEntity = {
	type: 'doc',
	content: [panelC1WithTable],
};

const docWithPanelC1WithoutTable: ADFEntity = {
	type: 'doc',
	content: [panelC1WithoutTable],
};

// A plain panel containing a table wrapped in an LCM extension (the downgraded shape).
const docWithLcmWrappedTableInPanel: ADFEntity = {
	type: 'doc',
	content: [
		{
			type: 'panel',
			attrs: { panelType: 'info' },
			content: [
				{ type: 'paragraph', content: [{ type: 'text', text: 'before' }] },
				{
					type: 'extension',
					attrs: {
						extensionType: LEGACY_CONTENT_MACRO_EXTENSION_TYPE,
						extensionKey: LEGACY_CONTENT_MACRO_EXTENSION_KEY,
						layout: 'default',
						parameters: {
							nestedContent: { version: 1, type: 'doc', content: [tableNode] },
							adf: JSON.stringify({ version: 1, type: 'doc', content: [tableNode] }),
							[PANEL_C1_FALLBACK_MARKER]: true,
						},
					},
				},
				{ type: 'paragraph', content: [{ type: 'text', text: 'after' }] },
			],
		},
	],
};

// A plain panel containing a table wrapped in an unsupportedBlock (the safety-net shape).
const docWithUnsupportedBlockWrappedTableInPanel: ADFEntity = {
	type: 'doc',
	content: [
		{
			type: 'panel',
			attrs: { panelType: 'info' },
			content: [
				{ type: 'paragraph', content: [{ type: 'text', text: 'before' }] },
				{ type: 'unsupportedBlock', attrs: { originalValue: tableNode } },
				{ type: 'paragraph', content: [{ type: 'text', text: 'after' }] },
			],
		},
	],
};

const paragraphOnlyDoc: ADFEntity = {
	type: 'doc',
	content: [{ type: 'paragraph', content: [{ type: 'text', text: 'plain' }] }],
};

const docWithPanelWithParagraph: ADFEntity = {
	type: 'doc',
	content: [
		{
			type: 'panel',
			attrs: { panelType: 'info' },
			content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
		},
	],
};

// Helper to create schemas with different node configurations.
const createSchemaWithNodes = (
	options: {
		includeExtension?: boolean;
		includePanelC1?: boolean;
		includeTable?: boolean;
		includeUnsupportedBlock?: boolean;
	} = {},
) => {
	const {
		includePanelC1 = false,
		includeTable = false,
		includeExtension = false,
		includeUnsupportedBlock = false,
	} = options;

	const baseNodes = ['doc', 'paragraph', 'text', 'panel'];
	const nodes = [...baseNodes];

	if (includePanelC1) {
		nodes.push('panel_c1');
	}
	if (includeTable) {
		nodes.push('table', 'tableRow', 'tableCell', 'tableHeader');
	}
	if (includeExtension) {
		nodes.push('extension');
	}
	if (includeUnsupportedBlock) {
		nodes.push('unsupportedBlock');
	}

	return createSchema({ nodes });
};

describe('panelC1FallbackTransform', () => {
	describe('when no escape-hatch node type is available', () => {
		it('should return unchanged ADF with isTransformed false', () => {
			// Neither `extension` nor `unsupportedBlock` available.
			const schema = createSchemaWithNodes({ includeTable: true });

			const result = panelC1FallbackTransform(schema, docWithPanelC1WithTable);

			expect(result.isTransformed).toBe(false);
			expect(result.transformedAdf).toEqual(docWithPanelC1WithTable);
		});

		it('should still downgrade a tableless panel_c1 to a plain panel', () => {
			const schema = createSchemaWithNodes();

			const result = panelC1FallbackTransform(schema, docWithPanelC1WithoutTable);

			expect(result.isTransformed).toBe(true);
			expect((result.transformedAdf as ADFEntity).content?.[0]?.type).toBe('panel');
		});
	});

	describe('when panel_c1 is not supported by the schema', () => {
		it('should downgrade panel_c1 to a plain panel and wrap the table in an LCM extension', () => {
			const schema = createSchemaWithNodes({ includeExtension: true });

			const result = panelC1FallbackTransform(schema, docWithPanelC1WithTable);

			expect(result.isTransformed).toBe(true);
			const panel = (result.transformedAdf as ADFEntity).content?.[0];
			expect(panel?.type).toBe('panel');
			// Paragraphs preserved in place; only the table is wrapped.
			expect(panel?.content?.[0]?.type).toBe('paragraph');
			expect(isLcmExtension(panel?.content?.[1])).toBe(true);
			expect(getLcmWrappedNode(panel?.content?.[1])).toEqual(tableNode);
			expect(panel?.content?.[2]?.type).toBe('paragraph');
		});

		it('should store the wrapped table in both nestedContent and the stringified adf param', () => {
			const schema = createSchemaWithNodes({ includeExtension: true });

			const result = panelC1FallbackTransform(schema, docWithPanelC1WithTable);

			const lcm = (result.transformedAdf as ADFEntity).content?.[0]?.content?.[1];
			const params = lcm?.attrs?.parameters;
			expect(params?.nestedContent).toEqual({ version: 1, type: 'doc', content: [tableNode] });
			expect(JSON.parse(params?.adf)).toEqual({ version: 1, type: 'doc', content: [tableNode] });
			expect(params?.[PANEL_C1_FALLBACK_MARKER]).toBe(true);
		});

		it('should wrap the table in an LCM even when table exists in the schema', () => {
			const schema = createSchemaWithNodes({
				includeTable: true,
				includeExtension: true,
			});

			const result = panelC1FallbackTransform(schema, docWithPanelC1WithTable);

			expect(result.isTransformed).toBe(true);
			const panel = (result.transformedAdf as ADFEntity).content?.[0];
			expect(panel?.type).toBe('panel');
			expect(isLcmExtension(panel?.content?.[1])).toBe(true);
			expect(() => Node.fromJSON(schema, result.transformedAdf as ADFEntity)).not.toThrow();
		});

		it('should fall back to unsupportedBlock when extension is unavailable', () => {
			const schema = createSchemaWithNodes({ includeUnsupportedBlock: true });

			const result = panelC1FallbackTransform(schema, docWithPanelC1WithTable);

			expect(result.isTransformed).toBe(true);
			const panel = (result.transformedAdf as ADFEntity).content?.[0];
			expect(panel?.type).toBe('panel');
			expect(panel?.content?.[1]?.type).toBe('unsupportedBlock');
			expect(panel?.content?.[1]?.attrs?.originalValue).toEqual(tableNode);
			expect(() => Node.fromJSON(schema, result.transformedAdf as ADFEntity)).not.toThrow();
		});

		it('should downgrade a tableless panel_c1 to a plain panel with no wrapping', () => {
			const schema = createSchemaWithNodes({ includeExtension: true });

			const result = panelC1FallbackTransform(schema, docWithPanelC1WithoutTable);

			expect(result.isTransformed).toBe(true);
			const panel = (result.transformedAdf as ADFEntity).content?.[0];
			expect(panel?.type).toBe('panel');
			expect(panel?.content?.[0]?.type).toBe('paragraph');
			expect(panel?.content?.some((child) => isLcmExtension(child ?? undefined))).toBe(false);
		});
	});

	describe('when panel_c1 is supported by the schema', () => {
		it('should leave panel_c1 untouched', () => {
			const schema = createSchemaWithNodes({
				includePanelC1: true,
				includeTable: true,
				includeExtension: true,
			});

			const result = panelC1FallbackTransform(schema, docWithPanelC1WithTable);

			expect(result.isTransformed).toBe(false);
			expect((result.transformedAdf as ADFEntity).content?.[0]?.type).toBe('panel_c1');
		});

		it('should restore an LCM-wrapped table back into the panel (round-trip)', () => {
			const schema = createSchemaWithNodes({
				includePanelC1: true,
				includeTable: true,
				includeExtension: true,
			});

			const result = panelC1FallbackTransform(schema, docWithLcmWrappedTableInPanel);

			expect(result.isTransformed).toBe(true);
			const panel = (result.transformedAdf as ADFEntity).content?.[0];
			expect(panel?.content?.[1]?.type).toBe('table');
			expect(panel?.content?.[1]).toEqual(tableNode);
		});

		it('should restore an unsupportedBlock-wrapped table back into the panel (round-trip)', () => {
			const schema = createSchemaWithNodes({
				includePanelC1: true,
				includeTable: true,
				includeUnsupportedBlock: true,
			});

			const result = panelC1FallbackTransform(schema, docWithUnsupportedBlockWrappedTableInPanel);

			expect(result.isTransformed).toBe(true);
			const panel = (result.transformedAdf as ADFEntity).content?.[0];
			expect(panel?.content?.[1]?.type).toBe('table');
			expect(panel?.content?.[1]).toEqual(tableNode);
		});

		it('should NOT restore an LCM-wrapped table whose parent is not a panel', () => {
			const schema = createSchemaWithNodes({
				includePanelC1: true,
				includeTable: true,
				includeExtension: true,
			});
			// An LCM-wrapped table sitting directly in the doc (not inside a panel) was
			// wrapped for unrelated reasons and must be left untouched.
			const lcmNode = docWithLcmWrappedTableInPanel.content?.[0]?.content?.[1] as ADFEntity;
			const docWithLcmAtRoot: ADFEntity = {
				type: 'doc',
				content: [lcmNode],
			};

			const result = panelC1FallbackTransform(schema, docWithLcmAtRoot);

			expect(result.isTransformed).toBe(false);
			// The LCM is left untouched (still wrapping the table, not restored).
			expect(result.transformedAdf).toEqual(docWithLcmAtRoot);
			expect((result.transformedAdf as ADFEntity).content?.[0]?.type).toBe('extension');
		});

		it('should NOT restore an unsupportedBlock-wrapped table whose parent is not a panel', () => {
			const schema = createSchemaWithNodes({
				includePanelC1: true,
				includeTable: true,
				includeUnsupportedBlock: true,
			});
			// An unsupportedBlock-wrapped table sitting directly in the doc (not inside a
			// panel) was wrapped for unrelated reasons and must be left untouched.
			const docWithUnsupportedBlockAtRoot: ADFEntity = {
				type: 'doc',
				content: [{ type: 'unsupportedBlock', attrs: { originalValue: tableNode } }],
			};

			const result = panelC1FallbackTransform(schema, docWithUnsupportedBlockAtRoot);

			expect(result.isTransformed).toBe(false);
			// The unsupportedBlock is left untouched (still wrapping the table).
			expect(result.transformedAdf).toEqual(docWithUnsupportedBlockAtRoot);
			expect((result.transformedAdf as ADFEntity).content?.[0]?.type).toBe('unsupportedBlock');
		});
	});

	describe('idempotency and untouched documents', () => {
		it('should leave documents without panel_c1 unchanged', () => {
			const schema = createSchemaWithNodes({ includeExtension: true });

			const result = panelC1FallbackTransform(schema, paragraphOnlyDoc);

			expect(result.isTransformed).toBe(false);
		});

		it('should leave non-LCM extensions unchanged when panel_c1 is supported', () => {
			const schema = createSchemaWithNodes({
				includePanelC1: true,
				includeTable: true,
				includeExtension: true,
			});
			const docWithUnrelatedExtension: ADFEntity = {
				type: 'doc',
				content: [
					{
						type: 'panel',
						attrs: { panelType: 'info' },
						content: [
							{
								type: 'extension',
								attrs: {
									extensionType: 'com.atlassian.confluence.macro.core',
									extensionKey: 'some-other-macro',
									parameters: {},
								},
							},
						],
					},
				],
			};

			const result = panelC1FallbackTransform(schema, docWithUnrelatedExtension);

			expect(result.isTransformed).toBe(false);
			expect(result.transformedAdf).toBe(docWithUnrelatedExtension);
		});

		it('should leave unrelated unsupportedBlock nodes unchanged when panel_c1 is supported', () => {
			const schema = createSchemaWithNodes({
				includePanelC1: true,
				includeTable: true,
				includeUnsupportedBlock: true,
			});
			const docWithNonTableUnsupportedBlock: ADFEntity = {
				type: 'doc',
				content: [
					{
						type: 'panel',
						attrs: { panelType: 'info' },
						content: [
							{
								type: 'unsupportedBlock',
								attrs: { originalValue: { type: 'extension', attrs: { extensionKey: 'x' } } },
							},
						],
					},
				],
			};

			const result = panelC1FallbackTransform(schema, docWithNonTableUnsupportedBlock);

			expect(result.isTransformed).toBe(false);
			expect(result.transformedAdf).toBe(docWithNonTableUnsupportedBlock);
		});

		it('LCM downgrade output should round-trip back to the original when support returns', () => {
			const offSchema = createSchemaWithNodes({ includeExtension: true });
			const onSchema = createSchemaWithNodes({
				includePanelC1: true,
				includeTable: true,
				includeExtension: true,
			});

			const off = panelC1FallbackTransform(offSchema, docWithPanelC1WithTable);
			expect(off.isTransformed).toBe(true);

			// The wrapped doc is a plain panel; turning support back on restores the table
			// into that plain panel. Promotion back to panel_c1 happens later via the
			// shared container transform.
			const back = panelC1FallbackTransform(onSchema, off.transformedAdf as ADFEntity);
			const panel = (back.transformedAdf as ADFEntity).content?.[0];
			expect(panel?.type).toBe('panel');
			expect(panel?.content?.[1]).toEqual(tableNode);
		});
	});
});

describe('transformContainerNodes', () => {
	it('promotes panel nodes when the schema allows panel_c1', () => {
		const schema = createSchemaWithNodes({ includePanelC1: true, includeTable: true });

		const result = transformContainerNodes(docWithPanelWithParagraph, schema);

		expect(result.isTransformed).toBe(true);
		expect(result.transformedNodeTypes).toEqual(['panel_c1']);
		expect((result.transformedAdf as ADFEntity).content?.[0]?.type).toBe('panel_c1');
	});

	it('restores wrapped table content and re-promotes it through the shared transform', () => {
		const schema = createSchemaWithNodes({
			includeExtension: true,
			includePanelC1: true,
			includeTable: true,
		});

		const result = transformContainerNodes(docWithLcmWrappedTableInPanel, schema);
		const panel = (result.transformedAdf as ADFEntity).content?.[0];

		expect(result.isTransformed).toBe(true);
		expect(result.transformedNodeTypes).toEqual(['panel_c1']);
		expect(panel?.type).toBe('panel_c1');
		expect(panel?.content?.[1]).toEqual(tableNode);
	});

	it('downgrades unsupported panel_c1 content through the shared transform', () => {
		const schema = createSchemaWithNodes({ includeExtension: true });

		const result = transformContainerNodes(docWithPanelC1WithTable, schema);
		const panel = (result.transformedAdf as ADFEntity).content?.[0];

		expect(result.isTransformed).toBe(true);
		expect(result.transformedNodeTypes).toEqual(['panel_c1']);
		expect(panel?.type).toBe('panel');
		expect(isLcmExtension(panel ?? undefined)).toBe(false);
		expect(isLcmExtension(panel?.content?.[1])).toBe(true);
	});

	it('leaves unrelated documents unchanged when no fallback or promotion is needed', () => {
		const schema = createSchemaWithNodes({
			includeExtension: true,
			includePanelC1: true,
			includeTable: true,
		});

		const result = transformContainerNodes(paragraphOnlyDoc, schema);

		expect(result.isTransformed).toBe(false);
		expect(result.transformedNodeTypes).toEqual([]);
		expect(result.transformedAdf).toEqual(paragraphOnlyDoc);
	});
});
