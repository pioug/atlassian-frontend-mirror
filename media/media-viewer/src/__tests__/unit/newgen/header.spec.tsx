import React from 'react';
import { IntlProvider } from 'react-intl-next';

import { type Identifier } from '@atlaskit/media-client';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';

import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';

import EditorPanelIcon from '@atlaskit/icon/core/migration/status-information--editor-panel';
import { fakeIntl } from '@atlaskit/media-test-helpers';
import { Header } from '../../../header';
import { render, screen, waitFor } from '@testing-library/react';

const externalIdentifierWithName: Identifier = {
	dataURI: 'some-external-src',
	name: 'some-name',
	mediaItemType: 'external-image',
};
const externalIdentifier: Identifier = {
	dataURI: 'some-external-src',
	mediaItemType: 'external-image',
};

const traceContext = { traceId: 'some-trace-id' };

describe('<Header />', () => {
	it('onSetArchiveSideBarVisible to be called with true if media type is archive', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingArchive();
		const { mediaApi } = createMockedMediaApi(fileItem);
		const onSetArchiveSideBarVisible = jest.fn();
		render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<Header
						intl={fakeIntl}
						identifier={identifier}
						onSetArchiveSideBarVisible={onSetArchiveSideBarVisible}
						traceContext={traceContext}
					/>
				</MockedMediaClientProvider>
			</IntlProvider>,
		);
		await waitFor(() => {
			expect(onSetArchiveSideBarVisible).toHaveBeenCalledWith(true);
		});
	});
	it('onSetArchiveSideBarVisible to be called with false if media type is not archive', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);
		const onSetArchiveSideBarVisible = jest.fn();
		render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<Header
						intl={fakeIntl}
						identifier={identifier}
						onSetArchiveSideBarVisible={onSetArchiveSideBarVisible}
						traceContext={traceContext}
					/>
				</MockedMediaClientProvider>
			</IntlProvider>,
		);
		await waitFor(() => {
			expect(onSetArchiveSideBarVisible).toHaveBeenCalledWith(false);
		});
	});

	it('shows the download button while loading', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { mediaApi } = createMockedMediaApi(fileItem);
		const onSetArchiveSideBarVisible = jest.fn();
		render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<Header
						intl={fakeIntl}
						identifier={identifier}
						onSetArchiveSideBarVisible={onSetArchiveSideBarVisible}
						traceContext={traceContext}
					/>
				</MockedMediaClientProvider>
			</IntlProvider>,
		);
		await waitFor(() => {
			expect(screen.getByLabelText('Download')).toBeInTheDocument();
		});
	});

	describe('Metadata', () => {
		it('should work with external image identifier', async () => {
			const [fileItem] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);
			const onSetArchiveSideBarVisible = jest.fn();
			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<Header
							intl={fakeIntl}
							identifier={externalIdentifierWithName}
							onSetArchiveSideBarVisible={onSetArchiveSideBarVisible}
							traceContext={traceContext}
						/>
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('some-name')).toBeInTheDocument();
			});
		});

		it('should default to dataURI as name when no name is passed in a external image identifier', async () => {
			const [fileItem] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);
			const onSetArchiveSideBarVisible = jest.fn();
			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<Header
							intl={fakeIntl}
							identifier={externalIdentifier}
							onSetArchiveSideBarVisible={onSetArchiveSideBarVisible}
							traceContext={traceContext}
						/>
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			await waitFor(() => {
				expect(screen.getByText('some-external-src')).toBeInTheDocument();
			});
		});

		it('should render file name as a heading level 1', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<Header intl={fakeIntl} identifier={identifier} traceContext={traceContext} />
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			const heading = await screen.findByRole('heading', { level: 1 });
			expect(heading).toBeVisible();
			expect(heading).toHaveTextContent('img.png');
			expect(heading).toHaveAttribute('id', 'media.media-viewer.file.name');
		});

		describe('File collectionName', () => {
			it('shows the title when loaded', async () => {
				const [fileItem, identifier] =
					generateSampleFileItem.workingImgWithRemotePreviewInRecentsCollection();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const onSetArchiveSideBarVisible = jest.fn();
				render(
					<IntlProvider locale="en">
						<MockedMediaClientProvider mockedMediaApi={mediaApi}>
							<Header
								intl={fakeIntl}
								identifier={identifier}
								onSetArchiveSideBarVisible={onSetArchiveSideBarVisible}
								traceContext={traceContext}
							/>
						</MockedMediaClientProvider>
					</IntlProvider>,
				);
				await waitFor(() => {
					expect(screen.getByText('img.png')).toBeInTheDocument();
				});
			});
		});

		describe('File metadata', () => {
			it('should render media type text and file size', async () => {
				const [fileItem, identifier] =
					generateSampleFileItem.workingImgWithRemotePreviewInRecentsCollection();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const onSetArchiveSideBarVisible = jest.fn();
				render(
					<IntlProvider locale="en">
						<MockedMediaClientProvider mockedMediaApi={mediaApi}>
							<Header
								intl={fakeIntl}
								identifier={identifier}
								onSetArchiveSideBarVisible={onSetArchiveSideBarVisible}
								traceContext={traceContext}
							/>
						</MockedMediaClientProvider>
					</IntlProvider>,
				);
				await waitFor(() => {
					expect(screen.getByText('img.png')).toBeInTheDocument();
				});
				expect(screen.getByTestId('media-viewer-file-metadata-text').textContent).toBe(
					'image · 41 KB',
				);
			});

			it('should not render file size if unavailable', async () => {
				const [fileItem] = generateSampleFileItem.workingImgWithRemotePreview();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const onSetArchiveSideBarVisible = jest.fn();
				render(
					<IntlProvider locale="en">
						<MockedMediaClientProvider mockedMediaApi={mediaApi}>
							<Header
								intl={fakeIntl}
								identifier={externalIdentifierWithName}
								onSetArchiveSideBarVisible={onSetArchiveSideBarVisible}
								traceContext={traceContext}
							/>
						</MockedMediaClientProvider>
					</IntlProvider>,
				);

				await waitFor(() => {
					expect(screen.getByText('some-name')).toBeInTheDocument();
				});
				expect(screen.getByTestId('media-viewer-file-metadata-text').textContent).toBe('image');
			});

			it('should render unknown type', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingUnknown();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const onSetArchiveSideBarVisible = jest.fn();
				render(
					<IntlProvider locale="en">
						<MockedMediaClientProvider mockedMediaApi={mediaApi}>
							<Header
								intl={fakeIntl}
								identifier={identifier}
								onSetArchiveSideBarVisible={onSetArchiveSideBarVisible}
								traceContext={traceContext}
							/>
						</MockedMediaClientProvider>
					</IntlProvider>,
				);
				await waitFor(() => {
					expect(screen.getByText('unknown.mp3')).toBeInTheDocument();
				});
				expect(screen.getByTestId('media-viewer-file-metadata-text').textContent).toBe(
					'unknown · 9.3 MB',
				);
			});
		});

		describe('Sidebar button', () => {
			it('should render sidebar button if sidebar component is present', async () => {
				const [fileItem, identifier] =
					generateSampleFileItem.workingImgWithRemotePreviewInRecentsCollection();
				const { mediaApi } = createMockedMediaApi(fileItem);
				const onSetArchiveSideBarVisible = jest.fn();
				render(
					<IntlProvider locale="en">
						<MockedMediaClientProvider mockedMediaApi={mediaApi}>
							<Header
								intl={fakeIntl}
								identifier={identifier}
								onSetArchiveSideBarVisible={onSetArchiveSideBarVisible}
								extensions={{
									sidebar: {
										icon: (
											<EditorPanelIcon color="currentColor" spacing="spacious" label="sidebar" />
										),
										renderer: () => <div />,
									},
								}}
								traceContext={traceContext}
							/>
						</MockedMediaClientProvider>
					</IntlProvider>,
				);

				await waitFor(() => {
					expect(screen.getByText('img.png')).toBeInTheDocument();
				});

				expect(screen.getByLabelText('sidebar')).toBeInTheDocument();
			});
		});
	});
});
