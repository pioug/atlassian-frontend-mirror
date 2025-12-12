import { adfToValidatorSpec } from '@atlaskit/adf-schema-generator';
import adfNode from '../../../src/next-schema/full-schema.adf';

test('should be able to handle heading', () => {
	const result = sortNestedArrays(adfToValidatorSpec(adfNode));

	expect(result.heading.json).toEqual(sortNestedArrays(heading));
});

test('should be able to handle the panel node', () => {
	const result = sortNestedArrays(adfToValidatorSpec(adfNode));

	expect(result.panel.json).toEqual(sortNestedArrays(panel));
});

// i don't know what node on the results object is nested_expand because
// nested_expand doesn't exist in the adfNode object :hmmmmmm:
test.skip('should be able to handle nested expand', () => {
	const result = sortNestedArrays(adfToValidatorSpec(adfNode));

	expect(result.nested_expand.json).toEqual(sortNestedArrays(nested_expand));
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortNestedArrays(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.sort();
	}
	if (typeof obj === 'object') {
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				obj[key] = sortNestedArrays(obj[key]);
			}
		}
	}
	return obj;
}

const nested_expand = {
	props: {
		type: { type: 'enum', values: ['nestedExpand'] },
		attrs: { props: { title: { type: 'string', optional: true } } },
		content: 'nestedExpand_content',
	},
	required: ['content'],
};

const panel = {
	props: {
		type: { type: 'enum', values: ['panel'] },
		attrs: {
			props: {
				panelType: {
					type: 'enum',
					values: ['info', 'note', 'tip', 'warning', 'error', 'success', 'custom'],
				},
				panelIcon: { type: 'string', optional: true },
				panelIconId: { type: 'string', optional: true },
				panelIconText: { type: 'string', optional: true },
				panelColor: { type: 'string', optional: true },
				localId: { type: 'string', optional: true },
			},
		},
		content: {
			type: 'array',
			items: [
				[
					'paragraph_with_no_marks',
					'heading_with_no_marks',
					'bulletList',
					'orderedList',
					'blockCard',
					'mediaGroup',
					'mediaSingle_caption',
					'mediaSingle_full',
					'codeBlock',
					'taskList',
					'rule',
					'decisionList',
					'extension_with_marks',
				],
			],
			minItems: 1,
			allowUnsupportedBlock: true,
		},
	},
};

const heading = {
	props: {
		type: { type: 'enum', values: ['heading'] },
		content: {
			type: 'array',
			items: ['inline_content'],
			allowUnsupportedInline: true,
			optional: true,
		},
		marks: { type: 'array', items: [], optional: true },
		attrs: {
			props: {
				level: { type: 'number', minimum: 1, maximum: 6 },
				localId: { type: 'string', optional: true },
			},
		},
	},
};
