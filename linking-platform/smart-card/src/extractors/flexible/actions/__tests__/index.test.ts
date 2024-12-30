import { ActionName, CardAction } from '../../../../index';
import {
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
	it('extracts client actions', () => {
		const actions = extractFlexibleCardActions({
			response: TEST_RESPONSE_WITH_PREVIEW_AND_DOWNLOAD,
		});

		expect(actions).toEqual({
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
			},
		});
	});
});
