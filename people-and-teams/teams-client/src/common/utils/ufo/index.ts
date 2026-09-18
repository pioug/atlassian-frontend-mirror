import { UFOExperience } from '@atlaskit/ufo/experience';

import { StatusCode } from '../error';
import type { HttpError } from '../error/HttpError';
import { isAuthError } from '../error/isAuthError';
import { isErrorStatusCode } from '../error/isErrorStatusCode';
import { isNetworkError } from '../error/isNetworkError';
import { createErrorMetadata } from './createErrorMetadata';
import { isIgnoredError } from './isIgnoredError';

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
