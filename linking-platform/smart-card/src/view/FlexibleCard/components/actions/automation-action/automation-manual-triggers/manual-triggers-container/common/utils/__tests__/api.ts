import type { Ari } from '../../types';
import { extractCloudIdAndProductFromSite, performGetRequest, performPostRequest } from '../api';

describe('extractCloudIdAndProductFromSite', () => {
	test.each([
		[
			'ari:cloud:platform::site/12345678-1234-1234-12345678901234567',
			'12345678-1234-1234-12345678901234567',
			'jira',
		],
		[
			'ari:cloud:platform::site/abcde-fghijk-12345-12345678901234567',
			'abcde-fghijk-12345-12345678901234567',
			'jira',
		],
		[
			'ari:cloud:confluence::site/abcde-fghijk-12345-12345678901234567',
			'abcde-fghijk-12345-12345678901234567',
			'confluence',
		],
		[
			'ari:cloud:jira::site/abcde-fghijk-12345-12345678901234567',
			'abcde-fghijk-12345-12345678901234567',
			'jira',
		],
	])(
		'Valid site ARI %p should extract cloudId %p',
		(site: Ari, cloudId: string, product: string) => {
			expect(extractCloudIdAndProductFromSite(site).product).toEqual(product);
			expect(extractCloudIdAndProductFromSite(site).cloudId).toEqual(cloudId);
		},
	);

	test.each([
		['ari:coud:platform::site/abcde-fghijk-12345-12345678901234567'],
		['ai:cloud:confluence::site/abcde-fghijk-12345-12345678901234567'],
		['ari:cloud:jira::site:abcde-fghijk-12345-12345678901234567'],
		['ari:coud:platform::site/123'],
		['ai:cloud:platform::site/123'],
		['ari:cloud:platform::site:123'],
		['ari:cloud:platform::site:/:/123'],
		['ari:cloud:confluence2::site/123'],
		['ari:cloud:confluence*::site/123'],
	])('Malformed site ARI %p should throw error', (malformedSiteAri: Ari) => {
		expect(() => extractCloudIdAndProductFromSite(malformedSiteAri)).toThrowError(
			'Not a site ARI: ' + malformedSiteAri,
		);
	});
	test.each([
		['ari:cloud:platform::sit/12345678-1234-1234-12345678901234567'],
		['ari:cloud:confluence::product/abcde-fghijk-12345-12345678901234567'],
		['ari:cloud:platform::sit/123'],
	])('Unsupported ARI %p should throw error', (malformedSiteAri: Ari) => {
		expect(() => extractCloudIdAndProductFromSite(malformedSiteAri)).toThrowError(
			'Not a site ARI: ' + malformedSiteAri,
		);
	});
});

describe('API Tests', () => {
	const url = 'https://automation.atlassian.com';
	beforeEach(() => {
		global.fetch = jest.fn().mockImplementation(async () => {
			return {
				json: async () => ({}),
			};
		});
	});
	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('performGetRequest', () => {
		test.each`
			description                                       | url    | user_set_header | expected_header
			${'GET request with default Content-Type header'} | ${url} | ${undefined}    | ${'application/json'}
			${'GET request with custom Content-Type header'}  | ${url} | ${'text/plain'} | ${'text/plain'}
		`(
			'$description should resolve in $expected_header',
			async ({ url, user_set_header, expected_header }) => {
				if (user_set_header === undefined) {
					await performGetRequest(url);
				} else {
					await performGetRequest(url, {
						headers: { 'Content-Type': expected_header },
					});
				}
				expect(global.fetch).toHaveBeenCalledWith(url, {
					headers: { 'Content-Type': expected_header },
					method: 'GET',
				});
			},
		);
	});

	describe('performPostRequest', () => {
		test.each`
			description                                        | url    | user_set_header | expected_header
			${'POST request with default Content-Type header'} | ${url} | ${undefined}    | ${'application/json'}
			${'POST request with custom Content-Type header'}  | ${url} | ${'text/plain'} | ${'text/plain'}
		`('should perform $description', async ({ url, user_set_header, expected_header }) => {
			if (user_set_header === undefined) {
				await performPostRequest(url);
			} else {
				await performPostRequest(url, {
					headers: { 'Content-Type': expected_header },
				});
			}
			expect(global.fetch).toHaveBeenCalledWith(url, {
				headers: { 'Content-Type': expected_header },
				method: 'POST',
			});
		});
	});
});
