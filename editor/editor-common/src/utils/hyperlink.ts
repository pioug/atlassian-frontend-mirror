// File has been copied to packages/editor/editor-plugin-ai/src/provider/markdown-transformer/utils/hyperlink.ts
// If changes are made to this file, please make the same update in the linked file.

import type { Match } from '@atlaskit/adf-schema';
import { linkify } from '@atlaskit/adf-schema';
import type { Node, Schema, Slice } from '@atlaskit/editor-prosemirror/model';

import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../analytics/types/enums';
import type { AnalyticsEventPayload } from '../analytics/types/events';
import type { InputMethodInsertLink } from '../analytics/types/insert-events';

import { FILEPATH_REGEXP } from './FILEPATH_REGEXP';
import { getLinkDomain } from './getLinkDomain';
import { normalizeUrl } from './normalizeUrl';
import { shouldAutoLinkifyMatch } from './should-auto-linkify-tld';
import { mapSlice } from './slice';

// Don't linkify if starts with $ or {
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
export const DONTLINKIFY_REGEXP: RegExp = /^(\$|\{)/;

/**
 * Linkify content in a slice (eg. after a rich text paste)
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function linkifyContent(schema: Schema): (slice: Slice) => Slice {
	return (slice: Slice): Slice =>
		mapSlice(slice, (node, parent) => {
			const isAllowedInParent = !parent || parent.type !== schema.nodes.codeBlock;
			const link = node.type.schema.marks.link;
			if (link === undefined) {
				throw new Error('Link not in schema - unable to linkify content');
			}
			if (isAllowedInParent && node.isText && !link.isInSet(node.marks)) {
				const linkified = [] as Node[];
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const text = node.text!;

				const matches = findLinkMatches(text).filter(shouldAutoLinkifyMatch);

				let pos = 0;
				const filepaths = findFilepaths(text);
				matches.forEach((match) => {
					if (isLinkInMatches(match.index, filepaths)) {
						return;
					}

					if (match.index > 0) {
						linkified.push(node.cut(pos, match.index));
					}
					linkified.push(
						node
							.cut(match.index, match.lastIndex)
							.mark(link.create({ href: normalizeUrl(match.url) }).addToSet(node.marks)),
					);
					pos = match.lastIndex;
				});
				if (pos < text.length) {
					linkified.push(node.cut(pos));
				}
				return linkified;
			}
			return node;
		});
}

// eslint-disable-next-line jsdoc/require-jsdoc, @atlaskit/volt-strict-mode/no-multiple-exports
export function isFromCurrentDomain(url: string): boolean {
	if (!window || !window.location) {
		return false;
	}
	const currentDomain = window.location.hostname;
	const linkDomain = getLinkDomain(url);
	return currentDomain === linkDomain;
}

/**
 * Fetch linkify matches from text
 * @param text Input text from a node
 * @returns Array of linkify matches. Returns empty array if text is empty or no matches found;
 */
function findLinkMatches(text: string): Match[] {
	if (text === '') {
		return [];
	}
	return linkify.match(text) || [];
}

interface filepathMatch {
	endIndex: number;
	startIndex: number;
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const findFilepaths = (text: string, offset: number = 0): Array<filepathMatch> => {
	// Creation of a copy of the RegExp is necessary as lastIndex is stored on it when we run .exec()
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp -- Ignored via go/ees005
	const localRegExp = new RegExp(FILEPATH_REGEXP);
	let match;
	const matchesList: filepathMatch[] = [];
	const maxFilepathSize = 260;
	// Ignored via go/ees005
	// eslint-disable-next-line no-cond-assign
	while ((match = localRegExp.exec(text)) !== null) {
		const start = match.index + offset;
		let end = localRegExp.lastIndex + offset;
		if (end - start > maxFilepathSize) {
			end = start + maxFilepathSize;
		} // We don't care about big strings of text that are pretending to be filepaths!!
		matchesList.push({
			startIndex: start,
			endIndex: end,
		});
	}
	return matchesList;
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isLinkInMatches = (linkStart: number, matchesList: Array<filepathMatch>): boolean => {
	for (let i = 0; i < matchesList.length; i++) {
		if (linkStart >= matchesList[i].startIndex && linkStart < matchesList[i].endIndex) {
			return true;
		}
	}
	return false;
};

// eslint-disable-next-line jsdoc/require-jsdoc, @atlaskit/volt-strict-mode/no-multiple-exports
export function getLinkCreationAnalyticsEvent(
	inputMethod: InputMethodInsertLink,
	url: string,
): AnalyticsEventPayload {
	return {
		action: ACTION.INSERTED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId: ACTION_SUBJECT_ID.LINK,
		attributes: { inputMethod, fromCurrentDomain: isFromCurrentDomain(url) },
		eventType: EVENT_TYPE.TRACK,
		nonPrivacySafeAttributes: {
			linkDomain: getLinkDomain(url),
		},
	};
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { FILEPATH_REGEXP } from './FILEPATH_REGEXP';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { LinkMatcher } from './LinkMatcher';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { normalizeUrl } from './normalizeUrl';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getLinkDomain } from './getLinkDomain';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { canLinkBeCreatedInRange } from './canLinkBeCreatedInRange';
