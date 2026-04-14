import { defineMessages } from 'react-intl';

export const commonMessages = defineMessages({
	unknownError: {
		id: 'jql-editor.common.validation.unknown-error',
		defaultMessage: 'Unable to parse the query.',
		description: 'Message shown when the query could not be parsed due to an unknown error.',
	},
});
