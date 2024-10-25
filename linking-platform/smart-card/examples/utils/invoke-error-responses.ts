import type { MockResponseObject } from 'fetch-mock/types';

import { SmartLinkActionType } from '@atlaskit/linking-types';

export const mockLoadFailedResponse = 400;

export const mockUpdateFailedResponse = 500;

export const mockNoDataResponse = {
	transitions: [{ id: '3', name: 'To Do', appearance: 'default' }],
};

export const mockSuccessfulLoadResponse = {
	transitions: [
		{ id: '3', name: 'To Do', appearance: 'default' },
		{ id: '4', name: 'In Progress', appearance: 'default' },
	],
};

const errorResponse = {
	error: {
		message: 'Field Labels is required.',
		status: 400,
		title: 'JiraObjectProvider.JiraCustomError',
	},
};

export const mockUpdateCustomErrorResponse = new Response(
	new Blob([JSON.stringify(errorResponse)], {
		type: 'application/json',
	}),
	{ status: 400 },
);

export const getFetchMockInvokeOptions = (getResponse: any, updateResponse?: any) => ({
	matcher: '/gateway/api/object-resolver/invoke ',
	method: 'POST',
	name: 'invoke',
	overwriteRoutes: true,
	response: (url: string, options: MockResponseObject) => {
		const body = JSON.parse((options?.body as string) ?? '{}');
		switch (body.action.actionType) {
			case SmartLinkActionType.GetStatusTransitionsAction:
				return getResponse;
			case SmartLinkActionType.StatusUpdateAction:
				return updateResponse;
			default:
				return 200;
		}
	},
});
