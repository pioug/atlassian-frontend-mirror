/** @jsx jsx */
import { Transformer } from '@atlaskit/editor-common/types';
import { BaseTheme, WidthProvider } from '@atlaskit/editor-common/ui';
import { jsx, css } from '@emotion/react';
import { EditorView } from 'prosemirror-view';
import { Fragment } from 'react';

import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import { ExperienceStore } from '@atlaskit/editor-common/ufo';
import EditorActions from '../actions';
import { getUiComponent } from '../create-editor';
import ReactEditorView from '../create-editor/ReactEditorViewNext';
import ErrorBoundary from '../create-editor/ErrorBoundary';
import { createFeatureFlagsFromProps } from '../create-editor/feature-flags-from-props';
import { EventDispatcher } from '../event-dispatcher';
import { ContextAdapter } from '../nodeviews/context-adapter';
import {
  ACTION,
  ACTION_SUBJECT,
  FireAnalyticsCallback,
} from '@atlaskit/editor-common/analytics';
import { EditorProps } from '../types/editor-props';
import EditorContext from '../ui/EditorContext';
import {
  PortalProviderWithThemeProviders,
  PortalRenderer,
} from '../ui/PortalProvider';
import { RenderTracking } from '../utils/performance/components/RenderTracking';
import { getBaseFontSize } from './utils/getBaseFontSize';
import useMeasureEditorMountTime from './hooks/useMeasureEditorMountTime';
import useProviderFactory from './hooks/useProviderFactory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { GetEditorPlugins } from '../types/get-editor-props';

interface Props {
  props: EditorProps;
  handleAnalyticsEvent: FireAnalyticsCallback;
  createAnalyticsEvent: CreateUIAnalyticsEvent;
  handleSave: (view: EditorView) => void;
  editorActions: EditorActions;
  getExperienceStore: () => ExperienceStore | undefined;
  onEditorCreated: (instance: {
    view: EditorView;
    eventDispatcher: EventDispatcher;
    transformer?: Transformer<string>;
  }) => void;
  onEditorDestroyed: (_instance: {
    view: EditorView;
    transformer?: Transformer<string>;
  }) => void;
  getEditorPlugins: GetEditorPlugins;
}

interface InternalProps extends Omit<Props, 'getExperienceStore'> {
  providerFactory: ProviderFactory;
}

/**
 * EditorInternal is used for the internal editor react component
 * with the lifecycle methods extracted into hooks.
 */
export default function EditorInternal(props: Props) {
  const {
    props: editorProps,
    getExperienceStore,
    editorActions,
    createAnalyticsEvent,
  } = props;

  useMeasureEditorMountTime(
    editorProps,
    getExperienceStore,
    createAnalyticsEvent,
  );

  const providerFactory = useProviderFactory(
    editorProps,
    editorActions,
    createAnalyticsEvent,
  );

  const updatedProps = { ...props, providerFactory };
  return <EditorInternalWithoutHooks {...updatedProps} />;
}

/**
 * EditorInternalComponent is used to capture the common component
 * from the `render` method of `Editor` and share it with `EditorNext`.
 */
export function EditorInternalWithoutHooks({
  props,
  handleAnalyticsEvent,
  createAnalyticsEvent,
  handleSave,
  editorActions,
  providerFactory,
  onEditorCreated,
  onEditorDestroyed,
  getEditorPlugins,
}: InternalProps) {
  const Component = getUiComponent(props.appearance!);

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
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={props.contextIdentifierProvider}
      >
        <WidthProvider css={css({ height: '100%' })}>
          <EditorContext editorActions={editorActions}>
            <ContextAdapter>
              <PortalProviderWithThemeProviders
                onAnalyticsEvent={handleAnalyticsEvent}
                useAnalyticsContext={props.UNSAFE_useAnalyticsContext}
                render={(portalProviderAPI) => (
                  <Fragment>
                    <ReactEditorView
                      editorProps={overriddenEditorProps}
                      createAnalyticsEvent={createAnalyticsEvent}
                      portalProviderAPI={portalProviderAPI}
                      providerFactory={providerFactory}
                      onEditorCreated={onEditorCreated}
                      onEditorDestroyed={onEditorDestroyed}
                      allowAnalyticsGASV3={props.allowAnalyticsGASV3}
                      disabled={props.disabled}
                      getEditorPlugins={getEditorPlugins}
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
                            insertMenuItems={props.insertMenuItems}
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
