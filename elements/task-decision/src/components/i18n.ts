import { defineMessages } from 'react-intl-next';

export const messages: {
	fieldsetLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	markTaskAsCompleted: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	markTaskAsNotCompleted: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	decisionAriaLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	undefinedDecisionAriaLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
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
	decisionAriaLabel: {
		id: 'platform.taskDecision.decisionAriaLabel',
		defaultMessage: 'Decision',
		description: 'Descriptive text for a decision element',
	},
	undefinedDecisionAriaLabel: {
		id: 'platform.taskDecision.undefinedDecisionAriaLabel',
		defaultMessage: 'Undefined decision',
		description: 'Descriptive text for an undefined decision element',
	},
});
