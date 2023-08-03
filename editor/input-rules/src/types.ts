import type {
  InputRuleHandler,
  InputRuleWrapper,
  OnHandlerApply,
} from '@atlaskit/editor-common/types';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type HandleInputEvent = (props: {
  view: EditorView;
  from: number;
  to: number;
  text: string;
}) => boolean;

export type InputRulePluginState = {
  matchedRule: MatchedRule;
  from: number;
  to: number;
  textInserted: string;
} | null;

export type MatchedRule = InputRuleWrapper & {
  result: RegExpExecArray;
};

export type OnInputEvent = (props: {
  state: EditorState;
  from: number;
  to: number;
}) => boolean;

export type OnBeforeRegexMatch = (tr: Transaction) => void;

export type {
  /**
   * @deprecated Please import this type from @atlaskit/editor-commmon/types
   */
  InputRuleHandler,
  /**
   * @deprecated Please import this type from @atlaskit/editor-commmon/types
   */
  OnHandlerApply,
  /**
   * @deprecated Please import this type from @atlaskit/editor-commmon/types
   */
  InputRuleWrapper,
};
