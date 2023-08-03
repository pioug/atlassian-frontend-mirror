import type {
  InputRuleHandler,
  InputRuleWrapper,
  OnHandlerApply,
} from '@atlaskit/editor-common/types';

import type { OnInputEvent } from './types';

export {
  leafNodeReplacementCharacter,
  TEXT_INPUT_RULE_TRANSACTION_KEY,
  MAX_REGEX_MATCH,
} from './constants';
export { createInputRulePlugin } from './plugin';
export type {
  /**
   * @deprecated Please import this type from @atlaskit/editor-commmon/types
   */
  InputRuleWrapper,
  /**
   * @deprecated Please import this type from @atlaskit/editor-commmon/types
   */
  InputRuleHandler,
  OnInputEvent,
  /**
   * @deprecated Please import this type from @atlaskit/editor-commmon/types
   */
  OnHandlerApply,
};

export { createRule, createPlugin } from './utils';
