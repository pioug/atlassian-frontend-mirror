import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EditorCardProvider } from '..';
import { type LinkAppearance, type ORSProvidersResponse, type UserPreferences } from '../types';
import { mocks } from '../../client/__tests__/__fixtures__/mocks';
import { urlResponsePromiseCache } from '../../client';

const getMockProvidersResponse = ({
	userPreferences,
}: { userPreferences?: UserPreferences } = {}): ORSProvidersResponse => ({
	providers: [
		{
			key: 'google-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/docs.google.com\\/(?:spreadsheets|document|presentation)\\/d\\/[^\\\\]+\\/|^https:\\/\\/drive.google.com\\/file\\/d\\/[^\\\\]+\\/|^https:\\/\\/drive.google.com\\/open\\?id=[^&]+|^https:\\/\\/drive.google.com\\/drive\\/u\\/\\d+\\/folders\\/[^&\\?]+|^https:\\/\\/drive.google.com\\/drive\\/folders\\/[^&\\?]+',
				},
			],
		},
		{
			key: 'provider-with-default-view',
			patterns: [
				{
					source: '^https:\\/\\/site-with-default-view.com\\/.*?/?$',
					defaultView: 'embed',
				},
			],
		},
		{
			key: 'jira-object-provider',
			patterns: [
				{
					source: '^https:\\/\\/.*?\\.jira-dev\\.com\\/browse\\/([a-zA-Z0-9]+-\\d+)#?.*?\\/?$',
				},
				{
					source:
						'^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/software\\/(c\\/)?projects\\/([^\\/]+?)\\/boards\\/(\\d+)\\/(timeline|roadmap)\\/?',
				},
				{
					source:
						'^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/core\\/projects\\/(?<resourceId>\\w+)\\/(timeline|calendar|list|board|summary)\\/?',
				},
				{
					source:
						'^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/core\\/projects\\/(?<resourceId>\\w+)\\/form\\/(?<formId>\\w+)\\/?',
				},
				{
					source:
						'^https:\\/\\/[^/]+\\.jira-dev\\.com\\/jira\\/(core|software(\\/c)?|servicedesk)\\/projects\\/(\\w+)\\/forms\\/form\\/direct\\/\\d+\\/\\d+.*$',
				},
			],
		},
		{
			key: 'slack-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/.+?\\.slack\\.com\\/archives\\/[CG][A-Z0-9][^/]+\\/?$|^https:\\/\\/app\\.slack\\.com\\/client\\/T[A-Z0-9]+\\/[CG][A-Z0-9][^/]+\\/?$|^https:\\/\\/.+?\\.slack\\.com\\/archives\\/[CG][A-Z0-9][^/]+\\/p[0-9]+(\\?.*)?$',
				},
			],
		},
		{
			key: 'polaris-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/.*?\\/jira\\/polaris\\/projects\\/[^\\/]+?\\/ideas\\/view\\/\\d+$|^https:\\/\\/.*?\\/secure\\/JiraProductDiscoveryAnonymous\\.jspa\\?hash=\\w+|^https:\\/\\/.*?\\/jira\\/polaris\\/share\\/\\w+',
				},
			],
		},
		{
			key: 'jpd-views-service-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/.*?\\/jira\\/polaris\\/share\\/\\w+|^https:\\/\\/.*?\\/jira\\/discovery\\/share\\/views\\/[\\w-]+(\\?selectedIssue=[\\w-]+&issueViewLayout=sidebar&issueViewSection=[\\w-]+)?$',
				},
			],
		},
	],
	...(userPreferences
		? {
				userPreferences,
			}
		: {}),
});

const expectedInlineAdf = (url: string) => ({
	type: 'inlineCard',
	attrs: {
		url,
	},
});

const expectedEmbedAdf = (url: string) => ({
	type: 'embedCard',
	attrs: {
		url,
		layout: 'wide',
	},
});

const expectedBlockAdf = (url: string) => ({
	type: 'blockCard',
	attrs: {
		url,
	},
});

describe('providers > editor', () => {
	let mockFetch: jest.Mock;

	beforeEach(() => {
		// Since we use module level caching,
		// we need to clear it up for clean test run
		urlResponsePromiseCache.clear();
		mockFetch = jest.fn();
		(global as any).fetch = mockFetch;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		delete (global as any).fetch;
	});

	it('should use baseUrl defined by provided environment for /providers call', async () => {
		const provider = new EditorCardProvider('stg');
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
		await provider.resolve(url, 'inline', false);
		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringMatching(/.*?pug\.jira-dev.*?\/providers/),
			expect.objectContaining({
				method: 'post',
				headers: expect.objectContaining({
					Origin: 'https://pug.jira-dev.com/gateway/api',
				}),
			}),
		);
	});

	it('should use baseUrl defined by provided override for /providers call', async () => {
		const provider = new EditorCardProvider('stg', 'https://trellis.coffee/gateway/api');
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
		await provider.resolve(url, 'inline', false);
		expect(mockFetch).toHaveBeenCalledWith(
			'https://trellis.coffee/gateway/api/object-resolver/providers',
			expect.objectContaining({
				method: 'post',
				headers: expect.objectContaining({
					Origin: 'https://trellis.coffee/gateway/api',
				}),
			}),
		);
	});

	it('should use baseUrl defined by provided environment for /resolve/batch call', async () => {
		const provider = new EditorCardProvider('stg');
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';
		await provider.findPattern(url);
		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringMatching(/.*?pug\.jira-dev.*?\/resolve\/batch/),
			expect.objectContaining({
				body: JSON.stringify([
					{
						resourceUrl: url,
					},
				]),
				method: 'post',
			}),
		);
	});

	it('should use baseUrl defined by provided override for /resolve/batch call', async () => {
		const provider = new EditorCardProvider('stg', 'https://trellis.coffee/gateway/api');
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';
		await provider.findPattern(url);
		expect(mockFetch).toHaveBeenCalledWith(
			'https://trellis.coffee/gateway/api/object-resolver/resolve/batch',
			expect.objectContaining({
				body: JSON.stringify([
					{
						resourceUrl: url,
					},
				]),
				method: 'post',
			}),
		);
	});

	it('returns inlineCard when calling /providers endpoint', async () => {
		const provider = new EditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedInlineAdf(url));
	});

	it('returns blockCard when calling /providers endpoint', async () => {
		const provider = new EditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
		const adf = await provider.resolve(url, 'block', false);
		expect(adf).toEqual(expectedBlockAdf(url));
	});

	it.each<[string, string]>([
		['Slack message', 'https://atlassian.slack.com/archives/C014W1DTRHS/p1614244582005100'],
		[
			'Slack message in thread',
			'https://atlassian.slack.com/archives/C014W1DTRHS/p1614306173007200?thread_ts=1614244582.005100&cid=C014W1DTRHS',
		],
	])('returns inline when %s link inserted, calling /providers endpoint', async (_, url) => {
		const provider = new EditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedInlineAdf(url));
	});

	it.each<[string, string]>([
		['Giphy Gif', 'https://giphy.com/gifs/happy-kawaii-nice-yCZEmKBKejysx5V2Ya'],
		['Giphy Gif with extension', 'https://media.giphy.com/media/OEv64W2RHusD9BrQ9z/giphy.gif'],
		[
			'Giphy Mp4 video',
			'https://media3.giphy.com/media/tYaV2Xd7SzmARXOWjO/giphy360p.mp4?cid=ecf05e47tqlptrwmtazt5a732xtckc235h1nxhh8l5r8557k&rid=giphy360p.mp4&ct=v',
		],
		[
			'Giphy Clip',
			'https://giphy.com/clips/studiosoriginals-omg-shocked-surprised-2P4BzWM98c2IzSoqN5',
		],
	])(
		'returns embedCard when %s public link is inserted, calling /providers and /resolve/batch endpoint',
		async (_, url) => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () => getMockProvidersResponse(),
				ok: true,
			});
			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedEmbedAdf(url));
		},
	);

	it.each<[string, string]>([
		[
			'Domain ending in "giphy"',
			'https://dodgygiphy.com/gifs/happy-kawaii-nice-yCZEmKBKejysx5V2Yaa',
		],
		['Giphy profile', 'https://giphy.com/Ellienka'],
	])(
		'returns inlineCard when %s public link is inserted, calling /providers and /resolve/batch endpoint',
		async (_, url) => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () => getMockProvidersResponse(),
				ok: true,
			});
			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		},
	);

	it.each<[string, string]>([
		[
			'roadmap embed',
			'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/roadmap',
		],
		[
			'roadmap embed with query parameter',
			'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/roadmap?shared=&atlOrigin=eyJpIjoiYmFlNzRlMzAyYjAyNDlkZTgxZDc5ZTIzYmNlZmI5MjAiLCJwIjoiaiJ9',
		],
		[
			'classic roadmap embed',
			'https://jdog.jira-dev.com/jira/software/c/projects/DL39857/boards/3186/roadmap',
		],
		[
			'timeline embed',
			'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/timeline',
		],
		[
			'timeline embed with query parameter',
			'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/timeline?shared=&atlOrigin=eyJpIjoiYmFlNzRlMzAyYjAyNDlkZTgxZDc5ZTIzYmNlZmI5MjAiLCJwIjoiaiJ9',
		],
		[
			'classic timeline embed',
			'https://jdog.jira-dev.com/jira/software/c/projects/DL39857/boards/3186/timeline',
		],
		[
			'Polaris view link',
			'https://polaris-v0.jira-dev.com/jira/polaris/projects/CS10/ideas/view/8981',
		],
		[
			'Polaris anonymous share view',
			'https://polaris-v0.jira-dev.com/jira/polaris/share/b2029c50914309acb37699615b1137da5',
		],
		[
			'Polaris anonymous share view fullscreen',
			'https://polaris-v0.jira-dev.com/jira/polaris/share/89cb70599021ac29e227fc49c56782969?fullscreen=true',
		],
		[
			'Polaris anonymous resolved view',
			'https://polaris-v0.jira-dev.com/secure/JiraProductDiscoveryAnonymous.jspa?hash=b2029c50914309acb37699615b1137da5',
		],
		[
			'Polaris published view',
			'https://polaris-v0.jira-dev.com/jira/discovery/share/views/c722b7ce-cd8a-4f0c-838c-7add80ba3277',
		],
		[
			'Polaris published view with idea opened in sidebar',
			'https://polaris-v0.jira-dev.com/jira/discovery/share/views/c722b7ce-cd8a-4f0c-838c-7add80ba3277?selectedIssue=SO-2&issueViewLayout=sidebar&issueViewSection=overview',
		],
		[
			'Jira work management (JWM) timeline view',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/timeline',
		],
		[
			'Jira work management (JWM) calendar view',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/calendar',
		],
		[
			'Jira work management (JWM) list view',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/list',
		],
		[
			'Jira work management (JWM) board view',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/board',
		],
		[
			'Jira work management (JWM) summary view',
			'https://gopi-2.jira-dev.com/jira/core/projects/T2/summary',
		],
		[
			'Jira work management (JWM) form view',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/form/1',
		],
		[
			'Jira work management (JWM) form view with Query Params',
			'https://jdog.jira-dev.com/jira/core/projects/NPM5/form/1?atlOrigin=eyJpIjoiM2MzNTA5N2FmNzNjNDQxNmFhNDAzNDhhYmIyZTRiNGQiLCJwIjoiaiJ9',
		],
		[
			'ProForma issue forms direct view',
			'https://jdog.jira-dev.com/jira/servicedesk/projects/PROFORMA/forms/form/direct/10/10048',
		],
		[
			'ProForma issue forms direct view with query parameter',
			'https://jdog.jira-dev.com/jira/servicedesk/projects/PROFORMA/forms/form/direct/10/10048?requestTypeId=509',
		],
	])('returns embedCard when %s link inserted, calling /providers endpoint', async (_, url) => {
		const provider = new EditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedEmbedAdf(url));
	});

	it('returns inlineCard when calling /providers endpoint, with fallback to /resolve', async () => {
		const provider = new EditorCardProvider();
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://drive.google.com/file/123';
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedInlineAdf(url));
	});

	it('returns undefined when calling /providers endpoint, with fallback to /resolve, not supported', async () => {
		const provider = new EditorCardProvider();
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.notFound, status: 404 }],
			ok: true,
		});

		const url = 'https://drive.google.com/file/123';
		const promise = provider.resolve(url, 'inline', false);
		await expect(promise).rejects.toEqual(undefined);
	});

	it('returns undefined when calling /providers endpoint, with fallback to /resolve, both fail', async () => {
		const provider = new EditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => {
				throw Error();
			},
		});
		mockFetch.mockResolvedValueOnce({
			json: async () => {
				throw Error();
			},
		});
		const url = 'https://drive.google.com/file/123';
		const promise = provider.resolve(url, 'inline', false);
		await expect(promise).rejects.toEqual(undefined);
	});

	it('calls /providers endpoint only once', async () => {
		const provider = new EditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		await Promise.all([
			provider.resolve('https://drive.google.com/file/d/123/view', 'inline'),
			provider.resolve('https://drive.google.com/file/d/456/view', 'inline'),
			provider.resolve('https://drive.google.com/file/d/789/view', 'inline'),
		]);
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});

	it('calls /providers endpoint again if the first request fails', async () => {
		const mockResolveResponse = {
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		};
		// Mocking call to /providers (failed)
		mockFetch.mockResolvedValueOnce({
			json: async () => {
				throw Error();
			},
			ok: true,
		});
		// Mocking call to /resolve/batch (success)
		mockFetch.mockResolvedValueOnce(mockResolveResponse);
		// Mocking call to /providers (success)
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch (success)
		mockFetch.mockResolvedValueOnce(mockResolveResponse);

		const provider = new EditorCardProvider();

		// Expected: /providers failed, resolve/batch is called.
		const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedInlineAdf(url));

		// Expected: /provider retried and success, pattern matched.
		const url2 = 'https://drive.google.com/file/d/456/view?usp=sharing';
		const adf2 = await provider.resolve(url2, 'inline', false);
		expect(adf2).toEqual(expectedInlineAdf(url2));

		// Expected: Pattern matched, no request is made.
		const url3 = 'https://drive.google.com/file/d/789/view?usp=sharing';
		const adf3 = await provider.resolve(url3, 'inline', false);
		expect(adf3).toEqual(expectedInlineAdf(url3));

		// Expected: Pattern not matched, /batch/resolve is called.
		const url4 = 'https://site-without-pattern.com';
		const adf4 = await provider.resolve(url4, 'inline', false);
		expect(adf4).toEqual(expectedInlineAdf(url4));

		expect(mockFetch).toHaveBeenCalledTimes(4);
		expect(mockFetch).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('/providers'),
			expect.any(Object),
		);
		expect(mockFetch).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining('/resolve'),
			expect.any(Object),
		);
		expect(mockFetch).toHaveBeenNthCalledWith(
			3,
			expect.stringContaining('/providers'),
			expect.any(Object),
		);
		expect(mockFetch).toHaveBeenNthCalledWith(
			4,
			expect.stringContaining('/resolve'),
			expect.any(Object),
		);
	});

	it('should return EmbedCard when defaultView specifies it', async () => {
		const provider = new EditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://site-with-default-view.com/testing';
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedEmbedAdf(url));
	});

	it('should find pattern for a link', async () => {
		const provider = new EditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = 'https://site-with-default-view.com/testing';
		expect(await provider.findPattern(url)).toBe(true);
	});

	it('should not find pattern for a link', async () => {
		const provider = new EditorCardProvider();
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.notFound, status: 404 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';
		expect(await provider.findPattern(url)).toBe(false);
	});

	it('should return true when /resolve returns positive results but pattern is not found', async () => {
		const provider = new EditorCardProvider();
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';
		expect(await provider.findPattern(url)).toBe(true);
	});

	it('should not call /resolve/batch second time', async () => {
		const provider = new EditorCardProvider();
		// Mocking call to /providers
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		// Mocking call to /resolve/batch
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = 'https://site-without-pattern.com';
		expect(await provider.findPattern(url)).toBe(true);
		expect(await provider.findPattern(url)).toBe(true);
	});

	describe('with user preferences', () => {
		it('should use throw when default user preferences is url', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'url',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const promise = provider.resolve(url, 'inline', false);
			await expect(promise).rejects.toEqual(undefined);
		});

		it('should return default user preference appearance adf', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedBlockAdf(url));
		});

		it('should return specific url user preference appearance adf', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'site-with-default-view.com/testing',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should throw when specific url user preference appearance is url', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'some-other-path.com',
									appearance: 'embed',
								},
								{
									urlSegment: 'site-with-default-view.com/testing',
									appearance: 'url',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const promise = provider.resolve(url, 'inline', false);
			await expect(promise).rejects.toEqual(undefined);
		});

		it('should return specific url user preference appearance adf when its not first in the map', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'some-other-path.com',
									appearance: 'embed',
								},
								{
									urlSegment: 'site-with-default-view.com/testing',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should use user default appearance even for urls we have hardcoded appearance for', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedBlockAdf(url));
		});

		it('should use hardcoded appearance when user has "inline" default appearance (and no pattern matches url)', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedEmbedAdf(url));
		});

		it('should use user appearance over hardcoded one when url matches users pattern', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'jdog.jira-dev.com/jira/core',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should use providers default appearance if user default appearance is inline (and no pattern matches url)', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedEmbedAdf(url));
		});

		it('should use the appearance associated with the preference containing the longest urlSegment that matches the url', async () => {
			const provider = new EditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
								{
									urlSegment: 'box.com/s',
									appearance: 'embed',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://app.box.com/s/yyr1vmw55haa09jnuj439amf0w7r5q1b';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedEmbedAdf(url));
		});

		it('should match a urlSegment as full word prior to location of urlSegment', async () => {
			const provider = new EditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://dropbox.com/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should match a urlSegment as full word at the start of the url', async () => {
			const provider = new EditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'http://box.com/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedBlockAdf(url));
		});

		it('should match a urlSegment as full word after the location of urlSegment', async () => {
			const provider = new EditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://box.community/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should match a urlSegment as full word at the end of the url', async () => {
			const provider = new EditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com/foo/bar/index.html',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://box.com/foo/bar/index.html';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedBlockAdf(url));
		});

		it('should match urlSegment to url of subdomain', async () => {
			const provider = new EditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://app.box.com/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedBlockAdf(url));
		});

		it('should escape the url segment', async () => {
			const provider = new EditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'inline',
							appearances: [
								{
									urlSegment: 'box.com',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			// If the '.' was not escaped it would match any character literally.
			const url = 'https://boxacom/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should match against urlSegment which starts with non-letter character', async () => {
			const provider = new EditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'url',
							appearances: [
								{
									urlSegment: '.box.com',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://app.box.com/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should match against urlSegment which ends with non-letter character', async () => {
			const provider = new EditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'url',
							appearances: [
								{
									urlSegment: 'wikipedia.org/wiki/Leif_',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://en.wikipedia.org/wiki/Leif_Edling';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should match against urlSegment which starts and ends with non-letter character', async () => {
			const provider = new EditorCardProvider();
			// Mocking call to /providers
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'url',
							appearances: [
								{
									urlSegment: '.box.com/',
									appearance: 'inline',
								},
							],
						},
					}),
				ok: true,
			});

			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://app.box.com/foo';
			const adf = await provider.resolve(url, 'inline', false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		describe('With Noun entities', () => {
			ffTest.on('smart_links_noun_support', 'ff on', () => {
				it('should return EmbedCard when defaultView specifies it', async () => {
					const provider = new EditorCardProvider();
					mockFetch.mockResolvedValueOnce({
						json: async () =>
							getMockProvidersResponse({
								userPreferences: {
									defaultAppearance: 'embed',
									appearances: [],
								},
							}),
						ok: true,
					});

					// Mocking call to /resolve/batch
					mockFetch.mockResolvedValueOnce({
						json: async () => [{ body: mocks.nounDataSuccess, status: 200 }],
						ok: true,
					});

					const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
					const adf = await provider.resolve(url, 'inline', false);
					expect(adf).toEqual(expectedEmbedAdf(url));
				});
			});
		});
	});

	describe('when consumer calls function without shouldForceAppearance argument defined', () => {
		const allUserPreferencesCombinations = [
			...(['url', 'inline', 'block', 'embed'] as LinkAppearance[]).map<[string, UserPreferences]>(
				(defaultAppearance) => [
					` default appearance = ${defaultAppearance}`,
					{
						defaultAppearance,
						appearances: [],
					} as UserPreferences,
				],
			),
			...(['url', 'inline', 'block', 'embed'] as LinkAppearance[]).map<[string, UserPreferences]>(
				(defaultAppearance) => [
					`specific url appearance = ${defaultAppearance}`,
					{
						defaultAppearance: 'block',
						appearances: [
							{
								urlSegment: 'some-domain.com',
								appearance: 'embed',
							},
						],
					} as UserPreferences,
				],
			),
		];

		it.each<[string, UserPreferences]>(allUserPreferencesCombinations)(
			"should use requested appearance over user's preferred %s",
			async (_, userPreferences) => {
				const provider = new EditorCardProvider();
				mockFetch.mockResolvedValueOnce({
					json: async () =>
						getMockProvidersResponse({
							userPreferences,
						}),
					ok: true,
				});
				mockFetch.mockResolvedValueOnce({
					json: async () => [{ body: mocks.success, status: 200 }],
					ok: true,
				});

				const url = 'https://docs.google.com/testing/index.html';
				const adf = await provider.resolve(url, 'inline');
				expect(adf).toEqual(expectedInlineAdf(url));
			},
		);

		it("should use requested appearance over provider's appearance", async () => {
			// This means for pre-G released editor we will not be using provider specific appearance
			// If we to do otherwise we would introduce a bug where user switching to URL and back would not get
			// appearance they chose, but instead provider's specific appearance would be used.

			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline');
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should use hardcoded appearance over requested appearance', async () => {
			// This means for pre-G released editor we still have a bug,
			// where if user switches to URL first and then back to `inline` for Jira Roadmap link for ex,
			// we will display embed instead. That is an existing bug.

			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'jdog.jira-dev.com/jira/core',
									appearance: 'block',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline');
			expect(adf).toEqual(expectedEmbedAdf(url));
		});
	});

	describe('when appearance is manually changed on the frontend', () => {
		it('should take manually specified appearance over provider default appearance', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () => getMockProvidersResponse(),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should take manually specified appearance over user default appearance', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should take manually specified appearance over user path based appearance', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () =>
					getMockProvidersResponse({
						userPreferences: {
							defaultAppearance: 'block',
							appearances: [
								{
									urlSegment: 'site-with-default-view.com/testing',
									appearance: 'url',
								},
							],
						},
					}),
				ok: true,
			});

			const url = 'https://site-with-default-view.com/testing/index.html';
			const adf = await provider.resolve(url, 'inline', true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should take manually specified appearance over hardcoded appearance', async () => {
			const provider = new EditorCardProvider();
			mockFetch.mockResolvedValueOnce({
				json: async () => getMockProvidersResponse(),
				ok: true,
			});

			const url = 'https://jdog.jira-dev.com/jira/core/projects/NPM5/board';
			const adf = await provider.resolve(url, 'inline', true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should not call /providers when shouldForceAppearance is true', async () => {
			const provider = new EditorCardProvider();

			const url = 'https://site-with-default-view.com/testing/index.html';
			await provider.resolve(url, 'inline', true);
			expect(mockFetch).not.toHaveBeenCalled();
		});
	});
});
