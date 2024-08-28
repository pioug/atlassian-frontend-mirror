import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import type { OperationalAEP } from './utils';

type MediaUploadAEP<Action, Attributes> = OperationalAEP<
	Action,
	ACTION_SUBJECT.MEDIA,
	ACTION_SUBJECT_ID.UPLOAD_MEDIA,
	Attributes
>;

type SourceAttrs = { mediaUploadSource: 'local' | 'url' };

type MediaUploadCommencedAEP = MediaUploadAEP<ACTION.UPLOAD_COMMENCED, SourceAttrs>;
type MediaUploadSuccessAEP = MediaUploadAEP<ACTION.UPLOAD_SUCCEEDED, SourceAttrs>;
type MediaUploadFailAEP = MediaUploadAEP<ACTION.UPLOAD_FAILED, SourceAttrs & { reason: string }>;

export type MediaUploadEventPayload =
	| MediaUploadCommencedAEP
	| MediaUploadSuccessAEP
	| MediaUploadFailAEP;
