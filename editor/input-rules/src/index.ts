import type {
  InputRuleHandler,
  InputRuleWrapper,
  OnHandlerApply,
  OnInputEvent,
} from './types';

export {
  leafNodeReplacementCharacter,
  TEXT_INPUT_RULE_TRANSACTION_KEY,
  MAX_REGEX_MATCH,
} from './constants';
export { createInputRulePlugin } from './plugin';
export type {
  InputRuleWrapper,
  InputRuleHandler,
  OnInputEvent,
  OnHandlerApply,
};
