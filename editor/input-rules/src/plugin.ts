import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';

import { TEXT_INPUT_RULE_TRANSACTION_KEY } from './constants';
import { createInputEventHandler } from './handler';
import type {
  InputRulePluginState,
  InputRuleWrapper,
  OnBeforeRegexMatch,
  OnInputEvent,
} from './types';

type Options = {
  allowInsertTextOnDocument?: boolean;
  onInputEvent?: OnInputEvent;
  onBeforeRegexMatch?: OnBeforeRegexMatch;
};

export function createInputRulePlugin(
  pluginName: string,
  rules: InputRuleWrapper[],
  options: Options = {},
): Plugin {
  const onInputEvent = options?.onInputEvent;
  const onBeforeRegexMatch = options?.onBeforeRegexMatch;
  const allowInsertTextOnDocument = Boolean(options?.allowInsertTextOnDocument);
  const pluginKey = new PluginKey(`inputRulePlugin__${pluginName}`);

  const inputEvent = createInputEventHandler({
    allowInsertTextOnDocument,
    pluginKey,
    rules,
    onInputEvent,
    onBeforeRegexMatch,
  });

  const plugin: Plugin = new Plugin<InputRulePluginState>({
    key: pluginKey,
    state: {
      init() {
        return null;
      },
      apply(tr, prev) {
        const stored = tr.getMeta(pluginKey);
        if (stored) {
          return stored;
        }

        return tr.selectionSet || tr.docChanged ? null : prev;
      },
    },

    appendTransaction: (transactions, oldState, newState) => {
      const transactionWithInputRuleMeta = transactions.find(tr =>
        tr.getMeta(pluginKey),
      );

      const pluginState:
        | InputRulePluginState
        | undefined
        | null = transactionWithInputRuleMeta?.getMeta(pluginKey);

      if (!pluginState || !transactionWithInputRuleMeta) {
        return null;
      }

      const { matchedRule, from, to } = pluginState;

      const { result } = matchedRule;

      const mappedTo = transactionWithInputRuleMeta.mapping.map(to);

      const tr = matchedRule.handler(newState, result, from, mappedTo);

      if (!tr) {
        return null;
      }

      tr.setMeta(TEXT_INPUT_RULE_TRANSACTION_KEY, true);
      if (matchedRule.onHandlerApply) {
        matchedRule.onHandlerApply(newState, tr, matchedRule.result);
      }

      return tr;
    },

    props: {
      handleTextInput(view, from, to, text) {
        return inputEvent({
          view,
          from,
          to,
          text,
        });
      },
      handleDOMEvents: {
        compositionend: view => {
          setTimeout(() => {
            const selection = view.state.selection;
            if (!(selection instanceof TextSelection)) {
              return;
            }
            const { $cursor } = selection;

            if ($cursor) {
              inputEvent({
                view,
                from: $cursor.pos,
                to: $cursor.pos,
                text: '',
              });
            }
          });

          return false;
        },
      },
    },

    // @ts-ignore This is used by prosemirror-view to apply input rules on text input event.
    // However, there is no typing ffor this, yet.
    isInputRules: true,
  });

  return plugin;
}
