import type { JsonLd } from '@atlaskit/json-ld-types';

import {
	TEST_DOCUMENT,
	TEST_RESOLVED_META_DATA,
	TEST_RESPONSE,
} from '../../../common/__mocks__/jsonld.ts';
import extractRovoChatAction from '../extract-rovo-chat-action.ts';

describe('extractRovoChatAction', () => {
	const response: JsonLd.Response = {
		data: TEST_DOCUMENT,
		meta: {
			...TEST_RESOLVED_META_DATA,
			key: 'google-object-provider',
		},
	};
	const rovoConfig = { isRovoEnabled: true, isRovoLLMEnabled: true };
	const actionOptions = { hide: false, rovoChatAction: { optIn: true } };

	it('returns Rovo Chat action', () => {
		const action = extractRovoChatAction(response, rovoConfig, actionOptions);

		expect(action).toBe(true);
	});

	it('returns undefined when rovo chat is not available', () => {
		const action = extractRovoChatAction(response, undefined, actionOptions);

		expect(action).toBeUndefined();
	});

	it('returns undefined if feature is not supported by provider', () => {
		const action = extractRovoChatAction(TEST_RESPONSE, rovoConfig, actionOptions);

		expect(action).toBeUndefined();
	});

	it('returns undefined if action is not opt-in', () => {
		const action = extractRovoChatAction(response, rovoConfig, undefined);

		expect(action).toBeUndefined();
	});
});
