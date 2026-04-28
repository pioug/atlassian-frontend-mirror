import { defineMessages } from 'react-intl';

export const nativeEmbedToolbarMessages: {
	alwaysShowTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	expandPreview: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	refresh: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	setEmbedType: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	summarise: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	alwaysShowTitle: {
		id: 'fabric.editor.alwaysShowTitle.non-final',
		defaultMessage: 'Show embed title',
		description:
			'Label for the toggle to enable or disable the behaviour of always showing the title of the embed.',
	},
	refresh: {
		id: 'fabric.editor.refresh.non-final',
		defaultMessage: 'Refresh',
		description: 'Label for the button to refresh the embedded link.',
	},
	summarise: {
		id: 'fabric.editor.nativeEmbeds.summarise',
		defaultMessage: 'Summarize',
		description: 'Label for the button to summarize the content of the embedded link using AI.',
	},
	setEmbedType: {
		id: 'fabric.editor.setEmbedType.non-final',
		defaultMessage: 'Set embed type',
		description: 'Label for the button to set the type of embed.',
	},
	expandPreview: {
		id: 'fabric.editor.nativeEmbeds.expandPreview',
		defaultMessage: 'Expand preview',
		description: 'Label for the button to open the embed in a fullscreen preview.',
	},
});
