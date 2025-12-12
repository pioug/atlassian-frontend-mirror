import type { ADFAttribute, ADFAttributeString, ADFAttributes } from '../../../types/ADFAttribute';
import {
	buildRequired,
	hasRequiredAttributes,
	buildVariantRequired,
} from '../../../transforms/adfToJson/requiredBuilder';
import type { ContentVisitorReturnType } from '../../../transforms/adfToJson/adfToJsonVisitor';
import type { ADFNodeContentRangeSpec } from '../../../types/ADFNodeSpec';

describe('hasRequiredAttributes', () => {
	test('given attrs is undefined, it returns false', () => {
		const attrs = undefined;
		// @ts-expect-error - testing undefined case
		const result = hasRequiredAttributes(attrs);
		expect(result).toBe(false);
	});

	test('given attrs is an empty object, it returns false', () => {
		const attrs = {};
		const result = hasRequiredAttributes(attrs);
		expect(result).toBe(false);
	});

	describe('not anyOf', () => {
		test('given attrs is an object with an optional attribute, it returns false', () => {
			const attrs: Record<string, ADFAttributeString> = {
				attr1: {
					type: 'string',
					optional: true,
				},
			};
			const result = hasRequiredAttributes(attrs);
			expect(result).toBe(false);
		});

		test('given attrs is an object with a required attribute, it returns true', () => {
			const attrs: Record<string, ADFAttributeString> = {
				attr1: {
					type: 'string',
				},
			};
			const result = hasRequiredAttributes(attrs);
			expect(result).toBe(true);
		});

		test('given attrs is an object with a required attribute and an optional attribute, it returns true', () => {
			const attrs: Record<string, ADFAttribute> = {
				attr1: {
					type: 'string',
				},
				attr2: {
					type: 'number',
					optional: true,
				},
			};
			const result = hasRequiredAttributes(attrs);
			expect(result).toBe(true);
		});
	});

	describe('anyOf', () => {
		test('given attrs is an object with an optional attribute with anyOf, it returns false', () => {
			const attrs: ADFAttributes = {
				anyOf: [
					{
						attr1: {
							type: 'string',
							optional: true,
						},
					},
				],
			};
			const result = hasRequiredAttributes(attrs);
			expect(result).toBe(false);
		});

		test('given attrs is an object with a required attribute with anyOf, it returns true', () => {
			const attrs: ADFAttributes = {
				anyOf: [
					{
						attr1: {
							type: 'string',
						},
					},
				],
			};
			const result = hasRequiredAttributes(attrs);
			expect(result).toBe(true);
		});

		test('given attrs is an object with a required attribute and an optional attribute with anyOf, it returns true', () => {
			const attrs: ADFAttributes = {
				anyOf: [
					{
						attr1: {
							type: 'string',
						},
					},
					{
						attr2: {
							type: 'number',
							optional: true,
						},
					},
				],
			};
			const result = hasRequiredAttributes(attrs);
			expect(result).toBe(true);
		});
	});
});

describe('buildRequired', () => {
	test('given attrs is undefined, it returns ["type"]', () => {
		const attrs = undefined;
		// @ts-expect-error - testing undefined case
		const result = buildRequired(attrs, false, '');
		expect(result).toEqual(['type']);
	});

	test('given attrs is an empty object, it returns ["type"]', () => {
		const attrs = {};
		const result = buildRequired(attrs, false, '');
		expect(result).toEqual(['type']);
	});

	test('given attrs is an object with an optional attribute, it returns ["type"]', () => {
		const attrs: Record<string, ADFAttributeString> = {
			attr1: {
				type: 'string',
				optional: true,
			},
		};
		const result = buildRequired(attrs, false, '');
		expect(result).toEqual(['type']);
	});

	test('given attrs is an object with a required attribute, it returns ["type", "attrs"]', () => {
		const attrs: Record<string, ADFAttributeString> = {
			attr1: {
				type: 'string',
			},
		};
		const result = buildRequired(attrs, false, '');
		expect(result).toEqual(['type', 'attrs']);
	});

	test('given attrs is an object with a required attribute and an optional attribute, it returns ["type", "attrs"]', () => {
		const attrs: Record<string, ADFAttribute> = {
			attr1: {
				type: 'string',
			},
			attr2: {
				type: 'number',
				optional: true,
			},
		};
		const result = buildRequired(attrs, false, '');
		expect(result).toEqual(['type', 'attrs']);
	});

	test('given hasContent is true, it returns ["type", "content"]', () => {
		const attrs = {};
		const result = buildRequired(attrs, true, '');
		expect(result).toEqual(['type', 'content']);
	});

	test('given name is "doc", it returns ["version", "type"]', () => {
		const attrs = {};
		const result = buildRequired(attrs, false, 'doc');
		expect(result).toEqual(['version', 'type']);
	});
});

describe('buildVariantRequired', () => {
	test('given content is an empty array, it returns an empty object', () => {
		const content: ContentVisitorReturnType[] = [];
		const result = buildVariantRequired(content);
		expect(result).toEqual({});
	});

	test('given content is an array with minItems >= 1, it returns { required: ["content"] }', () => {
		const content: ContentVisitorReturnType[] = [
			{ minItems: 1, contentTypes: ['text'], type: '$or' },
		];
		const result = buildVariantRequired(content);
		expect(result).toEqual({ required: ['content'] });
	});

	test('given content is an array with range.type, it returns { required: ["content"] }', () => {
		const content: ContentVisitorReturnType[] = [
			{
				range: { type: '$range' } as ADFNodeContentRangeSpec,
				contentTypes: ['text'],
				type: '$or',
			},
		];
		const result = buildVariantRequired(content);
		expect(result).toEqual({ required: ['content'] });
	});
});
