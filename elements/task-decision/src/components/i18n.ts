import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	fieldsetLabel: {
		id: 'fabric.editor.fieldsetLabel',
		defaultMessage: 'Action Item List',
		description: 'Label for a list of tasks/ action items',
	},
	markTaskAsCompleted: {
		id: 'platform.taskDecision.markTaskAsCompleted',
		defaultMessage: 'Mark task as completed',
		description: 'Button to mark a task as complete in the editor',
	},
	markTaskAsNotCompleted: {
		id: 'platform.taskDecision.markTaskAsNotCompleted',
		defaultMessage: 'Mark task as not completed',
		description: 'Button to mark a task as not complete in the editor',
	},
});
