import type { Match } from '@atlaskit/adf-schema';
import { linkify } from '@atlaskit/adf-schema';

import { DONTLINKIFY_REGEXP } from './hyperlink';

/* eslint-enable require-unicode-regexp */
/**
 * Instance of class LinkMatcher are used in autoformatting in place of Regex.
 * Hence it has been made similar to regex with an exec method.
 * Extending it directly from class Regex was introducing some issues, thus that has been avoided.
 */
export class LinkMatcher {
	static create(): RegExp {
		class LinkMatcherRegex {
			exec(str: string): Match | null {
				const stringsBySpace = str.slice(0, str.length - 1).split(' ');
				const lastStringBeforeSpace = stringsBySpace[stringsBySpace.length - 1];
				const isLastStringValid = lastStringBeforeSpace.length > 0;

				if (!str.endsWith(' ') || !isLastStringValid) {
					return null;
				}

				if (DONTLINKIFY_REGEXP.test(lastStringBeforeSpace)) {
					return null;
				}

				const links: null | Match[] = linkify.match(lastStringBeforeSpace);
				if (!links || links.length === 0) {
					return null;
				}
				const lastMatch = links[links.length - 1];
				const lastLink: Match = links[links.length - 1];

				lastLink.input = str.substring(lastMatch.index);
				lastLink.length = lastLink.lastIndex - lastLink.index + 1;
				lastLink.index = str.lastIndexOf(lastStringBeforeSpace) + lastMatch.index;

				return lastLink;
			}
		}

		return new LinkMatcherRegex() as RegExp;
	}
}
