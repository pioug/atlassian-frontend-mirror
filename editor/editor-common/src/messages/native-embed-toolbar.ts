import { defineMessages } from 'react-intl';

/**
 * @private
 * @deprecated Native embed toolbar messages are now owned by
 * `@atlassian/editor-plugin-native-embeds`. Use
 * `nativeEmbedToolbarMessages` from
 * `@atlassian/editor-plugin-native-embeds/src/messages/native-embed-toolbar`
 * instead. This export is kept temporarily for backwards compatibility.
 */
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
		id: 'fabric.editor.nativeEmbeds.alwaysShowTitle',
		defaultMessage: 'Show embed title',
		description:
			'Label for the toggle to enable or disable the behaviour of always showing the title of the embed.',
	},
	expandPreview: {
		id: 'fabric.editor.nativeEmbeds.expandPreview',
		defaultMessage: 'Expand',
		description: 'Label for the button to expand the embed to fullscreen.',
	},
	refresh: {
		id: 'fabric.editor.nativeEmbeds.refresh',
		defaultMessage: 'Refresh',
		description: 'Label for the button to refresh the embedded link.',
	},
	setEmbedType: {
		id: 'fabric.editor.nativeEmbeds.setEmbedType',
		defaultMessage: 'Set embed type',
		description: 'Label for the button to set the type of embed.',
	},
	summarise: {
		id: 'fabric.editor.nativeEmbeds.summarise',
		defaultMessage: 'Summarize',
		description: 'Label for the button to summarize the content of the embedded link using AI.',
	},
});
