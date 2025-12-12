import { JSONSchemaTransformerName } from '../../../transforms/transformerNames';
import { adfMark } from '../../../adfMark';
import { buildMarks } from '../../../transforms/adfToJson/marksBuilder';

const testMark = adfMark('testMark').define({
	attrs: {
		optionalAttr: {
			type: 'string',
			optional: true,
		},
		requiredAttr: {
			type: 'string',
		},
	},
});

const ignoredMark = adfMark('ignoredMark').define({
	attrs: {
		optionalAttr: {
			type: 'string',
			optional: true,
		},
		requiredAttr: {
			type: 'string',
		},
	},
	ignore: [JSONSchemaTransformerName],
});

const expectedJson = {
	testMark_mark: {
		json: {
			additionalProperties: false,
			properties: {
				attrs: {
					additionalProperties: false,
					properties: {
						optionalAttr: {
							type: 'string',
						},
						requiredAttr: {
							type: 'string',
						},
					},
					required: ['requiredAttr'],
					type: 'object',
				},
				type: {
					enum: ['testMark'],
				},
			},
			required: ['type', 'attrs'],
			type: 'object',
		},
	},
};

describe('buildMarks', () => {
	it('should build JSON correcrtly', () => {
		const result = buildMarks([testMark]);
		expect(result).toEqual(expectedJson);
	});

	it('should ignore marks that are ignored', () => {
		const result = buildMarks([ignoredMark]);
		expect(result).toEqual({});
	});
});
