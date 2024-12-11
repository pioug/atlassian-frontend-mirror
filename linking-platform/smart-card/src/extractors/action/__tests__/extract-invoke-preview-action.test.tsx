import { ActionName, CardAction } from '../../../index';
import * as utils from '../../../view/EmbedModal/utils';
import {
	TEST_RESPONSE,
	TEST_RESPONSE_WITH_PREVIEW,
	TEST_RESPONSE_WITH_PREVIEW_AND_DOWNLOAD,
	TEST_URL,
} from '../../common/__mocks__/jsonld';
import { extractInvokePreviewAction } from '../extract-invoke-preview-action';

describe('extractInvokePreviewAction', () => {
	it('returns preview action', async () => {
		const action = extractInvokePreviewAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_PREVIEW,
		});

		expect(action).toEqual({
			actionFn: expect.any(Function),
			actionSubjectId: 'invokePreviewScreen',
			actionType: ActionName.PreviewAction,
			display: 'block',
			extensionKey: 'object-provider',
			id: 'test-id',
		});
	});

	it('triggers open embed modal', async () => {
		const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);
		const fireEvent = jest.fn();

		const action = extractInvokePreviewAction({
			appearance: 'block',
			fireEvent,
			id: 'test-id',
			origin: 'smartLinkCard',
			response: TEST_RESPONSE_WITH_PREVIEW_AND_DOWNLOAD,
		});
		await action?.actionFn();

		expect(openEmbedModal).toHaveBeenCalledWith({
			fireEvent,
			invokeDownloadAction: {
				actionFn: expect.any(Function),
				actionSubjectId: 'downloadDocument',
				actionType: ActionName.DownloadAction,
				display: 'block',
				extensionKey: 'object-provider',
				id: 'test-id',
			},
			invokeViewAction: {
				actionFn: expect.any(Function),
				actionSubjectId: 'shortcutGoToLink',
				actionType: 'ViewAction',
				display: 'block',
				extensionKey: 'object-provider',
				id: 'test-id',
			},
			isSupportTheming: false,
			isTrusted: true,
			linkIcon: {
				label: 'my name',
				url: TEST_URL,
			},
			origin: 'smartLinkCard',
			src: TEST_URL,
			title: 'my name',
			url: TEST_URL,
		});
	});

	it('does not return preview action if excluded', () => {
		const action = extractInvokePreviewAction({
			actionOptions: {
				hide: false,
				exclude: [CardAction.PreviewAction],
			},
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_PREVIEW,
		});

		expect(action).toBeUndefined();
	});

	it('should not return preview action if not in jsonld', () => {
		const action = extractInvokePreviewAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE,
		});

		expect(action).toBeUndefined();
	});
});
