import { createCaptionDeleteSucceededOperationalEvent } from '../../../analytics';

describe('createCaptionDeleteSucceededOperationalEvent', () => {
	const mockCaptionAttributes = {
		selectedTrackIndex: 0,
		availableCaptionTracks: 1,
		selectedTrackLanguage: 'en',
		artifactName: 'test-caption',
	};

	it('should create delete succeeded event with all required parameters', () => {
		const event = createCaptionDeleteSucceededOperationalEvent(
			'video',
			mockCaptionAttributes,
			'test-file-id',
			'test-trace-id',
		);

		expect(event).toEqual({
			eventType: 'operational',
			action: 'deleteSucceeded',
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
			},
		});
	});
});
