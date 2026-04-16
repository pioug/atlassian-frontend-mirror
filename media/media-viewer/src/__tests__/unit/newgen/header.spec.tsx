import React from 'react';
import { IntlProvider } from 'react-intl';

import { type Identifier } from '@atlaskit/media-client';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';

import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';

import EditorPanelIcon from '@atlaskit/icon/core/status-information';
import { fakeIntl } from '@atlaskit/media-test-helpers';
import { Header } from '../../../header';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

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

		await expect(document.body).toBeAccessible();
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

		await expect(document.body).toBeAccessible();
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

		await expect(document.body).toBeAccessible();
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

			await expect(document.body).toBeAccessible();
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

			await expect(document.body).toBeAccessible();
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

			await expect(document.body).toBeAccessible();
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

				await expect(document.body).toBeAccessible();
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

				await expect(document.body).toBeAccessible();
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

				await expect(document.body).toBeAccessible();
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

				await expect(document.body).toBeAccessible();
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

				await expect(document.body).toBeAccessible();
			});
		});

		describe('Header actions', () => {
			// Shared file item used across all header action tests
			const [fileItem, identifier] =
				generateSampleFileItem.workingImgWithRemotePreviewInRecentsCollection();

			// Helper: build a single header action entry
			const makeAction = (
				overrides: Partial<
					NonNullable<
						NonNullable<React.ComponentProps<typeof Header>['extensions']>['headerActions']
					>[number]
				> = {},
			) => ({
				icon: <EditorPanelIcon color="currentColor" spacing="spacious" label="Comment" />,
				label: 'View comments',
				onClick: jest.fn(),
				...overrides,
			});

			// Helper: render a Header with the given extensions and optional extra props
			const renderHeaderWithActions = (
				extensions: React.ComponentProps<typeof Header>['extensions'],
				extraProps: Partial<React.ComponentProps<typeof Header>> = {},
			) => {
				const { mediaApi } = createMockedMediaApi(fileItem);
				return render(
					<IntlProvider locale="en">
						<MockedMediaClientProvider mockedMediaApi={mediaApi}>
							<Header
								intl={fakeIntl}
								identifier={identifier}
								onSetArchiveSideBarVisible={jest.fn()}
								extensions={extensions}
								traceContext={traceContext}
								{...extraProps}
							/>
						</MockedMediaClientProvider>
					</IntlProvider>,
				);
			};

			it('should render a button with the correct testId and aria-label when headerActions is provided', async () => {
				renderHeaderWithActions({ headerActions: [makeAction()] });

				await waitFor(() => {
					expect(screen.getByTestId('media-viewer-header-action-0')).toBeInTheDocument();
				});

				expect(screen.getByLabelText('View comments')).toBeInTheDocument();
				await expect(document.body).toBeAccessible();
			});

			it('should not render action buttons when headerActions is not provided', async () => {
				renderHeaderWithActions(undefined);

				// Wait for the header to render (download button is always present)
				await screen.findByLabelText('Download');

				expect(screen.queryByTestId('media-viewer-header-action-0')).not.toBeInTheDocument();
			});

			it('should call onClick with the identifier and a close action when clicked', async () => {
				const onClick = jest.fn();
				const onClose = jest.fn();
				renderHeaderWithActions({ headerActions: [makeAction({ onClick })] }, { onClose });

				await screen.findByTestId('media-viewer-header-action-0');

				fireEvent.click(screen.getByTestId('media-viewer-header-action-0'));

				expect(onClick).toHaveBeenCalledTimes(1);
				expect(onClick).toHaveBeenCalledWith(
					identifier,
					expect.objectContaining({ close: expect.any(Function) }),
				);
				await expect(document.body).toBeAccessible();
			});

			it('should invoke onClose when actions.close() is called from onClick', async () => {
				const onClose = jest.fn();
				renderHeaderWithActions(
					{ headerActions: [makeAction({ onClick: (_id, actions) => actions.close() })] },
					{ onClose },
				);

				await screen.findByTestId('media-viewer-header-action-0');

				fireEvent.click(screen.getByTestId('media-viewer-header-action-0'));

				expect(onClose).toHaveBeenCalledTimes(1);
			});

			it('should hide the button when isVisible returns false', async () => {
				renderHeaderWithActions({
					headerActions: [makeAction({ isVisible: () => false })],
				});

				await screen.findByLabelText('Download');
				expect(screen.queryByTestId('media-viewer-header-action-0')).not.toBeInTheDocument();
			});

			it('should show the button when isVisible returns true', async () => {
				renderHeaderWithActions({
					headerActions: [makeAction({ isVisible: () => true })],
				});

				const button = await screen.findByTestId('media-viewer-header-action-0');
				expect(button).toBeInTheDocument();
			});

			it('should pass the identifier to the isVisible callback', async () => {
				const isVisible = jest.fn().mockReturnValue(true);
				renderHeaderWithActions({ headerActions: [makeAction({ isVisible })] });

				await waitFor(() => expect(isVisible).toHaveBeenCalledWith(identifier));
			});

			it('should render multiple buttons with correct testIds when multiple actions provided', async () => {
				renderHeaderWithActions({
					headerActions: [makeAction({ label: 'Action one' }), makeAction({ label: 'Action two' })],
				});

				await screen.findByTestId('media-viewer-header-action-0');

				expect(screen.getByTestId('media-viewer-header-action-0')).toHaveAttribute(
					'aria-label',
					'Action one',
				);
				expect(screen.getByTestId('media-viewer-header-action-1')).toHaveAttribute(
					'aria-label',
					'Action two',
				);
				await expect(document.body).toBeAccessible();
			});

			it('should render action buttons alongside sidebar button when both are provided', async () => {
				renderHeaderWithActions({
					sidebar: {
						icon: <EditorPanelIcon color="currentColor" spacing="spacious" label="sidebar" />,
						renderer: () => <div />,
					},
					headerActions: [makeAction()],
				});

				await screen.findByTestId('media-viewer-header-action-0');

				expect(screen.getByLabelText('sidebar')).toBeInTheDocument();
				expect(screen.getByLabelText('View comments')).toBeInTheDocument();
				await expect(document.body).toBeAccessible();
			});
		});
	});
});
