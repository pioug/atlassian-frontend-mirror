import { CardAction } from '../../../index';
import { mockAnalytics } from '../../../utils/mocks';
import { TEST_RESPONSE, TEST_RESPONSE_WITH_PREVIEW } from '../../common/__mocks__/jsonld';
import { extractPreviewActionProps } from '../extractPreviewActionProps';

describe('extractPreviewActionProps', () => {
	it('returns preview action', async () => {
		const action = extractPreviewActionProps({
			response: TEST_RESPONSE_WITH_PREVIEW,
			analytics: mockAnalytics,
			extensionKey: 'mock-extension-key',
			source: 'block' as const,
		});

		expect(action).toEqual({
			actionFn: expect.any(Function),
			actionType: 'PreviewAction',
			display: 'block',
			extensionKey: 'mock-extension-key',
		});
	});

	it('should not return preview action if excluded', () => {
		const action = extractPreviewActionProps({
			response: TEST_RESPONSE_WITH_PREVIEW,
			analytics: mockAnalytics,
			extensionKey: 'mock-extension-key',
			source: 'block' as const,
			actionOptions: {
				hide: false,
				exclude: [CardAction.PreviewAction],
			},
		});

		expect(action).toEqual(undefined);
	});

	it('should not return preview action if not in jsonld', () => {
		const action = extractPreviewActionProps({
			response: TEST_RESPONSE,
			analytics: mockAnalytics,
			extensionKey: 'mock-extension-key',
			source: 'block' as const,
		});

		expect(action).toEqual(undefined);
	});
});
