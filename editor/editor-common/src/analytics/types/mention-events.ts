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
		duration: number;
		queryLength?: number;
		spaceInQuery?: boolean;
		upKeyCount: number;
		downKeyCount: number;
		sessionId: string;
	},
	undefined
>;

type MentionTypeaheadInviteItemViewedPayload = UIAEP<
	ACTION.RENDERED,
	ACTION_SUBJECT.INVITE_ITEM,
	undefined,
	{
		componentName: string;
		containerId: string;
		objectId: string;
		childObjectId?: string;
		userRole?: string;
		sessionId: string;
	},
	undefined
>;

type MentionTypeaheadInviteItemClickedPayload = UIAEP<
	ACTION.CLICKED | ACTION.PRESSED,
	ACTION_SUBJECT.INVITE_ITEM,
	undefined,
	{
		componentName: string;
		duration: number;
		queryLength?: number;
		spaceInQuery?: boolean;
		upKeyCount: number;
		downKeyCount: number;
		containerId: string;
		objectId: string;
		childObjectId?: string;
		userRole?: string;
		sessionId: string;
		keyboardKey?: string;
	},
	undefined
>;

type MentionTypeaheadInsertedPayload = UIAEP<
	ACTION.CLICKED | ACTION.PRESSED,
	ACTION_SUBJECT.MENTION_TYPEAHEAD,
	undefined,
	{
		sessionId: string;
		duration: number;
		position?: number;
		keyboardKey?: string;
		source?: string;
		queryLength?: number;
		spaceInQuery?: boolean;
		isSpecial: boolean;
		accessLevel: string;
		userType?: string;
		userId: string;
		upKeyCount: number;
		downKeyCount: number;
		memberCount?: number | null;
		includesYou?: boolean | null;
		taskListId?: string;
		taskItemId?: string;
		localId?: string;
		containerId?: string;
		objectId?: string;
		childObjectId?: string;
	},
	undefined
>;

type MentionTypeaheadRenderedPayload = OperationalAEP<
	ACTION.RENDERED,
	ACTION_SUBJECT.MENTION_TYPEAHEAD | ACTION_SUBJECT.TEAM_MENTION_TYPEAHEAD,
	undefined,
	{
		componentName: string;
		duration: number;
		userIds: Array<string> | null;
		teams: Array<{
			teamId: string;
			includesYou: boolean;
			memberCount: number;
		}> | null;
		queryLength?: number;
		spaceInQuery?: boolean;
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
