import type { ScreenEventPayload, ScreenAttributes } from '@atlaskit/media-common/analytics/types';

export type PasswordPdfScreenEventPayload = Omit<
	ScreenEventPayload<ScreenAttributes, 'mediaViewerPasswordPdfScreen'>,
	'attributes'
>;

export const createPasswordPdfScreenEvent = (): PasswordPdfScreenEventPayload => ({
	eventType: 'screen',
	action: 'viewed',
	actionSubject: 'mediaViewerPasswordPdfScreen',
	name: 'mediaViewerPasswordPdfScreen',
});
