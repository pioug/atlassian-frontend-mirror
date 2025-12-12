import { validateSchemaCompatibility } from 'json-schema-diff-validator';
import { adfToJSON } from '@atlaskit/adf-schema-generator';
import adfNode from '../../../src/next-schema/full-schema.adf';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let expect: any;
expect.extend({
	// @ts-expect-error
	toBeBackwardsCompatibleWith(received, expected) {
		try {
			validateSchemaCompatibility(expected, received, {
				allowNewOneOf: true,
				allowNewEnumValue: true,
				allowReorder: true,
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			if (e.name === 'AssertionError') {
				return {
					pass: false,
					message: () =>
						JSON.stringify(
							JSON.parse(
								e.message.replace(
									'The schema is not backward compatible. Difference include breaking change = ',
									'',
								),
							),
							null,
							4,
						),
				};
			}
			return {
				pass: false,
				message: () => e.message,
			};
		}
		return { pass: true, message: 'Schemas are compatible' };
	},
});

test('ADF DSL to JSON Schema backwards compatibility for full schema', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const currentSchema = require('../../../json-schema/v1/full.json');
	const nextSchema = adfToJSON(adfNode, true);
	expect(nextSchema).toBeBackwardsCompatibleWith(currentSchema);
});

test('ADF DSL to JSON Schema backwards compatibility for stage0 schema', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const currentSchema = require('../../../json-schema/v1/stage-0.json');
	const nextSchema = adfToJSON(adfNode);
	expect(nextSchema).toBeBackwardsCompatibleWith(currentSchema);
});
