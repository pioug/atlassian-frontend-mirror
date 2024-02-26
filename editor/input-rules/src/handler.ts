import type {
  EditorState,
  PluginKey,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

import {
  leafNodeReplacementCharacter,
  MAX_REGEX_MATCH,
  TEXT_INPUT_RULE_TRANSACTION_KEY,
} from './constants';
import { isGapCursorSelection } from './editor-common';
import type {
  HandleInputEvent,
  InputRulePluginState,
  InputRuleWrapper,
  MatchedRule,
  OnBeforeRegexMatch,
  OnInputEvent,
} from './types';

type Options = {
  pluginKey: PluginKey;
  rules: InputRuleWrapper[];
  allowInsertTextOnDocument: boolean;
  onInputEvent?: OnInputEvent;
  onBeforeRegexMatch?: OnBeforeRegexMatch;
};

export const createInputEventHandler =
  ({
    rules,
    pluginKey,
    allowInsertTextOnDocument,
    onInputEvent,
    onBeforeRegexMatch,
  }: Options): HandleInputEvent =>
  ({ view, from, to, text }) => {
    if (view.composing) {
      return false;
    }

    const state = view.state;
    const $from = state.doc.resolve(from);

    if ($from.parent.type.spec.code) {
      return false;
    }
    if (onInputEvent && !onInputEvent({ state, from, to })) {
      return false;
    }

    const textBefore =
      $from.parent.textBetween(
        Math.max(0, $from.parentOffset - MAX_REGEX_MATCH),
        $from.parentOffset,
        undefined,
        leafNodeReplacementCharacter,
      ) + text;

    const result = findMatchOnRules({
      rules,
      textBefore,
      from,
      to,
      state,
    });

    if (!result) {
      return false;
    }

    const tr = allowInsertTextOnDocument
      ? state.tr.insertText(text, from, to)
      : state.tr;
    tr.setMeta(TEXT_INPUT_RULE_TRANSACTION_KEY, true);
    tr.setMeta(pluginKey, {
      textInserted: text,
      from: result.from,
      to: result.to,
      matchedRule: result.matchedRule,
    } as InputRulePluginState);

    if (onBeforeRegexMatch) {
      onBeforeRegexMatch(tr);
    }

    view.dispatch(tr);
    return true;
  };

type FindMatchOnRulesProps = {
  rules: InputRuleWrapper[];
  textBefore: string;
  from: number;
  to: number;
  state: EditorState;
};
type RuleMatchedResult = {
  from: number;
  to: number;
  matchedRule: MatchedRule;
};
function findMatchOnRules({
  rules,
  textBefore,
  from,
  to,
  state,
}: FindMatchOnRulesProps): RuleMatchedResult | null {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    // Some plugins like Typeahead require a whitespace before a trigger character.
    // We want them to fire inside a gap cursor. Yet, a gap cursor is not considered a whitespace,
    // and `textBefore` contains the text in the previous block before the gap cursor.
    // Here is a workaround: if we inside a gap cursor, match the input rule only against the last typed character
    // (which may be a typeahead trigger) and ignore the rest.
    const matchString: string = isGapCursorSelection(state.selection)
      ? textBefore.at(-1) ?? ''
      : textBefore;

    const match = rule.match.exec(matchString);
    if (!match) {
      continue;
    }

    const parentNodeStartAt = state.selection.$from.start();
    const offset = Math.max(
      0,
      state.selection.$from.parentOffset - MAX_REGEX_MATCH,
    );
    const fromFixed = Math.max(parentNodeStartAt + match.index + offset, 1);
    const transform: Transaction | null = rule.handler(
      state,
      match,
      fromFixed,
      to,
    );

    if (transform) {
      return {
        from: fromFixed,
        to,
        matchedRule: {
          ...rule,
          result: match,
        },
      };
    }
  }

  return null;
}
