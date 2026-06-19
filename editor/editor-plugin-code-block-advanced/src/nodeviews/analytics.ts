import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';

export type CodeFoldingTrigger = 'gutter' | 'placeholder';

export const getCodeFoldingAnalyticsPayload = (
	folded: boolean,
	trigger: CodeFoldingTrigger,
): AnalyticsEventPayload => ({
	action: ACTION.TOGGLE_CODE_FOLDING,
	actionSubject: ACTION_SUBJECT.CODE_BLOCK,
	attributes: {
		folded,
		trigger,
	},
	eventType: EVENT_TYPE.TRACK,
});
