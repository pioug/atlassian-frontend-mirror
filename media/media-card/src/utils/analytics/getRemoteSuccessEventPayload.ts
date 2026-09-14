import type { CardPreviewAttributes, RemoteSuccessEventPayload } from './analytics';

export const getRemoteSuccessEventPayload = (
	cardPreviewAttributes: CardPreviewAttributes,
): RemoteSuccessEventPayload => ({
	eventType: 'operational',
	action: 'Remote-success',
	actionSubject: 'mediaCardCache',
	attributes: {
		cardPreviewAttributes,
	},
});
