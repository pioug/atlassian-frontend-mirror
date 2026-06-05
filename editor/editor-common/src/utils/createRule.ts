import { closeHistory } from '@atlaskit/prosemirror-history';

import type { InputRuleHandler, InputRuleWrapper } from '../types';

export const createRule = (
	match: RegExp,
	handler: InputRuleHandler,
	allowsBackwardMatch: boolean = false,
): InputRuleWrapper => {
	return {
		match,
		handler,
		onHandlerApply: (_state, tr) => {
			closeHistory(tr);
		},
		allowsBackwardMatch,
	};
};
