import { defineMessages } from 'react-intl';

export const externalMediaMessages: {
	externalMediaFile: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	externalMediaFile: {
		id: 'fabric.editor.externalMediaFile',
		defaultMessage: 'External media file',
		description:
			'Displayed as a tooltip and accessibility label for an info icon badge when an externally hosted media file is shown in the editor.',
	},
});
