import { adfNode } from '../../../adfNode';
import { adfToValidatorSpec } from '../../../transforms/adfToValidatorSpec/adfToValidatorSpec';
import type { ValidatorSpecNode } from '../../../transforms/adfToValidatorSpec/ValidatorSpec';

test('should deeply add properties', () => {
	const node = adfNode('paragraph').define({
		root: true,
		attrs: {
			deep: {
				type: 'object',
				properties: {},
			},
		},
		DANGEROUS_MANUAL_OVERRIDE: {
			'validator-spec': {
				'props.attrs.props.deep.properties': {
					reason: 'its a test',
					value: {
						new: {
							type: 'string',
							default: 'I am new',
						},
					},
				},
			},
		},
	});
	const result = adfToValidatorSpec(node);
	expect((result.paragraph.json as ValidatorSpecNode).props.attrs).toEqual({
		props: {
			deep: {
				properties: {
					new: {
						type: 'string',
						default: 'I am new',
					},
				},
				type: 'object',
			},
		},
	});
});

test('should deeply remove properties', () => {
	const node = adfNode('paragraph').define({
		root: true,
		attrs: {
			deep: {
				type: 'object',
				properties: {
					killMe: {
						type: 'string',
						default: 'kill me',
					},
				},
			},
		},
		DANGEROUS_MANUAL_OVERRIDE: {
			'validator-spec': {
				'props.attrs.props.deep.props.killMe': {
					reason: 'its a test',
					remove: true,
				},
			},
		},
	});
	const result = adfToValidatorSpec(node);
	expect((result.paragraph.json as ValidatorSpecNode).props.attrs).toEqual({
		props: {
			deep: {
				props: {},
			},
		},
	});
});

test('should deeply remove array elements', () => {
	const node = adfNode('paragraph').define({
		root: true,
		attrs: {
			anyOf: [
				{
					datasource: {
						type: 'object',
					},
				},
			],
		},
		DANGEROUS_MANUAL_OVERRIDE: {
			'validator-spec': {
				'props.attrs[0].props.datasource.type': {
					reason: 'its a test',
					remove: true,
				},
			},
		},
	});
	const result = adfToValidatorSpec(node);
	expect((result.paragraph.json as ValidatorSpecNode).props.attrs).toEqual([
		{ props: { datasource: {} } },
	]);
});

test('should throw error for missing array elements', () => {
	const node = adfNode('paragraph').define({
		root: true,
		attrs: {
			anyOf: [
				{
					datasource: {
						type: 'object',
					},
				},
			],
		},
		DANGEROUS_MANUAL_OVERRIDE: {
			'validator-spec': {
				'props.attrs[1].props.datasource.type': {
					reason: 'its a test',
					remove: true,
				},
			},
		},
	});

	expect(() => adfToValidatorSpec(node)).toThrow();
});

test('should throw error if deleting non existing path', () => {
	const node = adfNode('paragraph').define({
		root: true,
		attrs: {
			anyOf: [
				{
					datasource: {
						type: 'object',
					},
				},
			],
		},
		DANGEROUS_MANUAL_OVERRIDE: {
			'validator-spec': {
				'props.attrs[0].props.datasource.blah': {
					reason: 'I do not exist',
					remove: true,
				},
			},
		},
	});

	expect(() => adfToValidatorSpec(node)).toThrow();
});
