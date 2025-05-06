import { UFOExperience } from '@atlaskit/ufo';

import {
	type HttpError,
	isAuthError,
	isErrorStatusCode,
	isNetworkError,
	StatusCode,
} from '../error';

import { createErrorMetadata, isIgnoredError } from './utils';

export class TeamsUFOExperience extends UFOExperience {
	abortWithError(error: Error | HttpError, reason: string): Promise<boolean | null> {
		return super.abort({
			metadata: {
				error: createErrorMetadata(error),
				reason,
			},
		});
	}
	failWithError(error: Error | HttpError | unknown): Promise<boolean | null> {
		if (error instanceof Error) {
			if (isAuthError(error)) {
				return this.abortWithError(error, 'Abort due to user unauthenticated');
			}

			if (isErrorStatusCode(StatusCode.GONE, error)) {
				return this.abortWithError(error, 'Abort due to unavailable resource');
			}

			if (isIgnoredError(error)) {
				return this.abortWithError(error, 'Abort due to an error in ignore list');
			}

			if (isNetworkError(error)) {
				return this.abortWithError(error, 'Abort due to network error');
			}
			return super.failure({
				metadata: {
					error: createErrorMetadata(error),
					packageVersion: process.env._PACKAGE_VERSION_,
					packageName: process.env._PACKAGE_NAME_,
				},
			});
		}

		return super.failure({
			metadata: {
				error: 'unknown error',
				packageVersion: process.env._PACKAGE_VERSION_,
				packageName: process.env._PACKAGE_NAME_,
			},
		});
	}
}
