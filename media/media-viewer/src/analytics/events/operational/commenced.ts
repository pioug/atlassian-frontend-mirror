import { WithFileAttributes } from '@atlaskit/media-common';
import { MediaFileEventPayload } from './_mediaFile';

export type CommencedAttributes = WithFileAttributes;

export type CommencedEventPayload = MediaFileEventPayload<
  CommencedAttributes,
  'commenced'
>;

export const createCommencedEvent = (
  fileId: string,
): CommencedEventPayload => ({
  eventType: 'operational',
  action: 'commenced',
  actionSubject: 'mediaFile',
  attributes: {
    fileAttributes: {
      fileId: fileId,
    },
  },
});
