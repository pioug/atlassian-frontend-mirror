import { ActionName, CardAction } from '../../../index';
import { EmbedModalSize } from '../../../view/EmbedModal/types';
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

// Mock the fg function
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

// Mock the isModalWithinPreviewPanelIFrame function from our local utils
jest.mock('../../../utils/iframe-utils', () => ({
	...jest.requireActual('../../../utils/iframe-utils'),
	isModalWithinPreviewPanelIFrame: jest.fn(),
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
		// Reset the mocks to default behavior
		const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
		const { fg } = require('@atlaskit/platform-feature-flags');
		const { isModalWithinPreviewPanelIFrame } = require('../../../utils/iframe-utils');

		expValEquals.mockReturnValue(false);
		fg.mockReturnValue(false);
		isModalWithinPreviewPanelIFrame.mockReturnValue(false);
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

	it('triggers open embed modal with size with feature flag enabled', async () => {
		const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);
		const fireEvent = jest.fn();

		const { fg } = require('@atlaskit/platform-feature-flags');
		fg.mockReturnValue(true);

		const action = extractInvokePreviewAction({
			appearance: 'block',
			fireEvent,
			id: 'test-id',
			origin: 'smartLinkCard',
			response: TEST_RESPONSE_WITH_PREVIEW_AND_DOWNLOAD,
			actionOptions: {
				previewAction: {
					size: EmbedModalSize.Small,
				},
				hide: false,
			},
		});
		await action?.invokeAction.actionFn();

		expect(openEmbedModal).toHaveBeenCalledWith({
			size: EmbedModalSize.Small,
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
			panelData: { embedUrl: 'https://my.url.com' },
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

	it('should include isInPreviewPanel when experiment is enabled and within preview panel', async () => {
		// Enable the experiment for this test
		const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
		const { isModalWithinPreviewPanelIFrame } = require('../../../utils/iframe-utils');
		expValEquals.mockReturnValue(true);
		isModalWithinPreviewPanelIFrame.mockReturnValue(true);

		const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);

		const action = extractInvokePreviewAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_PREVIEW,
		});

		await action?.invokeAction.actionFn();

		expect(openEmbedModal).toHaveBeenCalledWith(
			expect.objectContaining({
				isInPreviewPanel: true,
			}),
		);
	});

	it('should not include isInPreviewPanel when experiment is disabled', async () => {
		// Ensure experiment is disabled
		const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
		expValEquals.mockReturnValue(false);

		const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);

		const action = extractInvokePreviewAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_PREVIEW,
		});

		await action?.invokeAction.actionFn();

		expect(openEmbedModal).toHaveBeenCalledWith(
			expect.not.objectContaining({
				isInPreviewPanel: expect.anything(),
			}),
		);
	});

	it('should set isInPreviewPanel to false when not within preview panel', async () => {
		// Enable the experiment for this test
		const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
		const { isModalWithinPreviewPanelIFrame } = require('../../../utils/iframe-utils');
		expValEquals.mockReturnValue(true);
		isModalWithinPreviewPanelIFrame.mockReturnValue(false);

		const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);

		const action = extractInvokePreviewAction({
			appearance: 'block',
			id: 'test-id',
			response: TEST_RESPONSE_WITH_PREVIEW,
		});

		await action?.invokeAction.actionFn();

		expect(openEmbedModal).toHaveBeenCalledWith(
			expect.objectContaining({
				isInPreviewPanel: false,
			}),
		);
	});

	describe('Analytics tracking for preview actions', () => {
		it('should fire analytics event when preview panel is used with correct conditions', async () => {
			// Enable the experiment for this test
			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			expValEquals.mockReturnValue(true);

			const fireEvent = jest.fn();
			const mockOpenPreviewPanel = jest.fn();
			const mockIsPreviewPanelAvailable = jest.fn().mockReturnValue(true);

			const action = extractInvokePreviewAction({
				appearance: 'block',
				fireEvent,
				id: 'test-id',
				origin: 'smartLinkPreviewHoverCard',
				response: TEST_RESPONSE_WITH_PREVIEW_AND_ARI,
				isPreviewPanelAvailable: mockIsPreviewPanelAvailable,
				openPreviewPanel: mockOpenPreviewPanel,
			});

			await action?.invokeAction.actionFn();

			expect(fireEvent).toHaveBeenCalledWith('ui.smartLink.clicked.previewHoverCard', {
				id: 'test-id',
				display: 'hoverCardPreview',
				previewType: 'panel',
			});
		});

		it('should fire analytics event when embed modal is used with correct conditions', async () => {
			// Enable the experiment for this test
			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			expValEquals.mockReturnValue(true);

			const fireEvent = jest.fn();
			jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);

			const action = extractInvokePreviewAction({
				appearance: 'block',
				fireEvent,
				id: 'test-id',
				origin: 'smartLinkPreviewHoverCard',
				response: TEST_RESPONSE_WITH_PREVIEW,
			});

			await action?.invokeAction.actionFn();

			expect(fireEvent).toHaveBeenCalledWith('ui.smartLink.clicked.previewHoverCard', {
				id: 'test-id',
				display: 'hoverCardPreview',
				previewType: 'modal',
			});
		});

		it('should not fire analytics event when experiment is disabled', async () => {
			// Ensure experiment is disabled
			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			expValEquals.mockReturnValue(false);

			const fireEvent = jest.fn();
			jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);

			const action = extractInvokePreviewAction({
				appearance: 'block',
				fireEvent,
				id: 'test-id',
				origin: 'smartLinkPreviewHoverCard',
				response: TEST_RESPONSE_WITH_PREVIEW,
			});

			await action?.invokeAction.actionFn();

			expect(fireEvent).not.toHaveBeenCalled();
		});

		it('should not fire analytics event when origin is not smartLinkPreviewHoverCard', async () => {
			// Enable the experiment for this test
			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			expValEquals.mockReturnValue(true);

			const fireEvent = jest.fn();
			jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);

			const action = extractInvokePreviewAction({
				appearance: 'block',
				fireEvent,
				id: 'test-id',
				origin: 'smartLinkCard',
				response: TEST_RESPONSE_WITH_PREVIEW,
			});

			await action?.invokeAction.actionFn();

			expect(fireEvent).not.toHaveBeenCalled();
		});

		it('should not fire analytics event when fireEvent is not provided', async () => {
			// Enable the experiment for this test
			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			expValEquals.mockReturnValue(true);

			const openEmbedModal = jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);

			const action = extractInvokePreviewAction({
				appearance: 'block',
				id: 'test-id',
				origin: 'smartLinkPreviewHoverCard',
				response: TEST_RESPONSE_WITH_PREVIEW,
			});

			await action?.invokeAction.actionFn();

			// No fireEvent function provided, so no analytics should be fired
			expect(openEmbedModal).toHaveBeenCalled();
		});

		it('should use empty string for id when id is not provided in analytics event', async () => {
			// Enable the experiment for this test
			const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
			expValEquals.mockReturnValue(true);

			const fireEvent = jest.fn();
			jest.spyOn(utils, 'openEmbedModal').mockResolvedValue(undefined);

			const action = extractInvokePreviewAction({
				appearance: 'block',
				fireEvent,
				origin: 'smartLinkPreviewHoverCard',
				response: TEST_RESPONSE_WITH_PREVIEW,
				// No id provided
			});

			await action?.invokeAction.actionFn();

			expect(fireEvent).toHaveBeenCalledWith('ui.smartLink.clicked.previewHoverCard', {
				id: '',
				display: 'hoverCardPreview',
				previewType: 'modal',
			});
		});
	});
});
