import { ActionName, CardAction } from '../../../index';
import * as utils from '../../../view/EmbedModal/utils';
import {
	PREVIEW,
	TEST_DOCUMENT,
	TEST_DOCUMENT_WITH_ARI,
	TEST_RESPONSE,
	TEST_RESPONSE_WITH_PREVIEW,
	TEST_RESPONSE_WITH_PREVIEW_AND_DOWNLOAD,
	TEST_URL,
} from '../../common/__mocks__/jsonld';
import { extractInvokePreviewAction } from '../extract-invoke-preview-action';

// Mock the expValEquals function
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

// Create a test response with preview and ARI which is needed for testing preview panel params
const TEST_RESPONSE_WITH_PREVIEW_AND_ARI = {
	...TEST_RESPONSE_WITH_PREVIEW,
	data: {
		...TEST_DOCUMENT_WITH_ARI,
		preview: PREVIEW,
	},
};

describe('extractInvokePreviewAction', () => {
	beforeEach(() => {
		// Reset the mock to default behavior (experiment disabled)
		const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
		expValEquals.mockReturnValue(false);
	});

	it('returns preview action', async () => {
		const action = extractInvokePreviewAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_PREVIEW,
		});

		expect(action).toEqual({
			invokeAction: {
				actionFn: expect.any(Function),
				actionSubjectId: 'invokePreviewScreen',
				actionType: ActionName.PreviewAction,
				display: 'block',
				extensionKey: 'object-provider',
				id: 'test-id',
			},
			hasPreviewPanel: false,
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
		await action?.invokeAction.actionFn();

		expect(openEmbedModal).toHaveBeenCalledWith({
			extensionKey: 'object-provider',
			fireEvent,
			id: 'test-id',
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

	it('should return preview action with preview panel when available', async () => {
		// Enable the experiment for this test
		const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
		expValEquals.mockReturnValue(true);

		const mockOpenPreviewPanel = jest.fn();
		const mockIsPreviewPanelAvailable = jest.fn().mockReturnValue(true);

		const action = extractInvokePreviewAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_PREVIEW_AND_ARI,
			isPreviewPanelAvailable: mockIsPreviewPanelAvailable,
			openPreviewPanel: mockOpenPreviewPanel,
		});

		expect(action).toEqual({
			invokeAction: {
				actionFn: expect.any(Function),
				actionSubjectId: 'invokePreviewScreen',
				actionType: ActionName.PreviewAction,
				display: 'block',
				extensionKey: 'object-provider',
				id: 'test-id',
			},
			hasPreviewPanel: true,
		});

		await action?.invokeAction.actionFn();
		expect(mockOpenPreviewPanel).toHaveBeenCalledWith({
			ari: expect.any(String),
			url: TEST_URL,
			name: 'my name',
			iconUrl: undefined,
		});
	});

	it('should display embed modal preview when preview panel is not available', async () => {
		const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);
		const mockIsPreviewPanelAvailable = jest.fn().mockReturnValue(false);

		const action = extractInvokePreviewAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_PREVIEW,
			isPreviewPanelAvailable: mockIsPreviewPanelAvailable,
			openPreviewPanel: undefined,
		});

		expect(action?.hasPreviewPanel).toBe(false);
		await action?.invokeAction.actionFn();
		expect(openEmbedModal).toHaveBeenCalled();
	});

	it('should fall back to embed modal when preview panel params are incomplete', async () => {
		const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);
		const mockIsPreviewPanelAvailable = jest.fn().mockReturnValue(true);
		const mockOpenPreviewPanel = jest.fn();

		const modifiedResponse = {
			...TEST_RESPONSE_WITH_PREVIEW,
			data: {
				...TEST_DOCUMENT,
				url: undefined,
				preview: PREVIEW,
			},
		};

		const action = extractInvokePreviewAction({
			appearance: 'block',
			id: 'test-id',
			response: modifiedResponse,
			isPreviewPanelAvailable: mockIsPreviewPanelAvailable,
			openPreviewPanel: mockOpenPreviewPanel,
		});

		expect(action?.hasPreviewPanel).toBe(false);
		await action?.invokeAction.actionFn();
		expect(openEmbedModal).toHaveBeenCalled();
	});
});
