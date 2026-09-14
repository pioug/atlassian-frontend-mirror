import { stage0ValidJsonSchema } from '@atlassian/adf-schema-json';

import type { ADFEntity } from '../../../types';
import { createSpec, validator } from '../../validator';

// A stored table-in-panel document is a plain ADF `panel` containing a `table` (panel_c1 is a
// ProseMirror-only variant that collapses to `panel` on save). Take the fixture panel and its table.
const panelWithTable = (
	stage0ValidJsonSchema.find((f) => f.name === 'panel-with-nested-table.json') as
		| { data: { content: ADFEntity[] } }
		| undefined
)?.data.content[0] as ADFEntity;

const table = (panelWithTable?.content ?? []).find((child) => child?.type === 'table') as ADFEntity;

// A panel holding a paragraph AND a table. The paragraph is a variant-named child that resolves only
// via the variant content-resolution, so it exercises more than the table-only path.
const panelWithParagraphAndTable: ADFEntity = {
	type: 'panel',
	attrs: { panelType: 'info' },
	content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hi' }] }, table],
};

const docWith = (node: ADFEntity): ADFEntity => ({ type: 'doc', version: 1, content: [node] });

// A bare panel (no doc wrapper) exercises the root-entity path through `extractAllowedContent`.
const panelWithParagraph: ADFEntity = {
	type: 'panel',
	attrs: { panelType: 'info' },
	content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hi' }] }],
};

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes = (entity: any, acc: string[] = []): string[] => {
	if (!entity || typeof entity !== 'object') {
		return acc;
	}
	if (entity.type) {
		acc.push(entity.type);
	}
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(entity.content || []).forEach((child: any) => nodeTypes(child, acc));
	return acc;
};

// The editor's repairing callback (editorCallbackFor): wrap invalid content as `unsupportedBlock`.
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapInvalid = (entity: any) => ({
	type: 'unsupportedBlock',
	attrs: { originalValue: entity },
});

// `panel_c1` and `panel_c1_root_only` are `stage0: true`, so table-in-panel is accepted for a caller
// validating against stage-0 and declined for one validating against full ADF. `validateADFEntity`
// passes `{ stage0: true }` for any caller that does not declare `final`, which covers every editor
// and renderer, so the stage-0 caller below is the production path.
describe('validator: table-in-panel (panel_c1), stage-0 caller — positional rejection', () => {
	let validate: ReturnType<typeof validator>;
	beforeEach(() => {
		validate = validator(undefined, undefined, { stage0: true });
	});

	// panel_c1 is wired into `doc`, `bodiedSyncBlock` and `layoutColumn` content only, so a table in a
	// panel is rejected at every other position.
	//
	// Acceptance at the allowed positions is covered declaratively by the stage-0 valid fixtures
	// (panel-with-nested-table, panel-with-paragraph-and-nested-table,
	// bodiedSyncBlock-with-panel-nested-table).
	it('rejects a table inside a panel nested in a table cell', () => {
		const doc = docWith({
			type: 'table',
			content: [
				{
					type: 'tableRow',
					content: [{ type: 'tableCell', attrs: {}, content: [panelWithTable] }],
				},
			],
		});
		expect(() => validate(doc)).toThrow('table: invalid content');
	});

	it('rejects a table inside a panel nested in an expand', () => {
		const doc = docWith({ type: 'expand', attrs: { title: '' }, content: [panelWithTable] });
		expect(() => validate(doc)).toThrow('table: invalid content');
	});

	it('rejects a table inside a panel nested in a bodiedExtension', () => {
		const doc = docWith({
			type: 'bodiedExtension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'expand',
				layout: 'default',
			},
			content: [panelWithTable],
		});
		expect(() => validate(doc)).toThrow('table: invalid content');
	});
});

describe('validator: table-in-panel (panel_c1), stage-0 caller — editor repair path preserves content', () => {
	// validateADFEntity builds the validator from the full node list and passes a repairing callback;
	// valid content must be preserved, not wrapped as `unsupportedBlock`.
	let validate: ReturnType<typeof validator>;
	beforeEach(() => {
		validate = validator(Object.keys(createSpec()), undefined, { stage0: true });
	});

	it('preserves a paragraph + table in a panel at the document root', () => {
		const { entity } = validate(docWith(panelWithParagraphAndTable), wrapInvalid);
		const types = nodeTypes(entity);
		expect(types).toContain('paragraph');
		expect(types).toContain('table');
		expect(types).not.toContain('unsupportedBlock');
	});

	// panel_c1's content lists many variant-named children (paragraph_with_no_marks, ...); mix
	// several with a table and confirm none are wrapped.
	it('preserves a panel’s variant-named children alongside a table', () => {
		const panel: ADFEntity = {
			type: 'panel',
			attrs: { panelType: 'info' },
			content: [
				{ type: 'paragraph', content: [{ type: 'text', text: 'hi' }] },
				{ type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'head' }] },
				{
					type: 'bulletList',
					content: [
						{
							type: 'listItem',
							content: [{ type: 'paragraph', content: [{ type: 'text', text: 'item' }] }],
						},
					],
				},
				{ type: 'codeBlock', content: [{ type: 'text', text: 'code' }] },
				table,
			],
		};
		const { entity } = validate(docWith(panel), wrapInvalid);
		const types = nodeTypes(entity);
		expect(types).toEqual(
			expect.arrayContaining(['paragraph', 'heading', 'bulletList', 'codeBlock', 'table']),
		);
		expect(types).not.toContain('unsupportedBlock');
	});

	it('preserves a table-in-panel inside a layout column', () => {
		const doc = docWith({
			type: 'layoutSection',
			content: [
				{ type: 'layoutColumn', attrs: { width: 50 }, content: [panelWithTable] },
				{ type: 'layoutColumn', attrs: { width: 50 }, content: [panelWithParagraph] },
			],
		});
		const { entity } = validate(doc, wrapInvalid);
		const types = nodeTypes(entity);
		expect(types).toContain('layoutSection');
		expect(types).toContain('table');
		expect(types).not.toContain('unsupportedBlock');
	});

	it('wraps a table-in-panel where panel_c1 is not allowed (table cell)', () => {
		const doc = docWith({
			type: 'table',
			content: [
				{
					type: 'tableRow',
					content: [{ type: 'tableCell', attrs: {}, content: [panelWithTable] }],
				},
			],
		});
		const { entity } = validate(doc, wrapInvalid);
		expect(nodeTypes(entity)).toContain('unsupportedBlock');
	});
});

// A caller validating against full ADF declines the stage-0 variants, so table-in-panel is rejected
// at every position, which is what `full/invalid/panel-with-nested-table.json` asserts.
describe('validator: table-in-panel (panel_c1), full-ADF caller — table rejected', () => {
	let validate: ReturnType<typeof validator>;
	beforeEach(() => {
		validate = validator();
	});

	it('throws on a paragraph + table in a panel at the document root', () => {
		expect(() => validate(docWith(panelWithParagraphAndTable))).toThrow('table: invalid content');
	});

	it('wraps the table on the editor repair path', () => {
		const { entity } = validate(docWith(panelWithParagraphAndTable), wrapInvalid);
		const types = nodeTypes(entity);
		expect(types).toContain('paragraph');
		expect(types).toContain('unsupportedBlock');
	});

	it('preserves a paragraph in a bare panel validated as the root entity', () => {
		const { entity } = validate(panelWithParagraph, wrapInvalid);
		expect(nodeTypes(entity)).not.toContain('unsupportedBlock');
		expect(nodeTypes(entity)).toContain('paragraph');
	});

	it('rejects a table in a bare panel validated as the root entity', () => {
		const { entity } = validate(panelWithTable, wrapInvalid);
		expect(nodeTypes(entity)).toContain('unsupportedBlock');
	});
});
