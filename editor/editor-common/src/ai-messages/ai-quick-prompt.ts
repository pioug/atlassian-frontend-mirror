import { defineMessages } from 'react-intl-next';

export const aiQuickPromptMessages: {
	nudgeText: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	nudgeText: {
		id: 'fabric.editor.ai.quickPrompt.nudge',
		defaultMessage: '<code>Tab</code> to improve writing',
		description:
			'Nudge text shown inline after a paragraph to suggest the user ' +
			'press Tab to trigger AI improve writing. <code> tags wrap the ' +
			'key name and are rendered as styled code spans.',
	},
});
