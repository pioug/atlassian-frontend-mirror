import type { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD } from './enums';
import type { OperationalAEP, ScreenAEP, TrackAEP } from './utils';

export type InlineCommentToolbarViewedAEP = ScreenAEP<
	ACTION.VIEWED,
	ACTION_SUBJECT.INLINE_COMMENT_TOOLBAR,
	undefined,
	{
		commentTargetType: string | undefined;
		hasExistingComments: boolean;
		isCommentButtonEnabled: boolean;
	},
	undefined
> & { name: 'inlineCommentToolbar' };

export type AnnotationActionType =
	| ACTION.INSERTED
	| ACTION.CLOSED
	| ACTION.EDITED
	| ACTION.DELETED
	| ACTION.OPENED
	| ACTION.RESOLVED
	| ACTION.VIEWED;

export type AnnotationErrorAEP = OperationalAEP<
	ACTION.ERROR,
	ACTION_SUBJECT.ANNOTATION,
	ACTION_SUBJECT_ID.INLINE_COMMENT,
	{
		errorReason?: string;
	}
>;

export type AnnotationAEP = TrackAEP<
	AnnotationActionType,
	ACTION_SUBJECT.ANNOTATION,
	ACTION_SUBJECT_ID.INLINE_COMMENT,
	AnnotationAEPAttributes,
	undefined
>;

export type AnnotationAEPAttributes =
	| undefined
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	| {}
	| AnnotationDraftAEPAttributes
	| AnnotationResolvedAEPAttributes;

export type AnnotationDraftAEPAttributes = {
	commentTargetType?: 'remixEmbed' | 'media' | 'text' | 'other';
	inlineNodeNames?: string[];
	inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.SHORTCUT;
	// overlap is how many other annotations are within or overlapping with the new selection
	overlap: number;
};

export type AnnotationResolvedAEPAttributes = {
	method: RESOLVE_METHOD;
};

export enum RESOLVE_METHOD {
	COMPONENT = 'component',
	CONSUMER = 'consumer',
	ORPHANED = 'orphaned',
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export enum VIEW_METHOD {
	BADGE = 'badge',
	COMMENT_BUTTON = 'commentButton',
}
