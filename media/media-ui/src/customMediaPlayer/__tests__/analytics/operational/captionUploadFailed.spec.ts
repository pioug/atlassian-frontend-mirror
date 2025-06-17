import { createCaptionUploadFailedOperationalEvent } from '../../../analytics';

describe('createCaptionUploadFailedOperationalEvent', () => {
	const mockCaptionAttributes = {
		selectedTrackIndex: 0,
		availableCaptionTracks: 1,
		selectedTrackLanguage: 'en',
		artifactName: 'test-caption',
	};

	const mockError = new Error('Test error');

	it('should create upload failed event with all required parameters', () => {
		const event = createCaptionUploadFailedOperationalEvent(
			'video',
			mockCaptionAttributes,
			'test-file-id',
			'test-trace-id',
			mockError,
		);

		expect(event).toEqual({
			eventType: 'operational',
			action: 'uploadFailed',
			actionSubject: 'mediaPlayerCaption',
			actionSubjectId: 'test-file-id',
			attributes: {
				type: 'video',
				captionAttributes: {
					selectedTrackIndex: 0,
					availableCaptionTracks: 1,
					selectedTrackLanguage: 'en',
					artifactName: 'test-caption',
				},
				fileAttributes: {
					fileId: 'test-file-id',
				},
				traceContext: {
					traceId: 'test-trace-id',
				},
				failReason: 'upload-fail',
				error: 'Error',
				errorDetail: 'Test error',
			},
		});
	});
});
