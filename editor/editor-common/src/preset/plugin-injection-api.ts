import isEqual from 'lodash/isEqual';
import throttle from 'lodash/throttle';
import type { EditorState } from 'prosemirror-state';

import type {
  DefaultEditorPlugin,
  NextEditorPlugin,
  PluginDependenciesAPI,
  PluginInjectionAPI,
} from '../types/next-editor-plugin';

type NextEditorPluginInitializedType = ReturnType<NextEditorPlugin<any>>;

type SharedStateAPIProps = {
  getEditorState: () => EditorState | undefined;
};

type EditorStateDiff = {
  readonly newEditorState: EditorState;
  readonly oldEditorState: EditorState | undefined;
};

type Callback = (props: {
  nextSharedState: unknown;
  prevSharedState: unknown;
}) => void;

function hasGetSharedState(
  plugin: ReturnType<NextEditorPlugin<any, any>>,
): plugin is DefaultEditorPlugin<any, { sharedState: unknown }> {
  return typeof (plugin as any).getSharedState === 'function';
}

function hasActions(
  plugin: ReturnType<NextEditorPlugin<any, any>>,
): plugin is DefaultEditorPlugin<
  any,
  { actions: Record<string, (...args: any) => any> }
> {
  return typeof (plugin as any).actions === 'object';
}

type NotifyListernersThrottledThrottledProps = EditorStateDiff & {
  plugins: Map<string, NextEditorPluginInitializedType>;
  listeners: Map<string, Set<Callback>>;
};

const DREAM_TARGET_60_FPS = 16;
/*
 *
 * After some investigations, we discovered this is the best ratio for our current Editor: 80ms. That means is five times bigger than the 60fps dream target.
 *
 * In the future, once we remove the entire WithPluginState, We may decide to reduce this value.
 *
 */
const THROTTLE_CALLS_FOR_MILLISECONDS = DREAM_TARGET_60_FPS * 5;
const notifyListenersThrottled = throttle(
  ({
    newEditorState,
    oldEditorState,
    listeners,
    plugins,
  }: NotifyListernersThrottledThrottledProps) => {
    const isInitialization = !oldEditorState && newEditorState;
    const callbacks: Function[] = [];

    for (let pluginName of listeners.keys()) {
      const plugin = plugins.get(pluginName);

      if (!plugin || !hasGetSharedState(plugin)) {
        continue;
      }

      const nextSharedState = plugin.getSharedState(newEditorState);

      const prevSharedState =
        !isInitialization && oldEditorState
          ? plugin.getSharedState(oldEditorState)
          : undefined;

      const isSamePluginState = isEqual(prevSharedState, nextSharedState);
      if (isInitialization || !isSamePluginState) {
        (listeners.get(pluginName) || new Set<Callback>()).forEach(
          (callback) => {
            callbacks.push(
              callback.bind(callback, { nextSharedState, prevSharedState }),
            );
          },
        );
      }
    }

    if (callbacks.length === 0) {
      return;
    }

    callbacks.forEach((cb) => {
      cb();
    });
  },
  THROTTLE_CALLS_FOR_MILLISECONDS,
);

export class PluginsData {}

class ActionsAPI {
  createAPI(
    plugin: ReturnType<NextEditorPlugin<any, any>> | undefined,
  ): PluginDependenciesAPI<NextEditorPlugin<any, any>>['actions'] {
    if (!plugin || !hasActions(plugin)) {
      return {};
    }

    return new Proxy(plugin.actions || {}, {
      get: function (target, prop: string, receiver) {
        // We will be able to track perfomance here
        return Reflect.get(target, prop);
      },
    });
  }
}

export class SharedStateAPI {
  private getEditorState: () => EditorState | undefined;
  private listeners: Map<string, Set<Callback>>;

  constructor({ getEditorState }: SharedStateAPIProps) {
    this.getEditorState = getEditorState;
    this.listeners = new Map();
  }

  createAPI(
    plugin: NextEditorPluginInitializedType | undefined,
  ): PluginDependenciesAPI<NextEditorPlugin<any, any>>['sharedState'] {
    if (!plugin) {
      return {
        currentState: () => undefined,
        onChange: (sub: Callback) => {
          return () => {};
        },
      };
    }

    const pluginName = plugin.name;
    return {
      currentState: () => {
        const state = this.getEditorState();
        if (!state || !hasGetSharedState(plugin)) {
          return undefined;
        }

        return plugin.getSharedState(state);
      },
      onChange: (sub: Callback) => {
        const pluginListeners = this.listeners.get(pluginName) || new Set();

        pluginListeners.add(sub);

        this.listeners.set(pluginName, pluginListeners);

        return () => {
          (this.listeners.get(pluginName) || new Set()).delete(sub);
        };
      },
    };
  }

  notifyListeners({
    newEditorState,
    oldEditorState,
    plugins,
  }: EditorStateDiff &
    Record<'plugins', Map<string, NextEditorPluginInitializedType>>) {
    const { listeners } = this;
    notifyListenersThrottled({
      newEditorState,
      oldEditorState,
      listeners,
      plugins,
    });
  }

  destroy() {
    this.listeners.clear();
  }
}

type EditorStateDelta = {
  readonly newEditorState: EditorState;
  readonly oldEditorState: EditorState;
};

interface PluginInjectionAPIDefinition {
  api: <T extends NextEditorPlugin<any, any>>() => PluginInjectionAPI<
    T extends NextEditorPlugin<infer Name, any> ? Name : never,
    T extends NextEditorPlugin<any, infer Metadata> ? Metadata : never
  >;
  onEditorViewUpdated: (props: EditorStateDelta) => void;
  onEditorPluginInitialized: (plugin: NextEditorPluginInitializedType) => void;
}

export class EditorPluginInjectionAPI implements PluginInjectionAPIDefinition {
  private sharedStateAPI: SharedStateAPI;
  private actionsAPI: ActionsAPI;
  private plugins: Map<string, NextEditorPluginInitializedType>;

  constructor({ getEditorState }: SharedStateAPIProps) {
    this.sharedStateAPI = new SharedStateAPI({ getEditorState });
    this.plugins = new Map();
    this.actionsAPI = new ActionsAPI();
  }

  api<T extends NextEditorPlugin<any, any>>() {
    const { sharedStateAPI, actionsAPI, getPluginByName } = this;
    type ExternalPluginsGenericType = PluginInjectionAPI<
      T extends NextEditorPlugin<infer Name, any> ? Name : never,
      T extends NextEditorPlugin<any, infer Metadata> ? Metadata : never
    >['externalPlugins'];

    const externalPlugins = new Proxy<ExternalPluginsGenericType>({} as any, {
      get: function (target, prop: string, receiver) {
        const plugin = getPluginByName(prop);
        if (!plugin) {
          // eslint-disable-next-line
          console.error(`Plugin: ${prop} does not exist`);
          return undefined;
        }
        const sharedState = sharedStateAPI.createAPI(plugin);
        const actions = actionsAPI.createAPI(plugin);

        const proxyCoreAPI: PluginDependenciesAPI<NextEditorPlugin<any, any>> =
          {
            sharedState,
            actions,
          };

        return proxyCoreAPI;
      },
    });

    return {
      externalPlugins,
    };
  }

  onEditorViewUpdated = ({
    newEditorState,
    oldEditorState,
  }: EditorStateDiff) => {
    this.sharedStateAPI.notifyListeners({
      newEditorState,
      oldEditorState,
      plugins: this.plugins,
    });
  };

  onEditorPluginInitialized = (plugin: NextEditorPluginInitializedType) => {
    this.addPlugin(plugin);
  };

  private addPlugin = (plugin: NextEditorPluginInitializedType) => {
    this.plugins.set(plugin.name, plugin);
  };

  private getPluginByName = (
    pluginName: string,
  ): NextEditorPluginInitializedType | undefined => {
    const plugin = this.plugins.get(pluginName);

    return plugin;
  };
}
