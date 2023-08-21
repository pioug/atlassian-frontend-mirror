import isEqual from 'lodash/isEqual';
import throttle from 'lodash/throttle';

import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type {
  DefaultEditorPlugin,
  NextEditorPlugin,
  PluginDependenciesAPI,
  PluginInjectionAPI,
} from '../types/next-editor-plugin';

import { corePlugin } from './core-plugin';

type NextEditorPluginInitializedType = ReturnType<NextEditorPlugin<any>>;

type SharedStateAPIProps = {
  getEditorState: () => EditorState | undefined;
};

interface PluginInjectionAPIProps extends SharedStateAPIProps {
  getEditorView: () => EditorView | undefined;
}

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

function hasCommands(
  plugin: ReturnType<NextEditorPlugin<any, any>>,
): plugin is DefaultEditorPlugin<
  any,
  { commands: Record<string, (...args: any) => any> }
> {
  return typeof (plugin as any).commands === 'object';
}

type FilterPluginsWithListenersProps = {
  plugins: Map<string, NextEditorPluginInitializedType>;
  listeners: Map<string, Set<Callback>>;
};
const filterPluginsWithListeners = ({
  listeners,
  plugins,
}: FilterPluginsWithListenersProps): NextEditorPluginInitializedType[] =>
  Array.from(listeners.keys())
    .map((pluginName) => plugins.get(pluginName))
    .filter(
      (plugin): plugin is NextEditorPluginInitializedType =>
        plugin !== undefined && hasGetSharedState(plugin),
    );

type SharedStateDiff = {
  nextSharedState: unknown;
  prevSharedState: unknown;
};
type SharedStateByPluginName = Map<string, SharedStateDiff>;
type ExtractSharedStateFromPluginsProps = EditorStateDiff & {
  plugins: Array<NextEditorPluginInitializedType>;
};
const extractSharedStateFromPlugins = ({
  oldEditorState,
  newEditorState,
  plugins,
}: ExtractSharedStateFromPluginsProps): SharedStateByPluginName => {
  const isInitialization = !oldEditorState && newEditorState;
  const result = new Map();

  for (let plugin of plugins) {
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
      result.set(plugin.name, { nextSharedState, prevSharedState });
    }
  }

  return result;
};

const THROTTLE_CALLS_FOR_MILLISECONDS = 0;

type PluginUpdatesToNotify = Map<string, SharedStateDiff[]>;
type NotifyListenersThrottledThrottledProps = {
  listeners: Map<string, Set<Callback>>;
  updatesToNotifyQueue: PluginUpdatesToNotify;
};
const notifyListenersThrottled = throttle(
  ({
    listeners,
    updatesToNotifyQueue,
  }: NotifyListenersThrottledThrottledProps) => {
    const callbacks: Function[] = [];

    for (let [pluginName, diffs] of updatesToNotifyQueue.entries()) {
      const pluginListeners = listeners.get(pluginName) || [];

      pluginListeners.forEach((callback) => {
        diffs.forEach((diff) => {
          callbacks.push(callback.bind(callback, diff));
        });
      });
    }

    updatesToNotifyQueue.clear();

    if (callbacks.length === 0) {
      return;
    }

    callbacks.reverse().forEach((cb) => {
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

class EditorCommandsAPI {
  createAPI(
    plugin: ReturnType<NextEditorPlugin<any, any>> | undefined,
  ): PluginDependenciesAPI<NextEditorPlugin<any, any>>['commands'] {
    if (!plugin || !hasCommands(plugin)) {
      return {};
    }

    return new Proxy(plugin.commands || {}, {
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
        if (!hasGetSharedState(plugin)) {
          return undefined;
        }

        const state = this.getEditorState();
        return plugin.getSharedState(state);
      },
      onChange: (sub: Callback) => {
        const pluginListeners = this.listeners.get(pluginName) || new Set();

        pluginListeners.add(sub);

        this.listeners.set(pluginName, pluginListeners);

        return () => this.cleanupSubscription(pluginName, sub);
      },
    };
  }

  private cleanupSubscription(pluginName: string, sub: Callback) {
    (this.listeners.get(pluginName) || new Set()).delete(sub);
  }

  private updatesToNotifyQueue: PluginUpdatesToNotify = new Map();
  notifyListeners({
    newEditorState,
    oldEditorState,
    plugins,
  }: EditorStateDiff &
    Record<'plugins', Map<string, NextEditorPluginInitializedType>>) {
    const { listeners, updatesToNotifyQueue } = this;
    const pluginsFiltered = filterPluginsWithListeners({ plugins, listeners });

    const sharedStateDiffs = extractSharedStateFromPlugins({
      oldEditorState,
      newEditorState,
      plugins: pluginsFiltered,
    });

    if (sharedStateDiffs.size === 0) {
      return;
    }

    for (let [pluginName, nextDiff] of sharedStateDiffs) {
      const currentDiffQueue = updatesToNotifyQueue.get(pluginName) || [];

      updatesToNotifyQueue.set(pluginName, [...currentDiffQueue, nextDiff]);
    }

    notifyListenersThrottled({
      updatesToNotifyQueue,
      listeners,
    });
  }

  destroy() {
    this.listeners.clear();
    this.updatesToNotifyQueue.clear();
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
  private commandsAPI: EditorCommandsAPI;
  private plugins: Map<string, NextEditorPluginInitializedType>;

  constructor({ getEditorState, getEditorView }: PluginInjectionAPIProps) {
    this.sharedStateAPI = new SharedStateAPI({ getEditorState });
    this.plugins = new Map();
    this.actionsAPI = new ActionsAPI();
    this.commandsAPI = new EditorCommandsAPI();
    // Special core plugin that is always added
    this.addPlugin(corePlugin({ getEditorView }));
  }

  api<T extends NextEditorPlugin<any, any>>() {
    const { sharedStateAPI, actionsAPI, commandsAPI, getPluginByName } = this;
    type DependenciesGenericType = PluginInjectionAPI<
      T extends NextEditorPlugin<infer Name, any> ? Name : never,
      T extends NextEditorPlugin<any, infer Metadata> ? Metadata : never
    >['dependencies'];

    const dependencies = new Proxy<DependenciesGenericType>({} as any, {
      get: function (target, prop: string, receiver) {
        // If we pass this as a prop React hates us
        // Let's just reflect the result and ignore these
        if (prop === 'toJSON') {
          return Reflect.get(target, prop);
        }

        const plugin = getPluginByName(prop);
        if (!plugin) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line
            console.warn(`Plugin: ${prop} does not exist`);
          }
          return undefined;
        }
        const sharedState = sharedStateAPI.createAPI(plugin);
        const actions = actionsAPI.createAPI(plugin);
        const commands = commandsAPI.createAPI(plugin);

        const proxyCoreAPI: PluginDependenciesAPI<NextEditorPlugin<any, any>> =
          {
            sharedState,
            actions,
            commands,
          };

        return proxyCoreAPI;
      },
    });

    return {
      dependencies,
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
    // Plugins other than `core` are checked by the preset itself
    // For some reason in some tests we have duplicates that are missed.
    // To follow-up in ED-19611
    if (plugin.name === 'core' && this.plugins.has(plugin.name)) {
      throw new Error(
        `Plugin ${plugin.name} has already been initialised in the Editor API! 
        There cannot be duplicate plugins or you will have unexpected behaviour`,
      );
    }
    this.plugins.set(plugin.name, plugin);
  };

  private getPluginByName = (
    pluginName: string,
  ): NextEditorPluginInitializedType | undefined => {
    const plugin = this.plugins.get(pluginName);

    return plugin;
  };
}
