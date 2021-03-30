import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  ProviderFactory,
  Providers,
} from '@atlaskit/editor-common/provider-factory';
import { setMacroProvider } from './actions';
import { Dispatch } from '../../event-dispatcher';
import { EditorPlugin, PMPluginFactoryParams } from '../../types';
import { pluginKey } from './plugin-key';
import { MacroState } from './types';

export type {
  MacroProvider,
  MacroAttributes,
  ExtensionType,
} from '@atlaskit/editor-common/provider-factory';
export {
  insertMacroFromMacroBrowser,
  resolveMacro,
  runMacroAutoConvert,
  setMacroProvider,
} from './actions';
export type { MacroState };

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
) =>
  new Plugin({
    state: {
      init: () => ({ macroProvider: null }),

      apply(tr, state: MacroState) {
        const meta = tr.getMeta(pluginKey);
        if (meta) {
          const newState = { ...state, ...meta };
          dispatch(pluginKey, newState);

          return newState;
        }

        return state;
      },
    },
    key: pluginKey,
    view: (view: EditorView) => {
      const handleProvider = (
        _name: string,
        provider?: Providers['macroProvider'],
      ) => provider && setMacroProvider(provider)(view);
      // make sure editable DOM node is mounted
      if (view.dom.parentNode) {
        providerFactory.subscribe('macroProvider', handleProvider);
      }
      return {
        destroy() {
          providerFactory.unsubscribe('macroProvider', handleProvider);
        },
      };
    },
  });

const macroPlugin = (): EditorPlugin => ({
  name: 'macro',

  pmPlugins() {
    return [
      {
        name: 'macro',
        plugin: ({ dispatch, providerFactory }: PMPluginFactoryParams) =>
          createPlugin(dispatch, providerFactory),
      },
    ];
  },
});

export default macroPlugin;
