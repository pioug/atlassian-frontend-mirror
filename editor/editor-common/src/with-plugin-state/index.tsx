import React from 'react';

import PropTypes from 'prop-types';

import type {
  EditorState,
  PluginKey,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { AnalyticsDispatch, AnalyticsEventPayload } from '../analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics';
import type { EventDispatcher } from '../event-dispatcher';
import { createDispatch } from '../event-dispatcher';
import { analyticsEventKey, startMeasure, stopMeasure } from '../utils';

import type { NamedPluginKeys, NamedPluginStates, Writeable } from './types';

const DEFAULT_SAMPLING_RATE = 100;
const DEFAULT_SLOW_THRESHOLD = 4;

export type PerformanceOptions = {
  samplingRate: number;
  slowThreshold: number;
  trackingEnabled: boolean;
};

export interface State {
  [name: string]: any;
}

type ContextUpdateHandler = (
  editorView: EditorView,
  eventDispatcher: EventDispatcher,
) => void;

export type EditorActionsPrivateAccess = {
  _privateGetEditorView: () => EditorView;
  _privateGetEventDispatcher: () => EventDispatcher;
  _privateSubscribe: (cb: ContextUpdateHandler) => void;
  _privateUnsubscribe: (cb: ContextUpdateHandler) => void;
};

type EditorSharedConfigPrivateAccess = {
  editorView: EditorView;
  eventDispatcher: EventDispatcher;
};

export type PluginsConfig = { [name: string]: PluginKey };

// That context was exctract from the old WithPluginState from editor-core
// It was using some private types from
// - EditorAction: packages/editor/editor-core/src/actions/index.ts
// - EditorSharedConfig: packages/editor/editor-core/src/labs/next/internal/context/shared-config.tsx
type Context = {
  editorActions?: EditorActionsPrivateAccess;
  editorSharedConfig?: EditorSharedConfigPrivateAccess;
};

export interface Props<P extends NamedPluginKeys> {
  debounce?: boolean;
  eventDispatcher?: EventDispatcher;
  editorView?: EditorView;
  plugins: P;
  render: (pluginState: NamedPluginStates<P>) => React.ReactElement | null;
}

/**
 * @private
 * @deprecated
 *
 * Using this component is deprecated. It should be replaced with `useSharedPluginState`.
 * This requires having access to the injection API from the plugin itself.
 *
 * An example of the refactor with the new hook (using hyperlink as an example) is:
 *
 * Before:
 * ```ts
 * <WithPluginState
 *   editorView={editorView}
 *   plugins={{
 *     hyperlinkState: hyperlinkPluginKey
 *   }}
 *   render={({ hyperlinkState }) =>
 *     renderComponent({ hyperlinkState })
 *   }
 * />
 * ```
 *
 * After:
 * ```ts
 * import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
 * import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
 *
 * function ComponentWithState(
 *   api: ExtractInjectionAPI<typeof hyperlinkPlugin> | undefined
 * ) {
 *   const { hyperlinkState } = useSharedPluginState(api, ['hyperlink']);
 *   return renderComponent({ hyperlinkState })
 * }
 * ```
 *
 */
class WithPluginState<P extends NamedPluginKeys> extends React.Component<
  Props<P>,
  State
> {
  static displayName = 'WithPluginState';

  private listeners = {};
  private debounce: number | null = null;
  private notAppliedState = {};
  private isSubscribed = false;
  private callsCount = 0;

  static contextTypes = {
    editorActions: PropTypes.object,
    editorSharedConfig: PropTypes.object,
  };
  context!: Context;
  state: NamedPluginStates<P>;

  constructor(props: Props<P>, context: Context) {
    super(props, context);
    this.state = this.getPluginsStates(
      this.props.plugins,
      this.getEditorView(props, context),
    );
  }

  private getEditorView(
    maybeProps?: Props<P>,
    maybeContext?: Context,
  ): EditorView | undefined {
    const props = maybeProps || this.props;
    const context = maybeContext || this.context;
    return (
      props.editorView ||
      (context &&
        context.editorActions &&
        context.editorActions._privateGetEditorView()) ||
      (context &&
        context.editorSharedConfig &&
        context.editorSharedConfig.editorView)
    );
  }

  private getEventDispatcher(
    maybeProps?: Props<P>,
  ): EventDispatcher | undefined {
    const props = maybeProps || this.props;
    return (
      props.eventDispatcher ||
      (this.context &&
        this.context.editorActions &&
        this.context.editorActions._privateGetEventDispatcher()) ||
      (this.context &&
        this.context.editorSharedConfig &&
        this.context.editorSharedConfig.eventDispatcher)
    );
  }

  private handlePluginStateChange =
    (
      propName: string,
      pluginName: string,
      performanceOptions: PerformanceOptions,
      skipEqualityCheck?: boolean,
    ) =>
    (pluginState: any) => {
      // skipEqualityCheck is being used for old plugins since they are mutating plugin state instead of creating a new one
      if ((this.state as any)[propName] !== pluginState || skipEqualityCheck) {
        this.updateState({
          stateSubset: { [propName]: pluginState },
          pluginName,
          performanceOptions,
        });
      }
    };

  /**
   * Debounces setState calls in order to reduce number of re-renders caused by several plugin state changes.
   */
  private updateState = ({
    stateSubset,
    pluginName,
    performanceOptions,
  }: {
    stateSubset: State;
    pluginName: string;
    performanceOptions: PerformanceOptions;
  }) => {
    this.notAppliedState = { ...this.notAppliedState, ...stateSubset };

    if (this.debounce) {
      window.clearTimeout(this.debounce);
    }

    const debounce =
      this.props.debounce !== false
        ? (fn: Function) => window.setTimeout(fn, 0)
        : (fn: Function) => fn();

    this.debounce = debounce(() => {
      const measure = `🦉${pluginName}::WithPluginState`;
      performanceOptions.trackingEnabled && startMeasure(measure);
      this.setState(this.notAppliedState, () => {
        performanceOptions.trackingEnabled &&
          stopMeasure(measure, (duration) => {
            // Each WithPluginState component will fire analytics event no more than once every `samplingLimit` times
            if (
              ++this.callsCount % performanceOptions.samplingRate === 0 &&
              duration > performanceOptions.slowThreshold
            ) {
              this.dispatchAnalyticsEvent({
                action: ACTION.WITH_PLUGIN_STATE_CALLED,
                actionSubject: ACTION_SUBJECT.EDITOR,
                eventType: EVENT_TYPE.OPERATIONAL,
                attributes: {
                  plugin: pluginName,
                  duration,
                },
              });
            }
          });
      });
      this.debounce = null;
      this.notAppliedState = {};
    });
  };

  private dispatchAnalyticsEvent = (payload: AnalyticsEventPayload) => {
    const eventDispatcher = this.getEventDispatcher();
    if (eventDispatcher) {
      const dispatch: AnalyticsDispatch = createDispatch(eventDispatcher);
      dispatch(analyticsEventKey, {
        payload,
      });
    }
  };

  private getPluginsStates(
    plugins: P,
    editorView?: EditorView,
  ): NamedPluginStates<P> {
    if (!editorView || !plugins) {
      return {} as NamedPluginStates<P>;
    }

    const keys = Object.keys(plugins);
    return keys.reduce<Writeable<NamedPluginStates<P>>>((acc, propName) => {
      const pluginKey = plugins[propName as keyof P];
      if (!pluginKey) {
        return acc;
      }
      acc[propName as keyof NamedPluginStates<P>] = pluginKey.getState(
        editorView.state,
      );
      return acc;
    }, {} as Writeable<NamedPluginStates<P>>);
  }

  private subscribe(props: Props<P>): void {
    const plugins = props.plugins;
    const eventDispatcher = this.getEventDispatcher(props);
    const editorView = this.getEditorView(props);
    if (!eventDispatcher || !editorView || this.isSubscribed) {
      return;
    }

    // TODO: ED-15663
    // Please, do not copy or use this kind of code below
    // @ts-ignore
    const fakePluginKey = {
      key: 'analyticsPlugin$',
      getState: (state: EditorState) => {
        return (state as any)['analyticsPlugin$'];
      },
    } as PluginKey;

    const analyticsPlugin = fakePluginKey.getState(editorView.state);
    const uiTracking =
      analyticsPlugin && analyticsPlugin.performanceTracking
        ? analyticsPlugin.performanceTracking.uiTracking || {}
        : {};
    const trackingEnabled = uiTracking.enabled === true;
    const samplingRate = uiTracking.samplingRate ?? DEFAULT_SAMPLING_RATE;
    const slowThreshold = uiTracking.slowThreshold ?? DEFAULT_SLOW_THRESHOLD;

    this.isSubscribed = true;

    const pluginsStates = this.getPluginsStates(plugins, editorView);
    this.setState(pluginsStates);

    Object.keys(plugins).forEach((propName) => {
      const pluginKey = plugins[propName as keyof P];

      if (!pluginKey) {
        return;
      }

      const pluginName = (pluginKey as any).key;
      const pluginState = (pluginsStates as any)[propName];
      const isPluginWithSubscribe = pluginState && pluginState.subscribe;
      const handler = this.handlePluginStateChange(
        propName,
        pluginName,
        { samplingRate, slowThreshold, trackingEnabled },
        isPluginWithSubscribe,
      );

      if (isPluginWithSubscribe) {
        pluginState.subscribe(handler);
      } else {
        eventDispatcher.on((pluginKey as any).key, handler);
      }

      (this.listeners as any)[(pluginKey as any).key] = { handler, pluginKey };
    });
  }

  private unsubscribe() {
    const eventDispatcher = this.getEventDispatcher();
    const editorView = this.getEditorView();

    if (!eventDispatcher || !editorView || !this.isSubscribed) {
      return;
    }

    Object.keys(this.listeners).forEach((key) => {
      const pluginState = (this.listeners as any)[key].pluginKey.getState(
        editorView.state,
      );

      if (pluginState && pluginState.unsubscribe) {
        pluginState.unsubscribe((this.listeners as any)[key].handler);
      } else {
        eventDispatcher.off(key, (this.listeners as any)[key].handler);
      }
    });

    this.listeners = [];
  }

  private onContextUpdate = () => {
    this.subscribe(this.props);
  };

  private subscribeToContextUpdates(context?: Context) {
    if (context && context.editorActions) {
      context.editorActions._privateSubscribe(this.onContextUpdate);
    }
  }

  private unsubscribeFromContextUpdates(context?: Context) {
    if (context && context.editorActions) {
      context.editorActions._privateUnsubscribe(this.onContextUpdate);
    }
  }

  componentDidMount() {
    this.subscribe(this.props);
    this.subscribeToContextUpdates(this.context);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props<P>) {
    if (!this.isSubscribed) {
      this.subscribe(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.debounce) {
      window.clearTimeout(this.debounce);
    }
    this.unsubscribeFromContextUpdates(this.context);
    this.unsubscribe();
  }

  render() {
    const { render } = this.props;
    return render(this.state);
  }
}

export { WithPluginState };
