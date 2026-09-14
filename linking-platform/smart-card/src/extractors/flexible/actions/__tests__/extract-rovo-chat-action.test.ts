import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { CardAction } from '../../../../constants';
import { TEST_DOCUMENT, TEST_RESOLVED_META_DATA } from '../../../common/__mocks__/jsonld';
import extractRovoChatAction from '../extract-rovo-chat-action';

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure', () => ({
	expValEqualsNoExposure: jest.fn(() => false),
}));

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
	const rovoConfig = { rovoOptions: { isRovoEnabled: true, isRovoLLMEnabled: true } };
	const actionOptions = { hide: false, rovoChatAction: { optIn: true } };

	it('returns undefined when rovo chat is not available', () => {
		const action = extractRovoChatAction({ actionOptions, response });

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
