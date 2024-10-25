import { type ErrorResponse, type SuccessResponse } from '@atlaskit/link-provider';

import { mocks } from '../../../../utils/mocks';

export const mockSuccessResponse: SuccessResponse = {
	status: 200,
	body: mocks.success,
};

export const mockForbiddenResponse: SuccessResponse = {
	status: 403,
	body: mocks.forbidden,
};

export const mockNotFoundResponse: SuccessResponse = {
	status: 404,
	body: mocks.notFound,
};

export const mockUnAuthResponse: SuccessResponse = {
	status: 401,
	body: mocks.unauthorized,
};

export const mockErrorResponse: ErrorResponse = {
	status: 400,
	error: {
		type: 'ResolveUnsupportedError',
		message: 'Error: Something went wrong',
		status: 400,
	},
};
