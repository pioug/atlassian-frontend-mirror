import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import type { OperationalAEP } from './utils';

type AIUnhandledErrorCaughtAEP = OperationalAEP<
	ACTION.UNHANDLED_ERROR_CAUGHT,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.EXPERIENCE_APPLICATION,
	{ componentStack: string; errorMessage?: string }
>;

export type AIMarkdownConversionErrorCaughtAttributes = {
	errorType: 'markdownToProseMirrorError';
	errorSubType?: 'noProseMirrorDoc' | 'emptyProseMirrorDoc' | 'invalidProseMirrorDoc';
	componentStack: string;
	errorMessage?: string;
};

export type AIMarkdownConversionErrorCaughtAEP = OperationalAEP<
	ACTION.UNHANDLED_ERROR_CAUGHT,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.EXPERIENCE_APPLICATION,
	AIMarkdownConversionErrorCaughtAttributes
>;

export type AIEventPayload = AIUnhandledErrorCaughtAEP | AIMarkdownConversionErrorCaughtAEP;
