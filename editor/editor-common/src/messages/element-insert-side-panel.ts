import { defineMessages } from 'react-intl';

export const elementInsertSidePanel: {
	title: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	title: {
		id: 'fabric.editor.elementInsertSidePanel.title',
		defaultMessage: 'Insert',
		description:
			'Heading text displayed at the top of the element insert side panel that slides open in the editor, allowing users to browse and insert content elements.',
	},
});
