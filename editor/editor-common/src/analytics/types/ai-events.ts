import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID } from './enums';
import type { OperationalAEP } from './utils';

type AIUnhandledErrorCaughtAEP = OperationalAEP<
	ACTION.UNHANDLED_ERROR_CAUGHT,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.EXPERIENCE_APPLICATION,
	{ componentStack: string; errorMessage?: string }
>;

export type AIMarkdownConversionErrorCaughtAttributes = {
	componentStack: string;
	errorMessage?: string;
	errorSubType?: 'noProseMirrorDoc' | 'emptyProseMirrorDoc' | 'invalidProseMirrorDoc';
	errorType: 'markdownToProseMirrorError';
};

export type AIMarkdownConversionErrorCaughtAEP = OperationalAEP<
	ACTION.UNHANDLED_ERROR_CAUGHT,
	ACTION_SUBJECT.EDITOR_PLUGIN_AI,
	ACTION_SUBJECT_ID.EXPERIENCE_APPLICATION,
	AIMarkdownConversionErrorCaughtAttributes
>;

export type AIEventPayload = AIUnhandledErrorCaughtAEP | AIMarkdownConversionErrorCaughtAEP;
