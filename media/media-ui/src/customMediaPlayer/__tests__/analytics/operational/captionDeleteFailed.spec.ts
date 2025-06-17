import { createCaptionDeleteFailedOperationalEvent } from '../../../analytics';

describe('createCaptionDeleteFailedOperationalEvent', () => {
	const mockCaptionAttributes = {
		selectedTrackIndex: 0,
		availableCaptionTracks: 1,
		selectedTrackLanguage: 'en',
		artifactName: 'test-caption',
	};

	const mockError = new Error('Test error');

	it('should create delete failed event with all required parameters', () => {
		const event = createCaptionDeleteFailedOperationalEvent(
			'video',
			mockCaptionAttributes,
			'test-file-id',
			'test-trace-id',
			mockError,
		);

		expect(event).toEqual({
			eventType: 'operational',
			action: 'deleteFailed',
			actionSubject: 'mediaPlayerCaption',
			actionSubjectId: 'test-caption',
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
				failReason: 'delete-fail',
				error: 'Error',
				errorDetail: 'Test error',
			},
		});
	});
});
