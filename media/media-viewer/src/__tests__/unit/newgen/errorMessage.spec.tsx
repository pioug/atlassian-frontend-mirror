jest.mock('../../../analytics/events/operational/loadFailed', () => ({
	createLoadFailedEvent: jest.fn(),
}));
jest.mock('../../../analytics/events/operational/previewUnsupported', () => ({
	createPreviewUnsupportedEvent: jest.fn(),
}));
import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { IntlProvider } from 'react-intl';
import * as ufoWrapper from '../../../analytics/ufoExperiences';
import { ErrorMessage } from '../../../errorMessage';
import { MediaViewerError } from '../../../errors';
import Button from '@atlaskit/button/standard-button';
import { fakeIntl, smallImageFileId, asMock } from '@atlaskit/media-test-helpers';
import { getRandomTelemetryId, type MediaTraceContext } from '@atlaskit/media-common';
import { type FileState } from '@atlaskit/media-client';
import { messages as i18nMessages } from '@atlaskit/media-ui';
import { createLoadFailedEvent } from '../../../analytics/events/operational/loadFailed';
import { createPreviewUnsupportedEvent } from '../../../analytics/events/operational/previewUnsupported';

const mockfailMediaFileUfoExperience = jest.spyOn(ufoWrapper, 'failMediaFileUfoExperience');

describe('Error Message', () => {
	describe('Mapping error reason to message text', () => {
		it('should map error reason to translated message', () => {
			render(
				<IntlProvider locale="en">
					<ErrorMessage
						fileId="some-id"
						intl={fakeIntl}
						error={new MediaViewerError('itemviewer-file-failed-processing-status')}
					/>
				</IntlProvider>,
			);
			expect(
				screen.getByText(i18nMessages.image_format_invalid_error.defaultMessage as string),
			).toBeInTheDocument();
		});

		it('shows a dedicated "Unsupported file format" heading for a non-ZIP archive', () => {
			render(
				<IntlProvider locale="en">
					<ErrorMessage
						fileId="some-id"
						intl={fakeIntl}
						error={new MediaViewerError('archiveviewer-not-zip')}
					/>
				</IntlProvider>,
			);

			// The dedicated heading and explanatory line are shown.
			expect(
				screen.getByText(i18nMessages.unsupported_file_format.defaultMessage as string),
			).toBeInTheDocument();
			expect(
				screen.getByText(i18nMessages.archive_format_not_supported.defaultMessage as string),
			).toBeInTheDocument();

			// The generic failure copy is NOT shown for this case.
			expect(
				screen.queryByText(i18nMessages.something_went_wrong.defaultMessage as string),
			).not.toBeInTheDocument();
			expect(
				screen.queryByText(i18nMessages.couldnt_generate_preview.defaultMessage as string),
			).not.toBeInTheDocument();
		});

		it('shows a dedicated "Unsupported file format" heading for a non-decodable image MIME type', () => {
			render(
				<IntlProvider locale="en">
					<ErrorMessage
						fileId="some-id"
						intl={fakeIntl}
						error={new MediaViewerError('imageviewer-unsupported-mime')}
					/>
				</IntlProvider>,
			);

			// The dedicated heading and explanatory line are shown.
			expect(
				screen.getByText(i18nMessages.unsupported_file_format.defaultMessage as string),
			).toBeInTheDocument();
			expect(
				screen.getByText(i18nMessages.archive_format_not_supported.defaultMessage as string),
			).toBeInTheDocument();

			// The generic failure copy is NOT shown for this case.
			expect(
				screen.queryByText(i18nMessages.something_went_wrong.defaultMessage as string),
			).not.toBeInTheDocument();
			expect(
				screen.queryByText(i18nMessages.couldnt_generate_preview.defaultMessage as string),
			).not.toBeInTheDocument();
		});
	});

	it('should render a child component', async () => {
		render(
			<IntlProvider locale="en">
				<ErrorMessage intl={fakeIntl} fileId="some-id" error={new MediaViewerError('unsupported')}>
					<Button testId="error-child-button">Child</Button>
				</ErrorMessage>
			</IntlProvider>,
		);
		expect(screen.getByTestId('error-child-button')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	describe('analytics', () => {
		const fileState: FileState = {
			id: '1',
			status: 'processing',
			mediaType: 'audio',
			mimeType: 'audio/mp3',
			name: 'me.mp3',
			size: 1,
		};

		const traceContext: MediaTraceContext = {
			traceId: getRandomTelemetryId(),
		};

		beforeEach(() => {
			asMock(createPreviewUnsupportedEvent).mockReset();
			asMock(createLoadFailedEvent).mockReset();
			jest.clearAllMocks();
		});

		it('should not trigger load fail event when displayed if error reason is "unsupported"', () => {
			const error = new MediaViewerError('unsupported');

			render(
				<IntlProvider locale="en">
					<ErrorMessage intl={fakeIntl} fileId="some-id" error={error} fileState={fileState}>
						<Button>Child</Button>
					</ErrorMessage>
				</IntlProvider>,
			);

			expect(createPreviewUnsupportedEvent).toHaveBeenCalledWith(fileState);
			expect(createLoadFailedEvent).not.toHaveBeenCalled();
		});

		it('should trigger load fail event when displayed if error reason not "unsupported"', () => {
			const error = new MediaViewerError('imageviewer-fetch-url');
			render(
				<IntlProvider locale="en">
					<ErrorMessage
						intl={fakeIntl}
						fileId={smallImageFileId.id}
						error={error}
						fileState={fileState}
						traceContext={traceContext}
					>
						<Button>Child</Button>
					</ErrorMessage>
				</IntlProvider>,
			);
			expect(createLoadFailedEvent).toHaveBeenCalledWith(
				smallImageFileId.id,
				error,
				fileState,
				traceContext,
			);
			expect(createPreviewUnsupportedEvent).not.toHaveBeenCalled();
		});

		it('should not trigger analytics and ufo events if supressAnalytics prop passed', () => {
			jest.clearAllMocks();
			mockfailMediaFileUfoExperience.mockClear();
			const error = new MediaViewerError('imageviewer-fetch-url');
			render(
				<IntlProvider locale="en">
					<ErrorMessage
						intl={fakeIntl}
						fileId={smallImageFileId.id}
						error={error}
						fileState={fileState}
						supressAnalytics={true}
					>
						<Button>Child</Button>
					</ErrorMessage>
				</IntlProvider>,
			);
			expect(createLoadFailedEvent).not.toHaveBeenCalled();
			expect(createPreviewUnsupportedEvent).not.toHaveBeenCalled();
			expect(mockfailMediaFileUfoExperience).not.toHaveBeenCalled();
		});

		it('should give unsupported payload for correct error', () => {
			ErrorMessage.getEventPayload(new MediaViewerError('unsupported'), 'some-id', fileState);
			expect(createPreviewUnsupportedEvent).toHaveBeenCalledWith(fileState);
			expect(createLoadFailedEvent).not.toHaveBeenCalled();
		});

		it('should give previewUnsupported payload for a non-decodable image MIME type', () => {
			ErrorMessage.getEventPayload(
				new MediaViewerError('imageviewer-unsupported-mime'),
				'some-id',
				fileState,
			);
			expect(createPreviewUnsupportedEvent).toHaveBeenCalledWith(fileState);
			expect(createLoadFailedEvent).not.toHaveBeenCalled();
		});

		it('should give external image fail payload for correct error', () => {
			ErrorMessage.getEventPayload(
				new MediaViewerError('imageviewer-external-onerror'),
				'some-id',
				fileState,
				traceContext,
			);
			expect(createLoadFailedEvent).toHaveBeenCalledWith(
				'some-id',
				new Error('imageviewer-external-onerror'),
				fileState,
				traceContext,
			);
			expect(createPreviewUnsupportedEvent).not.toHaveBeenCalled();
		});

		it('should give load fail for other MediaViewerErrors', () => {
			const error = new MediaViewerError('imageviewer-fetch-url');
			ErrorMessage.getEventPayload(error, 'some-id', fileState, traceContext);
			expect(createLoadFailedEvent).toHaveBeenCalledWith('some-id', error, fileState, traceContext);
			expect(createPreviewUnsupportedEvent).not.toHaveBeenCalled();
		});

		it('should trigger fail ufo event for error with fileStateFlags', () => {
			const error = new MediaViewerError('imageviewer-fetch-url');
			render(
				<IntlProvider locale="en">
					<ErrorMessage
						intl={fakeIntl}
						fileId={smallImageFileId.id}
						error={error}
						fileState={fileState}
						fileStateFlags={{
							wasStatusProcessing: false,
							wasStatusUploading: false,
						}}
					>
						<Button>Child</Button>
					</ErrorMessage>
				</IntlProvider>,
			);
			expect(mockfailMediaFileUfoExperience).toHaveBeenCalledWith({
				fileStateFlags: {
					wasStatusProcessing: false,
					wasStatusUploading: false,
				},
			});
		});
	});
});
