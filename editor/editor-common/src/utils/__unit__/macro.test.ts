import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { getExtensionLozengeData } from '../macro';

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

const mockExpValEquals = expValEquals as jest.MockedFunction<typeof expValEquals>;

function createNode(parameters: unknown) {
	return {
		attrs: { parameters },
	} as any;
}

describe('getExtensionLozengeData', () => {
	describe.each([
		['experiment enabled', true],
		['experiment disabled', false],
	])('shared behaviour — %s', (_label, isEnabled) => {
		beforeEach(() => {
			mockExpValEquals.mockReturnValue(isEnabled);
		});

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
	});

	// EDITOR-4007: non-array placeholder used to throw `TypeError: ... forEach is not a function`.
	describe('non-array placeholder — when experiment is enabled (fix active)', () => {
		beforeEach(() => {
			mockExpValEquals.mockReturnValue(true);
		});

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

	describe('non-array placeholder — when experiment is disabled (legacy behaviour)', () => {
		beforeEach(() => {
			mockExpValEquals.mockReturnValue(false);
		});

		it('throws TypeError when placeholder is a plain object (documents the pre-fix crash)', () => {
			const node = createNode({
				macroMetadata: {
					placeholder: { value: 'placeholder' },
				},
			});
			expect(() => getExtensionLozengeData({ node, type: 'image' })).toThrow(TypeError);
		});
	});
});
