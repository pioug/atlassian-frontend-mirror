import { getExtensionLozengeData } from '../macro';

function createNode(parameters: unknown) {
	return {
		attrs: { parameters },
	} as any;
}

describe('getExtensionLozengeData', () => {
	it('returns undefined when node has no parameters', () => {
		const node = createNode(null);
		expect(getExtensionLozengeData({ node, type: 'image' })).toBeUndefined();
	});

	it('returns undefined when macroMetadata is missing', () => {
		const node = createNode({});
		expect(getExtensionLozengeData({ node, type: 'image' })).toBeUndefined();
	});

	it('returns undefined when placeholder is missing', () => {
		const node = createNode({ macroMetadata: {} });
		expect(getExtensionLozengeData({ node, type: 'image' })).toBeUndefined();
	});

	it('returns placeholder data when placeholder is a valid array and type matches', () => {
		const node = createNode({
			macroMetadata: {
				placeholder: [
					{
						type: 'image',
						data: { url: 'http://example.com/image.png', width: 100, height: 50 },
					},
					{ type: 'icon', data: { url: 'http://example.com/icon.png' } },
				],
			},
		});
		expect(getExtensionLozengeData({ node, type: 'image' })).toEqual({
			url: 'http://example.com/image.png',
			width: 100,
			height: 50,
		});
	});

	it('returns undefined when placeholder array has no matching type', () => {
		const node = createNode({
			macroMetadata: {
				placeholder: [{ type: 'icon', data: { url: 'http://example.com/icon.png' } }],
			},
		});
		expect(getExtensionLozengeData({ node, type: 'image' })).toBeUndefined();
	});

	it('returns undefined when matching placeholder entry has no data.url', () => {
		const node = createNode({
			macroMetadata: {
				placeholder: [{ type: 'image', data: {} }],
			},
		});
		expect(getExtensionLozengeData({ node, type: 'image' })).toBeUndefined();
	});

	// EDITOR-4007: the array guard is now permanent — a non-array placeholder must never throw
	// `TypeError: ... forEach is not a function`.
	it('returns undefined without throwing when placeholder is a plain object', () => {
		const node = createNode({
			macroMetadata: {
				placeholder: { value: 'placeholder' },
			},
		});
		expect(getExtensionLozengeData({ node, type: 'image' })).toBeUndefined();
	});

	it('returns undefined without throwing when placeholder is a numeric-keyed object', () => {
		const node = createNode({
			macroMetadata: {
				placeholder: { '0': { data: { url: 'http://example.com/icon.png' }, type: 'icon' } },
			},
		});
		expect(getExtensionLozengeData({ node, type: 'icon' })).toBeUndefined();
	});
});
