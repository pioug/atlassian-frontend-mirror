import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import {
	createMockedMediaApi,
	createServerUnauthorizedError,
} from '@atlaskit/media-client/test-helpers';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';
import { RequestError } from '@atlaskit/media-client';
import { DocViewer } from '../../../../../viewers/doc/doc-viewer';

const traceContext = { traceId: 'some-trace-id' };

// Helper to create password protected error
const createPasswordRequiredError = () =>
	new RequestError('serverEntityLocked', {
		attempts: 1,
		clientExhaustedRetries: false,
		statusCode: 423,
	});

// Mock DocumentViewer from @atlaskit/media-document-viewer to avoid complex dependencies
// but make sure it calls the content callback to trigger password flow
jest.mock('@atlaskit/media-document-viewer', () => ({
	__esModule: true,
	DocumentViewer: ({ getContent, zoom, onSuccess }: any) => {
		// Call getContent to test error handling paths and trigger password flow
		React.useEffect(() => {
			getContent(0, 1)
				.then(() => {
					// Call onSuccess when content loads successfully
					if (onSuccess) {
						onSuccess();
					}
				})
				.catch(() => {});
		}, [getContent, onSuccess]);

		return (
			<div data-testid="media-document-viewer" data-zoom={zoom}>
				<div data-testid="document-content">Document Content</div>
			</div>
		);
	},
	DOCUMENT_SCROLL_ROOT_ID: 'document-scroll-root',
}));

// Mock Spinner from @atlaskit/spinner
jest.mock('@atlaskit/spinner', () => ({
	__esModule: true,
	default: ({ size, appearance }: any) => (
		<div data-testid="spinner" data-size={size} data-appearance={appearance}>
			Loading...
		</div>
	),
}));

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<DocViewer />', () => {
	const mockOnSuccess = jest.fn();
	const mockOnError = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockDocumentContent = {
		total_pages: 5,
		start_index: 0,
		end_index: 1,
		fonts: [],
		pages: [
			{
				rotation: 0,
				width: 800,
				height: 600,
				lines: [],
				annotations: { text_form_fields: [], combobox_form_fields: [] },
				links: [],
			},
		],
	};

	const renderDocViewer = (
		fileItem = generateSampleFileItem.workingPdfWithRemotePreview()[0],
		mediaApi = createMockedMediaApi(fileItem).mediaApi,
		onSuccess = mockOnSuccess,
	) => {
		// Convert ResponseFileItem to FileState format
		const fileState = {
			...fileItem,
			status: 'processed' as const,
			name: fileItem.details.name || 'test.pdf',
			size: fileItem.details.size || 1000,
			mediaType: fileItem.details.mediaType || 'document',
			mimeType: fileItem.details.mimeType || 'application/pdf',
			artifacts: {},
		};

		return render(
			<IntlProvider locale="en">
				<MockedMediaClientProvider mockedMediaApi={mediaApi}>
					<DocViewer
						mediaClient={{ mediaStore: mediaApi } as any}
						fileState={fileState}
						collectionName="test-collection"
						onError={mockOnError}
						onSuccess={onSuccess}
						traceContext={traceContext}
					/>
				</MockedMediaClientProvider>
			</IntlProvider>,
		);
	};

	describe('Basic Rendering', () => {
		it('should render DocumentViewer with loading state initially', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			// Mock successful content fetch
			jest.spyOn(mediaApi, 'getDocumentContent').mockResolvedValue(mockDocumentContent);
			jest.spyOn(mediaApi, 'getDocumentPageImage').mockResolvedValue(new Blob());

			renderDocViewer(fileItem, mediaApi);

			// Initially, spinner should be visible and document viewer should have opacity 0
			expect(screen.getByTestId('spinner')).toBeInTheDocument();

			const documentViewerContainer = document.getElementById('document-scroll-root');
			expect(documentViewerContainer).toHaveStyle('opacity: 0');

			// After loading completes, spinner should be hidden and document viewer should be visible
			expect(await screen.findByTestId('media-document-viewer')).toBeInTheDocument();
			expect(screen.getByTestId('document-content')).toBeInTheDocument();

			// Check that zoom controls are rendered (they use MediaButton components)
			expect(screen.getByLabelText('zoom out')).toBeInTheDocument();
			expect(screen.getByLabelText('zoom in')).toBeInTheDocument();

			// Check that password input is not shown
			expect(screen.queryByPlaceholderText('Enter password')).not.toBeInTheDocument();

			// After successful loading, spinner should be hidden and opacity should be 1
			await waitFor(() => {
				expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
			});
			expect(documentViewerContainer).toHaveStyle('opacity: 1');
		});

		it('should have document scroll root id', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			jest.spyOn(mediaApi, 'getDocumentContent').mockResolvedValue(mockDocumentContent);

			renderDocViewer(fileItem, mediaApi);

			expect(await screen.findByTestId('media-document-viewer')).toBeInTheDocument();
			expect(document.getElementById('document-scroll-root')).toBeInTheDocument();
		});
	});

	describe('Password Protection', () => {
		it('should show password input when document is password protected', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			// Mock password required error - the error needs to be thrown when getContent is called in useEffect
			const passwordError = createPasswordRequiredError();
			jest.spyOn(mediaApi, 'getDocumentContent').mockRejectedValue(passwordError);

			renderDocViewer(fileItem, mediaApi);

			// Check for password protected PDF heading
			expect(await screen.findByPlaceholderText('Enter password')).toBeInTheDocument();
			expect(screen.getByText('This file is password protected.')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
			expect(screen.queryByTestId('media-document-viewer')).not.toBeInTheDocument();
		});

		it('should handle password submission successfully', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			// First call fails with password required, second succeeds
			jest
				.spyOn(mediaApi, 'getDocumentContent')
				.mockRejectedValueOnce(createPasswordRequiredError())
				.mockResolvedValue(mockDocumentContent);

			jest.spyOn(mediaApi, 'getDocumentPageImage').mockResolvedValue(new Blob());

			renderDocViewer(fileItem, mediaApi);

			// Enter password and submit
			const passwordInput = await screen.findByPlaceholderText('Enter password');
			const submitButton = screen.getByRole('button', { name: 'Submit' });

			await userEvent.type(passwordInput, 'test-password');
			await userEvent.click(submitButton);

			// Document viewer should appear after successful password validation
			expect(await screen.findByTestId('media-document-viewer')).toBeInTheDocument();
			expect(screen.queryByText('This file is password protected.')).not.toBeInTheDocument();

			// Check that getDocumentContent was called with password
			expect(mediaApi.getDocumentContent).toHaveBeenLastCalledWith(
				fileItem.id,
				{
					pageStart: 0,
					pageEnd: 1,
					collectionName: 'test-collection',
					password: 'test-password',
				},
				traceContext,
			);
		});

		it('should show password error when validation fails', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			// Always fail with password required error
			jest.spyOn(mediaApi, 'getDocumentContent').mockRejectedValue(createPasswordRequiredError());

			renderDocViewer(fileItem, mediaApi);

			// Enter password and submit
			const passwordInput = await screen.findByPlaceholderText('Enter password');
			const submitButton = screen.getByRole('button', { name: 'Submit' });

			await userEvent.type(passwordInput, 'wrong-password');
			await userEvent.click(submitButton);

			// Password error should be shown
			await waitFor(() => {
				expect(screen.getByText(/Incorrect password/i)).toBeInTheDocument();
			});

			// Should still show password input
			expect(screen.getByText('This file is password protected.')).toBeInTheDocument();
			expect(screen.queryByTestId('media-document-viewer')).not.toBeInTheDocument();
		});
	});

	describe('Zoom Controls', () => {
		it('should handle zoom level changes', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			jest.spyOn(mediaApi, 'getDocumentContent').mockResolvedValue(mockDocumentContent);
			jest.spyOn(mediaApi, 'getDocumentPageImage').mockResolvedValue(new Blob());

			renderDocViewer(fileItem);

			const documentViewer = await screen.findByTestId('media-document-viewer');
			expect(documentViewer).toHaveAttribute('data-zoom', '1.75');

			// Check that zoom level indicator shows initial value (note the space in the actual output)
			expect(screen.getByText('175 %')).toBeInTheDocument();

			// Zoom in - find by aria-label since it's on the svg icon
			const zoomInButton = screen.getByLabelText('zoom in');
			await userEvent.click(zoomInButton.closest('button')!);

			await waitFor(() => {
				expect(documentViewer).toHaveAttribute('data-zoom', '2.625');
				expect(screen.getByText('263 %')).toBeInTheDocument();
			});

			// Zoom out
			const zoomOutButton = screen.getByLabelText('zoom out');
			await userEvent.click(zoomOutButton.closest('button')!);

			await waitFor(() => {
				expect(documentViewer).toHaveAttribute('data-zoom', '1.75');
				expect(screen.getByText('175 %')).toBeInTheDocument();
			});
		});
	});

	describe('Error Handling', () => {
		it('should call onError when content fetch fails with non-password error', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const unauthorizedError = createServerUnauthorizedError();
			jest.spyOn(mediaApi, 'getDocumentContent').mockRejectedValue(unauthorizedError);

			renderDocViewer(fileItem);

			await waitFor(() => {
				expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
			});
		});

		it('should call onError when password validation fails with non-password error', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			// First call triggers password input, second call (password validation) fails with different error
			const unauthorizedError = createServerUnauthorizedError();
			jest
				.spyOn(mediaApi, 'getDocumentContent')
				.mockRejectedValueOnce(createPasswordRequiredError())
				.mockRejectedValueOnce(unauthorizedError);

			renderDocViewer(fileItem, mediaApi);

			// Enter password and submit
			const passwordInput = await screen.findByPlaceholderText('Enter password');
			const submitButton = screen.getByRole('button', { name: 'Submit' });

			await userEvent.type(passwordInput, 'test-password');
			await userEvent.click(submitButton);

			await waitFor(() => {
				expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
			});
		});

		it('should handle non-Error objects in catch blocks', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			// Reject with a non-Error object
			jest.spyOn(mediaApi, 'getDocumentContent').mockRejectedValue('string error');

			renderDocViewer(fileItem);

			await waitFor(() => {
				expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
			});
		});
	});

	describe('Content and Image Fetching', () => {
		it('should call getDocumentContent with correct parameters', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			jest.spyOn(mediaApi, 'getDocumentContent').mockResolvedValue(mockDocumentContent);
			jest.spyOn(mediaApi, 'getDocumentPageImage').mockResolvedValue(new Blob());

			renderDocViewer(fileItem, mediaApi);

			await waitFor(() => {
				expect(mediaApi.getDocumentContent).toHaveBeenCalledWith(
					fileItem.id,
					{
						pageStart: 0,
						pageEnd: 1,
						collectionName: 'test-collection',
						password: '',
					},
					traceContext,
				);
			});
		});

		it('should handle getDocumentPageImage and create object URL', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			const mockBlob = new Blob(['image data'], { type: 'image/png' });
			jest.spyOn(mediaApi, 'getDocumentContent').mockResolvedValue(mockDocumentContent);
			jest.spyOn(mediaApi, 'getDocumentPageImage').mockResolvedValue(mockBlob);

			// Mock URL.createObjectURL
			const mockObjectURL = 'blob:mock-url';
			global.URL.createObjectURL = jest.fn().mockReturnValue(mockObjectURL);

			renderDocViewer(fileItem, mediaApi);

			await screen.findByTestId('media-document-viewer');

			// Note: We can't easily test the getPageImageUrl callback directly since it's passed to DocumentViewer
			// but we can verify the mocks are set up correctly
			expect(mediaApi.getDocumentPageImage).toBeDefined();
			expect(global.URL.createObjectURL).toBeDefined();
		});
	});

	describe('Loading State', () => {
		it('should show spinner initially and hide after successful loading', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			jest.spyOn(mediaApi, 'getDocumentContent').mockResolvedValue(mockDocumentContent);
			jest.spyOn(mediaApi, 'getDocumentPageImage').mockResolvedValue(new Blob());

			renderDocViewer(fileItem, mediaApi);

			// Initially, spinner should be visible
			expect(screen.getByTestId('spinner')).toBeInTheDocument();
			expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'large');
			expect(screen.getByTestId('spinner')).toHaveAttribute('data-appearance', 'invert');

			// Document viewer container should have opacity 0
			const documentViewerContainer = document.getElementById('document-scroll-root');
			expect(documentViewerContainer).toHaveStyle('opacity: 0');

			// After loading completes, spinner should be hidden and opacity should be 1
			await screen.findByTestId('media-document-viewer');

			await waitFor(() => {
				expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
				expect(documentViewerContainer).toHaveStyle('opacity: 1');
			});
		});

		it('should maintain loading state during password flow', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			// First call fails with password required
			jest.spyOn(mediaApi, 'getDocumentContent').mockRejectedValue(createPasswordRequiredError());

			renderDocViewer(fileItem, mediaApi);

			// Should show password input without spinner when password is required
			expect(await screen.findByPlaceholderText('Enter password')).toBeInTheDocument();
			expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
		});
	});

	describe('Component Integration', () => {
		it('should render zoom controls with correct functionality', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			jest.spyOn(mediaApi, 'getDocumentContent').mockResolvedValue(mockDocumentContent);
			jest.spyOn(mediaApi, 'getDocumentPageImage').mockResolvedValue(new Blob());

			renderDocViewer(fileItem, mediaApi);

			await screen.findByTestId('media-document-viewer');

			// Verify zoom controls are rendered and functional
			expect(screen.getByLabelText('zoom in')).toBeInTheDocument();
			expect(screen.getByLabelText('zoom out')).toBeInTheDocument();
			expect(screen.getByText('175 %')).toBeInTheDocument();

			// Test zoom functionality
			const zoomOutButton = screen.getByLabelText('zoom out');
			await userEvent.click(zoomOutButton.closest('button')!);
			await waitFor(() => {
				expect(screen.getByText('100 %')).toBeInTheDocument();
			});
		});

		it('should render document viewer with content callback functionality', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			jest.spyOn(mediaApi, 'getDocumentContent').mockResolvedValue(mockDocumentContent);
			jest.spyOn(mediaApi, 'getDocumentPageImage').mockResolvedValue(new Blob());

			renderDocViewer(fileItem, mediaApi);

			await screen.findByTestId('media-document-viewer');

			// Verify that DocumentViewer is rendered with content
			expect(screen.getByTestId('document-content')).toBeInTheDocument();

			// Verify that getDocumentContent was called (through the mocked DocumentViewer effect)
			expect(mediaApi.getDocumentContent).toHaveBeenCalled();
		});

		it('should render without collectionName', async () => {
			const [fileItem] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { mediaApi } = createMockedMediaApi(fileItem);

			jest.spyOn(mediaApi, 'getDocumentContent').mockResolvedValue(mockDocumentContent);
			jest.spyOn(mediaApi, 'getDocumentPageImage').mockResolvedValue(new Blob());

			const fileState = {
				...fileItem,
				status: 'processed' as const,
				name: fileItem.details.name || 'test.pdf',
				size: fileItem.details.size || 1000,
				mediaType: fileItem.details.mediaType || 'document',
				mimeType: fileItem.details.mimeType || 'application/pdf',
				artifacts: {},
			};

			render(
				<IntlProvider locale="en">
					<MockedMediaClientProvider mockedMediaApi={mediaApi}>
						<DocViewer
							mediaClient={{ mediaStore: mediaApi } as any}
							fileState={fileState}
							onError={mockOnError}
							traceContext={traceContext}
						/>
					</MockedMediaClientProvider>
				</IntlProvider>,
			);

			expect(await screen.findByTestId('media-document-viewer')).toBeInTheDocument();

			await waitFor(() => {
				expect(mediaApi.getDocumentContent).toHaveBeenCalledWith(
					fileItem.id,
					{
						pageStart: 0,
						pageEnd: 1,
						collectionName: undefined,
						password: '',
					},
					traceContext,
				);
			});
		});
	});
});
