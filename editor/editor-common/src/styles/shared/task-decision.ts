/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { akEditorLineHeight, akEditorTableCellMinWidth } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const TaskDecisionSharedCssClassName = {
	DECISION_CONTAINER: 'decisionItemView-content-wrap',
	TASK_CONTAINER: 'taskItemView-content-wrap',
	TASK_ITEM: 'task-item',
	TASK_CHECKBOX_CONTAINER: 'task-item-checkbox-wrap',
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const tasksAndDecisionsStyles = css`
	.ProseMirror {
		.taskItemView-content-wrap,
		.${TaskDecisionSharedCssClassName.DECISION_CONTAINER} {
			position: relative;
			min-width: ${akEditorTableCellMinWidth}px;
		}

		.${TaskDecisionSharedCssClassName.DECISION_CONTAINER} {
			margin-top: 0;
		}

		.${TaskDecisionSharedCssClassName.TASK_CONTAINER} {
			span[contenteditable='false'] {
				height: ${akEditorLineHeight}em;
			}
		}

		.${TaskDecisionSharedCssClassName.TASK_ITEM} {
			line-height: ${akEditorLineHeight};
		}
	}

	div[data-task-local-id] {
		span[contenteditable='false'] {
			height: ${akEditorLineHeight}em;
		}
		span[contenteditable='false'] + div {
			line-height: ${akEditorLineHeight}em;
		}
	}

	div[data-task-list-local-id] {
		margin: ${token('space.150', '12px')} 0 0 0;
	}

	div[data-task-list-local-id] {
		// If task item is not first in the list then set margin top to 4px.
		div + div {
			margin-top: ${token('space.050', '4px')};
		}
	}

	// If task list is not first in the document then set margin top to 4px.
	div[data-task-list-local-id] div[data-task-list-local-id] {
		margin-top: ${token('space.050', '4px')};
		margin-left: ${token('space.300', '24px')};
	}

	/* When action list is inside panel */
	.ak-editor-panel__content {
		> div[data-task-list-local-id]:first-child {
			margin: 0 0 0 0 !important;
		}
	}
`;
