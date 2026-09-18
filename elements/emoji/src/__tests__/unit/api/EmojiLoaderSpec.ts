import fetchMock from 'fetch-mock/cjs/client';
import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill
import * as sinon from 'sinon';

import type { SecurityOptions } from '@atlaskit/util-service-support';

import EmojiLoader from '../../../api/EmojiLoader';
import type { EmojiLoaderConfig } from '../../../api/EmojiUtils';
import { isTestEnvironment } from '../../../util/is-test-environment';

jest.mock('../../../util/is-test-environment', () => ({
	isTestEnvironment: jest.fn(),
}));

const mockIsTestEnvironment = jest.mocked(isTestEnvironment);

const p1Url = 'https://p1/';

const defaultSecurityHeader = 'X-Bogus';

const header = (code: string | number): SecurityOptions => ({
	headers: {
		[defaultSecurityHeader]: code,
	},
});

type MockFetchResponse = Array<
	| string
	| {
			credentials: string;
			headers: any;
			identifier: string;
			isUnmatched: any;
			request: any;
	  }
>;

const getSecurityHeader = (call: MockFetchResponse) => {
	const data = call[1];
	if (typeof data === 'string') {
		return undefined;
	}
	return data.headers[defaultSecurityHeader];
};

const defaultSecurityCode = '10804';
const defaultAltScaleParam = 'altScale=XHDPI';
const emojiRepresentation = 'preferredRepresentation=IMAGE';

const provider1: EmojiLoaderConfig = {
	url: p1Url,
	securityProvider: () => header(defaultSecurityCode),
};

const providerData1 = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

const fetchResponse = (data: any[]) => ({ emojis: data });

function checkOrder(expected: any[], actual: any[]) {
	expect(actual).toHaveLength(expected.length);
	expected.forEach((emoji, idx) => {
		expect(emoji.id).toEqual(actual[idx].id);
	});
}

describe('EmojiLoader', () => {
	beforeEach(() => {
		// Match how the loader really behaves under Jest: caching disabled, so every test fetches
		// for itself. The caching tests below opt back in explicitly.
		mockIsTestEnvironment.mockReturnValue(true);
	});

	afterEach(() => {
		fetchMock.restore();
	});

	describe('#loadEmoji', () => {
		it('normal', () => {
			fetchMock.mock({
				matcher: `begin:${provider1.url}`,
				response: fetchResponse(providerData1),
			});

			const resource = new EmojiLoader(provider1);
			return resource.loadEmoji().then((emojiResponse) => {
				checkOrder(providerData1, emojiResponse.emojis);
			});
		});

		it('is only passed a baseUrl with no securityProvider and default altScale param', () => {
			const simpleProvider: EmojiLoaderConfig = {
				url: p1Url,
			};
			fetchMock.mock({
				matcher: `end:${defaultAltScaleParam}&${emojiRepresentation}`,
				response: fetchResponse(providerData1),
			});

			const resource = new EmojiLoader(simpleProvider);
			return resource.loadEmoji().then((emojiResponse) => {
				checkOrder(providerData1, emojiResponse.emojis);
			});
		});

		it('can handle when a version is specified in the query params', () => {
			const params = '?maxVersion=2';
			fetchMock.mock({
				matcher: `end:${params}&${defaultAltScaleParam}&${emojiRepresentation}`,
				response: fetchResponse(providerData1),
			});

			const provider2 = {
				...provider1,
				url: `${provider1.url}${params}`,
			};

			const resource = new EmojiLoader(provider2);
			return resource.loadEmoji().then((emojiResponse) => {
				checkOrder(providerData1, emojiResponse.emojis);
			});
		});

		it('does not add a scale param when it detects the pixel ratio is <= 1', () => {
			const provider2 = {
				...provider1,
				getRatio: () => 1,
			};
			fetchMock.mock({
				matcher: `${provider1.url}?${defaultAltScaleParam}&${emojiRepresentation}`,
				response: fetchResponse(providerData1),
			});

			const resource = new EmojiLoader(provider2);
			return resource.loadEmoji().then((emojiResponse) => {
				checkOrder(providerData1, emojiResponse.emojis);
			});
		});

		it('adds a scale param when it detects the pixel ratio is > 1', () => {
			const provider2 = {
				...provider1,
				getRatio: () => 2,
			};
			// Should use double of XHDPI for altScale
			fetchMock.mock({
				matcher: `end:?scale=XHDPI&altScale=XXXHDPI&${emojiRepresentation}`,
				response: fetchResponse(providerData1),
			});

			const resource = new EmojiLoader(provider2);
			return resource.loadEmoji().then((emojiResponse) => {
				checkOrder(providerData1, emojiResponse.emojis);
			});
		});

		it('401 error once retry', () => {
			const refreshedSecurityProvider = sinon.stub();
			refreshedSecurityProvider.returns(Promise.resolve(header(666)));

			const provider401 = {
				...provider1,
				refreshedSecurityProvider,
			};

			const matcher = `begin:${provider1.url}`;

			fetchMock
				.mock({
					name: 'auth',
					matcher,
					response: 401,
					repeat: 1,
				})
				.mock({
					name: 'auth2',
					matcher,
					response: fetchResponse(providerData1),
					repeat: 1,
				});

			const resource = new EmojiLoader(provider401);
			return resource.loadEmoji().then((emojiResponse) => {
				expect(refreshedSecurityProvider.callCount).toEqual(1);
				const firstCall = fetchMock.lastCall('auth');
				// eslint-disable-next-line
				expect(firstCall).not.toBeUndefined();
				expect(getSecurityHeader(firstCall)).toEqual(defaultSecurityCode);
				const secondCall = fetchMock.lastCall('auth2');
				// eslint-disable-next-line
				expect(secondCall).not.toBeUndefined();
				expect(getSecurityHeader(secondCall)).toEqual(666);

				checkOrder([...providerData1], emojiResponse.emojis);
			});
		});

		it('401 error twice retry', () => {
			const refreshedSecurityProvider = sinon.stub();
			refreshedSecurityProvider.returns(Promise.resolve(header(666)));

			const provider401 = {
				...provider1,
				refreshedSecurityProvider,
			};

			const provider401Matcher = {
				name: 'authonce',
				matcher: `begin:${provider1.url}`,
			};

			fetchMock.mock({
				...provider401Matcher,
				response: 401,
			});

			const resource = new EmojiLoader(provider401);
			return resource
				.loadEmoji()
				.then(() => {
					expect(true).toBeFalsy();
				})
				.catch((err) => {
					expect(err.code).toEqual(401);
				});
		});

		describe('promise caching', () => {
			// The promise cache is module-level and persists across tests, so each test uses a
			// unique URL to avoid cross-test pollution.
			beforeEach(() => {
				mockIsTestEnvironment.mockReturnValue(false);
			});

			it('reuses the same promise for loaders sharing the same config url', async () => {
				const url = 'https://cache-shared/';
				fetchMock.mock({
					matcher: `begin:${url}`,
					response: fetchResponse(providerData1),
				});

				const first = new EmojiLoader({ ...provider1, url }).loadEmoji();
				const second = new EmojiLoader({ ...provider1, url }).loadEmoji();

				expect(second).toBe(first);
				const [firstResponse] = await Promise.all([first, second]);
				checkOrder(providerData1, firstResponse.emojis);
				expect(fetchMock.calls(`begin:${url}`)).toHaveLength(1);
			});

			it('does not cache a rejected promise so retries can refetch', async () => {
				const url = 'https://cache-reject/';
				fetchMock.mock({ matcher: `begin:${url}`, response: 500, repeat: 1 });
				fetchMock.mock({
					matcher: `begin:${url}`,
					response: fetchResponse(providerData1),
					overwriteRoutes: false,
				});

				await expect(new EmojiLoader({ ...provider1, url }).loadEmoji()).rejects.toBeDefined();

				const retryResponse = await new EmojiLoader({ ...provider1, url }).loadEmoji();
				checkOrder(providerData1, retryResponse.emojis);
				expect(fetchMock.calls(`begin:${url}`)).toHaveLength(2);
			});

			it('does not cache in a test environment, so each loader refetches', async () => {
				mockIsTestEnvironment.mockReturnValue(true);

				const url = 'https://cache-disabled-in-tests/';
				fetchMock.mock({
					matcher: `begin:${url}`,
					response: fetchResponse(providerData1),
				});

				const first = new EmojiLoader({ ...provider1, url }).loadEmoji();
				const second = new EmojiLoader({ ...provider1, url }).loadEmoji();

				expect(second).not.toBe(first);
				await Promise.all([first, second]);
				expect(fetchMock.calls(`begin:${url}`)).toHaveLength(2);
			});
		});
	});
});
