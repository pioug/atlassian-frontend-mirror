import { type ScreenEventPayload, type ScreenAttributes } from '@atlaskit/media-common';

export type PasswordPdfScreenEventPayload = Omit<
  ScreenEventPayload<ScreenAttributes, 'mediaViewerPasswordPdfScreen'>,
  'attributes'
>;

export const createPasswordPdfScreenEvent =
  (): PasswordPdfScreenEventPayload => ({
    eventType: 'screen',
    action: 'viewed',
    actionSubject: 'mediaViewerPasswordPdfScreen',
    name: 'mediaViewerPasswordPdfScreen',
  });
