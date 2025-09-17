import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import type { OperationalAEP } from './utils';

type AILocalIdNotFoundErrorAEP = OperationalAEP<
	ACTION.LOCAL_ID_NOT_FOUND,
	ACTION_SUBJECT.AI_STREAMING,
	ACTION_SUBJECT_ID.EXPERIENCE_APPLICATION,
	{ docSize: number | undefined; localId: string }
>;

export type AIStreamingEventPayload = AILocalIdNotFoundErrorAEP;
