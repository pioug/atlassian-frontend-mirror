import { defineMessages } from 'react-intl-next';

export const tasksAndDecisionsMessages: {
	taskPlaceholder: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	decisionPlaceholder: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	editAccessTitle: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	requestToEditDescription: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	requestToEdit: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	dismiss: {
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
	taskList: {
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
	taskPlaceholder: {
		id: 'fabric.editor.taskPlaceholder',
		defaultMessage: "Type your action, use '@' to assign to someone.",
		description: 'Placeholder description for an empty action/task in the editor',
	},
	decisionPlaceholder: {
		id: 'fabric.editor.decisionPlaceholder',
		defaultMessage: 'Add a decision…',
		description: 'Placeholder description for an empty decision in the editor',
	},
	editAccessTitle: {
		id: 'fabric.editor.editAccessTitle',
		defaultMessage: 'You need edit access',
		description: 'Title in the popup when we click on action item checkbox without edit permission',
	},
	requestToEditDescription: {
		id: 'fabric.editor.requestToEditDescription',
		defaultMessage: 'When you request access, the page owner will receive a notification.',
		description:
			'Description in the popup when we click on action item checkbox without edit permission',
	},
	requestToEdit: {
		id: 'fabric.editor.requestToEdit',
		defaultMessage: 'Request to edit',
		description:
			'Button in the popup when we click on action item checkbox without edit permission',
	},
	dismiss: {
		id: 'fabric.editor.requestToEditDismiss',
		defaultMessage: 'Dismiss',
		description: 'Button in the popup when we click on dismiss without edit permission',
	},
	markTaskAsCompleted: {
		id: 'fabric.editor.taskDecision.markTaskAsCompleted',
		defaultMessage: 'Mark task as completed',
		description: 'Button to mark a task as complete in the editor',
	},
	markTaskAsNotCompleted: {
		id: 'fabric.editor.taskDecision.markTaskAsNotCompleted',
		defaultMessage: 'Mark task as not completed',
		description: 'Button to mark a task as not complete in the editor',
	},
	taskList: {
		id: 'fabric.editor.taskList',
		defaultMessage: 'Task list',
		description: 'Label for the task list in the editor',
	},
	decisionAriaLabel: {
		id: 'fabric.editor.decisionAriaLabel',
		defaultMessage: 'Decision',
		description: 'Descriptive text for a decision element',
	},
	undefinedDecisionAriaLabel: {
		id: 'fabric.editor.undefinedDecisionAriaLabel',
		defaultMessage: 'Undefined decision',
		description: 'Descriptive text for an undefined decision element',
	},
});
