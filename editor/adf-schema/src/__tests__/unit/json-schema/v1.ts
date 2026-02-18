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

	describe('listItem flexible first child', () => {
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

		it('accepts nested list first child only in stage-0', () => {
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
			expect(validateFull(nestedListFirst)).toEqual(false);
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
