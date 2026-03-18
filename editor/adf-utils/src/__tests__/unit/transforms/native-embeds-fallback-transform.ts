import { nativeEmbedsFallbackTransform } from '../../../transforms/native-embeds-fallback-transform';
import type { ADFEntity } from '../../../types';


describe('nativeEmbedsFallbackTransform', () => {
	it('returns unchanged ADF when extension is not a native embed', () => {
		const adf: ADFEntity = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'some-macro',
						parameters: { url: 'https://example.com' },
					},
				},
			],
		};

		const result = nativeEmbedsFallbackTransform(adf);

		expect(result.hasValidTransform).toBe(false);
		expect(result.transformedAdf).toEqual(adf);
	});

	it('transforms extension with native-embed key and URL into paragraph with inlineCard', () => {
		const adf: ADFEntity = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.some-other-extension-type',
						extensionKey: 'native-embed:whiteboard',
						parameters: { macroParams: { url: { value: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345' } } },
					},
				},
			],
		};

		const result = nativeEmbedsFallbackTransform(adf);
		const transformedAdf = result.transformedAdf as ADFEntity;

		expect(result.hasValidTransform).toBe(true);
		expect(transformedAdf.content?.[0]).toEqual({
			type: 'paragraph',
			content: [
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345',
					},
				},
			],
		});
	});

	it('drops native-embed extension when URL is missing', () => {
		const adf: ADFEntity = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.some-other-extension-type',
						extensionKey: 'native-embed:database',
						parameters: {},
					},
				},
			],
		};

		const result = nativeEmbedsFallbackTransform(adf);
		const transformedAdf = result.transformedAdf as ADFEntity;

		expect(result.hasValidTransform).toBe(true);
		expect(transformedAdf.content).toEqual([]);
	});

	it('returns original ADF when transformed output fails ADF schema validation', () => {
		const originalAdf: ADFEntity = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.some-other-extension-type',
						extensionKey: 'native-embed:whiteboard',
						parameters: { macroParams: { url: { value: 'https://example.com' } } },
					},
				},
			],
		};

		jest.isolateModules(() => {
			const mockValidate = jest.fn().mockReturnValue({ valid: false });
			jest.mock('../../../validator/validator', () => ({
				validator: () => mockValidate,
			}));

			const {
				nativeEmbedsFallbackTransform: isolatedTransform,
			} = require('../../../transforms/native-embeds-fallback-transform');

			const result = isolatedTransform(originalAdf);

			// Because the transformed ADF is invalid, it should fall back to the original
			expect(result.hasValidTransform).toBe(false);
			expect(result.transformedAdf).toEqual(originalAdf);
		});
	});

	it('returns transformed ADF when it passes ADF schema validation', () => {
		const adf: ADFEntity = {
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.some-other-extension-type',
						extensionKey: 'native-embed:whiteboard',
						parameters: { macroParams: { url: { value: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345' } } },
					},
				},
			],
		};

		const result = nativeEmbedsFallbackTransform(adf);
		const transformedAdf = result.transformedAdf as ADFEntity;

		// The transform should succeed and the result should pass validation
		expect(result.hasValidTransform).toBe(true);
		expect(transformedAdf.content?.[0]).toEqual({
			type: 'paragraph',
			content: [
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345',
					},
				},
			],
		});
	});
});
