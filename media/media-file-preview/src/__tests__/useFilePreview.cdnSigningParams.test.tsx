/**
 * Verifies that SSR-seeded CDN asset URLs are only forwarded when CDN delivery
 * and SSR data seeding are enabled. Path-based routing, isolated cloud, and GCP
 * build their image URL through the product's `/media-api` proxy instead.
 */
import React from 'react';

import { renderHook } from '@testing-library/react';

import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { useFilePreview } from '../useFilePreview';
import { createMockedMediaClientProvider } from './helpers/_MockedMediaClientProvider';

const mockIsCDNEnabled = jest.fn();
const mockGetSSRPreview = jest.fn();

jest.mock('@atlaskit/media-client/media-cdn', () => ({
	...jest.requireActual('@atlaskit/media-client/media-cdn'),
	isCDNEnabled: () => mockIsCDNEnabled(),
}));

jest.mock('../getPreview/getSSRPreview', () => ({
	...jest.requireActual('../getPreview/getSSRPreview'),
	getSSRPreview: (...args: unknown[]) => mockGetSSRPreview(...args),
}));

const PRESIGNED_CDN_URL =
	'https://media-cdn.atlassian.com/region/v2/cdn/client/client-id/file/abc/image?token=cdn-token&wm-ari=ari%3Acloud%3Aconfluence%3Asite%3Aspace%2F1&wm-v=version&Policy=policy-value&Signature=sig-value&Key-Pair-Id=kp-value';

const seededCdnUrlArg = () => mockGetSSRPreview.mock.calls[0]?.[5];

const renderWithSeededCdnUrl = () => {
	const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
	const { MockedMediaClientProvider } = createMockedMediaClientProvider({
		initialItems: fileItem,
	});

	const initialFileState = {
		status: 'processed' as const,
		id: identifier.id,
		name: 'ssr-seeded.jpg',
		size: 512,
		mimeType: 'image/jpeg',
		mediaType: 'image' as const,
		artifacts: {},
		representations: {},
		previewCdnUrl: PRESIGNED_CDN_URL,
	};

	return renderHook(
		() =>
			useFilePreview({
				identifier,
				initialFileState,
				ssr: 'server',
			}),
		{
			wrapper: ({ children }: { children: React.ReactNode }) => (
				<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
			),
		},
	);
};

describe('useFilePreview — seeded CDN URL guard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetSSRPreview.mockReturnValue({ dataURI: 'data:image/jpeg;base64,zzz' });
	});

	ffTest.on('platform_media_ssr_data_seed', 'SSR data seeding enabled', () => {
		it('forwards the complete seeded CDN URL when CDN delivery is enabled', () => {
			mockIsCDNEnabled.mockReturnValue(true);

			renderWithSeededCdnUrl();

			expect(mockGetSSRPreview).toHaveBeenCalled();
			expect(seededCdnUrlArg()).toBe(PRESIGNED_CDN_URL);
		});
	});

	// isCDNEnabled() is evaluated before the feature gate in
	// `seededCdnUrl && isCDNEnabled() && fg('platform_media_ssr_data_seed')`, so
	// when CDN delivery is disabled the gate is never reached (short-circuit).
	// These cases are therefore gate-independent and must not use ffTest, which
	// requires the gate to be evaluated in every test.
	describe('when CDN delivery is disabled (isCDNEnabled() === false)', () => {
		beforeEach(() => {
			mockIsCDNEnabled.mockReturnValue(false);
		});

		it('does not forward the seeded CDN URL for path-based routing', () => {
			// Path-based routing makes isCDNEnabled() false: the URL is served by the
			// product's own /media-api proxy, not CloudFront.
			renderWithSeededCdnUrl();

			expect(mockGetSSRPreview).toHaveBeenCalled();
			expect(seededCdnUrlArg()).toBeUndefined();
		});

		it('keeps the pre-signed CDN asset out of non-CDN preview generation', () => {
			renderWithSeededCdnUrl();

			expect(seededCdnUrlArg()).not.toBe(PRESIGNED_CDN_URL);
		});
	});

	ffTest.off('platform_media_ssr_data_seed', 'SSR data seeding disabled', () => {
		it('does not forward the seeded CDN URL even when CDN delivery is enabled', () => {
			mockIsCDNEnabled.mockReturnValue(true);

			renderWithSeededCdnUrl();

			expect(seededCdnUrlArg()).toBeUndefined();
		});
	});
});
