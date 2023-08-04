import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

export type InputRuleHandler = (
  state: EditorState,
  matchResult: RegExpExecArray,
  start: number,
  end: number,
) => Transaction | null;

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
