import { UIAEP } from './utils';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from './enums';

type AvatarButtonViewedAEP = UIAEP<
  ACTION.VIEWED,
  ACTION_SUBJECT.BUTTON,
  ACTION_SUBJECT_ID.AVATAR_GROUP_PLUGIN,
  {},
  undefined
>;

export type AvatarEventPayload = AvatarButtonViewedAEP;
