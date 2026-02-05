import { fg } from '@atlaskit/platform-feature-flags';

import { RESERVED_CHARACTERS_REGEX, RESERVED_WORDS } from '../constants/reserved-words';

/**
 * Quote the provided JQL string (and escape any existing quotes) if the input string uses reserved characters.
 *
 * @param jqlString String to sanitise
 */
export const sanitiseJqlString = (jqlString: string): string => {
	// If the string contains special characters, perform a proper escape
	if (RESERVED_CHARACTERS_REGEX.test(jqlString)) {
		return `"${jqlString.replace(/"/g, '\\"')}"`;
	}

	// If the string matches a reserved word, wrap it in quotes since any
	// special characters would have been caught above already
	if (RESERVED_WORDS.has(jqlString.toLowerCase()) && fg('queue-setting-page-jql-bug')) {
		return `"${jqlString}"`;
	}

	return jqlString;
};
