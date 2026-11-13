import { defineMessages } from 'react-intl';

export const captionMessages: {
	placeholder: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	placeholderWithClickAgainPrompt: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	placeholderWithDoubleClickPrompt: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	placeholder: {
		id: 'fabric.editor.captionPlaceholder',
		defaultMessage: 'Add a caption',
		description: 'Placeholder description for an empty (new) caption in the editor',
	},
	placeholderWithClickAgainPrompt: {
		id: 'fabric.editor.captionPlaceholderWithClickAgainPrompt',
		defaultMessage: 'Add a caption - click again to preview',
		description:
			'Placeholder description to prompt users to add a caption and click already selected media again to preview',
	},
	placeholderWithDoubleClickPrompt: {
		id: 'fabric.editor.captionPlaceholderWithDoubleClickPrompt',
		defaultMessage: 'Add a caption - double-click to preview',
		description:
			'Placeholder description to prompt users to add a caption and double click media to preview',
	},
});
