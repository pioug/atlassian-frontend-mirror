/** @jsx jsx */
import { Fragment, useCallback } from 'react';

import { css, jsx } from '@emotion/react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { FireAnalyticsCallback } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import {
  PortalProviderWithThemeProviders,
  PortalRenderer,
} from '@atlaskit/editor-common/portal-provider';
import type { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
  AllEditorPresetPluginTypes,
  Transformer,
  PublicPluginAPI,
} from '@atlaskit/editor-common/types';
import { BaseTheme, WidthProvider } from '@atlaskit/editor-common/ui';

import type EditorActions from '../actions';
import { getUiComponent } from '../create-editor';
import ErrorBoundary from '../create-editor/ErrorBoundary';
import { createFeatureFlagsFromProps } from '../create-editor/feature-flags-from-props';
import type { EditorViewProps } from '../create-editor/ReactEditorView';
import ReactEditorView from '../create-editor/ReactEditorView';
import type { EventDispatcher } from '../event-dispatcher';
import { ContextAdapter } from '../nodeviews/context-adapter';
import type { EditorNextProps } from '../types/editor-props';
import EditorContext from '../ui/EditorContext';
import { useSetPresetContext } from '../presets/context';
import { RenderTracking } from '../utils/performance/components/RenderTracking';
import { getBaseFontSize } from './utils/getBaseFontSize';

interface InternalProps {
  props: EditorNextProps;
  handleAnalyticsEvent: FireAnalyticsCallback;
  createAnalyticsEvent: CreateUIAnalyticsEvent;
  handleSave: (view: EditorView) => void;
  editorActions: EditorActions;
  onEditorCreated: (instance: {
    view: EditorView;
    eventDispatcher: EventDispatcher;
    transformer?: Transformer<string>;
  }) => void;
  onEditorDestroyed: (_instance: {
    view: EditorView;
    transformer?: Transformer<string>;
  }) => void;
  preset: EditorPresetBuilder<string[], AllEditorPresetPluginTypes[]>;
  providerFactory: ProviderFactory;
}

/**
 * EditorInternalComponent is used to capture the common component
 * from the `render` method of `Editor` and share it with `EditorNext`.
 */
export function EditorInternal({
  props,
  handleAnalyticsEvent,
  createAnalyticsEvent,
  handleSave,
  editorActions,
  providerFactory,
  onEditorCreated,
  onEditorDestroyed,
  preset,
}: InternalProps) {
  const Component = getUiComponent(props.appearance!);

  const setEditorApi = useSetPresetContext();

  const overriddenEditorProps = {
    ...props,
    onSave: props.onSave ? handleSave : undefined,
    // noop all analytic events, even if a handler is still passed.
    analyticsHandler: undefined,
  };

  const featureFlags = createFeatureFlagsFromProps(props);
  const renderTracking = props.performanceTracking?.renderTracking?.editor;
  const renderTrackingEnabled = renderTracking?.enabled;
  const useShallow = renderTracking?.useShallow;
  // ED-16320: Check for explicit disable so that by default
  // it will still be enabled as it currently is. Then we can
  // progressively opt out synthetic tenants.
  const isErrorTrackingExplicitlyDisabled =
    props.performanceTracking?.errorTracking?.enabled === false;

  return (
    <Fragment>
      {renderTrackingEnabled && (
        <RenderTracking
          componentProps={props}
          action={ACTION.RE_RENDERED}
          actionSubject={ACTION_SUBJECT.EDITOR}
          handleAnalyticsEvent={handleAnalyticsEvent}
          propsToIgnore={['defaultValue']}
          useShallow={useShallow}
        />
      )}
      <ErrorBoundary
        errorTracking={!isErrorTrackingExplicitlyDisabled}
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={props.contextIdentifierProvider}
        featureFlags={featureFlags}
      >
        <WidthProvider css={css({ height: '100%' })}>
          <EditorContext editorActions={editorActions}>
            <ContextAdapter>
              <PortalProviderWithThemeProviders
                onAnalyticsEvent={handleAnalyticsEvent}
                useAnalyticsContext={props.UNSAFE_useAnalyticsContext}
                render={(portalProviderAPI) => (
                  <Fragment>
                    <ReactEditorViewContextWrapper
                      editorProps={overriddenEditorProps}
                      createAnalyticsEvent={createAnalyticsEvent}
                      portalProviderAPI={portalProviderAPI}
                      providerFactory={providerFactory}
                      onEditorCreated={onEditorCreated}
                      onEditorDestroyed={onEditorDestroyed}
                      disabled={props.disabled}
                      preset={preset}
                      setEditorApi={setEditorApi}
                      render={({
                        editor,
                        view,
                        eventDispatcher,
                        config,
                        dispatchAnalyticsEvent,
                        editorRef,
                      }) => (
                        <BaseTheme
                          baseFontSize={getBaseFontSize(props.appearance)}
                        >
                          <Component
                            innerRef={editorRef}
                            appearance={props.appearance!}
                            disabled={props.disabled}
                            editorActions={editorActions}
                            editorDOMElement={editor}
                            editorView={view}
                            providerFactory={providerFactory}
                            eventDispatcher={eventDispatcher}
                            dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                            maxHeight={props.maxHeight}
                            minHeight={props.minHeight}
                            onSave={props.onSave ? handleSave : undefined}
                            onCancel={props.onCancel}
                            popupsMountPoint={props.popupsMountPoint}
                            popupsBoundariesElement={
                              props.popupsBoundariesElement
                            }
                            popupsScrollableElement={
                              props.popupsScrollableElement
                            }
                            contentComponents={config.contentComponents}
                            primaryToolbarComponents={
                              config.primaryToolbarComponents
                            }
                            primaryToolbarIconBefore={
                              props.primaryToolbarIconBefore
                            }
                            secondaryToolbarComponents={
                              config.secondaryToolbarComponents
                            }
                            customContentComponents={props.contentComponents}
                            customPrimaryToolbarComponents={
                              props.primaryToolbarComponents
                            }
                            customSecondaryToolbarComponents={
                              props.secondaryToolbarComponents
                            }
                            contextPanel={props.contextPanel}
                            collabEdit={props.collabEdit}
                            persistScrollGutter={props.persistScrollGutter}
                            enableToolbarMinWidth={
                              props.featureFlags?.toolbarMinWidthOverflow !=
                              null
                                ? !!props.featureFlags?.toolbarMinWidthOverflow
                                : props.allowUndoRedoButtons
                            }
                            useStickyToolbar={props.useStickyToolbar}
                            featureFlags={featureFlags}
                            pluginHooks={config.pluginHooks}
                            hideAvatarGroup={props.hideAvatarGroup}
                          />
                        </BaseTheme>
                      )}
                    />
                    <PortalRenderer portalProviderAPI={portalProviderAPI} />
                  </Fragment>
                )}
              />
            </ContextAdapter>
          </EditorContext>
        </WidthProvider>
      </ErrorBoundary>
    </Fragment>
  );
}

function ReactEditorViewContextWrapper(props: EditorViewProps) {
  const setInternalEditorAPI = useSetPresetContext();
  const { setEditorApi: setExternalEditorAPI } = props;

  /**
   * We use the context to retrieve the editorAPI
   * externally for consumers via `usePreset`.
   *
   * However we also may need to retrieve this value internally via context
   * so we should also set the value for the `EditorContext` that is used in
   * `EditorInternal`.
   */
  const setEditorAPI = useCallback(
    (api: PublicPluginAPI<any>) => {
      setInternalEditorAPI?.(api);
      setExternalEditorAPI?.(api);
    },
    [setInternalEditorAPI, setExternalEditorAPI],
  );

  return <ReactEditorView {...props} setEditorApi={setEditorAPI} />;
}
