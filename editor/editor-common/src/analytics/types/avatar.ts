import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import { type UIAEP } from './utils';

type AvatarButtonViewedAEP = UIAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.BUTTON,
	ACTION_SUBJECT_ID.AVATAR_GROUP_PLUGIN,
	Object,
	undefined
>;

export type AvatarEventPayload = AvatarButtonViewedAEP;
