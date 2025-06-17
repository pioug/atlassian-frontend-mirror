import { createCaptionUploadSucceededOperationalEvent } from '../../../analytics';

describe('createCaptionUploadSucceededOperationalEvent', () => {
	const mockCaptionAttributes = {
		selectedTrackIndex: 0,
		availableCaptionTracks: 1,
		selectedTrackLanguage: 'en',
		artifactName: 'test-caption',
	};

	it('should create upload succeeded event with all required parameters', () => {
		const event = createCaptionUploadSucceededOperationalEvent(
			'video',
			mockCaptionAttributes,
			'test-file-id',
			'test-trace-id',
		);

		expect(event).toEqual({
			eventType: 'operational',
			action: 'uploadSucceeded',
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
			},
		});
	});
});
