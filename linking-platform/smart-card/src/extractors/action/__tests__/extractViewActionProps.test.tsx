import { CardAction } from '../../../index';
import { mockAnalytics } from '../../../utils/mocks';
import { TEST_RESPONSE, TEST_RESPONSE_WITH_VIEW } from '../../common/__mocks__/jsonld';
import { extractViewActionProps } from '../extractViewActionProps';

describe('extractViewActionProps', () => {
	it('returns view action', async () => {
		const action = extractViewActionProps({
			response: TEST_RESPONSE_WITH_VIEW,
			analytics: mockAnalytics,
			extensionKey: 'mock-extension-key',
			source: 'block' as const,
		});

		expect(action).toEqual({
			actionFn: expect.any(Function),
			actionType: 'ViewAction',
			display: 'block',
			extensionKey: 'mock-extension-key',
		});
	});

	it('should not return view action if excluded', () => {
		const action = extractViewActionProps({
			response: TEST_RESPONSE_WITH_VIEW,
			analytics: mockAnalytics,
			extensionKey: 'mock-extension-key',
			source: 'block' as const,
			actionOptions: {
				hide: false,
				exclude: [CardAction.ViewAction],
			},
		});

		expect(action).toEqual(undefined);
	});

	it('should not return view action if not in jsonld', () => {
		const action = extractViewActionProps({
			response: TEST_RESPONSE,
			analytics: mockAnalytics,
			extensionKey: 'mock-extension-key',
			source: 'block' as const,
		});

		expect(action).toEqual(undefined);
	});
});
