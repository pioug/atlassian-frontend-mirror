import type { Providers } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  NextEditorPlugin,
  PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type {
  EditorState,
  ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { buildHandler, completeReplacements } from './doc';
import type { InputRule } from './input-rules';
import { triggerInputRule } from './input-rules';
import reducers from './reducers';
import type { CustomAutoformatAction, CustomAutoformatState } from './types';
import { getPluginState, pluginKey } from './utils';

export const createPMPlugin = ({ providerFactory }: PMPluginFactoryParams) => {
  const rules: Array<InputRule> = [];

  return new SafePlugin({
    state: {
      init(): CustomAutoformatState {
        return {
          resolving: [],
          matches: [],
        };
      },

      apply(
        tr: ReadonlyTransaction,
        prevPluginState: CustomAutoformatState,
      ): CustomAutoformatState {
        if (!prevPluginState) {
          return prevPluginState;
        }

        // remap positions
        const remappedPluginState: CustomAutoformatState = {
          ...prevPluginState,
          resolving: prevPluginState.resolving.map(candidate => ({
            ...candidate,
            start: tr.mapping.map(candidate.start),
            end: tr.mapping.map(candidate.end, -1),
          })),
        };

        const meta: CustomAutoformatAction | undefined = tr.getMeta(pluginKey);
        if (!meta) {
          return remappedPluginState;
        }

        return reducers(remappedPluginState, meta);
      },
    },
    props: {
      handleTextInput(
        view: EditorView,
        from: number,
        to: number,
        text: string,
      ) {
        triggerInputRule(view, rules, from, to, text);
        return false;
      },
      handleKeyDown: keydownHandler({
        Enter: (
          _state: EditorState,
          _dispatch?: unknown,
          view?: EditorView,
        ) => {
          if (view) {
            triggerInputRule(
              view,
              rules,
              view.state.selection.from,
              view.state.selection.to,
              '',
            );
          }
          return false;
        },
      }),
    },

    view() {
      const handleProvider = (
        name: string,
        provider?: Providers['autoformattingProvider'],
      ) => {
        if (name !== 'autoformattingProvider' || !provider) {
          return;
        }

        provider.then(async autoformattingProvider => {
          const ruleset = await autoformattingProvider.getRules();

          Object.keys(ruleset).forEach(rule => {
            const inputRule: InputRule = {
              matchTyping: new RegExp('(\\s+|^)' + rule + '(\\s|,|\\.)$'),
              matchEnter: new RegExp('(\\s+|^)' + rule + '()$'),
              handler: buildHandler(rule, ruleset[rule]),
            };

            rules.push(inputRule);
          });
        });
      };

      providerFactory.subscribe('autoformattingProvider', handleProvider);

      return {
        update(view: EditorView) {
          const currentState = getPluginState(view.state);
          if (!currentState) {
            return;
          }

          // make replacements in document for finished autoformats
          if (currentState.matches) {
            completeReplacements(view, currentState);
          }
        },
        destroy() {
          providerFactory.unsubscribe('autoformattingProvider', handleProvider);
        },
      };
    },

    key: pluginKey,
  });
};

export type CustomAutoformatPlugin = NextEditorPlugin<'customAutoformat'>;

export const customAutoformatPlugin: CustomAutoformatPlugin = () => ({
  name: 'customAutoformat',

  pmPlugins() {
    return [{ name: 'customAutoformat', plugin: createPMPlugin }];
  },
});
