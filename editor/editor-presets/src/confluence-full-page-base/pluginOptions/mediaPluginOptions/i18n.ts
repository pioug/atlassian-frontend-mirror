// oxlint-disable-next-line @atlassian/no-restricted-imports
import { defineMessages } from 'react-intl';

export const i18n = defineMessages({
	invalidAltText: {
		id: 'editor-presets-confluence.media.alt-text.invalid',
		defaultMessage:
			// eslint-disable-next-line no-restricted-syntax
			"We aren’t able to accept every possible character in Alt text. All Unicode letters and numbers are OK, but these are the only acceptable symbols: , ' . - _ ( ).",
		description:
			"Error message to explain that alt text for an image on a page can only contain any Unicode alphanumerics along with any characters from the following symbol set: , ' . - _ ( )",
	},
});
