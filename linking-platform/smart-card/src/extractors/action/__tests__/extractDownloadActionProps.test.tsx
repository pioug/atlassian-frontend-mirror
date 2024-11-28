import { CardAction } from '../../../index';
import { mockAnalytics } from '../../../utils/mocks';
import { TEST_RESPONSE, TEST_RESPONSE_WITH_DOWNLOAD } from '../../common/__mocks__/jsonld';
import { extractDownloadActionProps } from '../extractDownloadActionProps';

describe('extractDownloadActionProps', () => {
	it('returns download action', async () => {
		const action = extractDownloadActionProps({
			response: TEST_RESPONSE_WITH_DOWNLOAD,
			analytics: mockAnalytics,
			extensionKey: 'mock-extension-key',
			source: 'block' as const,
		});

		expect(action).toEqual({
			actionFn: expect.any(Function),
			actionType: 'DownloadAction',
			display: 'block',
			extensionKey: 'mock-extension-key',
		});
	});

	it('should not return download action if excluded', () => {
		const action = extractDownloadActionProps({
			response: TEST_RESPONSE_WITH_DOWNLOAD,
			analytics: mockAnalytics,
			extensionKey: 'mock-extension-key',
			source: 'block' as const,
			actionOptions: {
				hide: false,
				exclude: [CardAction.DownloadAction],
			},
		});

		expect(action).toEqual(undefined);
	});

	it('should not return download action if not in jsonld', () => {
		const action = extractDownloadActionProps({
			response: TEST_RESPONSE,
			analytics: mockAnalytics,
			extensionKey: 'mock-extension-key',
			source: 'block' as const,
		});

		expect(action).toEqual(undefined);
	});
});
