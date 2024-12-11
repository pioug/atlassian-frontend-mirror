import userEvent from '@testing-library/user-event';

import { ActionName, CardAction } from '../../../index';
import { TEST_RESPONSE, TEST_URL } from '../../common/__mocks__/jsonld';
import { extractInvokeCopyLinkAction } from '../extract-invoke-copy-link-action';

describe('extractInvokeCopyLinkAction', () => {
	it('returns view action', async () => {
		const action = extractInvokeCopyLinkAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE,
		});

		expect(action).toEqual({
			actionFn: expect.any(Function),
			actionSubjectId: 'copyLink',
			actionType: ActionName.CopyLinkAction,
			display: 'block',
			extensionKey: 'object-provider',
			id: 'test-id',
		});
	});

	it('triggers copy url to clipboard', async () => {
		userEvent.setup();
		const action = extractInvokeCopyLinkAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE,
		});

		await action?.actionFn();

		const clipboardText = await navigator.clipboard.readText();
		expect(clipboardText).toBe(TEST_URL);
	});

	it('should not return view action if excluded', () => {
		const action = extractInvokeCopyLinkAction({
			actionOptions: {
				hide: false,
				exclude: [CardAction.CopyLinkAction],
			},
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE,
		});

		expect(action).toBeUndefined();
	});
});
