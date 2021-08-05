import React from 'react';
import PropTypes from 'prop-types';
import { EditorState, Selection, Transaction } from 'prosemirror-state';
import { DirectEditorProps, EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { intlShape } from 'react-intl';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  browser,
  ErrorReporter,
  getAnalyticsEventSeverity,
  getResponseEndTime,
  measureRender,
  ProviderFactory,
  Transformer,
  startMeasure,
  stopMeasure,
  shouldForceTracking,
} from '@atlaskit/editor-common';

import { createDispatch, Dispatch, EventDispatcher } from '../event-dispatcher';
import { processRawValue } from '../utils';
import { RenderTracking } from '../utils/react-hooks/use-component-renderer-tracking';
import {
  findChangedNodesFromTransaction,
  validateNodes,
  validNode,
} from '../utils/nodes';
import createPluginList from './create-plugins-list';
import {
  ACTION,
  ACTION_SUBJECT,
  AnalyticsDispatch,
  AnalyticsEventPayload,
  DispatchAnalyticsEvent,
  EVENT_TYPE,
  fireAnalyticsEvent,
  FULL_WIDTH_MODE,
  getAnalyticsEventsFromTransaction,
  PLATFORMS,
} from '../plugins/analytics';
import { createFeatureFlagsFromProps } from '../plugins/feature-flags-context/feature-flags-from-props';
import { getEnabledFeatureFlagKeys } from '../plugins/feature-flags-context/get-enabled-feature-flag-keys';
import {
  EditorAppearance,
  EditorConfig,
  EditorReactContext,
  EditorPlugin,
  EditorProps,
} from '../types';
import { FeatureFlags } from '../types/feature-flags';
import { PortalProviderAPI } from '../ui/PortalProvider';
import {
  createErrorReporter,
  createPMPlugins,
  processPluginsList,
} from './create-editor';
import { getDocStructure, SimplifiedNode } from '../utils/document-logger';
import { isFullPage } from '../utils/is-full-page';
import measurements from '../utils/performance/measure-enum';
import { getNodesCount } from '../utils/document';
import { analyticsEventKey, SEVERITY } from '@atlaskit/editor-common';
import { createSchema } from './create-schema';
import { PluginPerformanceObserver } from '../utils/performance/plugin-performance-observer';
import { PluginPerformanceReportData } from '../utils/performance/plugin-performance-report';
import { getParticipantsCount } from '../plugins/collab-edit/get-participants-count';
import { countNodes } from '../utils/count-nodes';
import { TransactionTracker } from '../utils/performance/track-transactions';
import {
  EVENT_NAME_DISPATCH_TRANSACTION,
  EVENT_NAME_STATE_APPLY,
  EVENT_NAME_UPDATE_STATE,
  EVENT_NAME_VIEW_STATE_UPDATED,
  EVENT_NAME_ON_CHANGE,
} from '../utils/performance/track-transactions';
import {
  PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
  PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
  DEFAULT_SAMPLING_RATE_VALID_TRANSACTIONS,
} from './consts';
import { getContextIdentifier } from '../plugins/base/pm-plugins/context-identifier';
import { FireAnalyticsCallback } from '../plugins/analytics/fire-analytics-event';

export interface EditorViewProps {
  editorProps: EditorProps;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  providerFactory: ProviderFactory;
  portalProviderAPI: PortalProviderAPI;
  allowAnalyticsGASV3?: boolean;
  disabled?: boolean;
  render?: (props: {
    editor: JSX.Element;
    view?: EditorView;
    config: EditorConfig;
    eventDispatcher: EventDispatcher;
    transformer?: Transformer<string>;
    dispatchAnalyticsEvent: DispatchAnalyticsEvent;
  }) => JSX.Element;
  onEditorCreated: (instance: {
    view: EditorView;
    config: EditorConfig;
    eventDispatcher: EventDispatcher;
    transformer?: Transformer<string>;
  }) => void;
  onEditorDestroyed: (instance: {
    view: EditorView;
    config: EditorConfig;
    eventDispatcher: EventDispatcher;
    transformer?: Transformer<string>;
  }) => void;
}

function handleEditorFocus(view: EditorView): number | undefined {
  if (view.hasFocus()) {
    return;
  }

  return window.setTimeout(() => {
    view.focus();
  }, 0);
}

const EMPTY: EditorPlugin[] = [];

export function shouldReconfigureState(
  props: EditorProps,
  nextProps: EditorProps,
) {
  const prevPlugins = props.dangerouslyAppendPlugins?.__plugins ?? EMPTY;
  const nextPlugins = nextProps.dangerouslyAppendPlugins?.__plugins ?? EMPTY;

  if (
    nextPlugins.length !== prevPlugins.length ||
    prevPlugins.some((p) =>
      nextPlugins.some((n) => n.name === p.name && n !== p),
    )
  ) {
    return true;
  }

  const mobileProperties: Array<keyof EditorProps> =
    props.appearance === 'mobile' ? ['featureFlags', 'quickInsert'] : [];

  const properties: Array<keyof EditorProps> = [
    'appearance',
    'persistScrollGutter',
    'UNSAFE_allowUndoRedoButtons',
    'placeholder',
    ...mobileProperties,
  ];

  return properties.reduce(
    (acc, curr) => acc || props[curr] !== nextProps[curr],
    false,
  );
}

export default class ReactEditorView<T = {}> extends React.Component<
  EditorViewProps & T,
  {},
  EditorReactContext
> {
  view?: EditorView;
  eventDispatcher: EventDispatcher;
  contentTransformer?: Transformer<string>;
  config!: EditorConfig;
  editorState: EditorState;
  errorReporter: ErrorReporter;
  dispatch: Dispatch;
  proseMirrorRenderedSeverity?: SEVERITY;
  transactionTracker: TransactionTracker;
  validTransactionCount: number;

  static contextTypes = {
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
    intl: intlShape,
  };

  // ProseMirror is instantiated prior to the initial React render cycle,
  // so we allow transactions by default, to avoid discarding the initial one.
  private canDispatchTransactions = true;

  private focusTimeoutId: number | undefined;

  private pluginPerformanceObserver: PluginPerformanceObserver;

  private featureFlags: FeatureFlags;

  private onPluginObservation = (
    report: PluginPerformanceReportData,
    editorState: EditorState,
  ) => {
    this.dispatchAnalyticsEvent({
      action: ACTION.TRANSACTION_DISPATCHED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        report,
        participants: getParticipantsCount(editorState),
      },
    });
  };

  get transactionTracking() {
    return (
      this.props.editorProps.performanceTracking?.transactionTracking ?? {
        enabled: false,
      }
    );
  }

  private getPluginNames() {
    return this.editorState.plugins.map((p: any) => p.key);
  }

  private countNodes() {
    return countNodes(this.editorState);
  }

  constructor(props: EditorViewProps & T, context: EditorReactContext) {
    super(props, context);

    this.eventDispatcher = new EventDispatcher();

    this.dispatch = createDispatch(this.eventDispatcher);
    this.errorReporter = createErrorReporter(
      props.editorProps.errorReporterHandler,
    );

    this.transactionTracker = new TransactionTracker();
    this.pluginPerformanceObserver = new PluginPerformanceObserver((report) =>
      this.onPluginObservation(report, this.editorState),
    )
      .withPlugins(() => this.getPluginNames())
      .withNodeCounts(() => this.countNodes())
      .withOptions(() => this.transactionTracking)
      .withTransactionTracker(() => this.transactionTracker);

    this.validTransactionCount = 0;

    this.featureFlags = createFeatureFlagsFromProps(this.props.editorProps);
    const featureFlagsEnabled = this.featureFlags
      ? getEnabledFeatureFlagKeys(this.featureFlags)
      : [];

    // START TEMPORARY CODE ED-10584
    if (this.props.createAnalyticsEvent) {
      (this.props
        .createAnalyticsEvent as any).__queueAnalytics = this.featureFlags.queueAnalytics;
    }
    // END TEMPORARY CODE ED-10584

    // This needs to be before initialising editorState because
    // we dispatch analytics events in plugin initialisation
    this.eventDispatcher.on(analyticsEventKey, this.handleAnalyticsEvent);

    this.editorState = this.createEditorState({
      props,
      context,
      replaceDoc: true,
    });

    this.dispatchAnalyticsEvent({
      action: ACTION.STARTED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      attributes: {
        platform: PLATFORMS.WEB,
        featureFlags: featureFlagsEnabled,
      },
      eventType: EVENT_TYPE.UI,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: EditorViewProps) {
    // START TEMPORARY CODE ED-10584
    if (
      nextProps.createAnalyticsEvent &&
      nextProps.createAnalyticsEvent !== this.props.createAnalyticsEvent
    ) {
      const featureFlags = createFeatureFlagsFromProps(nextProps.editorProps);
      (nextProps.createAnalyticsEvent as any).__queueAnalytics =
        featureFlags.queueAnalytics;
    }
    // END TEMPORARY CODE ED-10584

    if (
      this.view &&
      this.props.editorProps.disabled !== nextProps.editorProps.disabled
    ) {
      // Disables the contentEditable attribute of the editor if the editor is disabled
      this.view.setProps({
        editable: (_state) => !nextProps.editorProps.disabled,
      } as DirectEditorProps);

      if (
        !nextProps.editorProps.disabled &&
        nextProps.editorProps.shouldFocus
      ) {
        this.focusTimeoutId = handleEditorFocus(this.view);
      }
    }

    const { appearance } = this.props.editorProps;
    const { appearance: nextAppearance } = nextProps.editorProps;

    if (shouldReconfigureState(this.props.editorProps, nextProps.editorProps)) {
      this.reconfigureState(nextProps);
    }

    if (nextAppearance !== appearance) {
      if (nextAppearance === 'full-width' || appearance === 'full-width') {
        this.dispatchAnalyticsEvent({
          action: ACTION.CHANGED_FULL_WIDTH_MODE,
          actionSubject: ACTION_SUBJECT.EDITOR,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            previousMode: this.formatFullWidthAppearance(appearance),
            newMode: this.formatFullWidthAppearance(nextAppearance),
          },
        });
      }
    }

    if (!this.transactionTracking.enabled) {
      this.pluginPerformanceObserver.disconnect();
    }
  }

  formatFullWidthAppearance = (
    appearance: EditorAppearance | undefined,
  ): FULL_WIDTH_MODE => {
    if (appearance === 'full-width') {
      return FULL_WIDTH_MODE.FULL_WIDTH;
    }
    return FULL_WIDTH_MODE.FIXED_WIDTH;
  };

  reconfigureState = (props: EditorViewProps) => {
    if (!this.view) {
      return;
    }

    // We cannot currently guarentee when all the portals will have re-rendered during a reconfigure
    // so we blur here to stop ProseMirror from trying to apply selection to detached nodes or
    // nodes that haven't been re-rendered to the document yet.
    if (this.view.dom instanceof HTMLElement && this.view.hasFocus()) {
      this.view.dom.blur();
    }

    this.config = processPluginsList(
      this.getPlugins(
        props.editorProps,
        this.props.editorProps,
        this.props.createAnalyticsEvent,
      ),
    );

    const state = this.editorState;
    const plugins = createPMPlugins({
      schema: state.schema,
      dispatch: this.dispatch,
      errorReporter: this.errorReporter,
      editorConfig: this.config,
      eventDispatcher: this.eventDispatcher,
      providerFactory: props.providerFactory,
      portalProviderAPI: props.portalProviderAPI,
      reactContext: () => this.context,
      dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
      performanceTracking: props.editorProps.performanceTracking,
      transactionTracker: this.transactionTracker,
      featureFlags: createFeatureFlagsFromProps(props.editorProps),
    });

    const newState = state.reconfigure({ plugins });

    // need to update the state first so when the view builds the nodeviews it is
    // using the latest plugins
    this.view.updateState(newState);

    return this.view.update({ ...this.view.props, state: newState });
  };

  handleAnalyticsEvent: FireAnalyticsCallback = (payload) => {
    if (!this.props.allowAnalyticsGASV3) {
      return;
    }
    fireAnalyticsEvent(this.props.createAnalyticsEvent)(payload);
  };

  componentDidMount() {
    // Transaction dispatching is already enabled by default prior to
    // mounting, but we reset it here, just in case the editor view
    // instance is ever recycled (mounted again after unmounting) with
    // the same key.
    // Although storing mounted state is an anti-pattern in React,
    // we do so here so that we can intercept and abort asynchronous
    // ProseMirror transactions when a dismount is imminent.
    this.canDispatchTransactions = true;

    if (this.transactionTracking.enabled) {
      this.pluginPerformanceObserver.observe();
    }
  }

  /**
   * Clean up any non-PM resources when the editor is unmounted
   */
  componentWillUnmount() {
    // We can ignore any transactions from this point onwards.
    // This serves to avoid potential runtime exceptions which could arise
    // from an async dispatched transaction after it's unmounted.
    this.canDispatchTransactions = false;

    this.eventDispatcher.destroy();

    clearTimeout(this.focusTimeoutId);

    this.pluginPerformanceObserver.disconnect();

    if (this.view) {
      // Destroy the state if the Editor is being unmounted
      const editorState = this.view.state;
      editorState.plugins.forEach((plugin) => {
        const state = plugin.getState(editorState);
        if (state && state.destroy) {
          state.destroy();
        }
      });
    }
    // this.view will be destroyed when React unmounts in handleEditorViewRef

    this.eventDispatcher.off(analyticsEventKey, this.handleAnalyticsEvent);
  }

  // Helper to allow tests to inject plugins directly
  getPlugins(
    editorProps: EditorProps,
    prevEditorProps?: EditorProps,
    createAnalyticsEvent?: CreateUIAnalyticsEvent,
  ): EditorPlugin[] {
    const editorPlugins = editorProps.dangerouslyAppendPlugins?.__plugins ?? [];
    const builtinPlugins = createPluginList(
      editorProps,
      prevEditorProps,
      createAnalyticsEvent,
    );

    if (editorPlugins && editorPlugins.length > 0) {
      builtinPlugins.push(...editorPlugins);
    }

    return builtinPlugins;
  }

  createEditorState = (options: {
    props: EditorViewProps;
    context: EditorReactContext;
    replaceDoc?: boolean;
  }) => {
    if (this.view) {
      /**
       * There's presently a number of issues with changing the schema of a
       * editor inflight. A significant issue is that we lose the ability
       * to keep track of a user's history as the internal plugin state
       * keeps a list of Steps to undo/redo (which are tied to the schema).
       * Without a good way to do work around this, we prevent this for now.
       */
      // eslint-disable-next-line no-console
      console.warn(
        'The editor does not support changing the schema dynamically.',
      );
      return this.editorState;
    }

    this.config = processPluginsList(
      this.getPlugins(
        options.props.editorProps,
        undefined,
        options.props.createAnalyticsEvent,
      ),
    );
    const schema = createSchema(this.config);

    const {
      contentTransformerProvider,
      defaultValue,
    } = options.props.editorProps;

    const plugins = createPMPlugins({
      schema,
      dispatch: this.dispatch,
      errorReporter: this.errorReporter,
      editorConfig: this.config,
      eventDispatcher: this.eventDispatcher,
      providerFactory: options.props.providerFactory,
      portalProviderAPI: this.props.portalProviderAPI,
      reactContext: () => options.context,
      dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
      performanceTracking: this.props.editorProps.performanceTracking,
      transactionTracker: this.transactionTracker,
      featureFlags: this.featureFlags,
    });

    this.contentTransformer = contentTransformerProvider
      ? contentTransformerProvider(schema)
      : undefined;

    let doc;

    if (options.replaceDoc) {
      doc = processRawValue(
        schema,
        defaultValue,
        options.props.providerFactory,
        options.props.editorProps.sanitizePrivateContent,
        this.contentTransformer,
        this.dispatchAnalyticsEvent,
      );
    }
    let selection: Selection | undefined;
    if (doc) {
      // ED-4759: Don't set selection at end for full-page editor - should be at start.
      selection = isFullPage(options.props.editorProps.appearance)
        ? Selection.atStart(doc)
        : Selection.atEnd(doc);
    }
    // Workaround for ED-3507: When media node is the last element, scrollIntoView throws an error
    const patchedSelection = selection
      ? Selection.findFrom(selection.$head, -1, true) || undefined
      : undefined;

    return EditorState.create({
      schema,
      plugins,
      doc,
      selection: patchedSelection,
    });
  };

  private onEditorViewStateUpdated = ({
    originalTransaction,
    transactions,
    oldEditorState,
    newEditorState,
  }: {
    originalTransaction: Transaction;
    transactions: Transaction[];
    oldEditorState: EditorState;
    newEditorState: EditorState;
  }) => {
    const { enabled: trackinEnabled } = this.transactionTracking;

    this.config.onEditorViewStateUpdatedCallbacks.forEach((entry) => {
      trackinEnabled &&
        startMeasure(`🦉 ${entry.pluginName}::onEditorViewStateUpdated`);
      entry.callback({
        originalTransaction,
        transactions,
        oldEditorState,
        newEditorState,
      });
      trackinEnabled &&
        stopMeasure(`🦉 ${entry.pluginName}::onEditorViewStateUpdated`);
    });
  };

  private trackValidTransactions = () => {
    const { editorProps } = this.props;
    if (editorProps?.trackValidTransactions) {
      this.validTransactionCount++;
      const samplingRate =
        (typeof editorProps.trackValidTransactions === 'object' &&
          editorProps.trackValidTransactions.samplingRate) ||
        DEFAULT_SAMPLING_RATE_VALID_TRANSACTIONS;
      if (this.validTransactionCount >= samplingRate) {
        this.dispatchAnalyticsEvent({
          action: ACTION.DISPATCHED_VALID_TRANSACTION,
          actionSubject: ACTION_SUBJECT.EDITOR,
          eventType: EVENT_TYPE.OPERATIONAL,
        });
        this.validTransactionCount = 0;
      }
    }
  };

  private dispatchTransaction = (transaction: Transaction) => {
    if (!this.view) {
      return;
    }

    this.transactionTracker.bumpDispatchCounter(this.transactionTracking);
    const {
      startMeasure,
      stopMeasure,
    } = this.transactionTracker.getMeasureHelpers(this.transactionTracking);
    startMeasure(EVENT_NAME_DISPATCH_TRANSACTION);

    const nodes: PMNode[] = findChangedNodesFromTransaction(transaction);
    const changedNodesValid = validateNodes(nodes);

    if (changedNodesValid) {
      const oldEditorState = this.view.state;

      // go ahead and update the state now we know the transaction is good
      startMeasure(EVENT_NAME_STATE_APPLY);
      const {
        state: editorState,
        transactions,
      } = this.view.state.applyTransaction(transaction);
      stopMeasure(EVENT_NAME_STATE_APPLY);

      this.trackValidTransactions();

      if (editorState === oldEditorState) {
        return;
      }

      startMeasure(EVENT_NAME_UPDATE_STATE);
      this.view.updateState(editorState);
      stopMeasure(EVENT_NAME_UPDATE_STATE);

      startMeasure(EVENT_NAME_VIEW_STATE_UPDATED);
      this.onEditorViewStateUpdated({
        originalTransaction: transaction,
        transactions,
        oldEditorState,
        newEditorState: editorState,
      });
      stopMeasure(EVENT_NAME_VIEW_STATE_UPDATED);

      if (this.props.editorProps.onChange && transaction.docChanged) {
        const source = transaction.getMeta('isRemote') ? 'remote' : 'local';

        startMeasure(EVENT_NAME_ON_CHANGE);
        this.props.editorProps.onChange(this.view, { source });
        stopMeasure(
          EVENT_NAME_ON_CHANGE,
          (duration: number, startTime: number) => {
            if (
              this.props.editorProps.performanceTracking
                ?.onChangeCallbackTracking?.enabled !== true
            ) {
              return;
            }
            this.dispatchAnalyticsEvent({
              action: ACTION.ON_CHANGE_CALLBACK,
              actionSubject: ACTION_SUBJECT.EDITOR,
              eventType: EVENT_TYPE.OPERATIONAL,
              attributes: {
                duration,
                startTime,
              },
            });
          },
        );
      }
      this.editorState = editorState;
    } else {
      const invalidNodes = nodes
        .filter((node) => !validNode(node))
        .map<SimplifiedNode | string>((node) =>
          getDocStructure(node, { compact: true }),
        );

      this.dispatchAnalyticsEvent({
        action: ACTION.DISPATCHED_INVALID_TRANSACTION,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          analyticsEventPayloads: getAnalyticsEventsFromTransaction(
            transaction,
          ),
          invalidNodes,
        },
      });
    }

    stopMeasure(EVENT_NAME_DISPATCH_TRANSACTION);
  };

  getDirectEditorProps = (state?: EditorState): DirectEditorProps => {
    return {
      state: state || this.editorState,
      dispatchTransaction: (tr: Transaction) => {
        // Block stale transactions:
        // Prevent runtime exeptions from async transactions that would attempt to
        // update the DOM after React has unmounted the Editor.
        if (this.canDispatchTransactions) {
          this.dispatchTransaction(tr);
        }
      },
      // Disables the contentEditable attribute of the editor if the editor is disabled
      editable: (_state) => !this.props.editorProps.disabled,
      attributes: { 'data-gramm': 'false' },
    };
  };

  createEditorView = (node: HTMLDivElement) => {
    measureRender(measurements.PROSEMIRROR_RENDERED, (duration, startTime) => {
      const proseMirrorRenderedTracking = this.props.editorProps
        ?.performanceTracking?.proseMirrorRenderedTracking;

      const forceSeverityTracking =
        typeof proseMirrorRenderedTracking === 'undefined' &&
        shouldForceTracking();

      this.proseMirrorRenderedSeverity =
        !!forceSeverityTracking || proseMirrorRenderedTracking?.trackSeverity
          ? getAnalyticsEventSeverity(
              duration,
              proseMirrorRenderedTracking?.severityNormalThreshold ??
                PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
              proseMirrorRenderedTracking?.severityDegradedThreshold ??
                PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
            )
          : undefined;

      if (this.view) {
        this.dispatchAnalyticsEvent({
          action: ACTION.PROSEMIRROR_RENDERED,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: {
            duration,
            startTime,
            nodes: getNodesCount(this.view.state.doc),
            ttfb: getResponseEndTime(),
            severity: this.proseMirrorRenderedSeverity,
            objectId: getContextIdentifier(this.editorState)?.objectId,
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      }
    });

    // Creates the editor-view from this.editorState. If an editor has been mounted
    // previously, this will contain the previous state of the editor.
    this.view = new EditorView({ mount: node }, this.getDirectEditorProps());
  };

  handleEditorViewRef = (node: HTMLDivElement) => {
    if (!this.view && node) {
      this.createEditorView(node);
      const view = this.view!;
      this.props.onEditorCreated({
        view,
        config: this.config,
        eventDispatcher: this.eventDispatcher,
        transformer: this.contentTransformer,
      });

      if (
        this.props.editorProps.shouldFocus &&
        view.props.editable &&
        view.props.editable(view.state)
      ) {
        this.focusTimeoutId = handleEditorFocus(view);
      }

      // Force React to re-render so consumers get a reference to the editor view
      this.forceUpdate();
    } else if (this.view && !node) {
      // When the appearance is changed, React will call handleEditorViewRef with node === null
      // to destroy the old EditorView, before calling this method again with node === div to
      // create the new EditorView
      this.props.onEditorDestroyed({
        view: this.view,
        config: this.config,
        eventDispatcher: this.eventDispatcher,
        transformer: this.contentTransformer,
      });
      this.view.destroy(); // Destroys the dom node & all node views
      this.view = undefined;
    }
  };

  dispatchAnalyticsEvent = (payload: AnalyticsEventPayload): void => {
    if (this.props.allowAnalyticsGASV3 && this.eventDispatcher) {
      const dispatch: AnalyticsDispatch = createDispatch(this.eventDispatcher);
      dispatch(analyticsEventKey, {
        payload,
      });
    }
  };

  private editor = (
    <div
      className={getUAPrefix()}
      key="ProseMirror"
      ref={this.handleEditorViewRef}
      aria-label="Main content area"
      role="textbox"
    />
  );

  render() {
    const renderTracking = this.props.editorProps.performanceTracking
      ?.renderTracking?.reactEditorView;
    const renderTrackingEnabled = renderTracking?.enabled;
    const useShallow = renderTracking?.useShallow;

    return (
      <React.Fragment>
        {renderTrackingEnabled && (
          <RenderTracking
            componentProps={this.props}
            action={ACTION.RE_RENDERED}
            actionSubject={ACTION_SUBJECT.REACT_EDITOR_VIEW}
            handleAnalyticsEvent={this.handleAnalyticsEvent}
            useShallow={useShallow}
          />
        )}
        {this.props.render
          ? this.props.render({
              editor: this.editor,
              view: this.view,
              config: this.config,
              eventDispatcher: this.eventDispatcher,
              transformer: this.contentTransformer,
              dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
            })
          : this.editor}
      </React.Fragment>
    );
  }
}

function getUAPrefix() {
  if (browser.chrome) {
    return 'ua-chrome';
  } else if (browser.ie) {
    return 'ua-ie';
  } else if (browser.gecko) {
    return 'ua-firefox';
  }

  return '';
}
