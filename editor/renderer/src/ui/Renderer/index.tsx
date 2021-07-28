import React, { useContext, useLayoutEffect, useRef } from 'react';
import { PureComponent } from 'react';
import { IntlProvider } from 'react-intl';
import { Schema, Node as PMNode } from 'prosemirror-model';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema';
import { reduce } from '@atlaskit/adf-utils';
import {
  UnsupportedBlock,
  ProviderFactory,
  BaseTheme,
  WidthProvider,
  getAnalyticsAppearance,
  getAnalyticsEventSeverity,
  WithCreateAnalyticsEvent,
  getResponseEndTime,
  startMeasure,
  stopMeasure,
  shouldForceTracking,
} from '@atlaskit/editor-common';
import { normalizeFeatureFlags } from '@atlaskit/editor-common/normalize-feature-flags';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import {
  IframeWidthObserverFallbackWrapper,
  IframeWrapperConsumer,
} from '@atlaskit/width-detector';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import uuid from 'uuid/v4';
import { ReactSerializer, renderDocument, RendererContext } from '../../';
import { Wrapper } from './style';
import { TruncatedWrapper } from './truncated-wrapper';
import { RendererAppearance } from './types';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics/enums';
import { AnalyticsEventPayload, PLATFORM, MODE } from '../../analytics/events';
import AnalyticsContext from '../../analytics/analyticsContext';
import { CopyTextProvider } from '../../react/nodes/copy-text-provider';
import { Provider as SmartCardStorageProvider } from '../SmartCardStorage';
import { name, version } from '../../version.json';
import { ReactSerializerInit } from '../../react';
import { BreakoutSSRInlineScript } from './breakout-ssr';
import {
  RendererActionsContext,
  RendererContext as ActionsContext,
} from '../RendererActionsContext';
import { ActiveHeaderIdProvider } from '../active-header-id-provider';
import { RendererProps } from '../renderer-props';
import { AnnotationsWrapper } from '../annotations';
import {
  getActiveHeadingId,
  isNestedHeaderLinksEnabled,
} from '../../react/utils/links';
import { findInTree } from '../../utils';
import { isInteractiveElement } from './click-to-edit';
import { RendererContextProvider } from '../../renderer-context';
import memoizeOne from 'memoize-one';
import { ErrorBoundary } from './ErrorBoundary';

export const NORMAL_SEVERITY_THRESHOLD = 2000;
export const DEGRADED_SEVERITY_THRESHOLD = 3000;
export interface Extension<T> {
  extensionKey: string;
  parameters?: T;
  content?: any; // This would be the original Atlassian Document Format
}

export type { RendererProps as Props };
export class Renderer extends PureComponent<RendererProps> {
  private providerFactory: ProviderFactory;
  private serializer: ReactSerializer;
  private rafID?: number;
  private editorRef: React.RefObject<HTMLDivElement>;
  private mouseDownSelection?: string;
  private id?: string;

  constructor(props: RendererProps) {
    super(props);
    this.providerFactory = props.dataProviders || new ProviderFactory();
    this.serializer = new ReactSerializer(this.deriveSerializerProps(props));
    this.editorRef = props.innerRef || React.createRef();
    this.id = uuid();
    startMeasure(`Renderer Render Time: ${this.id}`);
  }

  private anchorLinkAnalytics() {
    const hash =
      window.location.hash && decodeURIComponent(window.location.hash.slice(1));
    const { disableHeadingIDs } = this.props;

    if (
      !disableHeadingIDs &&
      hash &&
      this.editorRef &&
      this.editorRef.current instanceof HTMLElement
    ) {
      const anchorLinkElement = document.getElementById(hash);
      // We are not use this.editorRef.querySelector here, instead we have this.editorRef.contains
      // because querySelector might fail if there are special characters in hash, and CSS.escape is still experimental.
      if (
        anchorLinkElement &&
        this.editorRef.current.contains(anchorLinkElement)
      ) {
        this.fireAnalyticsEvent({
          action: ACTION.VIEWED,
          actionSubject: ACTION_SUBJECT.ANCHOR_LINK,
          attributes: { platform: PLATFORM.WEB, mode: MODE.RENDERER },
          eventType: EVENT_TYPE.UI,
        });
      }
    }
  }

  componentDidMount() {
    this.fireAnalyticsEvent({
      action: ACTION.STARTED,
      actionSubject: ACTION_SUBJECT.RENDERER,
      attributes: { platform: PLATFORM.WEB },
      eventType: EVENT_TYPE.UI,
    });

    this.rafID = requestAnimationFrame(() => {
      stopMeasure(`Renderer Render Time: ${this.id}`, (duration) => {
        const { analyticsEventSeverityTracking } = this.props;
        const forceSeverityTracking =
          typeof analyticsEventSeverityTracking === 'undefined' &&
          shouldForceTracking();

        const severity =
          !!forceSeverityTracking || analyticsEventSeverityTracking?.enabled
            ? getAnalyticsEventSeverity(
                duration,
                analyticsEventSeverityTracking?.severityNormalThreshold ??
                  NORMAL_SEVERITY_THRESHOLD,
                analyticsEventSeverityTracking?.severityDegradedThreshold ??
                  DEGRADED_SEVERITY_THRESHOLD,
              )
            : undefined;

        this.fireAnalyticsEvent({
          action: ACTION.RENDERED,
          actionSubject: ACTION_SUBJECT.RENDERER,
          attributes: {
            platform: PLATFORM.WEB,
            duration,
            ttfb: getResponseEndTime(),
            nodes: reduce<Record<string, number>>(
              this.props.document,
              (acc, node) => {
                acc[node.type] = (acc[node.type] || 0) + 1;
                return acc;
              },
              {},
            ),
            severity,
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      });
      this.anchorLinkAnalytics();
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: RendererProps) {
    const nextMedia = nextProps.media || {};
    const media = this.props.media || {};

    if (
      nextProps.portal !== this.props.portal ||
      nextProps.appearance !== this.props.appearance ||
      nextProps.stickyHeaders !== this.props.stickyHeaders ||
      nextProps.disableActions !== this.props.disableActions ||
      nextProps.allowHeadingAnchorLinks !==
        this.props.allowHeadingAnchorLinks ||
      nextMedia.allowLinking !== media.allowLinking
    ) {
      this.serializer = new ReactSerializer(
        this.deriveSerializerProps(nextProps),
      );
    }
  }

  private deriveSerializerProps(props: RendererProps): ReactSerializerInit {
    // if just passed a boolean, change shape into object to simplify type
    const stickyHeaders = props.stickyHeaders
      ? props.stickyHeaders === true
        ? {}
        : props.stickyHeaders
      : undefined;

    const { annotationProvider } = props;
    const allowAnnotationsDraftMode = Boolean(
      annotationProvider &&
        annotationProvider.inlineComment &&
        annotationProvider.inlineComment.allowDraftMode,
    );

    return {
      providers: this.providerFactory,
      eventHandlers: props.eventHandlers,
      extensionHandlers: props.extensionHandlers,
      portal: props.portal,
      objectContext: {
        adDoc: props.document,
        schema: props.schema,
        ...props.rendererContext,
      } as RendererContext,
      appearance: props.appearance,
      disableHeadingIDs: props.disableHeadingIDs,
      disableActions: props.disableActions,
      allowDynamicTextSizing: props.allowDynamicTextSizing,
      allowHeadingAnchorLinks: props.allowHeadingAnchorLinks,
      allowColumnSorting: props.allowColumnSorting,
      fireAnalyticsEvent: this.fireAnalyticsEvent,
      shouldOpenMediaViewer: props.shouldOpenMediaViewer,
      allowAltTextOnImages: props.allowAltTextOnImages,
      stickyHeaders,
      allowMediaLinking: props.media && props.media.allowLinking,
      surroundTextNodesWithTextWrapper: allowAnnotationsDraftMode,
      media: props.media,
      allowCopyToClipboard: props.allowCopyToClipboard,
      allowCustomPanels: props.UNSAFE_allowCustomPanels,
      allowAnnotations: props.allowAnnotations,
      allowSelectAllTrap: props.allowSelectAllTrap,
      allowPlaceholderText: props.allowPlaceholderText,
    };
  }

  private featureFlags = memoizeOne(
    (featureFlags: RendererProps['featureFlags']) => ({
      featureFlags: normalizeFeatureFlags(featureFlags),
    }),
  );

  private fireAnalyticsEvent = (event: AnalyticsEventPayload) => {
    const { createAnalyticsEvent } = this.props;

    if (createAnalyticsEvent) {
      const channel = FabricChannel.editor;
      createAnalyticsEvent(event).fire(channel);
    }
  };

  private getSchema = () => {
    const { schema, adfStage } = this.props;
    if (schema) {
      return schema;
    }

    return getSchemaBasedOnStage(adfStage);
  };
  private onMouseDownEditView = () => {
    // When the user is deselecting text on the screen by clicking, if they are clicking outside
    // the current selection, by the time the onclick handler is called the window.getSelection()
    // value will already be cleared.
    // The mousedown callback is called before the selection is cleared.
    const windowSelection = window.getSelection();
    this.mouseDownSelection =
      windowSelection !== null ? windowSelection.toString() : undefined;
  };

  render() {
    const {
      document,
      onComplete,
      onError,
      appearance,
      adfStage,
      allowDynamicTextSizing,
      truncated,
      maxHeight,
      fadeOutHeight,
      enableSsrInlineScripts,
      allowHeadingAnchorLinks,
      allowPlaceholderText,
      allowColumnSorting,
      allowCopyToClipboard,
      UNSAFE_allowCustomPanels,
    } = this.props;

    const allowNestedHeaderLinks = isNestedHeaderLinksEnabled(
      allowHeadingAnchorLinks,
    );
    /**
     * Handle clicks inside renderer. If the click isn't on media, in the media picker, or on a
     * link, call the onUnhandledClick eventHandler (which in Jira for example, may switch the
     * renderer out for the editor).
     * @param event Click event anywhere inside renderer
     */
    const handleWrapperOnClick = (event: React.MouseEvent) => {
      if (!this.props.eventHandlers?.onUnhandledClick) {
        return;
      }
      const targetElement = event.target as HTMLElement;
      if (!(targetElement instanceof window.Element)) {
        return;
      }

      const rendererWrapper = event.currentTarget as HTMLElement;

      // Check if the click was on an interactive element
      const isInteractiveElementInTree = findInTree(
        targetElement,
        rendererWrapper,
        isInteractiveElement,
      );
      if (isInteractiveElementInTree) {
        return;
      }

      // Ensure that selecting text in the renderer doesn't trigger onUnhandledClick
      // This logic originated in jira-frontend:
      // src/packages/issue/issue-view/src/views/field/rich-text/rich-text-inline-edit-view.js

      // The selection is required to be checked in `onMouseDown` and here. If not here, a new
      // selection isn't reported; if not in `onMouseDown`, a click outside the selection will
      // return an empty selection, which will erroneously fire onUnhandledClick.
      const windowSelection = window.getSelection();
      const selection: string | undefined =
        windowSelection !== null ? windowSelection.toString() : undefined;
      const hasSelection = selection && selection.length !== 0;

      const hasSelectionMouseDown =
        this.mouseDownSelection && this.mouseDownSelection.length !== 0;
      const allowEditBasedOnSelection = !hasSelection && !hasSelectionMouseDown;

      if (allowEditBasedOnSelection) {
        this.props.eventHandlers.onUnhandledClick(event);
      }
    };

    try {
      const schema = this.getSchema();
      const { result, stat, pmDoc } = renderDocument(
        document,
        this.serializer,
        schema,
        adfStage,
        this.props.useSpecBasedValidator,
        this.id,
        this.fireAnalyticsEvent,
        this.props.unsupportedContentLevelsTracking,
        this.props.appearance,
      );

      if (onComplete) {
        onComplete(stat);
      }

      const rendererOutput = (
        <RendererContextProvider
          value={this.featureFlags(this.props.featureFlags)}
        >
          <CopyTextProvider>
            <ActiveHeaderIdProvider
              value={getActiveHeadingId(allowHeadingAnchorLinks)}
            >
              <IntlProvider>
                <AnalyticsContext.Provider
                  value={{
                    fireAnalyticsEvent: (event: AnalyticsEventPayload) =>
                      this.fireAnalyticsEvent(event),
                  }}
                >
                  <SmartCardStorageProvider>
                    <RendererWrapper
                      appearance={appearance}
                      dynamicTextSizing={!!allowDynamicTextSizing}
                      allowNestedHeaderLinks={allowNestedHeaderLinks}
                      allowColumnSorting={allowColumnSorting}
                      allowCopyToClipboard={allowCopyToClipboard}
                      allowCustomPanels={UNSAFE_allowCustomPanels}
                      allowPlaceholderText={allowPlaceholderText}
                      innerRef={this.editorRef}
                      onClick={handleWrapperOnClick}
                      onMouseDown={this.onMouseDownEditView}
                    >
                      {enableSsrInlineScripts ? (
                        <BreakoutSSRInlineScript
                          allowDynamicTextSizing={!!allowDynamicTextSizing}
                        />
                      ) : null}
                      <RendererActionsInternalUpdater
                        doc={pmDoc}
                        schema={schema}
                        onAnalyticsEvent={this.fireAnalyticsEvent}
                      >
                        {result}
                      </RendererActionsInternalUpdater>
                    </RendererWrapper>
                  </SmartCardStorageProvider>
                </AnalyticsContext.Provider>
              </IntlProvider>
            </ActiveHeaderIdProvider>
          </CopyTextProvider>
        </RendererContextProvider>
      );

      return truncated ? (
        <TruncatedWrapper height={maxHeight} fadeHeight={fadeOutHeight}>
          {rendererOutput}
        </TruncatedWrapper>
      ) : (
        rendererOutput
      );
    } catch (e) {
      if (onError) {
        onError(e);
      }
      return (
        <RendererWrapper
          appearance={appearance}
          dynamicTextSizing={!!allowDynamicTextSizing}
          allowCopyToClipboard={allowCopyToClipboard}
          allowPlaceholderText={allowPlaceholderText}
          allowColumnSorting={allowColumnSorting}
          allowNestedHeaderLinks={allowNestedHeaderLinks}
          onClick={handleWrapperOnClick}
        >
          <UnsupportedBlock />
        </RendererWrapper>
      );
    }
  }

  componentWillUnmount() {
    const { dataProviders } = this.props;

    if (this.rafID) {
      window.cancelAnimationFrame(this.rafID);
    }

    // if this is the ProviderFactory which was created in constructor
    // it's safe to destroy it on Renderer unmount
    if (!dataProviders) {
      this.providerFactory.destroy();
    }
  }
}

const RendererWithAnalytics = React.memo((props: RendererProps) => (
  <FabricEditorAnalyticsContext
    data={{
      appearance: getAnalyticsAppearance(props.appearance),
      packageName: name,
      packageVersion: version,
      componentName: 'renderer',
      editorSessionId: uuid(),
    }}
  >
    <WithCreateAnalyticsEvent
      render={(createAnalyticsEvent) => {
        return (
          <ErrorBoundary
            component={ACTION_SUBJECT.RENDERER}
            rethrowError
            fallbackComponent={null}
            createAnalyticsEvent={createAnalyticsEvent}
          >
            <Renderer {...props} createAnalyticsEvent={createAnalyticsEvent} />
          </ErrorBoundary>
        );
      }}
    />
  </FabricEditorAnalyticsContext>
));

type RendererWrapperProps = {
  appearance: RendererAppearance;
  dynamicTextSizing: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
  allowColumnSorting?: boolean;
  allowCopyToClipboard?: boolean;
  allowPlaceholderText?: boolean;
  allowCustomPanels?: boolean;
  allowNestedHeaderLinks: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
} & { children?: React.ReactNode };

const RendererWithIframeFallbackWrapper = React.memo(
  (props: RendererWrapperProps & { subscribe: Function | null }) => {
    const {
      allowColumnSorting,
      dynamicTextSizing,
      allowNestedHeaderLinks,
      innerRef,
      appearance,
      children,
      subscribe,
      onClick,
      onMouseDown,
    } = props;
    const renderer = (
      <WidthProvider className="ak-renderer-wrapper">
        <BaseTheme
          dynamicTextSizing={dynamicTextSizing}
          baseFontSize={
            !dynamicTextSizing && appearance && appearance !== 'comment'
              ? akEditorFullPageDefaultFontSize
              : undefined
          }
        >
          <Wrapper
            innerRef={innerRef}
            appearance={appearance}
            allowNestedHeaderLinks={allowNestedHeaderLinks}
            allowColumnSorting={!!allowColumnSorting}
            onClick={onClick}
            onMouseDown={onMouseDown}
          >
            {children}
          </Wrapper>
        </BaseTheme>
      </WidthProvider>
    );

    if (!subscribe) {
      return (
        <IframeWidthObserverFallbackWrapper>
          {renderer}
        </IframeWidthObserverFallbackWrapper>
      );
    }

    return renderer;
  },
);

/**
 * When the product doesn't provide a IframeWidthObserverFallbackWrapper,
 * we will give one to the renderer,
 *
 * so if we have more than one `WidthProvider` on the content,
 * only one iframe will be created on the older browsers.
 */
export function RendererWrapper(props: RendererWrapperProps) {
  return (
    <IframeWrapperConsumer>
      {({ subscribe }) => (
        <RendererWithIframeFallbackWrapper {...props} subscribe={subscribe} />
      )}
    </IframeWrapperConsumer>
  );
}

function RendererActionsInternalUpdater({
  children,
  doc,
  schema,
  onAnalyticsEvent,
}: {
  doc?: PMNode;
  schema: Schema;
  children: JSX.Element | null;
  onAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
}) {
  const actions = useContext(ActionsContext);
  const rendererRef = useRef(null);
  useLayoutEffect(() => {
    if (doc) {
      actions._privateRegisterRenderer(
        rendererRef,
        doc,
        schema,
        onAnalyticsEvent,
      );
    } else {
      actions._privateUnregisterRenderer();
    }

    return () => actions._privateUnregisterRenderer();
  }, [actions, schema, doc, onAnalyticsEvent]);

  return children;
}

const RendererWithAnnotationSelection = (props: RendererProps) => {
  const { allowAnnotations, document: adfDocument } = props;
  const localRef = React.useRef<HTMLDivElement>(null);
  const innerRef = props.innerRef || localRef;

  if (!allowAnnotations) {
    return <RendererWithAnalytics innerRef={innerRef} {...props} />;
  }

  return (
    <RendererActionsContext>
      <AnnotationsWrapper
        rendererRef={innerRef}
        adfDocument={adfDocument}
        annotationProvider={props.annotationProvider}
      >
        <RendererWithAnalytics innerRef={innerRef} {...props} />
      </AnnotationsWrapper>
    </RendererActionsContext>
  );
};

export default RendererWithAnnotationSelection;
