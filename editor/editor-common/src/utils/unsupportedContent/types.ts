import {
	type ACTION,
	type ACTION_SUBJECT,
	type ACTION_SUBJECT_ID,
	type EVENT_TYPE,
} from '../../analytics';

type AEP<Action, ActionSubject, ActionSubjectID, Attributes, EventType> = {
	action: Action;
	actionSubject: ActionSubject;
	actionSubjectId?: ActionSubjectID;
	attributes?: Attributes;
	eventType: EventType;
};

type TrackAEP<Action, ActionSubject, ActionSubjectID, Attributes> = AEP<
	Action,
	ActionSubject,
	ActionSubjectID,
	Attributes,
	EVENT_TYPE.TRACK
>;

type UnsupportedContentEncounteredAEP = TrackAEP<
	ACTION.UNSUPPORTED_CONTENT_ENCOUNTERED,
	ACTION_SUBJECT.DOCUMENT,
	ACTION_SUBJECT_ID,
	{
		unsupportedNode: Record<string, any>;
		errorCode?: String;
	}
>;

export type UnsupportedContentPayload = UnsupportedContentEncounteredAEP;

export type UnsupportedContentTooltipPayload = AEP<
	ACTION.UNSUPPORTED_TOOLTIP_VIEWED,
	ACTION_SUBJECT.TOOLTIP,
	ACTION_SUBJECT_ID.ON_UNSUPPORTED_BLOCK | ACTION_SUBJECT_ID.ON_UNSUPPORTED_INLINE,
	{
		unsupportedNodeType: string | undefined;
	},
	EVENT_TYPE.UI
>;
