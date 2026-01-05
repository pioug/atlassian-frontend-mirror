import { renderHook } from '@testing-library/react';

import { setGlobalTheme } from '@atlaskit/tokens';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { CONFLUENCE_EXTENSION_KEYS, useConfluencePageData } from '../useConfluencePageData';

jest.mock('@atlaskit/tokens', () => ({
	...jest.requireActual('@atlaskit/tokens'),
	setGlobalTheme: jest.fn(),
}));

describe('useConfluencePageData', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	ffTest.off('platform_deprecate_lp_cc_embed', 'feature flag is off', () => {
		it('should return undefined when feature flag is disabled', () => {
			const lpCcEmbedUrl =
				'https://lp-cc-embed.prod-east.frontend.public.atl-paas.net/?hostname=hello.atlassian.net&contentId=1604155950&spaceKey=GDAY';

			const { result } = renderHook(() =>
				useConfluencePageData(lpCcEmbedUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toBeUndefined();
		});

		it('should return undefined for any URL when feature flag is disabled', () => {
			const directConfluenceUrl =
				'https://hello.atlassian.net/wiki/spaces/ABC123/pages/12345/Page-Title?parentProduct=confluence&userId=user123&userInfo=atlassianUser&enableInlineComments=true&enablePageComments=false&themeState=colorMode:light';

			const { result } = renderHook(() =>
				useConfluencePageData(directConfluenceUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toBeUndefined();
		});
	});

	ffTest.on('platform_deprecate_lp_cc_embed', 'feature flag is on', () => {
		it('should return undefined for non-lp-cc-embed URLs', () => {
			const directConfluenceUrl =
				'https://hello.atlassian.net/wiki/spaces/ABC123/pages/12345/Page-Title?parentProduct=confluence&userId=user123&userInfo=atlassianUser&enableInlineComments=true&enablePageComments=false&themeState=colorMode:light';

			const { result } = renderHook(() =>
				useConfluencePageData(directConfluenceUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toBeUndefined();
		});

		it('should return undefined for an invalid URL', () => {
			const invalidUrl = 'invalid-url';

			const { result } = renderHook(() =>
				useConfluencePageData(invalidUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toBeUndefined();
		});

		it('should return undefined for empty URL', () => {
			const emptyUrl = '';

			const { result } = renderHook(() =>
				useConfluencePageData(emptyUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toBeUndefined();
		});

		it('should return undefined for URLs that do not start with http/https', () => {
			const invalidProtocolUrl =
				'ftp://lp-cc-embed.prod-east.frontend.public.atl-paas.net/?hostname=hello.atlassian.net&contentId=123';

			const { result } = renderHook(() =>
				useConfluencePageData(invalidProtocolUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toBeUndefined();
		});

		it('should return undefined for URLs without lp-cc-embed', () => {
			const urlWithMissingParams = 'https://hello.atlassian.net/wiki/invalid-path';

			const { result } = renderHook(() =>
				useConfluencePageData(urlWithMissingParams, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toBeUndefined();
		});

		it('should parse lp-cc-embed URLs correctly', () => {
			const lpCcEmbedUrl =
				'https://lp-cc-embed.prod-east.frontend.public.atl-paas.net/?hostname=hello.atlassian.net&contentId=1604155950&parentProduct=smartlink&enablePageComments=true&enableInlineComments=true&userId=712020%3A8e8a67f1-cbd8-41d5-a141-48827e5897c3&userInfo=atlassianAccount&spaceKey=GDAY&themeState=colorMode:dark';

			const { result } = renderHook(() =>
				useConfluencePageData(lpCcEmbedUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toEqual({
				hostname: 'hello.atlassian.net',
				spaceKey: 'GDAY',
				contentId: '1604155950',
				parentProduct: 'smartlink',
				userInfo: {
					userId: '712020:8e8a67f1-cbd8-41d5-a141-48827e5897c3',
					userIdType: 'atlassianAccount',
				},
				hash: '',
				enableInlineComments: true,
				enablePageComments: true,
				themeStateObject: { colorMode: 'dark' },
				allowedFeatures: {
					edit: ['delete-draft'],
					view: [
						'byline-contributors',
						'byline-extensions',
						'page-reactions',
						'page-comments',
						'inline-comments',
					],
				},
				mode: 'view',
				locale: 'en',
			});

			expect(setGlobalTheme).toHaveBeenCalledWith({ colorMode: 'dark' });
		});

		it('should not call setGlobalTheme when no theme data is provided', () => {
			const lpCcEmbedUrl =
				'https://lp-cc-embed.prod-east.frontend.public.atl-paas.net/?hostname=hello.atlassian.net&contentId=1604155950&spaceKey=GDAY';

			renderHook(() => useConfluencePageData(lpCcEmbedUrl, CONFLUENCE_EXTENSION_KEYS.PAGE));

			expect(setGlobalTheme).not.toHaveBeenCalled();
		});

		it('should parse lp-cc-embed URLs without spaceKey', () => {
			const lpCcEmbedUrl =
				'https://lp-cc-embed.stg-east.frontend.public.atl-paas.net/?hostname=pug.jira-dev.com&contentId=4522249092&parentProduct=smartlink&enablePageComments=true&enableInlineComments=true&userId=5e6...';

			const { result } = renderHook(() =>
				useConfluencePageData(lpCcEmbedUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toEqual({
				hostname: 'pug.jira-dev.com',
				spaceKey: '',
				contentId: '4522249092',
				parentProduct: 'smartlink',
				userInfo: undefined,
				hash: '',
				enableInlineComments: true,
				enablePageComments: true,
				themeStateObject: undefined,
				allowedFeatures: {
					edit: ['delete-draft'],
					view: [
						'byline-contributors',
						'byline-extensions',
						'page-reactions',
						'page-comments',
						'inline-comments',
					],
				},
				mode: 'view',
				locale: 'en',
			});
		});

		it('should handle lp-cc-embed URLs with missing contentId', () => {
			const invalidLpCcEmbedUrl =
				'https://lp-cc-embed.prod-east.frontend.public.atl-paas.net/?hostname=hello.atlassian.net';

			const { result } = renderHook(() =>
				useConfluencePageData(invalidLpCcEmbedUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toBeUndefined();
		});

		it('should handle lp-cc-embed URLs with missing hostname', () => {
			const invalidLpCcEmbedUrl =
				'https://lp-cc-embed.prod-east.frontend.public.atl-paas.net/?contentId=123456';

			const { result } = renderHook(() =>
				useConfluencePageData(invalidLpCcEmbedUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toBeUndefined();
		});

		it('should handle fedramp lp-cc-embed URLs', () => {
			const fedrampUrl =
				'https://lp-cc-embed.frontend.cdn.atlassian-us-gov-mod.com/?hostname=hello.atlassian.net&contentId=123456&spaceKey=TEST';

			const { result } = renderHook(() =>
				useConfluencePageData(fedrampUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toEqual({
				hostname: 'hello.atlassian.net',
				spaceKey: 'TEST',
				contentId: '123456',
				parentProduct: '',
				userInfo: undefined,
				hash: '',
				enableInlineComments: false,
				enablePageComments: false,
				themeStateObject: undefined,
				allowedFeatures: {
					edit: ['delete-draft'],
					view: ['byline-contributors', 'byline-extensions', 'page-reactions'],
				},
				mode: 'view',
				locale: 'en',
			});
		});

		it('should return undefined for invalid extension key', () => {
			const lpCcEmbedUrl =
				'https://lp-cc-embed.prod-east.frontend.public.atl-paas.net/?hostname=hello.atlassian.net&contentId=1604155950&spaceKey=GDAY';
			const invalidExtensionKey = 'invalid-extension-key';

			const { result } = renderHook(() => useConfluencePageData(lpCcEmbedUrl, invalidExtensionKey));

			expect(result.current).toBeUndefined();
		});

		it('should return undefined for empty extension key', () => {
			const lpCcEmbedUrl =
				'https://lp-cc-embed.prod-east.frontend.public.atl-paas.net/?hostname=hello.atlassian.net&contentId=1604155950&spaceKey=GDAY';
			const emptyExtensionKey = '';

			const { result } = renderHook(() => useConfluencePageData(lpCcEmbedUrl, emptyExtensionKey));

			expect(result.current).toBeUndefined();
		});

		it('should work with valid PAGE extension key', () => {
			const lpCcEmbedUrl =
				'https://lp-cc-embed.prod-east.frontend.public.atl-paas.net/?hostname=hello.atlassian.net&contentId=1604155950&spaceKey=GDAY';

			const { result } = renderHook(() =>
				useConfluencePageData(lpCcEmbedUrl, CONFLUENCE_EXTENSION_KEYS.PAGE),
			);

			expect(result.current).toBeDefined();
			expect(result.current?.contentId).toBe('1604155950');
		});

		it('should work with valid CANVAS extension key', () => {
			const lpCcEmbedUrl =
				'https://lp-cc-embed.prod-east.frontend.public.atl-paas.net/?hostname=hello.atlassian.net&contentId=1604155950&spaceKey=GDAY';

			const { result } = renderHook(() =>
				useConfluencePageData(lpCcEmbedUrl, CONFLUENCE_EXTENSION_KEYS.CANVAS),
			);

			expect(result.current).toBeDefined();
			expect(result.current?.contentId).toBe('1604155950');
		});
	});
});
