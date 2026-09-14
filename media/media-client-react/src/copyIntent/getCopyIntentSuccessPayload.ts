export const getCopyIntentSuccessPayload = (
	fileId = '',
): {
	eventType: string;
	action: string;
	actionSubject: string;
	attributes: {
		fileAttributes: {
			fileId: string;
		};
	};
} => {
	return {
		eventType: 'operational',
		action: 'succeeded',
		actionSubject: 'mediaCopyIntent',
		attributes: {
			fileAttributes: {
				fileId,
			},
		},
	};
};
