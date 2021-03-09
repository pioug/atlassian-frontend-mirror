import {
  OperationalEventPayload,
  OperationalAttributes,
} from '@atlaskit/media-common';

/** common definition used by other mediaFile events */
export type MediaFileEventPayload<
  Attributes extends OperationalAttributes,
  Action extends
    | 'commenced'
    | 'loadSucceeded'
    | 'loadFailed'
    | 'previewUnsupported'
    | 'zipEntryLoadSucceeded'
    | 'zipEntryLoadFailed'
> = OperationalEventPayload<Attributes, Action, 'mediaFile'>;
