import { defineMessages } from 'react-intl-next';

export const toolbarMediaMessages: {
    toolbarMediaTitle: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	toolbarMediaTitle: {
		id: 'fabric.editor.toolbarMediaTitle',
		defaultMessage: 'Add image, video, or file',
		description: 'a label for an icon that describes files, videos and images',
	},
});
