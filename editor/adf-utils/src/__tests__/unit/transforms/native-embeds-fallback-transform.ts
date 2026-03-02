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

		expect(result.isTransformed).toBe(false);
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
						parameters: { url: 'https://example.atlassian.net/wiki/spaces/DEMO/whiteboard/12345' },
					},
				},
			],
		};

		const result = nativeEmbedsFallbackTransform(adf);
		const transformedAdf = result.transformedAdf as ADFEntity;

		expect(result.isTransformed).toBe(true);
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

		expect(result.isTransformed).toBe(true);
		expect(transformedAdf.content).toEqual([]);
	});
});
