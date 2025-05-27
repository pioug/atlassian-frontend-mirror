import { css } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled

import { token } from '@atlaskit/tokens';

const akEditorLineHeight = 1.714;

export const TaskDecisionSharedCssClassName = {
	DECISION_CONTAINER: 'decisionItemView-content-wrap',
	TASK_CONTAINER: 'taskItemView-content-wrap',
	TASK_ITEM: 'task-item',
	TASK_CHECKBOX_CONTAINER: 'task-item-checkbox-wrap',
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const tasksAndDecisionsStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.taskItemView-content-wrap, .${TaskDecisionSharedCssClassName.DECISION_CONTAINER}`]: {
			position: 'relative',
			minWidth: 48,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${TaskDecisionSharedCssClassName.DECISION_CONTAINER}`]: {
			marginTop: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${TaskDecisionSharedCssClassName.TASK_CONTAINER}`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			"span[contenteditable='false']": {
				height: `${akEditorLineHeight}em`,
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
		[`.${TaskDecisionSharedCssClassName.TASK_ITEM}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: akEditorLineHeight,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[data-task-local-id]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"span[contenteditable='false']": {
			height: `${akEditorLineHeight}em`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		"span[contenteditable='false'] + div": {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: `${akEditorLineHeight}em`,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[data-task-list-local-id]': {
		margin: `${token('space.150', '12px')} 0 0 0`,

		// If task item is not first in the list then set margin top to 4px.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'div + div': {
			marginTop: token('space.050', '4px'),
		},
	},

	// If task list is not first in the document then set margin top to 4px.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[data-task-list-local-id] div[data-task-list-local-id]': {
		marginTop: token('space.050', '4px'),
		marginLeft: token('space.300', '24px'),
	},

	// When action list is inside panel
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-panel__content': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'> div[data-task-list-local-id]:first-child': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			margin: '0 !important',
		},
	},
});
