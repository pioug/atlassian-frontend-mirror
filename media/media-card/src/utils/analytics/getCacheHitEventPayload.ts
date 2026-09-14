import type { CacheHitEventPayload, CardPreviewAttributes } from './analytics';

export const getCacheHitEventPayload = (
	cardPreviewAttributes: CardPreviewAttributes,
): CacheHitEventPayload => ({
	eventType: 'operational',
	action: 'cache-hit',
	actionSubject: 'mediaCardCache',
	attributes: {
		cardPreviewAttributes,
	},
});
