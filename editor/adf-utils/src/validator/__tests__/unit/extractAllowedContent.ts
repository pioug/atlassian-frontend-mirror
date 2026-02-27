import { extractAllowedContent } from '../../extractAllowedContent';
import { createSpec } from '../../validator';

it('should extract the expected additional media single specs', () => {
	const validatorSpecs = createSpec();

	expect(extractAllowedContent(validatorSpecs, { type: 'mediaSingle' })).toEqual([
		[
			[
				'mediaSingle',
				{
					props: {
						content: expect.any(Object),
					},
				},
			],
		],
		[
			[
				'mediaSingle',
				{
					props: {
						content: expect.any(Object),
					},
				},
			],
		],
	]);
});

it('should extract the expected additional table specs', () => {
	const validatorSpecs = createSpec();
	expect(extractAllowedContent(validatorSpecs, { type: 'table' })).toEqual([]);
});

it('should extract the expected additional text specs', () => {
	const validatorSpecs = createSpec();
	expect(extractAllowedContent(validatorSpecs, { type: 'text' })).toEqual([
		[
			[
				'text',
				{
					props: {
						marks: expect.any(Object),
					},
				},
			],
		],
		[
			[
				'text',
				{
					props: {
						marks: expect.any(Object),
					},
				},
			],
		],
		[
			[
				'text',
				{
					props: {
						marks: expect.any(Object),
					},
				},
			],
		],
		[
			[
				'text',
				{
					props: {
						marks: expect.any(Object),
					},
				},
			],
		],
	]);
});

it('should extract the expected additional non_nestable_block_content specs', () => {
	const validatorSpecs = createSpec();
	expect(extractAllowedContent(validatorSpecs, { type: 'non_nestable_block_content' })).toEqual([]);
});

it('should extract the expected additional panel specs', () => {
	const validatorSpecs = createSpec();
	expect(extractAllowedContent(validatorSpecs, { type: 'panel' })).toEqual([]);
});

it('should extract the expected additional listItem specs', () => {
	const validatorSpecs = createSpec();
	const result = extractAllowedContent(validatorSpecs, { type: 'listItem' });
	expect(result.length).toBe(1);
});

it('should extract the expected additional media specs', () => {
	const validatorSpecs = createSpec();
	expect(extractAllowedContent(validatorSpecs, { type: 'media' })).toEqual([]);
});

it('should extract the expected additional codeBlock specs', () => {
	const validatorSpecs = createSpec();
	expect(extractAllowedContent(validatorSpecs, { type: 'codeBlock' })).toEqual([
		[
			[
				'codeBlock',
				{
					props: {
						marks: expect.any(Object),
					},
				},
			],
		],
	]);
});

it('should extract the expected additional layoutSection specs', () => {
	const validatorSpecs = createSpec();
	expect(extractAllowedContent(validatorSpecs, { type: 'layoutSection' })).toEqual([
		[
			[
				'layoutSection',
				{
					props: {
						content: expect.any(Object),
						marks: expect.any(Object),
					},
				},
			],
		],
		[
			[
				'layoutSection',
				{
					props: {
						content: expect.any(Object),
						marks: expect.any(Object),
						attrs: expect.any(Object),
					},
				},
			],
		],
	]);
});
