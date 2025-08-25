import type { RichMediaLayout } from '@atlaskit/adf-schema';

import type { GuidelineTypes, WidthTypes } from '../../guideline/types';

import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { EventInput } from './type-ahead';
import type { ChangeTypeAEP, TrackAEP, UIAEP } from './utils';

type MediaBorderActionType = ACTION.UPDATED | ACTION.ADDED | ACTION.DELETED;

export type MediaBorderTrackAction = TrackAEP<
	MediaBorderActionType,
	ACTION_SUBJECT.MEDIA,
	ACTION_SUBJECT_ID.BORDER,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	undefined
>;

type MediaLinkActionType =
	| ACTION.ADDED
	| ACTION.EDITED
	| ACTION.DELETED
	| ACTION.VISITED
	| ACTION.ERRORED;

export type MediaLinkAEP = TrackAEP<
	MediaLinkActionType,
	ACTION_SUBJECT.MEDIA,
	ACTION_SUBJECT_ID.LINK,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	undefined
>;

type MediaCaptionActionType = ACTION.DELETED | ACTION.EDITED | ACTION.ADDED;

export type CaptionTrackAction = TrackAEP<
	MediaCaptionActionType,
	ACTION_SUBJECT.MEDIA_SINGLE,
	ACTION_SUBJECT_ID.CAPTION,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	undefined
>;

type MediaAltTextAttributes = {
	mediaType: 'image' | 'file' | 'external';
	type: 'mediaSingle' | 'mediaInline';
};

type MediaAltTextAction = TrackAEP<
	ACTION.ADDED | ACTION.CLOSED | ACTION.EDITED | ACTION.CLEARED | ACTION.OPENED,
	ACTION_SUBJECT.MEDIA,
	ACTION_SUBJECT_ID.ALT_TEXT,
	MediaAltTextAttributes,
	undefined
>;

type MediaUIAction = UIAEP<
	ACTION.EDITED,
	ACTION_SUBJECT.MEDIA_SINGLE | ACTION_SUBJECT.EMBEDS,
	ACTION_SUBJECT_ID.RESIZED,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	undefined
>;

type MediaResizeAttributes = {
	inputMethod: EventInput;
	layout: string;
	parentNode?: string;
	snapType: GuidelineTypes;
	width?: number;
	widthType: WidthTypes;
};

export type MediaResizeTrackAction = UIAEP<
	ACTION.EDITED,
	ACTION_SUBJECT.MEDIA_SINGLE | ACTION_SUBJECT.EMBEDS,
	ACTION_SUBJECT_ID.RESIZED,
	MediaResizeAttributes,
	undefined
>;

type MediaInputResizeAttributes = {
	inputMethod: EventInput;
	layout: RichMediaLayout;
	parentNode?: string;
	validation: 'valid' | 'greater-than-max' | 'less-than-min';
	width: number;
};

export type MediaInputResizeTrackAction = UIAEP<
	ACTION.EDITED,
	ACTION_SUBJECT.MEDIA_SINGLE | ACTION_SUBJECT.EMBEDS,
	ACTION_SUBJECT_ID.RESIZED,
	MediaInputResizeAttributes,
	undefined
>;

export type MediaSwitchType =
	| ACTION_SUBJECT_ID.MEDIA_INLINE
	| ACTION_SUBJECT_ID.MEDIA_GROUP
	| ACTION_SUBJECT_ID.MEDIA_SINGLE;

type ChangeMediaAEP = ChangeTypeAEP<
	ACTION_SUBJECT.MEDIA,
	undefined,
	{ newType: MediaSwitchType; previousType: MediaSwitchType },
	undefined
>;

export type MediaViewerEventAction = UIAEP<
	ACTION.OPENED,
	ACTION_SUBJECT.MEDIA_VIEWER,
	ACTION_SUBJECT_ID.MEDIA,
	{ inputMethod: INPUT_METHOD.DOUBLE_CLICK; nodeType: string },
	undefined
>;

export type MediaAltTextActionType =
	| ACTION.ADDED
	| ACTION.CLOSED
	| ACTION.EDITED
	| ACTION.CLEARED
	| ACTION.OPENED;

export type MediaEventPayload =
	| MediaLinkAEP
	| MediaAltTextAction
	| MediaUIAction
	| MediaResizeTrackAction
	| MediaInputResizeTrackAction
	| MediaBorderTrackAction
	| CaptionTrackAction
	| ChangeMediaAEP
	| MediaViewerEventAction;
