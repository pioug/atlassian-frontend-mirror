import { SmartLinkActionType } from '@atlaskit/linking-types/smart-link-actions';
import createStatusUpdateRequest from '../create-status-update-request';

describe('createStatusUpdateRequest', () => {
	it('constructs action request from lozenge action item', () => {
		const id = 'some-id';
		const partialRequest = {
			action: {
				actionType: SmartLinkActionType.StatusUpdateAction,
				resourceIdentifiers: {
					issueKey: 'issue-id',
					hostname: 'some-hostname',
				},
			},
			details: {
				url: 'some-url',
				id: 'some-id',
			},
			providerKey: 'object-provider',
		};
		const request = createStatusUpdateRequest(partialRequest, id);

		expect(request).toEqual({
			action: {
				actionType: SmartLinkActionType.StatusUpdateAction,
				payload: {
					newStatusId: id,
				},
				resourceIdentifiers: {
					issueKey: 'issue-id',
					hostname: 'some-hostname',
				},
			},
			providerKey: 'object-provider',
		});
	});
});
