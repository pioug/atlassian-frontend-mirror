import type { EditorState, Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

export type InputRuleHandler = (
  state: EditorState,
  matchResult: RegExpExecArray,
  start: number,
  end: number,
) => Transaction | null;

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

export type OnHandlerApply = (
  state: EditorState,
  tr: Transaction,
  matchResult: RegExpExecArray,
) => void;

export interface InputRuleWrapper {
  match: RegExp;
  handler: InputRuleHandler;
  onHandlerApply?: OnHandlerApply;
}

export type MatchedRule = InputRuleWrapper & {
  result: RegExpExecArray;
};

export type OnInputEvent = (props: {
  state: EditorState;
  from: number;
  to: number;
}) => boolean;

export type OnBeforeRegexMatch = (tr: Transaction) => void;
