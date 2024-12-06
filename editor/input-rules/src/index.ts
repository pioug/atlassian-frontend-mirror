/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json
import type { OnInputEvent } from './types';

export {
	leafNodeReplacementCharacter,
	TEXT_INPUT_RULE_TRANSACTION_KEY,
	MAX_REGEX_MATCH,
} from './constants';
export { createInputRulePlugin } from './plugin';
export type { OnInputEvent };

export { createPlugin } from './utils';
