import { ffTest } from '@atlassian/feature-flags-test-utils';

import { type Datasource } from '@atlaskit/linking-common';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { type LinkAppearance, type UserPreferences } from '../types';
import { mocks } from './__fixtures__/mocks';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { EditorCardProvider, isJiraWorkItem } from '../provider';
import { getMockProvidersResponse, expectedInlineAdf, expectedEmbedAdf, expectedBlockAdf, expectedDatasourceAdf } from './test-utils';


const getUniqueURL = (url: string) => {
	return url + (url.includes('?') ? '&' : '?') + Math.random().toString(36).substring(2, 15);
};

describe('providers > editor', () => {
	let mockFetch: jest.Mock;

	beforeEach(() => {
		mockFetch = jest.fn();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(global as any).fetch = mockFetch;
	});

	afterAll(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
			// eslint-disable-next-line require-unicode-regexp
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
		const url = getUniqueURL('https://site-without-pattern.com');
		await provider.findPattern(url);
		expect(mockFetch).toHaveBeenCalledWith(
			// eslint-disable-next-line require-unicode-regexp
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
		const url = getUniqueURL('https://site-without-pattern.com');
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

	it('if product is provided, should forward product value as X-Product header in /resolve/batch call', async () => {
		const provider = new EditorCardProvider(
			'stg',
			'https://trellis.coffee/gateway/api',
			'CONFLUENCE',
		);

		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = getUniqueURL('https://site-without-pattern.com');

		await provider.findPattern(url);

		expect(mockFetch).toHaveBeenCalledWith(
			'https://trellis.coffee/gateway/api/object-resolver/resolve/batch',
			expect.objectContaining({
				method: 'post',
				headers: expect.objectContaining({
					'X-Product': 'CONFLUENCE',
				}),
			}),
		);
	});

	it('if product is not provided, should not set X-Product header in /resolve/batch call', async () => {
		const provider = new EditorCardProvider('stg', 'https://trellis.coffee/gateway/api');

		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		mockFetch.mockResolvedValueOnce({
			json: async () => [{ body: mocks.success, status: 200 }],
			ok: true,
		});
		const url = getUniqueURL('https://site-without-pattern.com');

		await provider.findPattern(url);

		expect(mockFetch).toHaveBeenCalledWith(
			'https://trellis.coffee/gateway/api/object-resolver/resolve/batch',
			expect.objectContaining({
				method: 'post',
				headers: expect.not.objectContaining({
					'X-Product': expect.anything(),
				}),
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

	

	it('returns datasource when jql link inserted, calling /resolve endpoint', async () => {
		const url =
			'https://forge-smart-link-battleground.jira-dev.com/issues/EDJ-3?filter=-4&jql=ORDER%20BY%20assignee%20DESC';
		const provider = new EditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const mockResolveResponse = {
			json: async () => [{ body: mocks.datasourceSuccess, status: 200 }],
			ok: true,
		};
		mockFetch.mockResolvedValueOnce(mockResolveResponse);
		const datasourceAdfData: Datasource = {
			id: mocks.datasourceSuccess.datasources[0].id,
			parameters: mocks.datasourceSuccess.datasources[0].parameters,
			views: [{ type: 'table' }],
		};
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedDatasourceAdf(datasourceAdfData, url));
		expect(mockFetch).toHaveBeenCalledTimes(2);
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
		const url = getUniqueURL('https://drive.google.com/file/123');
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

		const url = getUniqueURL('https://drive.google.com/file/123');
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
		const url = getUniqueURL('https://drive.google.com/file/123');
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
		expect(mockFetch).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('/providers'),
			expect.any(Object),
		);
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
		mockFetch.mockResolvedValueOnce(mockResolveResponse);
		mockFetch.mockResolvedValueOnce(mockResolveResponse);

		const provider = new EditorCardProvider();

		// Expected: Pattern not matched, /batch/resolve is called.
		const url1 = getUniqueURL('https://site-without-pattern.com');
		const adf1 = await provider.resolve(url1, 'inline', false);
		expect(adf1).toEqual(expectedInlineAdf(url1));

		// Expected: /providers failed, resolve/batch is called.
		const url2 = getUniqueURL('https://drive.google.com/file/d/123/view?usp=sharing');
		const adf2 = await provider.resolve(url2, 'inline', false);
		expect(adf2).toEqual(expectedInlineAdf(url2));

		// Expected: /provider retried and success, pattern matched.
		const url3 = getUniqueURL('https://drive.google.com/file/d/456/view?usp=sharing');
		const adf3 = await provider.resolve(url3, 'inline', false);
		expect(adf3).toEqual(expectedInlineAdf(url3));

		// Expected: Pattern matched, no request is made.
		const url4 = getUniqueURL('https://drive.google.com/file/d/789/view?usp=sharing');
		const adf4 = await provider.resolve(url4, 'inline', false);
		expect(adf4).toEqual(expectedInlineAdf(url4));

		expect(mockFetch).toHaveBeenCalledTimes(6);
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
		const url = getUniqueURL('https://site-with-default-view.com/testing');
		const adf = await provider.resolve(url, 'inline', false);
		expect(adf).toEqual(expectedEmbedAdf(url));
	});

	it('should find pattern for a link', async () => {
		const provider = new EditorCardProvider();
		mockFetch.mockResolvedValueOnce({
			json: async () => getMockProvidersResponse(),
			ok: true,
		});
		const url = getUniqueURL('https://site-with-default-view.com/testing');
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
		const url = getUniqueURL('https://site-without-pattern.com');
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
		const url = getUniqueURL('https://site-without-pattern.com');
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
		const url = getUniqueURL('https://site-without-pattern.com');
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

			const url = getUniqueURL('https://site-with-default-view.com/testing/index.html');
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

			const url = getUniqueURL('https://site-with-default-view.com/testing/index.html');
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

			const url = getUniqueURL('https://site-with-default-view.com/testing/index.html');
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

			const url = getUniqueURL('https://site-with-default-view.com/testing/index.html');
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

			const url = getUniqueURL('https://site-with-default-view.com/testing/index.html');
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

			const url = getUniqueURL('https://jdog.jira-dev.com/jira/core/projects/NPM5/board');
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

			const url = getUniqueURL('https://jdog.jira-dev.com/jira/core/projects/NPM5/board');
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

			const url = getUniqueURL('https://jdog.jira-dev.com/jira/core/projects/NPM5/board');
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

			const url = getUniqueURL('https://site-with-default-view.com/testing/index.html');
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

		describe('With entities', () => {
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
					json: async () => [{ body: mocks.entityDataSuccess, status: 200 }],
					ok: true,
				});

				const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
				const adf = await provider.resolve(url, 'inline', false);
				expect(adf).toEqual(expectedEmbedAdf(url));
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

			const url = getUniqueURL('https://site-with-default-view.com/testing/index.html');
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

			const url = getUniqueURL('https://jdog.jira-dev.com/jira/core/projects/NPM5/board');
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

			const url = getUniqueURL('https://jdog.jira-dev.com/jira/core/projects/NPM5/board');
			const adf = await provider.resolve(url, 'inline', true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should not call /providers when shouldForceAppearance is true', async () => {
			const provider = new EditorCardProvider();

			const url = getUniqueURL('https://site-with-default-view.com/testing/index.html');
			await provider.resolve(url, 'inline', true);
			expect(mockFetch).not.toHaveBeenCalled();
		});
	});

	describe('when consumer calls function with isEmbedFriendlyLocation as false', () => {
		it('should not use hardcoded appearance even if it matches regexp', async () => {
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

			const url = getUniqueURL('https://jdog.jira-dev.com/jira/core/projects/NPM5/board');
			const adf = await provider.resolve(url, 'inline', false, false);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		describe('should return inline card if unauthenticated and restricted 3P link is inserted inside ', () => {
			let url: string

			const setup = async () => {
				url = getUniqueURL('https://drive.google.com/file/d/123/view?usp=sharing');
				const provider = new EditorCardProvider();
				// Mocking call to /providers
				mockFetch.mockResolvedValueOnce({
					json: async () => getMockProvidersResponse(),
					ok: true,
				});
				// Mocking call to /resolve/batch
				mockFetch.mockResolvedValueOnce({
					json: async () => [{ body: mocks.unauthorized, status: 200 }],
					ok: true,
				});

				const adf = await provider.resolve(url, 'inline', false, false);	

				return adf;
			};

			eeTest('platform_sl_3p_unauth_paste_as_block_card', {
					'card_by_default_only': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedInlineAdf(url));
				},
				'card_by_default_and_new_design': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedInlineAdf(url));
				},
				'control': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedInlineAdf(url));
				},
			});
			
		});
	});
	
	describe('when consumer calls function with isEmbedFriendlyLocation as true', () => {
		it('should use hardcoded appearance if it matches regexp', async () => {
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

			const url = getUniqueURL('https://jdog.jira-dev.com/jira/core/projects/NPM5/board');
			const adf = await provider.resolve(url, 'inline', false, true);
			expect(adf).toEqual(expectedEmbedAdf(url));
		});

		it('should not use embed appearance for team calendar smart link when FF is off', async () => {
			setBooleanFeatureFlagResolver(() => false);
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

			const url =
				'https://jdog.jira-dev.com/wiki/spaces/kb/calendars/1bb45655-f521-4379-8353-59b423abfffb';
			const adf = await provider.resolve(url, 'inline', false, true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should not use embed appearance for AVP Visualization URLs when FF is off', async () => {
			setBooleanFeatureFlagResolver(() => false);
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
			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://hello.atlassian.net/avpviz/c/12345';
			const adf = await provider.resolve(url, 'inline', false, true);
			expect(adf).toEqual(expectedInlineAdf(url));
		});

		it('should use embed appearance for AVP Visualization URLs when FF is on', async () => {
			setBooleanFeatureFlagResolver(
				(flag) => flag === 'avp_unfurl_shared_charts_embed_by_default_2',
			);
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
			// Mocking call to /resolve/batch
			mockFetch.mockResolvedValueOnce({
				json: async () => [{ body: mocks.success, status: 200 }],
				ok: true,
			});

			const url = 'https://hello.atlassian.net/avpviz/c/12345';
			const adf = await provider.resolve(url, 'inline', false, true);
			expect(adf).toEqual(expectedEmbedAdf(url));
		});

		it('should use embed appearance for team calendar smart link when FF is on', async () => {
			setBooleanFeatureFlagResolver(() => true);
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

			const url =
				'https://jdog.jira-dev.com/wiki/spaces/kb/calendars/1bb45655-f521-4379-8353-59b423abfffb';
			const adf = await provider.resolve(url, 'inline', false, true);
			expect(adf).toEqual(expectedEmbedAdf(url));
		});

		describe('should return block card if unauthenticated and restricted 3P link is inserted', () => {
			let url: string

			const setup = async () => {
				url = getUniqueURL('https://drive.google.com/file/d/123/view?usp=sharing');

				const provider = new EditorCardProvider();
				// Mocking call to /providers
				mockFetch.mockResolvedValueOnce({
					json: async () => getMockProvidersResponse(),
					ok: true,
				});
				// Mocking call to /resolve/batch
				mockFetch.mockResolvedValueOnce({
					json: async () => [{ body: mocks.unauthorized, status: 200 }],
					ok: true,
				});

				const adf = await provider.resolve(url, 'inline', false, true);	
				return adf;
			};

			eeTest('platform_sl_3p_unauth_paste_as_block_card', {
				'card_by_default_only': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedBlockAdf(url));
				},
				'card_by_default_and_new_design': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedBlockAdf(url));
				},
				'control': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedInlineAdf(url));
				},	
				
			});
		});
		

		describe('should not do block card if unauthenticated and forbidden when 3P link is inserted inside', () => {
			let url: string

			const setup = async () => {
				url = getUniqueURL('https://drive.google.com/file/d/123/view?usp=sharing');
				const provider = new EditorCardProvider();
				// Mocking call to /providers
				mockFetch.mockResolvedValueOnce({
					json: async () => getMockProvidersResponse(),
					ok: true,
				});
				// Mocking call to /resolve/batch
				mockFetch.mockResolvedValueOnce({
					json: async () => [{ body: mocks.forbidden, status: 200 }],
					ok: true,
				});

				const adf = await provider.resolve(url, 'inline', false, true);	
				return adf;
			};

			eeTest('platform_sl_3p_unauth_paste_as_block_card', {
				'card_by_default_only': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedInlineAdf(url));
				},
				'card_by_default_and_new_design': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedInlineAdf(url));
				},
				'control': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedInlineAdf(url));
				},
			});
		});
		
		describe('should prefer user preference even if unauthenticated and restricted 3P link is inserted inside', () => {
			let url: string

			const setup = async () => {
				url = getUniqueURL('https://app.box.com/foo');
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
										appearance: 'inline',
									},
								],
							},
						}),
					ok: true,
				});

				// Mocking call to /resolve/batch
				mockFetch.mockResolvedValueOnce({
					json: async () => [{ body: mocks.unauthorized, status: 200 }],
					ok: true,
				});

				const adf = await provider.resolve(url, 'inline', false, true);	
				return adf;
			};

			eeTest('platform_sl_3p_unauth_paste_as_block_card', {
				'card_by_default_only': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedInlineAdf(url));
				},
				'card_by_default_and_new_design': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedInlineAdf(url));
				},
				'control': async () => {
					const adf = await setup();
					expect(adf).toEqual(expectedInlineAdf(url));
				},
			});
		})
	});

	describe('prompt linked issues experiment', () => {
		ffTest.on('issue-link-suggestions-in-comments', 'fg on', () => {
			it('should call onResolve for issue links', async () => {
				const baseUrl = 'https://jdog.jira-dev.com';
				const onResolveMock = jest.fn();

				const provider = new EditorCardProvider(undefined, baseUrl, undefined, onResolveMock);

				const issueAri = 'ari:cloud:jira:b5c3749a-7037-44ec-a059-fb4f675acf90:issue/10050';
				const issueUrl = 'https://jdog.jira-dev.com/browse/BNP-1';

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

				mockFetch.mockResolvedValueOnce({
					json: async () => [
						{
							body: {
								...mocks.entityDataSuccess,
								data: { ...mocks.entityDataSuccess.data, 'atlassian:ari': issueAri },
							},
							status: 200,
						},
					],
					ok: true,
				});

				await provider.resolve(issueUrl, 'inline', false);

				expect(onResolveMock).toHaveBeenCalledWith(issueUrl, issueAri);
				expect(onResolveMock).toHaveBeenCalledTimes(1);
			});

			it('should not call onResolve for remote issue links', async () => {
				const baseUrl = 'https://sdog.jira-dev.com';
				const onResolveMock = jest.fn();

				const provider = new EditorCardProvider(undefined, baseUrl, undefined, onResolveMock);

				const issueAri = 'ari:cloud:jira:b5c3749a-7037-44ec-a059-fb4f675acf90:issue/10050';
				const issueUrl = 'https://jdog.jira-dev.com/browse/BNP-1';

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

				mockFetch.mockResolvedValueOnce({
					json: async () => [
						{
							body: {
								...mocks.entityDataSuccess,
								data: { ...mocks.entityDataSuccess.data, 'atlassian:ari': issueAri },
							},
							status: 200,
						},
					],
					ok: true,
				});

				await provider.resolve(issueUrl, 'inline', false);

				expect(onResolveMock).toHaveBeenCalledTimes(0);
			});
		});

		ffTest.off('issue-link-suggestions-in-comments', 'fg off', () => {
			it('should not call onResolve for an issue link', async () => {
				const baseUrl = 'https://jdog.jira-dev.com';
				const onResolveMock = jest.fn();

				const provider = new EditorCardProvider(undefined, baseUrl, undefined, onResolveMock);

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

				const issueUrl = 'https://jdog.jira-dev.com/browse/BNP-1';
				await provider.resolve(issueUrl, 'inline', false);

				expect(onResolveMock).not.toHaveBeenCalled();
			});
		});
	});

	describe('isJiraWorkItem regexp', () => {
		it.each([
			'https://jv3.jira-dev.com/browse/BNP-1',
			'https://jira.company.com/browse/TEST-123',
			'https://my-instance.atlassian.net/browse/PROJ-999',
			'https://jira.example.com/browse/ABC-123',
		])('should return true for valid work item url: %s', (url) => {
			expect(isJiraWorkItem(url)).toBe(true);
		});

		it('should return false for URLs without /browse', () => {
			const url = 'https://jira.example.com/EXAMPLE-123';
			expect(isJiraWorkItem(url)).toBe(false);
		});

		it.each([
			'',
			'not-a-url',
			'http://',
			'https://jira.example.com',
			'https://jira.example.com/browse/',
			'https://jira.example.com/browse/123',
		])('should return false for invalid work item url: %s', (url) => {
			expect(isJiraWorkItem(url)).toBe(false);
		});
	});
});
