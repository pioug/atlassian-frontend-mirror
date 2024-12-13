import { type PublicPluginAPI } from '@atlaskit/editor-common/types';
import {
	type TypeAheadHandler,
	type TypeAheadInputMethod,
} from '@atlaskit/editor-plugin-type-ahead';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EmojiDescription, EmojiProvider } from '@atlaskit/emoji';

import { emojiPluginKey } from '../emojiPlugin';
import { type EmojiPlugin } from '../emojiPluginType';

export const ACTIONS = {
	SET_PROVIDER: 'SET_PROVIDER',
	SET_RESULTS: 'SET_RESULTS',
	SET_ASCII_MAP: 'SET_ASCII_MAP',
};

export const setAsciiMap = (asciiMap: Map<string, EmojiDescription>) => (tr: Transaction) => {
	return tr.setMeta(emojiPluginKey, {
		action: ACTIONS.SET_ASCII_MAP,
		params: { asciiMap },
	});
};

export const openTypeAhead =
	(typeaheadHandler: TypeAheadHandler, api?: PublicPluginAPI<EmojiPlugin>) =>
	(inputMethod: TypeAheadInputMethod) => {
		return Boolean(
			api?.typeAhead?.actions.open({
				triggerHandler: typeaheadHandler,
				inputMethod,
			}),
		);
	};

export const setProvider = (provider?: EmojiProvider) => (tr: Transaction) => {
	return tr.setMeta(emojiPluginKey, {
		action: ACTIONS.SET_PROVIDER,
		params: { provider },
	});
};
