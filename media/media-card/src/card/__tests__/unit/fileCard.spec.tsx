import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { MockedMediaClientProvider } from '@atlaskit/media-client-react/mocked-media-client-provider';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers/mocked-media-api';
import { generateSampleFileItem } from '@atlaskit/media-test-data/sample-file-items';
import { preloadMediaViewer } from '@atlaskit/media-viewer/preload';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { FileCard } from '../../fileCard';

// The real MediaViewer renders the whole viewer tree, which is not what the
// `mediaViewerExtensions` tests below are about — the behaviour under test is
// which selected item FileCard hands to it, and when. `jest.mock` is
// file-scoped and hoisted, so this stub applies to every test in this file;
// that is harmless because none of the other tests here render MediaViewer
// (they assert on `title-box-header`, and `shouldOpenMediaViewer` is never set).
jest.mock('@atlaskit/media-viewer/media-viewer-loader', () => ({
	__esModule: true,
	default: ({ selectedItem, onClose }: { selectedItem: { id?: string }; onClose?: () => void }) => (
		<div data-testid="mocked-media-viewer">
			{selectedItem.id ?? 'no-id'}
			<button type="button" onClick={onClose}>
				Close viewer
			</button>
		</div>
	),
}));

jest.mock('@atlaskit/media-viewer/preload', () => ({
	preloadMediaViewer: jest.fn(),
}));

const renderFileCard = (
	identifier: Parameters<typeof FileCard>[0]['identifier'],
	props?: Partial<Parameters<typeof FileCard>[0]>,
	mediaApi?: ReturnType<typeof createMockedMediaApi>['mediaApi'],
) => {
	return render(
		<IntlProvider locale="en">
			<MockedMediaClientProvider mockedMediaApi={mediaApi ?? {}}>
				<FileCard identifier={identifier} isLazy={false} {...props} />
			</MockedMediaClientProvider>
		</IntlProvider>,
	);
};

describe('<FileCard />', () => {
	beforeEach(() => {
		// Disable SSR feature gate to avoid uninitialized client errors in test environment
		failGate('platform_media_ssr_data_seed');
	});

	describe('fallback media name in FileCard when media service name is missing (HOT-301450)', () => {
		it('should display fallback name when file has no name and fallbackMediaNameFetcher resolves', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithNoName();
			const { mediaApi } = createMockedMediaApi(fileItem);
			const fetchedName = 'fallback-file-name.jpg';
			const fallbackMediaNameFetcher = jest.fn().mockResolvedValue(fetchedName);

			renderFileCard(identifier, { fallbackMediaNameFetcher }, mediaApi);

			await waitFor(() =>
				expect(screen.getByTestId('title-box-header')).toHaveTextContent(fetchedName),
			);
			await expect(document.body).toBeAccessible();
			expect(fallbackMediaNameFetcher).toHaveBeenCalledWith(fileItem.id);
		});

		it('should prefer file state name over fallback when file already has a name', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);
			const fallbackMediaNameFetcher = jest.fn().mockResolvedValue('should-not-be-used.jpg');

			renderFileCard(identifier, { fallbackMediaNameFetcher }, mediaApi);

			await waitFor(() =>
				expect(screen.getByTestId('title-box-header')).toHaveTextContent(fileItem.details.name),
			);
			expect(fallbackMediaNameFetcher).not.toHaveBeenCalled();
		});

		it('should not call fallbackMediaNameFetcher more than once', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithNoName();
			const { mediaApi } = createMockedMediaApi(fileItem);
			const fetchedName = 'fallback-file-name.jpg';
			const fallbackMediaNameFetcher = jest.fn().mockResolvedValue(fetchedName);

			renderFileCard(identifier, { fallbackMediaNameFetcher }, mediaApi);

			await waitFor(() =>
				expect(screen.getByTestId('title-box-header')).toHaveTextContent(fetchedName),
			);
			expect(fallbackMediaNameFetcher).toHaveBeenCalledTimes(1);
		});

		it('should still render the card when fallbackMediaNameFetcher rejects', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithNoName();
			const { mediaApi } = createMockedMediaApi(fileItem);
			const fallbackMediaNameFetcher = jest.fn().mockRejectedValue(new Error('fetch failed'));

			renderFileCard(identifier, { fallbackMediaNameFetcher }, mediaApi);

			await waitFor(() => expect(fallbackMediaNameFetcher).toHaveBeenCalledWith(fileItem.id));
			// Card should still render — rejection is silently ignored
			expect(screen.queryByTestId('title-box-header')).not.toHaveTextContent('fetch failed');
		});
	});

	describe('mediaViewerExtensions', () => {
		const experimentName = 'cc_comments_media_viewer_sidebar';

		it('should open Media Viewer on mount with the item returned by getMediaViewerSelectedItem', async () => {
			mockExpEnabled(experimentName);
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);
			const getMediaViewerSelectedItem = jest.fn().mockReturnValue(identifier);

			renderFileCard(
				identifier,
				{
					shouldOpenMediaViewer: true,
					mediaViewerItems: [identifier],
					mediaViewerExtensions: { getMediaViewerSelectedItem },
				},
				mediaApi,
			);

			await waitFor(() =>
				expect(screen.getByTestId('mocked-media-viewer')).toHaveTextContent(identifier.id),
			);
			expect(getMediaViewerSelectedItem).toHaveBeenCalledWith(identifier);

			await expect(document.body).toBeAccessible();
		});

		it('should not open Media Viewer on mount when getMediaViewerSelectedItem returns null', async () => {
			mockExpEnabled(experimentName);
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);
			const getMediaViewerSelectedItem = jest.fn().mockReturnValue(null);

			renderFileCard(
				identifier,
				{
					shouldOpenMediaViewer: true,
					mediaViewerItems: [identifier],
					mediaViewerExtensions: { getMediaViewerSelectedItem },
				},
				mediaApi,
			);

			await waitFor(() => expect(getMediaViewerSelectedItem).toHaveBeenCalledWith(identifier));
			expect(screen.queryByTestId('mocked-media-viewer')).not.toBeInTheDocument();
		});

		it('should not open Media Viewer on mount when no extensions are supplied', async () => {
			mockExpEnabled(experimentName);
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			renderFileCard(
				identifier,
				{ shouldOpenMediaViewer: true, mediaViewerItems: [identifier] },
				mediaApi,
			);

			await screen.findByTestId('media-card-view');
			expect(screen.queryByTestId('mocked-media-viewer')).not.toBeInTheDocument();
		});

		it('should report the identifier through onSelectedItemChange on open and null on close', async () => {
			mockExpEnabled(experimentName);
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);
			const onSelectedItemChange = jest.fn();

			renderFileCard(
				identifier,
				{
					shouldOpenMediaViewer: true,
					mediaViewerItems: [identifier],
					mediaViewerExtensions: { onSelectedItemChange },
				},
				mediaApi,
			);

			const card = await screen.findByTestId('media-card-view');
			await userEvent.click(card);

			expect(screen.getByTestId('mocked-media-viewer')).toHaveTextContent(identifier.id);
			expect(onSelectedItemChange).toHaveBeenNthCalledWith(1, identifier);

			await userEvent.click(screen.getByRole('button', { name: 'Close viewer' }));

			expect(screen.queryByTestId('mocked-media-viewer')).not.toBeInTheDocument();
			expect(onSelectedItemChange).toHaveBeenNthCalledWith(2, null);
		});

		it('should still open and close the viewer when no extensions are supplied', async () => {
			mockExpEnabled(experimentName);
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			renderFileCard(
				identifier,
				{ shouldOpenMediaViewer: true, mediaViewerItems: [identifier] },
				mediaApi,
			);

			const card = await screen.findByTestId('media-card-view');
			await userEvent.click(card);

			expect(screen.getByTestId('mocked-media-viewer')).toHaveTextContent(identifier.id);

			await userEvent.click(screen.getByRole('button', { name: 'Close viewer' }));

			expect(screen.queryByTestId('mocked-media-viewer')).not.toBeInTheDocument();
		});

		// With `cc_comments_media_viewer_sidebar` off the two gated callbacks must
		// be inert, while click-to-open and close still work exactly as on master.
		describe('with the experiment disabled', () => {
			it('should not call getMediaViewerSelectedItem or open the viewer on mount', async () => {
				mockExpDisabled(experimentName);
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const getMediaViewerSelectedItem = jest.fn().mockReturnValue(identifier);

				renderFileCard(
					identifier,
					{
						shouldOpenMediaViewer: true,
						mediaViewerItems: [identifier],
						mediaViewerExtensions: { getMediaViewerSelectedItem },
					},
					mediaApi,
				);

				await screen.findByTestId('media-card-view');

				expect(getMediaViewerSelectedItem).not.toHaveBeenCalled();
				expect(screen.queryByTestId('mocked-media-viewer')).not.toBeInTheDocument();
			});

			it('should not call onSelectedItemChange but still open and close the viewer', async () => {
				mockExpDisabled(experimentName);
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const onSelectedItemChange = jest.fn();

				renderFileCard(
					identifier,
					{
						shouldOpenMediaViewer: true,
						mediaViewerItems: [identifier],
						mediaViewerExtensions: { onSelectedItemChange },
					},
					mediaApi,
				);

				const card = await screen.findByTestId('media-card-view');
				await userEvent.click(card);

				expect(screen.getByTestId('mocked-media-viewer')).toHaveTextContent(identifier.id);

				await userEvent.click(screen.getByRole('button', { name: 'Close viewer' }));

				expect(screen.queryByTestId('mocked-media-viewer')).not.toBeInTheDocument();
				expect(onSelectedItemChange).not.toHaveBeenCalled();
			});
		});
	});

	describe('media viewer preload', () => {
		beforeEach(() => {
			jest.mocked(preloadMediaViewer).mockClear();
		});

		const renderCardWithViewer = async (
			shouldOpenMediaViewer: boolean,
			props?: Partial<Parameters<typeof FileCard>[0]>,
		) => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const { container } = renderFileCard(
				identifier,
				{ shouldOpenMediaViewer, ...props },
				mediaApi,
			);
			await screen.findByTestId('media-card-view');

			return { container, fileItem, identifier };
		};

		it('should capture and report a11y violations', async () => {
			const { container } = await renderCardWithViewer(true);

			await expect(container).toBeAccessible();
		});

		it('warms the viewer when the pointer enters a card that opens the viewer', async () => {
			const user = userEvent.setup();
			const { identifier } = await renderCardWithViewer(true);

			await user.hover(screen.getByTestId('media-card-view'));

			expect(preloadMediaViewer).toHaveBeenCalledWith(
				expect.objectContaining({
					identifier,
					mediaType: 'image',
					// Fires the warm-up's analytics through the card's analytics context.
					onAnalyticsEvent: expect.any(Function),
				}),
			);
		});

		it('does not warm the viewer for a card that does not open the viewer', async () => {
			const user = userEvent.setup();
			await renderCardWithViewer(false);

			await user.hover(screen.getByTestId('media-card-view'));

			expect(preloadMediaViewer).not.toHaveBeenCalled();
		});

		it('warms the viewer when keyboard focus reaches the open in viewer button', async () => {
			const user = userEvent.setup();
			const { identifier } = await renderCardWithViewer(true);

			// The "open in viewer" button is rendered outside the card wrapper, so its focus
			// never reaches the wrapper's `onFocus`. It is still how keyboard users open the
			// viewer, hence its own hook.
			await screen.findByRole('button', { name: /^Open / });
			await user.tab();

			expect(preloadMediaViewer).toHaveBeenCalledWith(
				expect.objectContaining({ identifier, mediaType: 'image' }),
			);
		});

		it('warms the viewer when keyboard focus enters the card itself', async () => {
			const user = userEvent.setup();
			const { identifier } = await renderCardWithViewer(true, {
				actions: [{ label: 'Download', handler: jest.fn() }],
			});

			// Tab past the "open in viewer" button onto the action button, which lives inside
			// the wrapper that carries `onFocus`.
			await screen.findByTestId('media-card-primary-action');
			await user.tab();
			jest.mocked(preloadMediaViewer).mockClear();
			await user.tab();

			expect(preloadMediaViewer).toHaveBeenCalledWith(
				expect.objectContaining({ identifier, mediaType: 'image' }),
			);
		});
	});
});
