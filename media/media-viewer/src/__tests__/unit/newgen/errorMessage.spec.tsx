jest.mock('../../../analytics/events/operational/loadFailed', () => ({
	createLoadFailedEvent: jest.fn(),
}));
jest.mock('../../../analytics/events/operational/previewUnsupported', () => ({
	createPreviewUnsupportedEvent: jest.fn(),
}));
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { mount } from 'enzyme';
import * as ufoWrapper from '../../../analytics/ufoExperiences';
import { ErrorMessage } from '../../../errorMessage';
import { MediaViewerError } from '../../../errors';
import Button from '@atlaskit/button/standard-button';
import { fakeIntl, smallImageFileId, asMock } from '@atlaskit/media-test-helpers';
import { getRandomHex, type MediaTraceContext } from '@atlaskit/media-common';
import { type FileState } from '@atlaskit/media-client';
import { messages as i18nMessages } from '@atlaskit/media-ui';
import { createLoadFailedEvent } from '../../../analytics/events/operational/loadFailed';
import { createPreviewUnsupportedEvent } from '../../../analytics/events/operational/previewUnsupported';

const mockfailMediaFileUfoExperience = jest.spyOn(ufoWrapper, 'failMediaFileUfoExperience');

describe('Error Message', () => {
	describe('Mapping error reason to message text', () => {
		it('should map error reason to translated message', () => {
			const el = mount(
				<IntlProvider locale="en">
					<ErrorMessage
						fileId="some-id"
						intl={fakeIntl}
						error={new MediaViewerError('itemviewer-file-failed-processing-status')}
					/>
				</IntlProvider>,
			);
			expect(el.text()).toContain(i18nMessages.image_format_invalid_error.defaultMessage);
		});
	});

	it('should render a child component', () => {
		const el = mount(
			<IntlProvider locale="en">
				<ErrorMessage intl={fakeIntl} fileId="some-id" error={new MediaViewerError('unsupported')}>
					<Button />
				</ErrorMessage>
			</IntlProvider>,
		);
		expect(el.find(Button)).toHaveLength(1);
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
			traceId: getRandomHex(8),
		};

		beforeEach(() => {
			asMock(createPreviewUnsupportedEvent).mockReset();
			asMock(createLoadFailedEvent).mockReset();
			jest.clearAllMocks();
		});

		it('should not trigger load fail event when displayed if error reason is "unsupported"', () => {
			const error = new MediaViewerError('unsupported');

			mount(
				<IntlProvider locale="en">
					<ErrorMessage intl={fakeIntl} fileId="some-id" error={error} fileState={fileState}>
						<Button />
					</ErrorMessage>
				</IntlProvider>,
			);

			expect(createPreviewUnsupportedEvent).toHaveBeenCalledWith(fileState);
			expect(createLoadFailedEvent).not.toHaveBeenCalled();
		});

		it('should trigger load fail event when displayed if error reason not "unsupported"', () => {
			const error = new MediaViewerError('imageviewer-fetch-url');
			mount(
				<IntlProvider locale="en">
					<ErrorMessage
						intl={fakeIntl}
						fileId={smallImageFileId.id}
						error={error}
						fileState={fileState}
						traceContext={traceContext}
					>
						<Button />
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
			jest.resetAllMocks();
			const error = new MediaViewerError('imageviewer-fetch-url');
			mount(
				<IntlProvider locale="en">
					<ErrorMessage
						intl={fakeIntl}
						fileId={smallImageFileId.id}
						error={error}
						fileState={fileState}
						supressAnalytics={true}
					>
						<Button />
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
			mount(
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
						<Button />
					</ErrorMessage>
				</IntlProvider>,
			);
			expect(mockfailMediaFileUfoExperience).toBeCalledWith({
				fileStateFlags: {
					wasStatusProcessing: false,
					wasStatusUploading: false,
				},
			});
		});
	});
});
