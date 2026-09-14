// See Sentry accepted options in here https://docs.sentry.io/error-reporting/configuration/?platform=javascript

import { logException } from './logException';
import { type CreateErrorHandler } from './types';

export const createErrorHandler: CreateErrorHandler = (details) => {
	return (error, message, tags = {}) => {
		logException(error, message, {
			tags: {
				...details,
				...tags,
			},
		});
	};
};
