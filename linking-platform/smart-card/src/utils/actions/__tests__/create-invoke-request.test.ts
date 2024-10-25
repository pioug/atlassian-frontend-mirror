import { SmartLinkActionType } from '@atlaskit/linking-types/smart-link-actions';

import createInvokeRequest from '../create-invoke-request';

describe('createInvokeRequest', () => {
	const action = {
		action: {
			actionType: SmartLinkActionType.FollowEntityAction,
			resourceIdentifiers: {
				prop1: 'prop-1',
				prop2: 'prop-2',
			},
		},
		providerKey: 'object-provider',
		reload: { url: 'some-url', id: 'some-id' },
		random: 'random-prop',
	};

	it('constructs action request', () => {
		const request = createInvokeRequest(action);

		expect(request).toEqual({
			action: {
				actionType: SmartLinkActionType.FollowEntityAction,
				resourceIdentifiers: {
					prop1: 'prop-1',
					prop2: 'prop-2',
				},
			},
			providerKey: 'object-provider',
		});
	});

	it('constructs action request with payload', () => {
		const payload = { id: 'some-id' };
		const request = createInvokeRequest(action, payload);

		expect(request).toEqual({
			action: {
				actionType: SmartLinkActionType.FollowEntityAction,
				payload,
				resourceIdentifiers: {
					prop1: 'prop-1',
					prop2: 'prop-2',
				},
			},
			providerKey: 'object-provider',
		});
	});
});
