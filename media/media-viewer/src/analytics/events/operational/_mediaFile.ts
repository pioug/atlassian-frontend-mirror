import type {
	OperationalEventPayload,
	OperationalAttributes,
} from '@atlaskit/media-common/analytics/types';

/** common definition used by other mediaFile events */
export type MediaFileEventPayload<
	Attributes extends OperationalAttributes,
	Action extends
		| 'commenced'
		| 'loadSucceeded'
		| 'loadFailed'
		| 'previewUnsupported'
		| 'previewTooLarge'
		| 'zipEntryLoadSucceeded'
		| 'zipEntryLoadFailed'
		| 'downloadSucceeded'
		| 'downloadFailed',
> = OperationalEventPayload<Attributes, Action, 'mediaFile'>;
