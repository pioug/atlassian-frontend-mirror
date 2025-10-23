// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import { defineMessages } from 'react-intl-next';

export const limitedModeMessages = defineMessages({
	limitedModeTitle: {
		id: 'fabric.editor.limitedModeTitle',
		defaultMessage: 'Speed improvements',
		description:
			'Title for flag shown when some functionality is disabled in a page in order to improve the pages speed.',
	},
	limitedModeDescriptionWithLink: {
		id: 'fabric.editor.limitedModeDescription',
		defaultMessage:
			'To increase speed and response time <learnMoreLink>some editing features are limited</learnMoreLink>.',
		description:
			'Description for flag shown when some functionality is disabled in a page in order to improve the pages speed. This description contains a link to learn more about limited mode.',
	},
	limitedModeDescriptionWithoutLink: {
		id: 'fabric.editor.limitedModeDescriptionWithoutLink',
		defaultMessage: 'To increase speed and response time some editing features are limited.',
		description:
			'Description for flag shown when some functionality is disabled in a page in order to improve the pages speed. This description does not contain a link to learn more about limited mode.',
	},
});
