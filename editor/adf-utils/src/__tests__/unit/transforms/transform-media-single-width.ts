import type { ADFEntity } from '@atlaskit/adf-utils/types';
import { transformMediaSingleWidth } from '../../../transforms/transform-media-single-width';

describe('transformMediaSingleWidth', () => {
	it('should not transform mediaSingle if widthType is defined', () => {
		const adf = {
			type: 'doc',
			content: [
				{
					type: 'mediaSingle',
					attrs: { width: 80, widthType: 'pixel' },
					content: [{ type: 'media', attrs: { id: '1', type: 'file', collection: 'c' } }],
				},
			],
		};
		const result = transformMediaSingleWidth(adf);
		expect(result.isTransformed).toBe(false);
		expect(result.transformedAdf).toEqual(adf);
	});

	it('should not transform mediaSingle if width is a valid number <= 100', () => {
		const adf = {
			type: 'doc',
			content: [
				{
					type: 'mediaSingle',
					attrs: { width: 50 },
					content: [{ type: 'media', attrs: { id: '1', type: 'file', collection: 'c' } }],
				},
			],
		};
		const result = transformMediaSingleWidth(adf);
		expect(result.isTransformed).toBe(false);
		expect(result.transformedAdf).toEqual(adf);
	});

	it('should transform mediaSingle if width is greater than 100', () => {
		const adf = {
			type: 'doc',
			content: [
				{
					type: 'mediaSingle',
					attrs: { width: 150 },
					content: [{ type: 'media', attrs: { id: '1', type: 'file', collection: 'c' } }],
				},
			],
		};
		const result = transformMediaSingleWidth(adf);

		const { content } = result.transformedAdf as ADFEntity;

		expect(result.isTransformed).toBe(true);
		expect(content?.at(0)?.attrs?.width).toBe(100);
	});

	it('should handle multiple mediaSingle nodes and only transform invalid ones', () => {
		const adf = {
			type: 'doc',
			content: [
				{
					type: 'mediaSingle',
					attrs: { width: 150 },
					content: [{ type: 'media', attrs: { id: '1', type: 'file', collection: 'c' } }],
				},
				{
					type: 'mediaSingle',
					attrs: { width: 80 },
					content: [{ type: 'media', attrs: { id: '2', type: 'file', collection: 'c' } }],
				},
			],
		};
		const result = transformMediaSingleWidth(adf);
		expect(result.isTransformed).toBe(true);

		const { content } = result.transformedAdf as ADFEntity;

		expect(content?.at(0)?.attrs?.width).toBe(100);
		expect(content?.at(1)?.attrs?.width).toBe(80);
	});

	it('should not transform if there are no mediaSingle nodes', () => {
		const adf = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [{ type: 'text', text: 'Hello' }],
				},
			],
		};
		const result = transformMediaSingleWidth(adf);
		expect(result.isTransformed).toBe(false);
		expect(result.transformedAdf).toEqual(adf);
	});
});
