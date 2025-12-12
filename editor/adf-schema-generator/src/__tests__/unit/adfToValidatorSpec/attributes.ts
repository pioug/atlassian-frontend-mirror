import { adfNode } from '../../../adfNode';
import { adfToValidatorSpec } from '../../../transforms/adfToValidatorSpec/adfToValidatorSpec';
import type { ValidatorSpecNode } from '../../../transforms/adfToValidatorSpec/ValidatorSpec';

test('should include minLength if present in attr', () => {
	const node = adfNode('node').define({
		root: true,
		attrs: {
			extensionKey: { type: 'string', default: '', minLength: 1 },
		},
	});
	const result = adfToValidatorSpec(node) as any;
	expect(result.node.json.props.attrs.props.extensionKey.minLength).toBe(1);
});

test('should handle array attribute', () => {
	const node = adfNode('node').define({
		root: true,
		attrs: {
			extensionKey: { type: 'array', items: { type: 'number' } },
		},
	});
	const result = adfToValidatorSpec(node) as any;
	expect(result.node.json.props.attrs.props.extensionKey.type).toBe('array');
});

test('should not include empty attributes', () => {
	const node = adfNode('node').define({
		root: true,
		attrs: {},
	});
	const result = adfToValidatorSpec(node);
	expect((result.node.json as ValidatorSpecNode).props.attrs).toBeUndefined();
});

test('should handle anyOf attribute', () => {
	const node = adfNode('node').define({
		root: true,
		attrs: {
			anyOf: [
				{
					key: { type: 'array', items: { type: 'number' } },
				},
				{
					name: { type: 'array', items: { type: 'number' } },
				},
			],
		},
	});
	const result = adfToValidatorSpec(node);
	expect((result.node.json as ValidatorSpecNode).props.attrs).toEqual([
		{ props: { key: { items: [{ type: 'number' }], type: 'array' } } },
		{ props: { name: { items: [{ type: 'number' }], type: 'array' } } },
	]);
});
