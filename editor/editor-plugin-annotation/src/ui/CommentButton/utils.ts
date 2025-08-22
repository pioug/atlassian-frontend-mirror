import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	MODE,
} from '@atlaskit/editor-common/analytics';
import { currentMediaNodeWithPos } from '@atlaskit/editor-common/media-single';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { AnnotationPlugin } from '../../annotationPluginType';
import { setInlineCommentDraftState } from '../../editor-commands';
import { isSelectionValid } from '../../pm-plugins/utils';
import { AnnotationSelectionType, type AnnotationProviders } from '../../types';

export const isButtonDisabled = ({
	state,
	api,
}: {
	api?: ExtractInjectionAPI<AnnotationPlugin>;
	state: EditorState | null;
}) => {
	const annotationSelectionType = state ? isSelectionValid(state) : AnnotationSelectionType.INVALID;
	return (
		annotationSelectionType === AnnotationSelectionType.DISABLED ||
		api?.connectivity?.sharedState?.currentState()?.mode === 'offline'
	);
};

export const shouldShowCommentButton = ({
	state,
	isVisible,
	annotationSelectionType,
}: {
	annotationSelectionType: AnnotationSelectionType;
	isVisible?: boolean;
	state: EditorState | null;
}) => {
	const isMediaSelected = state ? currentMediaNodeWithPos(state) : false;

	// comments on media can only be added via media floating toolbar
	if (
		isMediaSelected ||
		annotationSelectionType === AnnotationSelectionType.INVALID ||
		!isVisible
	) {
		return false;
	}

	return true;
};

export const fireOnClickAnalyticsEvent = ({
	api,
}: {
	api: ExtractInjectionAPI<AnnotationPlugin>;
}) => {
	api.analytics?.actions.fireAnalyticsEvent({
		action: ACTION.CLICKED,
		actionSubject: ACTION_SUBJECT.BUTTON,
		actionSubjectId: ACTION_SUBJECT_ID.CREATE_INLINE_COMMENT_FROM_HIGHLIGHT_ACTIONS_MENU,
		eventType: EVENT_TYPE.UI,
		attributes: {
			source: 'highlightActionsMenu',
			pageMode: 'edit',
		},
	});
};

const fireAnnotationErrorAnalyticsEvent = ({
	api,
	errorReason,
}: {
	api: ExtractInjectionAPI<AnnotationPlugin>;
	errorReason: string;
}) => {
	api.analytics?.actions?.fireAnalyticsEvent({
		action: ACTION.ERROR,
		actionSubject: ACTION_SUBJECT.ANNOTATION,
		actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
		eventType: EVENT_TYPE.OPERATIONAL,
		attributes: { errorReason },
	});
};

export const fireCommentButtonViewedAnalyticsEvent = ({
	api,
	isNonTextInlineNodeInludedInComment,
	annotationSelectionType,
}: {
	annotationSelectionType: AnnotationSelectionType;
	api?: ExtractInjectionAPI<AnnotationPlugin>;
	isNonTextInlineNodeInludedInComment: boolean;
}) => {
	api?.analytics?.actions.fireAnalyticsEvent({
		action: ACTION.VIEWED,
		actionSubject: ACTION_SUBJECT.BUTTON,
		actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
		eventType: EVENT_TYPE.UI,
		attributes: {
			isNonTextInlineNodeInludedInComment,
			isDisabled: annotationSelectionType === AnnotationSelectionType.DISABLED,
			inputMethod: INPUT_METHOD.FLOATING_TB,
			mode: MODE.EDITOR,
		},
	});
};

export const startCommentExperience = ({
	annotationProviders,
	api,
	state,
	dispatch,
}: {
	annotationProviders: AnnotationProviders;
	api: ExtractInjectionAPI<AnnotationPlugin>;
	dispatch: EditorView['dispatch'];
	state: EditorState;
}) => {
	const annotationManager = annotationProviders?.annotationManager;
	if (annotationManager) {
		annotationManager
			.checkPreemptiveGate()
			.then((canStartDraft) => {
				if (canStartDraft) {
					annotationProviders.createCommentExperience?.start({
						attributes: {
							pageClass: 'editor',
							commentType: 'inline',
						},
					});
					annotationProviders.createCommentExperience?.initExperience.start();

					const result = annotationManager.startDraft();
					if (!result.success) {
						// Fire an analytics event to indicate that the user has clicked the button
						// but the action was not completed, the result should contain a reason.
						fireAnnotationErrorAnalyticsEvent({
							api,
							errorReason: `toolbar-start-draft-failed/${result.reason}`,
						});
					}
				}
			})
			.catch(() => {
				fireAnnotationErrorAnalyticsEvent({
					api,
					errorReason: `toolbar-start-draft-preemptive-gate-error`,
				});
			});
		return true;
	} else {
		annotationProviders?.createCommentExperience?.start({
			attributes: {
				pageClass: 'editor',
				commentType: 'inline',
			},
		});
		annotationProviders?.createCommentExperience?.initExperience.start();

		return setInlineCommentDraftState(api?.analytics?.actions)(true)(state, dispatch);
	}
};
