import { type Auth, type AuthContext, type AuthProvider } from '@atlaskit/media-core';
import { fg } from '@atlaskit/platform-feature-flags';
import { MediaStoreError } from './error';
import { rejectTimeout } from '../../utils/setTimeoutPromise';
import { globalMediaEventEmitter } from '../../globalMediaEventEmitter';

export const DEFAULT_AUTH_PROVIDER_TIMEOUT = 10000;

export const resolveAuth = async (
	authProvider: AuthProvider,
	authContext?: AuthContext,
	authProviderTimeout = DEFAULT_AUTH_PROVIDER_TIMEOUT,
): Promise<Auth> => {
	const startTime = performance.now();
	let eventEmitted = false;

	// Feature flag: wrap authProvider with analytics event emission
	const authProviderPromise = fg('platform_media_auth_provider_analytics')
		? authProvider(authContext)
				.then((result) => {
					const durationMs = performance.now() - startTime;
					if (!eventEmitted) {
						eventEmitted = true;
						globalMediaEventEmitter.emit('auth-provider-succeeded', {
							durationMs,
							timeoutMs: authProviderTimeout,
							authContext,
						});
					} else {
						// Timeout already fired - auth arrived too late
						const timeoutError = new MediaStoreError('authProviderTimedOut');
						globalMediaEventEmitter.emit('auth-provider-failed', {
							durationMs,
							timeoutMs: authProviderTimeout,
							authContext,
							error: timeoutError,
						});
					}
					return result;
				})
				.catch((error) => {
					const durationMs = performance.now() - startTime;
					eventEmitted = true;
					globalMediaEventEmitter.emit('auth-provider-failed', {
						durationMs,
						timeoutMs: authProviderTimeout,
						authContext,
						error,
					});
					throw error;
				})
		: authProvider(authContext); // Original behavior when FG off

	let auth: Auth | undefined;
	try {
		auth = await Promise.race([
			authProviderPromise,
			rejectTimeout(authProviderTimeout, new MediaStoreError('authProviderTimedOut')),
		]);
	} catch (err) {
		// Mark as emitted so late arrivals are handled correctly by .then()/.catch()
		if (!eventEmitted && fg('platform_media_auth_provider_analytics')) {
			eventEmitted = true;
		}
		// PRESERVE ORIGINAL ERROR HANDLING
		if (err instanceof MediaStoreError) {
			throw err;
		}
		throw new MediaStoreError('failedAuthProvider', err instanceof Error ? err : undefined);
	}

	if (!auth) {
		throw new MediaStoreError('emptyAuth');
	}

	/*
    We added a token expiration check here in the past, and then we had to revert due to edge cases in the client that we can't control.
    Token expiration check in the frontend is a bad idea. Don't do it!
    More info:
    https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13080
    https://gist.github.com/timvisee/fcda9bbdff88d45cc9061606b4b923ca
  */

	return auth;
};

export const resolveInitialAuth = (auth?: Auth) => {
	if (!auth) {
		throw new MediaStoreError('missingInitialAuth');
	}
	return auth;
};
