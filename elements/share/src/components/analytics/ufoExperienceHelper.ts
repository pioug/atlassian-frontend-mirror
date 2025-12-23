import { type UFOExperience } from '@atlaskit/ufo';

const ignoredErrorStatusCode = [401, 403, 429];

export const isValidFailedExperience = (
	experience: UFOExperience,
	// the type for error is 'any' because consumers of the share config can pass in custom error objects
	error: any,
): void => {
	const errorStatusCode = error.code || error.status || error.statusCode;

	if (ignoredErrorStatusCode.includes(parseInt(errorStatusCode))) {
		experience.abort({
			metadata: {
				error,
			},
		});
		return;
	}

	experience.failure({ metadata: { error } });
};
