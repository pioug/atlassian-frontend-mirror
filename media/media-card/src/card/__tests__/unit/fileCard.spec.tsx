import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen, waitFor } from '@testing-library/react';

import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { FileCard } from '../../fileCard';

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

	eeTest
		.describe(
			'platform_editor_media_name_fallback_viewer_card',
			'fallback media name in FileCard when media service name is missing (HOT-301450)',
		)
		.variant(true, () => {
			it('should display fallback name when file has no name and fallbackMediaNameFetcher resolves', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithNoName();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const fetchedName = 'fallback-file-name.jpg';
				const fallbackMediaNameFetcher = jest.fn().mockResolvedValue(fetchedName);

				renderFileCard(identifier, { fallbackMediaNameFetcher }, mediaApi);

				await waitFor(() =>
					expect(screen.getByTestId('title-box-header')).toHaveTextContent(fetchedName),
				);
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
	eeTest
		.describe(
			'platform_editor_media_name_fallback_viewer_card',
			'fallback media name in FileCard when media service name is missing (HOT-301450)',
		)
		.variant(false, () => {
			it('should not use fallbackMediaNameFetcher when experiment is off', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithNoName();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const fallbackMediaNameFetcher = jest.fn().mockResolvedValue('should-not-be-used.jpg');

				renderFileCard(identifier, { fallbackMediaNameFetcher }, mediaApi);

				// File has no name — title box should not show the fallback name
				await waitFor(() =>
					expect(screen.queryByTestId('title-box-header')).not.toHaveTextContent(
						'should-not-be-used.jpg',
					),
				);
				expect(fallbackMediaNameFetcher).not.toHaveBeenCalled();
			});
		});
});
