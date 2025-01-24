/*
 * ED-15646
 * Headings in list items are not supported in our schema.
 * As the markdown transformer is used by the paste plugin,
 * certain pastes will strip invalid lines as
 * prosemirror-markdown cannot conform to the schema
 */

import type MarkdownIt from 'markdown-it';
import type StateCore from 'markdown-it/lib/rules_core/state_core';
import type Token from 'markdown-it/lib/token';

function handleHeadingOpen(state: StateCore, token: Token, acc: Token[], index: number) {
	const isInListItem = state.tokens[index - 1]?.type === 'list_item_open';

	if (isInListItem) {
		acc.push(new state.Token('paragraph_open', 'p', 1));
	} else {
		acc.push(token);
	}
}

function handleHeadingClose(state: StateCore, token: Token, acc: Token[], index: number) {
	const isInListItem = state.tokens[index + 1]?.type === 'list_item_close';
	if (isInListItem) {
		acc.push(new state.Token('paragraph_close', 'p', -1));
	} else {
		acc.push(token);
	}
}

export default function (md: MarkdownIt) {
	md.core.ruler.after('inline', 'ignore-list-heading-md-plugin', function (state: StateCore) {
		state.tokens = state.tokens.reduce((acc: Token[], token, index) => {
			const { type } = token;
			if (type === 'heading_open') {
				handleHeadingOpen(state, token, acc, index);
			} else if (type === 'heading_close') {
				handleHeadingClose(state, token, acc, index);
			} else {
				acc.push(token);
			}
			return acc;
		}, []);
	});
}
