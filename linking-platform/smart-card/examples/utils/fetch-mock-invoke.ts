import fetchMock from 'fetch-mock/cjs/client';
import type { MockResponseObject, MockRequest } from 'fetch-mock/types';
import { SmartLinkActionType } from '@atlaskit/linking-types';

const params =
	typeof URLSearchParams !== 'undefined' ? new URLSearchParams(location.search.slice(1)) : null;
const delay = params ? params.get('delay') : 0;
const scroll = params ? params.get('scroll') : false;

const mockActionTypes = [
	SmartLinkActionType.GetStatusTransitionsAction,
	SmartLinkActionType.StatusUpdateAction,
];

fetchMock.mock({
	delay, // delay for snapshot
	matcher: (url: string, options: MockRequest) => {
		try {
			if (url.endsWith('/gateway/api/object-resolver/invoke')) {
				const body = JSON.parse((options?.body as string) ?? '{}');
				const actionType = body?.action?.actionType;
				const resourceIdentifier = body?.action?.resourceIdentifiers;

				return (
					resourceIdentifier.hostname === 'some-hostname' && mockActionTypes.includes(actionType)
				);
			}
		} catch (error) {
			console.log('Error:', error);
		}
		return false;
	},
	method: 'POST',
	name: 'invoke',
	overwriteRoutes: true,
	response: (url: string, options: MockResponseObject) => {
		const body = JSON.parse((options?.body as string) ?? '{}');
		switch (body.action.actionType) {
			case SmartLinkActionType.GetStatusTransitionsAction:
				const transitions = [
					{ id: '1', name: 'In Progress', appearance: 'inprogress' },
					{ id: '2', name: 'Done', appearance: 'success' },
					{ id: '3', name: 'To Do', appearance: 'default' },
					{ id: '4', name: 'Explore' },
					{ id: '5', name: 'In Review', appearance: 'inprogress' },
				];

				return {
					transitions: scroll ? [...transitions, ...transitions, ...transitions] : transitions,
				};
			case SmartLinkActionType.StatusUpdateAction:
				return 204;
			default:
				return 200;
		}
	},
});
