import type { JsonLd } from '@atlaskit/json-ld-types';

import { CardAction } from '../../../../view/Card/types';
import {
	TEST_DOCUMENT,
	TEST_RESOLVED_META_DATA,
	TEST_RESPONSE,
} from '../../../common/__mocks__/jsonld';
import extractRovoChatAction from '../extract-rovo-chat-action';

describe('extractRovoChatAction', () => {
	const response: JsonLd.Response = {
		data: TEST_DOCUMENT,
		meta: {
			...TEST_RESOLVED_META_DATA,
			definitionId: 'd1',
			key: 'google-object-provider',
			resourceType: 'r1',
		},
	};
	const rovoConfig = { isRovoEnabled: true, isRovoLLMEnabled: true };
	const actionOptions = { hide: false, rovoChatAction: { optIn: true } };

	it('returns Rovo Chat action', () => {
		const action = extractRovoChatAction({
			actionOptions,
			appearance: 'hoverCardPreview',
			product: 'JSM',
			id: 'uid',
			response,
			rovoConfig,
		});

		expect(action).toEqual({
			invokeAction: {
				actionSubjectId: 'rovoChatPrompt',
				actionType: 'RovoChatAction',
				definitionId: 'd1',
				display: 'hoverCardPreview',
				extensionKey: 'google-object-provider',
				id: 'uid',
				resourceType: 'r1',
			},
			product: 'JSM',
			url: 'https://my.url.com',
		});
	});

	it('returns undefined when rovo chat is not available', () => {
		const action = extractRovoChatAction({ actionOptions, response });

		expect(action).toBeUndefined();
	});

	it('returns undefined if feature is not supported by provider', () => {
		const action = extractRovoChatAction({ actionOptions, response: TEST_RESPONSE, rovoConfig });

		expect(action).toBeUndefined();
	});

	it('returns undefined if action is not opt-in', () => {
		const action = extractRovoChatAction({ response, rovoConfig });

		expect(action).toBeUndefined();
	});

	it('returns undefined if actionOptions is set to hide all', () => {
		const action = extractRovoChatAction({ actionOptions: { hide: true }, response, rovoConfig });

		expect(action).toBeUndefined();
	});

	it('returns undefined if excluded in actionOptions', () => {
		const action = extractRovoChatAction({
			actionOptions: { hide: false, exclude: [CardAction.RovoChatAction] },
			response,
			rovoConfig,
		});

		expect(action).toBeUndefined();
	});
});
