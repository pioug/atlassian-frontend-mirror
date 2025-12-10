import { resolveAuth, resolveInitialAuth } from '../../client/media-store/resolveAuth';
import { MediaStoreError } from '../../client/media-store/error';
import { type AsapBasedAuth, type AuthProvider } from '@atlaskit/media-core';
import { resolveTimeout } from '../../utils/setTimeoutPromise';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { globalMediaEventEmitter } from '../../globalMediaEventEmitter';

// expires in 1619827800000
const token =
	'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI3ZjQ0MDFkNi0wYWJlLTRiNzItYThjZC1iOTMyYzU0M2FlZDAiLCJhY2Nlc3MiOnsidXJuOmZpbGVzdG9yZTpmaWxlOmNhZmRjOTA2LWM3Y2MtNGFhZS1hYzljLTY5YzhlNGE1YTFjNCI6WyJkZWxldGUiLCJyZWFkIl0sInVybjpmaWxlc3RvcmU6Y2h1bms6KiI6WyJyZWFkIiwiY3JlYXRlIl19LCJuYmYiOjE0NDEzMzIwMDAsImV4cCI6MTYxOTgyNzgwMH0.Bdbpv-UAjV87_-yVaVYObdvFtrD1wl-oBXyk6QMMPmc';

const auth: AsapBasedAuth = {
	asapIssuer: 'some-issuer',
	token,
	baseUrl: 'some-url',
};

describe('resolveAuth', () => {
	it('should return resolved Auth from provider', async () => {
		const provider = async () => auth;
		expect(await resolveAuth(provider, {})).toBe(auth);
	});

	it('should throw failedAuthProvider error if provider rejects', async () => {
		const someError = new Error('some-error');
		const provider = () => Promise.reject(someError);
		try {
			await resolveAuth(provider);
		} catch (e) {
			expect(e).toBeInstanceOf(MediaStoreError);
			expect((e as MediaStoreError).reason).toBe('failedAuthProvider');
			expect((e as MediaStoreError).innerError).toBe(someError);
		}
		expect.assertions(3);
	});

	it('should throw authProviderTimedOut error if provider times out', async () => {
		const AUTH_PROVIDER_TIMEOUT = 1;
		const provider = () => resolveTimeout(AUTH_PROVIDER_TIMEOUT + 500, auth);

		try {
			await resolveAuth(provider, {}, AUTH_PROVIDER_TIMEOUT);
		} catch (e) {
			expect(e).toBeInstanceOf(MediaStoreError);
			expect((e as MediaStoreError).reason).toBe('authProviderTimedOut');
		}
		expect.assertions(2);
	});

	// This test is verifying if the consumer bypassed TS checks and managed to provide
	// an Auth provider that actually does not resolve an Auth object.
	it('should throw emptyAuth error if provider resolves undefined', async () => {
		const provider = (async () => {}) as unknown as AuthProvider;
		try {
			await resolveAuth(provider);
		} catch (e) {
			expect(e).toBeInstanceOf(MediaStoreError);
			expect((e as MediaStoreError).reason).toBe('emptyAuth');
		}
		expect.assertions(2);
	});
});

describe('resolveInitialAuth', () => {
	it(`should return the auth if it's defined`, () => {
		expect(resolveInitialAuth(auth)).toBe(auth);
	});

	it('should throw missingInitialAuth if the auth is undefined', () => {
		try {
			resolveInitialAuth();
		} catch (e) {
			expect(e).toBeInstanceOf(MediaStoreError);
			expect((e as MediaStoreError).reason).toBe('missingInitialAuth');
		}
		expect.assertions(2);
	});
});

describe('resolveAuth with globalMediaEventEmitter', () => {
	let emitSpy: jest.SpyInstance;

	beforeEach(() => {
		emitSpy = jest.spyOn(globalMediaEventEmitter, 'emit');
	});

	afterEach(() => {
		emitSpy.mockRestore();
	});

	ffTest.on(
		'platform_media_auth_provider_analytics',
		'when platform_media_auth_provider_analytics is enabled',
		() => {
			it('should emit auth-provider-succeeded event when auth resolves successfully', async () => {
				const provider = async () => auth;
				const authContext = { collectionName: 'test-collection' };

				await resolveAuth(provider, authContext, 10000);

				expect(emitSpy).toHaveBeenCalledTimes(1);
				expect(emitSpy).toHaveBeenCalledWith('auth-provider-succeeded', {
					durationMs: expect.any(Number),
					timeoutMs: 10000,
					authContext,
				});
			});

			it('should emit auth-provider-failed event when auth provider rejects', async () => {
				const someError = new Error('some-error');
				const provider = () => Promise.reject(someError);
				const authContext = { collectionName: 'test-collection' };

				try {
					await resolveAuth(provider, authContext, 10000);
				} catch (e) {
					// Expected error
				}

				expect(emitSpy).toHaveBeenCalledTimes(1);
				expect(emitSpy).toHaveBeenCalledWith('auth-provider-failed', {
					durationMs: expect.any(Number),
					timeoutMs: 10000,
					authContext,
					error: someError,
				});
			});

			it('should emit auth-provider-failed event for late arrival when auth provider times out', async () => {
				const AUTH_PROVIDER_TIMEOUT = 1;
				const provider = () => resolveTimeout(AUTH_PROVIDER_TIMEOUT + 50, auth);
				const authContext = { collectionName: 'test-collection' };

				try {
					await resolveAuth(provider, authContext, AUTH_PROVIDER_TIMEOUT);
				} catch (e) {
					// Expected error - timeout fires first
				}

				// Wait for the authProvider to complete (late arrival)
				await resolveTimeout(100, undefined);

				// Event emitted for the late arrival
				expect(emitSpy).toHaveBeenCalledTimes(1);
				expect(emitSpy).toHaveBeenCalledWith('auth-provider-failed', {
					durationMs: expect.any(Number),
					timeoutMs: AUTH_PROVIDER_TIMEOUT,
					authContext,
					error: expect.any(MediaStoreError),
				});
			});

			it('should emit auth-provider-failed event once for late failure after timeout', async () => {
				const AUTH_PROVIDER_TIMEOUT = 10;
				// Provider rejects after timeout
				const provider = () =>
					resolveTimeout(AUTH_PROVIDER_TIMEOUT + 50, undefined).then(() => {
						throw new Error('late-failure');
					});

				try {
					await resolveAuth(provider, {}, AUTH_PROVIDER_TIMEOUT);
				} catch (e) {
					// Expected error - timeout fires first
				}

				// Wait for the late failure to complete
				await resolveTimeout(100, undefined);

				// Event emitted once for the late failure
				expect(emitSpy).toHaveBeenCalledTimes(1);
				expect(emitSpy).toHaveBeenCalledWith(
					'auth-provider-failed',
					expect.objectContaining({
						durationMs: expect.any(Number),
						timeoutMs: AUTH_PROVIDER_TIMEOUT,
						error: expect.any(Error),
					}),
				);
			});
		},
	);

	ffTest.off(
		'platform_media_auth_provider_analytics',
		'when platform_media_auth_provider_analytics is disabled',
		() => {
			it('should not emit events when feature flag is off', async () => {
				const provider = async () => auth;
				await resolveAuth(provider, {}, 10000);

				expect(emitSpy).not.toHaveBeenCalled();
			});

			it('should not emit events when provider rejects and feature flag is off', async () => {
				const someError = new Error('some-error');
				const provider = () => Promise.reject(someError);

				try {
					await resolveAuth(provider, {}, 10000);
				} catch (e) {
					// Expected error
				}

				expect(emitSpy).not.toHaveBeenCalled();
			});
		},
	);
});
