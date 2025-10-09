import type { AutoformatHandler } from '@atlaskit/editor-common/provider-factory';
import { processRawValue } from '@atlaskit/editor-common/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { closeHistory } from '@atlaskit/prosemirror-history';

import type { CustomAutoformatState } from '../types';

import type { InputRuleHander } from './input-rules';
import { autoformatAction } from './utils';

export const buildHandler = (_regex: string, handler: AutoformatHandler): InputRuleHander => {
	return async (view, match, start, end) => {
		const replacementPromise = handler(match.slice(1, match.length - 1));

		// queue the position and match pair so that we can remap across transactions
		// while we wait for the replacmentPromise to resolve
		view.dispatch(
			autoformatAction(view.state.tr, {
				action: 'matched',
				match: match,
				start,
				end,
			}),
		);

		// ask the provider to give us an ADF node to replace the text with
		const replacementData = await replacementPromise;
		const replacementNode = processRawValue(view.state.schema, replacementData);

		view.dispatch(
			autoformatAction(view.state.tr, {
				action: 'resolved',
				matchString: match[0],
				replacement: replacementNode,
			}),
		);

		return replacementData;
	};
};

/**
 * Shift enter adds an Object Replacement Character (/ufffc) after
 * the first word in the soft break line. Text between replaces this
 * with a '|' as it's a non-text node. We still want to replaceWith
 * on a string starting with an Object Replacement Character.
 */
export const isSoftBreakMatch = (docText: string, match: string[]): boolean => {
	const REPLACEMENT_CHARACTER = '\ufffc';

	const docTextStartChar = docText[0];
	const docTextEndSlice = docText.slice(1);

	const matchStartChar = match[0][0];
	const matchEndSlice = match[0].slice(1);

	const slicesMatch = docTextEndSlice === matchEndSlice;
	const isAlternator = docTextStartChar === '|';
	const isObjReplaceChar = matchStartChar === REPLACEMENT_CHARACTER;
	return slicesMatch && isAlternator && isObjReplaceChar;
};

export const completeReplacements = (view: EditorView, state: CustomAutoformatState) => {
	const { inlineCard } = view.state.schema.nodes;

	state.matches.forEach((completedMatch) => {
		const matchingRequests = state.resolving.filter(
			(candidate) => candidate.match[0] === completedMatch.matchString,
		);

		let tr = view.state.tr;
		matchingRequests.forEach((request) => {
			const { match, start, end } = request;
			const { replacement } = completedMatch;

			const prefix = match[1];
			const suffix = match[match.length - 1];

			const matchEndPos = end + suffix.length;

			// only permit inlineCard as replacement target for now
			if (!replacement || (replacement.type !== inlineCard && !replacement.isText)) {
				return;
			}

			// get the current document text, adding # or | if we cross node boundaries
			const docText = view.state.doc.textBetween(start, matchEndPos, '#', '|');

			const canAutoformatAfterSoftbreak = isSoftBreakMatch(docText, match);

			// only replace if text still remains the same as when typed at the start
			if (docText === match[0] || canAutoformatAfterSoftbreak) {
				tr = tr.replaceWith(
					tr.mapping.map(start + prefix.length),
					tr.mapping.map(end, -1),
					replacement,
				);
			}
		});

		// clear this match from plugin state now that we've processed it
		tr = autoformatAction(tr, {
			action: 'finish',
			matchString: completedMatch.matchString,
		});

		// and dispatch the replacement, closing history for cmd+z to allow undo separately
		view.dispatch(closeHistory(tr));
	});
};
