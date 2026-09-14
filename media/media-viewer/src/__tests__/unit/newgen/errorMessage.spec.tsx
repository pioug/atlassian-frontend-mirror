jest.mock('../../../analytics/events/operational/loadFailed', () => ({
	createLoadFailedEvent: jest.fn(),
}));
jest.mock('../../../analytics/events/operational/previewUnsupported', () => ({
	createPreviewUnsupportedEvent: jest.fn(),
}));
jest.mock('../../../analytics/events/operational/previewTooLarge', () => ({
	createPreviewTooLargeEvent: jest.fn(),
}));
import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { IntlProvider } from 'react-intl';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { MediaViewerError } from '../../../MediaViewerError';
import * as ufoWrapper from '../../../analytics/ufoExperiences';
import { ErrorMessage } from '../../../errorMessage';
import Button from '@atlaskit/button/standard-button';
import { fakeIntl, smallImageFileId, asMock } from '@atlaskit/media-test-helpers';
import { getRandomTelemetryId, type MediaTraceContext } from '@atlaskit/media-common';
import { type FileState } from '@atlaskit/media-client';
import { messages as i18nMessages } from '@atlaskit/media-ui/messages';
import { createLoadFailedEvent } from '../../../analytics/events/operational/loadFailed';
import { createPreviewTooLargeEvent } from '../../../analytics/events/operational/previewTooLarge';
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

		describe('size-aware failure UI (platform_media_too_large_preview_state)', () => {
			it.each([
				['codeviewer-file-size-exceeds'],
				['archiveviewer-codeviewer-file-size-exceeds'],
			] as const)(
				'shows a dedicated "File is too large to preview" heading for reason=%s when the gate is on',
				(reason) => {
					passGate('platform_media_too_large_preview_state');
					render(
						<IntlProvider locale="en">
							<ErrorMessage fileId="some-id" intl={fakeIntl} error={new MediaViewerError(reason)} />
						</IntlProvider>,
					);

					expect(
						screen.getByText(i18nMessages.file_too_large_to_preview.defaultMessage as string),
					).toBeInTheDocument();
					expect(
						screen.getByText(i18nMessages.file_too_large_description.defaultMessage as string),
					).toBeInTheDocument();

					// Neither the generic failure copy nor the legacy "couldn't load the
					// file" line is shown for this case.
					expect(
						screen.queryByText(i18nMessages.something_went_wrong.defaultMessage as string),
					).not.toBeInTheDocument();
					expect(
						screen.queryByText(i18nMessages.couldnt_generate_preview.defaultMessage as string),
					).not.toBeInTheDocument();
					expect(
						screen.queryByText(i18nMessages.couldnt_load_file.defaultMessage as string),
					).not.toBeInTheDocument();
				},
			);

			it('keeps the legacy "couldn\'t load the file" copy for an oversized code file when the gate is off', () => {
				failGate('platform_media_too_large_preview_state');
				render(
					<IntlProvider locale="en">
						<ErrorMessage
							fileId="some-id"
							intl={fakeIntl}
							error={new MediaViewerError('codeviewer-file-size-exceeds')}
						/>
					</IntlProvider>,
				);

				expect(
					screen.getByText(i18nMessages.something_went_wrong.defaultMessage as string),
				).toBeInTheDocument();
				expect(
					screen.getByText(i18nMessages.couldnt_load_file.defaultMessage as string),
				).toBeInTheDocument();
				expect(
					screen.queryByText(i18nMessages.file_too_large_to_preview.defaultMessage as string),
				).not.toBeInTheDocument();
			});

			it('does not show the too-large copy for an unrelated failure, regardless of gate state', () => {
				// The gate is only ever consulted once the reason is already
				// identified as a too-large reason, so for an unrelated reason the
				// gate value has no bearing and is never checked.
				render(
					<IntlProvider locale="en">
						<ErrorMessage
							fileId="some-id"
							intl={fakeIntl}
							error={new MediaViewerError('imageviewer-fetch-url')}
						/>
					</IntlProvider>,
				);

				expect(
					screen.getByText(i18nMessages.something_went_wrong.defaultMessage as string),
				).toBeInTheDocument();
				expect(
					screen.queryByText(i18nMessages.file_too_large_to_preview.defaultMessage as string),
				).not.toBeInTheDocument();
			});
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
			asMock(createPreviewTooLargeEvent).mockReset();
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

		describe('size-aware failure UI (platform_media_too_large_preview_state)', () => {
			it('should not trigger load fail event when displayed if error reason is a too-large reason and the gate is on', () => {
				passGate('platform_media_too_large_preview_state');
				const error = new MediaViewerError('codeviewer-file-size-exceeds');

				render(
					<IntlProvider locale="en">
						<ErrorMessage intl={fakeIntl} fileId="some-id" error={error} fileState={fileState}>
							<Button>Child</Button>
						</ErrorMessage>
					</IntlProvider>,
				);

				expect(createPreviewTooLargeEvent).toHaveBeenCalledWith(error, fileState);
				expect(createLoadFailedEvent).not.toHaveBeenCalled();
				expect(createPreviewUnsupportedEvent).not.toHaveBeenCalled();
			});

			it('should trigger load fail event for the same reason when the gate is off', () => {
				failGate('platform_media_too_large_preview_state');
				const error = new MediaViewerError('codeviewer-file-size-exceeds');

				render(
					<IntlProvider locale="en">
						<ErrorMessage intl={fakeIntl} fileId="some-id" error={error} fileState={fileState}>
							<Button>Child</Button>
						</ErrorMessage>
					</IntlProvider>,
				);

				expect(createLoadFailedEvent).toHaveBeenCalledWith('some-id', error, fileState, undefined);
				expect(createPreviewTooLargeEvent).not.toHaveBeenCalled();
			});

			it('should give previewTooLarge payload for both too-large reasons when the gate is on, distinguishing the reason', () => {
				passGate('platform_media_too_large_preview_state');

				const codeViewerError = new MediaViewerError('codeviewer-file-size-exceeds');
				const archiveError = new MediaViewerError('archiveviewer-codeviewer-file-size-exceeds');

				ErrorMessage.getEventPayload(codeViewerError, 'some-id', fileState);
				ErrorMessage.getEventPayload(archiveError, 'some-id', fileState);

				expect(createPreviewTooLargeEvent).toHaveBeenCalledTimes(2);
				// Each call is given its own error so the resulting payload's `failReason`
				// can distinguish an oversized item from an oversized ZIP entry.
				expect(createPreviewTooLargeEvent).toHaveBeenNthCalledWith(1, codeViewerError, fileState);
				expect(createPreviewTooLargeEvent).toHaveBeenNthCalledWith(2, archiveError, fileState);
				expect(createLoadFailedEvent).not.toHaveBeenCalled();
			});

			it('should still give load fail payload for an unrelated reason, regardless of gate state', () => {
				// The gate is only ever consulted once the reason is already
				// identified as a too-large reason, so for an unrelated reason the
				// gate value has no bearing and is never checked.
				const error = new MediaViewerError('imageviewer-fetch-url');

				ErrorMessage.getEventPayload(error, 'some-id', fileState, traceContext);

				expect(createLoadFailedEvent).toHaveBeenCalledWith(
					'some-id',
					error,
					fileState,
					traceContext,
				);
				expect(createPreviewTooLargeEvent).not.toHaveBeenCalled();
			});
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
