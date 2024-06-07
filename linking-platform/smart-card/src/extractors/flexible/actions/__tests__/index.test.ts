import { extractDownloadAction } from '../extract-download-action';
import { extractViewAction } from '../extract-view-action';
import { extractPreviewAction } from '../extract-preview-action';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import {
	TEST_DOCUMENT_WITH_DOWNLOAD_ACTION,
	TEST_DOCUMENT_WITH_VIEW_ACTION,
	TEST_DOCUMENT_WITH_PREVIEW,
	TEST_DOCUMENT,
	TEST_RESOLVED_META_DATA,
} from '../../../common/__mocks__/jsonld';
import { extractViewRelatedLinksAction } from '../extract-view-related-links-action';
import extractActions from '..';

describe('extractors.downloadAction', () => {
	it('returns an extracted URL for download action', () => {
		expect(extractDownloadAction(TEST_DOCUMENT_WITH_DOWNLOAD_ACTION)).toStrictEqual({
			downloadUrl: 'https://my.url.com',
		});
	});
	it('returns undefined for a document without a download action', () => {
		expect(extractDownloadAction(TEST_DOCUMENT)).toBe(undefined);
	});
});

describe('extractors.viewAction', () => {
	it('returns an extracted URL for view action', () => {
		expect(extractViewAction(TEST_DOCUMENT_WITH_VIEW_ACTION)).toStrictEqual({
			viewUrl: 'https://my.url.com',
		});
	});
	it('returns undefined for a document without a view action', () => {
		expect(extractViewAction(TEST_DOCUMENT)).toBe(undefined);
	});
});

describe('extractors.previewAction', () => {
	it('returns an extracted URL for preview action', () => {
		expect(
			extractPreviewAction({
				data: TEST_DOCUMENT_WITH_PREVIEW,
				meta: TEST_RESOLVED_META_DATA,
			}),
		).toEqual({
			downloadUrl: undefined,
			isSupportTheming: false,
			linkIcon: { icon: undefined, render: undefined },
			providerName: undefined,
			src: 'https://my.url.com',
			title: 'my name',
			url: 'https://my.url.com',
		});
	});
	it('returns an extracted URL with download for a preview action', () => {
		expect(
			extractPreviewAction({
				data: {
					...TEST_DOCUMENT_WITH_PREVIEW,
					...TEST_DOCUMENT_WITH_DOWNLOAD_ACTION,
				},
				meta: TEST_RESOLVED_META_DATA,
			}),
		).toEqual({
			downloadUrl: 'https://my.url.com',
			isSupportTheming: false,
			linkIcon: { icon: undefined, render: undefined },
			providerName: undefined,
			src: 'https://my.url.com',
			title: 'my name',
			url: 'https://my.url.com',
		});
	});
	it('returns undefined for a document without a preview action', () => {
		expect(
			extractPreviewAction({
				data: TEST_DOCUMENT,
				meta: TEST_RESOLVED_META_DATA,
			}),
		).toBe(undefined);
	});
});

describe('extractors.viewRelatedLinks', () => {
	it.each([
		[[], undefined],
		[['AiSummary'], undefined],
		[['RelatedLinks'], TEST_DOCUMENT.url],
		[['RelatedLinks', 'AISummary'], TEST_DOCUMENT.url],
	])('when meta.supportedFeature is %s, url is %s', (supportedFeature, expectedUrl) => {
		expect(
			extractViewRelatedLinksAction({
				data: TEST_DOCUMENT,
				meta: {
					...TEST_RESOLVED_META_DATA,
					supportedFeature,
				},
			}),
		).toEqual(
			expectedUrl && {
				url: expectedUrl,
			},
		);
	});

	it('when data.url is undefined and supportedFeature has RelatedLinks, it should return undefined', () => {
		expect(
			extractViewRelatedLinksAction({
				data: { ...TEST_DOCUMENT, url: undefined },
				meta: {
					...TEST_RESOLVED_META_DATA,
					supportedFeature: ['RelatedLinks'],
				},
			}),
		).toBeUndefined();
	});
});
describe('extractActions', () => {
	describe('ViewRelatedLinksAction', () => {
		const meta = {
			...TEST_RESOLVED_META_DATA,
			supportedFeature: ['RelatedLinks'],
		};
		ffTest(
			'platform.linking-platform.smart-card.enable-view-related-urls-action',
			/** Should return ViewRelatedLinksAction with url when FF is true*/
			() => {
				expect(extractActions({ data: TEST_DOCUMENT, meta })?.ViewRelatedLinksAction).toEqual({
					url: TEST_DOCUMENT.url,
				});
			},
			() => {
				expect(
					extractActions({ data: TEST_DOCUMENT, meta })?.ViewRelatedLinksAction,
				).toBeUndefined();
			},
		);
	});
});
