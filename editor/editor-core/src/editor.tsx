/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import React from 'react';

import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import type { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type {
  Transformer,
  AllEditorPresetPluginTypes,
} from '@atlaskit/editor-common/types';
import { WithCreateAnalyticsEvent } from '@atlaskit/editor-common/ui';
import { getAnalyticsAppearance } from '@atlaskit/editor-common/utils';
import { name, version } from './version-wrapper';

import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ExperienceStore } from '@atlaskit/editor-common/ufo';
import uuid from 'uuid/v4';
import EditorActions from './actions';
import { EditorInternalWithoutHooks as EditorInternal } from './editor-next/editor-internal';
import {
  Context,
  defaultProps,
  propTypes,
} from './editor-next/utils/editorPropTypes';
import trackEditorActions from './editor-next/utils/trackEditorActions';
import onEditorCreated from './editor-next/utils/onEditorCreated';
import deprecationWarnings from './editor-next/utils/deprecationWarnings';

import { EventDispatcher } from './event-dispatcher';
import {
  FireAnalyticsCallback,
  fireAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import {
  QuickInsertOptions,
  QuickInsertProvider,
} from './plugins/quick-insert/types';
import { EditorProps } from './types/editor-props';
import prepareQuickInsertProvider from './utils/prepare-quick-insert-provider';
import prepareExtensionProvider from './utils/prepare-extension-provider';
import { ProviderFactoryState } from './editor-next/hooks/useProviderFactory';
import handleProviders from './editor-next/utils/handleProviders';
import getProvidersFromEditorProps from './editor-next/utils/getProvidersFromEditorProps';
import {
  startMeasure,
  clearMeasure,
  stopMeasure,
  measureTTI,
} from '@atlaskit/editor-common/utils';
import measurements from './utils/performance/measure-enum';
import editorMeasureTTICallback from './editor-next/utils/editorMeasureTTICallback';
import { ACTION } from '@atlaskit/editor-common/analytics';
import sendDurationAnalytics from './editor-next/utils/sendDurationAnalytics';
import { createPreset } from './create-editor/create-plugins-list';

export type {
  AllowedBlockTypes,
  Command,
  CommandDispatch,
  DomAtPos,
  EditorAppearance,
  EditorAppearanceComponentProps,
  EditorConfig,
  EditorInstance,
  EditorPlugin,
  EditorProps,
  ExtensionConfig,
  ExtensionProvidersProp,
  FeedbackInfo,
  MarkConfig,
  MessageDescriptor,
  NodeConfig,
  NodeViewConfig,
  PluginsOptions,
  PMPlugin,
  PMPluginCreateConfig,
  PMPluginFactory,
  PMPluginFactoryParams,
  ReactComponents,
  ToolbarUIComponentFactory,
  ToolbarUiComponentFactoryParams,
  UIComponentFactory,
  UiComponentFactoryParams,
} from './types';
import { shouldRecreatePreset } from './create-editor/preset-utils';

type PresetState = {
  preset: EditorPresetBuilder<string[], AllEditorPresetPluginTypes[]>;
};
export default class Editor extends React.Component<
  EditorProps,
  ProviderFactoryState & PresetState
> {
  /**
   * WARNING: Code should be shared between Editor + EditorNext
   * If you are making changes that affect both, consider making them
   * in editor-next/editor-internal.tsx or editor-next/editor-utils.ts
   */

  static defaultProps = defaultProps;

  static contextTypes = {
    editorActions: PropTypes.object,
  };

  static propTypes = propTypes(
    'minHeight only supports editor appearance chromeless and comment for Editor',
  );

  private providerFactory: ProviderFactory;
  private editorActions: EditorActions;
  private createAnalyticsEvent?: CreateUIAnalyticsEvent;
  private editorSessionId: string;
  private experienceStore?: ExperienceStore;
  private startTime?: number;

  constructor(props: EditorProps, context: Context) {
    super(props);

    this.providerFactory = new ProviderFactory();
    deprecationWarnings(props);
    this.editorActions = (context || {}).editorActions || new EditorActions();
    this.editorSessionId = uuid();
    this.startTime = performance.now();
    this.onEditorCreated = this.onEditorCreated.bind(this);
    this.onEditorDestroyed = this.onEditorDestroyed.bind(this);
    this.getExperienceStore = this.getExperienceStore.bind(this);
    this.trackEditorActions(this.editorActions, props);

    /**
     * Consider any changes here to corresponding file for `EditorNext` in
     * `useEditorConstructor` (editor-next/hooks/useEditorMeasuresConstructor.ts)
     */
    startMeasure(measurements.EDITOR_MOUNTED);
    if (
      props.performanceTracking?.ttiTracking?.enabled ||
      props.featureFlags?.ufo
    ) {
      measureTTI(
        (tti, ttiFromInvocation, canceled) => {
          editorMeasureTTICallback(
            tti,
            ttiFromInvocation,
            canceled,
            this.props.performanceTracking,
            this.props.featureFlags,
            this.createAnalyticsEvent,
            this.experienceStore,
          );
        },
        props.performanceTracking?.ttiTracking?.ttiIdleThreshold,
        props.performanceTracking?.ttiTracking?.ttiCancelTimeout,
      );
    }

    /**
     * Consider any changes here to corresponding file for `EditorNext` in
     * `useProviderFactory` (editor-next/hooks/useProviderFactory.ts)
     */
    const extensionProvider = this.prepareExtensionProvider(
      props.extensionProviders,
    );

    const quickInsertProvider = this.prepareQuickInsertProvider(
      extensionProvider,
      props.quickInsert,
    );

    const preset = createPreset(props, undefined, this.createAnalyticsEvent);

    this.state = {
      extensionProvider,
      quickInsertProvider,
      preset,
    };
  }

  /**
   * Consider any changes here to corresponding file for `EditorNext` in
   * `useProviderFactory` (editor-next/hooks/useProviderFactory.ts) and
   * `useMeasureEditorMountTime` (editor-next/hooks/useMeasureEditorMountTime.ts)
   */
  componentDidMount() {
    stopMeasure(
      measurements.EDITOR_MOUNTED,
      sendDurationAnalytics(
        ACTION.EDITOR_MOUNTED,
        this.props,
        this.getExperienceStore,
        this.createAnalyticsEvent,
      ),
    );
    handleProviders(
      this.providerFactory,
      getProvidersFromEditorProps(this.props),
      this.state.extensionProvider,
      this.state.quickInsertProvider,
    );
  }

  /**
   * Consider any changes here to corresponding file for `EditorNext` in
   * `useProviderFactory` (editor-next/hooks/useProviderFactory.ts)
   */
  componentDidUpdate(prevProps: EditorProps) {
    const needsANewPreset = shouldRecreatePreset(prevProps, this.props);
    const preset = needsANewPreset
      ? createPreset(this.props, prevProps, this.createAnalyticsEvent)
      : this.state.preset;
    const { extensionProviders, quickInsert } = this.props;
    if (
      (extensionProviders &&
        extensionProviders !== prevProps.extensionProviders) ||
      // Though this will introduce some performance regression related to quick insert
      // loading but we can remove it soon when Forge will move to new API.
      // quickInsert={Promise.resolve(consumerQuickInsert)} is one of the main reason behind this performance issue.
      (quickInsert && quickInsert !== prevProps.quickInsert)
    ) {
      const extensionProvider =
        this.prepareExtensionProvider(extensionProviders);
      const quickInsertProvider = this.prepareQuickInsertProvider(
        extensionProvider,
        quickInsert,
      );

      this.setState(
        {
          extensionProvider,
          quickInsertProvider,
          preset,
        },
        () =>
          handleProviders(
            this.providerFactory,
            getProvidersFromEditorProps(this.props),
            this.state.extensionProvider,
            this.state.quickInsertProvider,
          ),
      );
      return;
    }

    if (needsANewPreset) {
      this.setState({ preset });
      return;
    }
    handleProviders(
      this.providerFactory,
      getProvidersFromEditorProps(this.props),
      this.state.extensionProvider,
      this.state.quickInsertProvider,
    );
  }

  /**
   * Consider any changes here to corresponding file for `EditorNext` in
   * `useProviderFactory` (editor-next/hooks/useProviderFactory.ts) and
   * `useMeasureEditorMountTime` (editor-next/hooks/useMeasureEditorMountTime.ts)
   */
  componentWillUnmount() {
    this.unregisterEditorFromActions();
    this.providerFactory.destroy();
    clearMeasure(measurements.EDITOR_MOUNTED);
    this.props?.performanceTracking?.onEditorReadyCallbackTracking?.enabled &&
      clearMeasure(measurements.ON_EDITOR_READY_CALLBACK);

    if (this.props.featureFlags?.ufo) {
      this.experienceStore?.abortAll({ reason: 'editor component unmounted' });
    }
  }

  /**
   * @private
   * @deprecated - Do not override this at all, this is an anti-pattern.
   * Please reach out to the Editor team if you were previously using this
   * and need to find a workaround.
   */
  trackEditorActions(
    editorActions: EditorActions & {
      _contentRetrievalTracking?: {
        getValueTracked: boolean;
        samplingCounters: { success: number; failure: number };
      };
    },
    props: EditorProps,
  ) {
    return trackEditorActions(
      editorActions,
      props.performanceTracking,
      (value) => this.handleAnalyticsEvent(value),
    );
  }

  /**
   * @private
   * @deprecated - Do not override this at all, this is an antipattern.
   * Please reach out to the Editor team if you were previously using this
   * and need to find a workaround.
   */
  prepareExtensionProvider = prepareExtensionProvider(() => this.editorActions);

  /**
   * @private
   * @deprecated - Do not override this at all, this is an antipattern.
   * Please reach out to the Editor team if you were previously using this
   * and need to find a workaround.
   */
  prepareQuickInsertProvider = (
    extensionProvider?: ExtensionProvider,
    quickInsert?: QuickInsertOptions,
  ): Promise<QuickInsertProvider> | undefined => {
    return prepareQuickInsertProvider(
      this.editorActions,
      extensionProvider,
      quickInsert,
      this.createAnalyticsEvent,
    );
  };

  /**
   * @private
   * @deprecated - Do not override this at all, this is an antipattern.
   * Please reach out to the Editor team if you were previously using this
   * and need to find a workaround.
   */
  onEditorCreated(instance: {
    view: EditorView;
    eventDispatcher: EventDispatcher;
    transformer?: Transformer<string>;
  }) {
    onEditorCreated(
      instance,
      this.props,
      (experienceStore) => (this.experienceStore = experienceStore),
      this.getExperienceStore,
      () => this.createAnalyticsEvent,
      this.editorActions,
      this.startTime,
      (view, dispatcher, transformerForActions) =>
        this.registerEditorForActions(view, dispatcher, transformerForActions),
    );
  }

  /**
   * @private
   * @deprecated - Do not override this at all, this is an antipattern.
   * Please reach out to the Editor team if you were previously using this
   * and need to find a workaround.
   */
  onEditorDestroyed(_instance: {
    view: EditorView;
    transformer?: Transformer<string>;
  }) {
    this.unregisterEditorFromActions();
    this.props.onDestroy?.();
  }

  /**
   * @private
   * @deprecated - Do not override this at all, this is an antipattern.
   * Please reach out to the Editor team if you were previously using this
   * and need to find a workaround.
   */
  handleSave = (view: EditorView): void => this.props.onSave?.(view);

  /**
   * @private
   * @deprecated - Do not override this at all, this is an antipattern.
   * Please reach out to the Editor team if you were previously using this
   * and need to find a workaround.
   */
  handleAnalyticsEvent: FireAnalyticsCallback = (data) =>
    fireAnalyticsEvent(this.createAnalyticsEvent)(data);

  /**
   * @private
   * @deprecated - Do not override this at all, this is an antipattern.
   * Please reach out to the Editor team if you were previously using this
   * and need to find a workaround.
   */
  registerEditorForActions(
    editorView: EditorView,
    eventDispatcher: EventDispatcher,
    contentTransformer?: Transformer<string>,
  ) {
    this.editorActions._privateRegisterEditor(
      editorView,
      eventDispatcher,
      contentTransformer,
    );
  }

  /**
   * @private
   * @deprecated - Do not override this at all, this is an antipattern.
   * Please reach out to the Editor team if you were previously using this
   * and need to find a workaround.
   */
  unregisterEditorFromActions() {
    this.editorActions._privateUnregisterEditor();
  }

  private getExperienceStore = () => this.experienceStore;

  render() {
    return (
      <FabricEditorAnalyticsContext
        data={{
          packageName: name,
          packageVersion: version,
          componentName: 'editorCore',
          appearance: getAnalyticsAppearance(this.props.appearance),
          editorSessionId: this.editorSessionId,
        }}
      >
        <WithCreateAnalyticsEvent
          render={(createAnalyticsEvent) =>
            (this.createAnalyticsEvent = createAnalyticsEvent) && (
              <EditorInternal
                props={this.props}
                handleAnalyticsEvent={this.handleAnalyticsEvent}
                createAnalyticsEvent={this.createAnalyticsEvent}
                preset={this.state.preset}
                handleSave={this.handleSave}
                editorActions={this.editorActions}
                providerFactory={this.providerFactory}
                onEditorCreated={this.onEditorCreated}
                onEditorDestroyed={this.onEditorDestroyed}
              />
            )
          }
        />
      </FabricEditorAnalyticsContext>
    );
  }
}
