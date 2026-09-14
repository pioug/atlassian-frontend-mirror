import { initialize } from '@af/adf-test-helpers/src/ajv';
import betterAjvErrors from 'better-ajv-errors';

import v1SchemaFull from '../../../../json-schema/v1/full.json';
import v1SchemaStage0 from '../../../../json-schema/v1/stage-0.json';

import {
	fullValidJsonSchema,
	fullInvalidJsonSchema,
	stage0ValidJsonSchema,
	stage0InvalidJsonSchema,
} from '@atlassian/adf-schema-json';

const ajv = initialize();
const packageName = process.env.npm_package_name as string;

describe(`${packageName} json-schema v1`, () => {
	const validateFull = ajv.compile(v1SchemaFull);
	const validateStage0 = ajv.compile(v1SchemaStage0);

	// A table nested inside a panel (panel_c1) is only allowed at the document root, inside a layout
	// column, or inside a synced block (bodiedSyncBlock). It must be rejected everywhere else, and
	// only in the stage-0 schema.
	describe('panel_c1 (table in panel) positional constraints', () => {
		const panelWithTable = (
			stage0ValidJsonSchema.find((f) => f.name === 'panel-with-nested-table.json') as
				| { data: { content: unknown[] } }
				| undefined
		)?.data.content[0];

		// Same panel with plain content (no table) — a control proving the container placement is
		// valid, so the table is what makes the nested cases invalid.
		const panelWithParagraph = {
			type: 'panel',
			attrs: { panelType: 'info' },
			content: [{ type: 'paragraph', content: [{ type: 'text', text: 'x' }] }],
		};

		const doc = (node: unknown) => ({ version: 1, type: 'doc', content: [node] });

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const wrappers: Record<string, (child: unknown) => any> = {
			'a table cell': (child) => ({
				type: 'table',
				content: [
					{ type: 'tableRow', content: [{ type: 'tableCell', attrs: {}, content: [child] }] },
				],
			}),
			'an expand': (child) => ({ type: 'expand', attrs: { title: '' }, content: [child] }),
			'a bodiedExtension': (child) => ({
				type: 'bodiedExtension',
				attrs: {
					extensionType: 'com.atlassian.confluence.macro.core',
					extensionKey: 'expand',
					layout: 'default',
				},
				content: [child],
			}),
		};

		// The positive cases are fixture-driven, exercised by the stage-0 loop below (valid in stage-0,
		// invalid in full): panel-with-nested-table.json (doc root), layout-with-panel-nested-table.json
		// (layout column), and panel-with-paragraph-and-nested-table.json (the content-superset case —
		// panel_c1 must accept normal panel content AND a table, not just a table on its own).
		// The wrapper cases below stay inline for their paired control (a plain panel is valid in the
		// same container, so the table is provably what makes the nested case invalid).
		Object.entries(wrappers).forEach(([where, wrap]) => {
			it(`is rejected when nested in ${where} (stage-0)`, () => {
				// control: same container with a plain panel is valid
				expect(validateStage0(doc(wrap(panelWithParagraph)))).toBe(true);
				// the table inside the panel is what makes it invalid
				expect(validateStage0(doc(wrap(panelWithTable)))).toBe(false);
			});
		});
	});

	describe('listItem with nested list as first child', () => {
		const legacyParagraphFirst = {
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'bulletList',
					content: [
						{
							type: 'listItem',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Legacy item' }],
								},
							],
						},
					],
				},
			],
		};
		const nestedListFirst = {
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'bulletList',
					content: [
						{
							type: 'listItem',
							content: [
								{
									type: 'bulletList',
									content: [
										{
											type: 'listItem',
											content: [
												{
													type: 'paragraph',
													content: [{ type: 'text', text: 'Nested item' }],
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
		};

		it('accepts paragraph-first listItem in full and stage-0', () => {
			const isValidFull = validateFull(legacyParagraphFirst);
			if (!isValidFull) {
				// eslint-disable-next-line no-console
				console.error(
					'Full schema - Legacy list item - Errors',
					betterAjvErrors(v1SchemaFull, legacyParagraphFirst, validateFull.errors, {
						indent: 2,
					}),
				);
			}
			expect(validateFull.errors).toEqual(null);

			const isValidStage0 = validateStage0(legacyParagraphFirst);
			if (!isValidStage0) {
				// eslint-disable-next-line no-console
				console.error(
					'Stage 0 schema - Legacy list item - Errors',
					betterAjvErrors(v1SchemaStage0, legacyParagraphFirst, validateStage0.errors, {
						indent: 2,
					}),
				);
			}
			expect(validateStage0.errors).toEqual(null);
		});

		it('accepts nested list first child in full and stage-0', () => {
			const isValidFull = validateFull(nestedListFirst);
			if (!isValidFull) {
				// eslint-disable-next-line no-console
				console.error(
					'Full schema - Nested list first child - Errors',
					betterAjvErrors(v1SchemaFull, nestedListFirst, validateFull.errors, {
						indent: 2,
					}),
				);
			}
			expect(validateFull.errors).toEqual(null);

			const isValidStage0 = validateStage0(nestedListFirst);
			if (!isValidStage0) {
				// eslint-disable-next-line no-console
				console.error(
					'Stage 0 schema - Nested list first child - Errors',
					betterAjvErrors(v1SchemaStage0, nestedListFirst, validateStage0.errors, {
						indent: 2,
					}),
				);
			}
			expect(validateStage0.errors).toEqual(null);
		});
	});

	describe('full', () => {
		for (const file of fullValidJsonSchema) {
			it(`validates '${file.name}'`, () => {
				const isValid = validateFull(file.data);
				if (!isValid) {
					// eslint-disable-next-line no-console
					console.error(
						'Full schema - Valid - Errors',
						betterAjvErrors(v1SchemaFull, file.data, validateFull.errors, {
							indent: 2,
						}),
					);
				}
				expect(validateFull.errors).toEqual(null);

				// Valid `full` use cases should be valid against `stage-0` schema
				const isValidStage0 = validateStage0(file.data);
				if (!isValidStage0) {
					// eslint-disable-next-line no-console
					console.error(
						'Stage 0 schema - Valid - Errors',
						betterAjvErrors(v1SchemaStage0, file.data, validateStage0.errors, {
							indent: 2,
						}),
					);
				}
				expect(validateStage0.errors).toEqual(null);
			});
		}

		for (const file of fullInvalidJsonSchema) {
			it(`does not validate '${file.name}'`, () => {
				expect(validateFull(file.data)).toEqual(false);
			});
		}
	});

	describe('stage-0', () => {
		for (const file of stage0ValidJsonSchema) {
			it(`validates '${file.name}'`, () => {
				const isValidStage0 = validateStage0(file.data);
				if (!isValidStage0) {
					// eslint-disable-next-line no-console
					console.error(
						'Full schema - Stage 0 Valid - Errors',
						betterAjvErrors(v1SchemaStage0, file.data, validateStage0.errors, {
							indent: 2,
						}),
					);
				}
				expect(validateStage0.errors).toEqual(null);

				// Valid `stage-0` use cases should be invalid against `full` schema
				expect(validateFull(file.data)).toEqual(false);
			});
		}

		for (const file of stage0InvalidJsonSchema) {
			it(`does not validate '${file.name}'`, () => {
				expect(validateStage0(file.data)).toEqual(false);
			});
		}
	});
});
