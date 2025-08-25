import {
	type ComponentNames,
	type Actions as MentionActions,
	type SliNames,
} from '@atlaskit/mention/types';

import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import { type OperationalAEP, type UIAEP } from './utils';

type MentionTypeaheadCancelledEventPayload = UIAEP<
	ACTION.CANCELLED,
	ACTION_SUBJECT.MENTION_TYPEAHEAD,
	undefined,
	{
		componentName: string;
		downKeyCount: number;
		duration: number;
		queryLength?: number;
		sessionId: string;
		spaceInQuery?: boolean;
		upKeyCount: number;
	},
	undefined
>;

type MentionTypeaheadInviteItemViewedPayload = UIAEP<
	ACTION.RENDERED,
	ACTION_SUBJECT.INVITE_ITEM,
	undefined,
	{
		childObjectId?: string;
		componentName: string;
		containerId: string;
		objectId: string;
		sessionId: string;
		userRole?: string;
	},
	undefined
>;

type MentionTypeaheadInviteItemClickedPayload = UIAEP<
	ACTION.CLICKED | ACTION.PRESSED,
	ACTION_SUBJECT.INVITE_ITEM,
	undefined,
	{
		childObjectId?: string;
		componentName: string;
		containerId: string;
		downKeyCount: number;
		duration: number;
		keyboardKey?: string;
		objectId: string;
		queryLength?: number;
		sessionId: string;
		spaceInQuery?: boolean;
		upKeyCount: number;
		userRole?: string;
	},
	undefined
>;

type MentionTypeaheadInsertedPayload = UIAEP<
	ACTION.CLICKED | ACTION.PRESSED,
	ACTION_SUBJECT.MENTION_TYPEAHEAD,
	undefined,
	{
		accessLevel: string;
		childObjectId?: string;
		containerId?: string;
		downKeyCount: number;
		duration: number;
		includesYou?: boolean | null;
		isSpecial: boolean;
		keyboardKey?: string;
		localId?: string;
		memberCount?: number | null;
		objectId?: string;
		position?: number;
		queryLength?: number;
		sessionId: string;
		source?: string;
		spaceInQuery?: boolean;
		taskItemId?: string;
		taskListId?: string;
		upKeyCount: number;
		userId: string;
		userType?: string;
	},
	undefined,
	string | undefined,
	string | undefined,
	string | undefined
>;

type MentionTypeaheadRenderedPayload = OperationalAEP<
	ACTION.RENDERED,
	ACTION_SUBJECT.MENTION_TYPEAHEAD | ACTION_SUBJECT.TEAM_MENTION_TYPEAHEAD,
	undefined,
	{
		componentName: string;
		duration: number;
		queryLength?: number;
		spaceInQuery?: boolean;
		teams: Array<{
			includesYou: boolean;
			memberCount: number;
			teamId: string;
		}> | null;
		userIds: Array<string> | null;
		xProductMentionsLength?: number;
	}
>;

type MentionProviderErroredPayload = OperationalAEP<
	ACTION.ERRORED,
	ACTION_SUBJECT.MENTION,
	ACTION_SUBJECT_ID.MENTION_PROVIDER,
	{
		reason: string;
	}
>;

// Attributes that are just an object with a string key and value
export type MentionAttributes = {
	[key: string]: string;
};

type MentionSliEventPayload = OperationalAEP<
	MentionActions,
	ComponentNames | SliNames,
	undefined,
	{
		componentName: string;
	} & MentionAttributes
>;

export type MentionEventPayload =
	| MentionTypeaheadCancelledEventPayload
	| MentionTypeaheadInviteItemViewedPayload
	| MentionTypeaheadInviteItemClickedPayload
	| MentionTypeaheadInsertedPayload
	| MentionTypeaheadRenderedPayload
	| MentionProviderErroredPayload
	| MentionSliEventPayload;
