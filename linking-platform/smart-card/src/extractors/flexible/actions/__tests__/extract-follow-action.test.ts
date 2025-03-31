import { type JsonLd } from '@atlaskit/json-ld-types';
import { SmartLinkActionType } from '@atlaskit/linking-types';

import {
	TEST_DOCUMENT,
	TEST_FOLLOW_ACTION,
	TEST_RESOLVED_META_DATA,
	TEST_STATUS_UPDATE_ACTION,
	TEST_UNFOLLOW_ACTION,
} from '../../../common/__mocks__/jsonld';
import extractFollowAction from '../extract-follow-action';

describe('extractFollowAction', () => {
	const id = 'some-id';

	const generateResponse = (actions: JsonLd.Data.BaseData['atlassian:serverAction'] = []) => ({
		data: {
			...TEST_DOCUMENT,
			'atlassian:serverAction': actions,
		},
		meta: TEST_RESOLVED_META_DATA,
	});

	it('returns follow action', () => {
		const response = generateResponse([TEST_FOLLOW_ACTION]);
		const action = extractFollowAction(response, { hide: false }, id);

		expect(action).toEqual({
			action: {
				action: {
					actionType: SmartLinkActionType.FollowEntityAction,
					resourceIdentifiers: {
						ari: 'some-resource-identifier',
					},
				},
				providerKey: 'object-provider',
				reload: {
					id: 'some-id',
					url: 'https://my.url.com',
				},
			},
			value: true,
			isProject: false,
		});
	});

	it('returns unfollow action', () => {
		const response = generateResponse([TEST_UNFOLLOW_ACTION]);
		const action = extractFollowAction(response, { hide: false }, id);

		expect(action).toEqual({
			action: {
				action: {
					actionType: SmartLinkActionType.UnfollowEntityAction,
					resourceIdentifiers: {
						ari: 'some-resource-identifier',
					},
				},
				providerKey: 'object-provider',
				reload: {
					id: 'some-id',
					url: 'https://my.url.com',
				},
			},
			value: false,
			isProject: false,
		});
	});

	it('returns only one action if both follow and unfollow action exist', () => {
		const response = generateResponse([TEST_FOLLOW_ACTION, TEST_UNFOLLOW_ACTION]);
		const action = extractFollowAction(response, { hide: false }, id);

		expect(action).toEqual({
			action: {
				action: {
					actionType: SmartLinkActionType.FollowEntityAction,
					resourceIdentifiers: {
						ari: 'some-resource-identifier',
					},
				},
				providerKey: 'object-provider',
				reload: {
					id: 'some-id',
					url: 'https://my.url.com',
				},
			},
			value: true,
			isProject: false,
		});
	});

	it('returns follow action if actionOptions is undefined', () => {
		const response = generateResponse([TEST_FOLLOW_ACTION]);
		const action = extractFollowAction(response, undefined, id);

		expect(action).toEqual({
			action: {
				action: {
					actionType: SmartLinkActionType.FollowEntityAction,
					resourceIdentifiers: {
						ari: 'some-resource-identifier',
					},
				},
				providerKey: 'object-provider',
				reload: {
					id: 'some-id',
					url: 'https://my.url.com',
				},
			},
			value: true,
			isProject: false,
		});
	});

	it('returns undefined when action options are hidden', () => {
		const response = generateResponse([TEST_FOLLOW_ACTION]);
		const action = extractFollowAction(response, { hide: true }, id);

		expect(action).toBeUndefined();
	});

	it('returns undefined without server actions', () => {
		const response = generateResponse();
		const action = extractFollowAction(response, { hide: false }, id);

		expect(action).toBeUndefined();
	});

	it('returns undefined without follow or unfollow server actions', () => {
		const response = generateResponse([TEST_STATUS_UPDATE_ACTION]);
		const action = extractFollowAction(response, { hide: false }, id);

		expect(action).toBeUndefined();
	});

	it('returns undefined without extension key', () => {
		const action = extractFollowAction({
			data: {
				...TEST_DOCUMENT,
				'atlassian:serverAction': [TEST_FOLLOW_ACTION],
				url: undefined,
			},
			meta: { ...TEST_RESOLVED_META_DATA, key: undefined },
		});

		expect(action).toBeUndefined();
	});

	it('returns undefined without resource identifiers', () => {
		const action = extractFollowAction({
			data: {
				...TEST_DOCUMENT,
				'atlassian:serverAction': [{ ...TEST_FOLLOW_ACTION, resourceIdentifiers: undefined }],
				url: undefined,
			},
			meta: TEST_RESOLVED_META_DATA,
		});

		expect(action).toBeUndefined();
	});

	it('does not return reload without url', () => {
		const followAction = extractFollowAction(
			{
				data: {
					...TEST_DOCUMENT,
					'atlassian:serverAction': [TEST_FOLLOW_ACTION],
					url: undefined,
				},
				meta: TEST_RESOLVED_META_DATA,
			},
			{ hide: false },
			id,
		);

		expect(followAction).not.toBeUndefined();
		expect(followAction?.action).not.toBeUndefined();
		expect(followAction?.action?.reload).toBeUndefined();
	});
});
