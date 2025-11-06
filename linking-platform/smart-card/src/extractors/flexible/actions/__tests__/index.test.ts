import { ActionName, CardAction } from '../../../../index';
import {
	PREVIEW,
	TEST_DOCUMENT,
	TEST_DOCUMENT_WITH_ARI,
	TEST_RESOLVED_META_DATA,
	TEST_RESPONSE,
	TEST_RESPONSE_WITH_DOWNLOAD,
	TEST_RESPONSE_WITH_PREVIEW,
	TEST_RESPONSE_WITH_PREVIEW_AND_DOWNLOAD,
} from '../../../common/__mocks__/jsonld';
import { extractCopyLinkClientAction } from '../extract-copy-link-action';
import { extractDownloadClientAction } from '../extract-download-action';
import { extractPreviewClientAction } from '../extract-preview-action';
import { extractViewRelatedLinksAction } from '../extract-view-related-links-action';
import { extractFlexibleCardActions } from '../index';

// Mock the expValEquals function
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

// Mock the isWithinPreviewPanelIFrame function
jest.mock('@atlaskit/linking-common/utils', () => ({
	...jest.requireActual('@atlaskit/linking-common/utils'),
	isWithinPreviewPanelIFrame: jest.fn(),
}));

// Create a test response with preview and ARI which is needed for testing preview panel params
const TEST_RESPONSE_WITH_PREVIEW_AND_ARI = {
	...TEST_RESPONSE_WITH_PREVIEW,
	data: {
		...TEST_DOCUMENT_WITH_ARI,
		preview: PREVIEW,
	},
};

describe('extractors.downloadAction', () => {
	describe('extractDownloadClientAction', () => {
		it('returns an extracted URL for download action', () => {
			const action = extractDownloadClientAction({
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE_WITH_DOWNLOAD,
			});
			expect(action?.invokeAction?.actionFn).toBeDefined();
			expect(action?.invokeAction?.actionType).toBe(ActionName.DownloadAction);
		});

		it('returns undefined for a document without a download action', () => {
			const action = extractDownloadClientAction({
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE,
			});
			expect(action).toBeUndefined();
		});

		it('does not return download action if excluded', () => {
			const action = extractDownloadClientAction({
				actionOptions: {
					hide: false,
					exclude: [CardAction.DownloadAction],
				},
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE_WITH_DOWNLOAD,
			});

			expect(action).toBeUndefined();
		});
	});
});

describe('extractors.previewAction', () => {
	describe('extractPreviewClientAction', () => {
		const { expValEquals } = require('@atlaskit/tmp-editor-statsig/exp-val-equals');
		const { isWithinPreviewPanelIFrame } = require('@atlaskit/linking-common/utils');

		beforeEach(() => {
			// Reset mocks before each test
			jest.clearAllMocks();
		});

		afterEach(() => {
			isWithinPreviewPanelIFrame.mockReturnValue(false);
			expValEquals.mockReturnValue(false);
		});

		it('returns an extracted URL for preview action', () => {
			const action = extractPreviewClientAction({
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE_WITH_PREVIEW,
			});

			expect(action?.invokeAction?.actionFn).toBeDefined();
			expect(action?.invokeAction?.actionType).toBe(ActionName.PreviewAction);
		});

		it('does not return preview action if excluded', () => {
			const action = extractPreviewClientAction({
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

		it('returns undefined for a document without a preview action', () => {
			const action = extractPreviewClientAction({
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE,
			});
			expect(action).toBeUndefined();
		});

		it('should return preview action with hasPreviewPanel false when no preview panel params', () => {
			const action = extractPreviewClientAction({
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE_WITH_PREVIEW,
			});

			expect(action?.invokeAction?.actionFn).toBeDefined();
			expect(action?.invokeAction?.actionType).toBe(ActionName.PreviewAction);
			expect(action?.hasPreviewPanel).toBe(false);
		});

		it('should return preview action with hasPreviewPanel true when preview panel is available', () => {
			// Enable the experiment for this test
			expValEquals.mockReturnValue(true);

			const action = extractPreviewClientAction({
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE_WITH_PREVIEW_AND_ARI,
				isPreviewPanelAvailable: jest.fn().mockReturnValue(true),
				openPreviewPanel: jest.fn(),
			});

			expect(action?.invokeAction?.actionFn).toBeDefined();
			expect(action?.invokeAction?.actionType).toBe(ActionName.PreviewAction);
			expect(action?.hasPreviewPanel).toBe(true);
		});

		it('should return preview action with hasPreviewPanel false when preview panel is not available', () => {
			const action = extractPreviewClientAction({
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE_WITH_PREVIEW,
				isPreviewPanelAvailable: jest.fn().mockReturnValue(false),
				openPreviewPanel: undefined,
			});

			expect(action?.invokeAction?.actionFn).toBeDefined();
			expect(action?.invokeAction?.actionType).toBe(ActionName.PreviewAction);
			expect(action?.hasPreviewPanel).toBe(false);
		});

		it('should return preview action with hasPreviewPanel false when preview panel params are incomplete', () => {
			const modifiedResponse = {
				...TEST_RESPONSE_WITH_PREVIEW,
				data: {
					...TEST_DOCUMENT,
					url: undefined,
					preview: PREVIEW,
				},
			};

			const action = extractPreviewClientAction({
				appearance: 'block',
				id: 'test-id',
				response: modifiedResponse,
				isPreviewPanelAvailable: jest.fn().mockReturnValue(true),
				openPreviewPanel: jest.fn(),
			});

			expect(action?.invokeAction?.actionFn).toBeDefined();
			expect(action?.invokeAction?.actionType).toBe(ActionName.PreviewAction);
			expect(action?.hasPreviewPanel).toBe(false);
		});

		it('should pass through all parameters correctly', () => {
			const mockIsPreviewPanelAvailable = jest.fn().mockReturnValue(true);
			const mockOpenPreviewPanel = jest.fn();

			const action = extractPreviewClientAction({
				appearance: 'inline',
				id: 'another-test-id',
				response: TEST_RESPONSE_WITH_PREVIEW_AND_DOWNLOAD,
				fireEvent: jest.fn(),
				origin: 'smartLinkCard',
				isPreviewPanelAvailable: mockIsPreviewPanelAvailable,
				openPreviewPanel: mockOpenPreviewPanel,
				actionOptions: {
					hide: false,
					exclude: [CardAction.DownloadAction],
				},
			});

			expect(action?.invokeAction?.actionFn).toBeDefined();
			expect(action?.invokeAction?.actionType).toBe(ActionName.PreviewAction);
			expect(action?.invokeAction?.display).toBe('inline');
			expect(action?.invokeAction?.id).toBe('another-test-id');
		});

		it('should return an action when not within a preview panel iframe', () => {
			expValEquals.mockReturnValue(true);
			isWithinPreviewPanelIFrame.mockReturnValueOnce(false);

			const action = extractPreviewClientAction({
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE_WITH_PREVIEW,
			});

			expect(action).not.toBe(undefined);
		});

		it('should return an action when experiment is not enabled', () => {
			expValEquals.mockReturnValue(false);
			isWithinPreviewPanelIFrame.mockReturnValueOnce(true);

			const action = extractPreviewClientAction({
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE_WITH_PREVIEW,
			});

			expect(action).not.toBe(undefined);
		});

		it('should return undefined when within a preview panel iframe and experiment is enabled', () => {
			expValEquals.mockReturnValue(true);
			isWithinPreviewPanelIFrame.mockReturnValueOnce(true);

			const action = extractPreviewClientAction({
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE_WITH_PREVIEW,
			});

			expect(action).toBe(undefined);
		});
	});
});

describe('extractors.copyLinkAction', () => {
	describe('extractCopyLinkClientAction', () => {
		it('returns a copy link action', () => {
			const action = extractCopyLinkClientAction({
				appearance: 'block',
				id: 'test-id',
				response: TEST_RESPONSE,
			});

			expect(action?.invokeAction?.actionFn).toBeDefined();
			expect(action?.invokeAction?.actionType).toBe(ActionName.CopyLinkAction);
		});

		it('does not return preview action if excluded', () => {
			const action = extractCopyLinkClientAction({
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
});

describe('extractors.viewRelatedLinks', () => {
	it.each([
		[[], undefined],
		[['AiSummary'], undefined],
		[['RelatedLinks'], TEST_DOCUMENT_WITH_ARI['atlassian:ari']],
		[['RelatedLinks', 'AISummary'], TEST_DOCUMENT_WITH_ARI['atlassian:ari']],
	])('when meta.supportedFeature is %s, ari is %s', (supportedFeature, expectedAri) => {
		expect(
			extractViewRelatedLinksAction({
				data: TEST_DOCUMENT_WITH_ARI,
				meta: {
					...TEST_RESOLVED_META_DATA,
					supportedFeature,
				},
			}),
		).toEqual(
			expectedAri && {
				ari: expectedAri,
			},
		);
	});

	it('when data.ari is undefined and supportedFeature has RelatedLinks, it should return undefined', () => {
		expect(
			extractViewRelatedLinksAction({
				data: { ...TEST_DOCUMENT, 'atlassian:ari': undefined },
				meta: {
					...TEST_RESOLVED_META_DATA,
					supportedFeature: ['RelatedLinks'],
				},
			}),
		).toBeUndefined();
	});
});

describe('extractFlexibleCardActions', () => {
	beforeEach(() => {
		// Reset mocks before each test
		jest.clearAllMocks();
	});

	it('extracts client actions', () => {
		const actions = extractFlexibleCardActions({
			response: TEST_RESPONSE_WITH_PREVIEW_AND_DOWNLOAD,
		});

		expect(actions).toMatchObject({
			CopyLinkAction: {
				invokeAction: expect.objectContaining({
					actionFn: expect.any(Function),
					actionType: ActionName.CopyLinkAction,
				}),
			},
			DownloadAction: {
				invokeAction: expect.objectContaining({
					actionFn: expect.any(Function),
					actionType: ActionName.DownloadAction,
				}),
			},
			PreviewAction: {
				invokeAction: expect.objectContaining({
					actionFn: expect.any(Function),
					actionType: ActionName.PreviewAction,
				}),
				hasPreviewPanel: expect.any(Boolean),
			},
		});
	});
});
