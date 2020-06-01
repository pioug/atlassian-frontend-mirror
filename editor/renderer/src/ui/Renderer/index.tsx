import React, { useContext, useEffect, useRef } from 'react';
import { PureComponent } from 'react';
import { IntlProvider } from 'react-intl';
import { Schema, Node as PMNode } from 'prosemirror-model';
import {
  getSchemaBasedOnStage,
  AnnotationMarkStates,
  AnnotationTypes,
  AnnotationId,
} from '@atlaskit/adf-schema';
import { reduce } from '@atlaskit/adf-utils';
import {
  ADFStage,
  UnsupportedBlock,
  ProviderFactory,
  EventHandlers,
  ExtensionHandlers,
  BaseTheme,
  WidthProvider,
  getAnalyticsAppearance,
  WithCreateAnalyticsEvent,
  getResponseEndTime,
  startMeasure,
  stopMeasure,
  akEditorFullPageDefaultFontSize,
  AnnotationProviders,
} from '@atlaskit/editor-common';
import {
  IframeWidthObserverFallbackWrapper,
  IframeWrapperConsumer,
} from '@atlaskit/width-detector';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { ReactSerializer, renderDocument, RendererContext } from '../../';
import { RenderOutputStat } from '../../render-document';
import { Wrapper } from './style';
import { TruncatedWrapper } from './truncated-wrapper';
import { RendererAppearance, StickyHeaderConfig } from './types';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics/enums';
import { AnalyticsEventPayload, PLATFORM, MODE } from '../../analytics/events';
import AnalyticsContext from '../../analytics/analyticsContext';
import { CopyTextProvider } from '../../react/nodes/copy-text-provider';
import { Provider as SmartCardStorageProvider } from '../SmartCardStorage';
import { name, version } from '../../version.json';
import { ReactSerializerInit } from '../../react';
import { BreakoutSSRInlineScript } from './breakout-ssr';

import { RendererContext as ActionsContext } from '../RendererActionsContext';
import {
  getAnnotationDeferred,
  resolveAnnotationPromises,
  getAllAnnotationMarks,
} from './utils/annotations';

export interface Extension<T> {
  extensionKey: string;
  parameters?: T;
  content?: any; // This would be the original Atlassian Document Format
}

export interface Props {
  document: any;
  dataProviders?: ProviderFactory;
  eventHandlers?: EventHandlers;
  extensionHandlers?: ExtensionHandlers;
  // Enables inline scripts to add support for breakout nodes,
  // before main JavaScript bundle is available.
  enableSsrInlineScripts?: boolean;
  onComplete?: (stat: RenderOutputStat) => void;
  annotationProvider?: AnnotationProviders<AnnotationMarkStates> | null;
  onError?: (error: any) => void;
  portal?: HTMLElement;
  rendererContext?: RendererContext;
  schema?: Schema;
  appearance?: RendererAppearance;
  adfStage?: ADFStage;
  disableHeadingIDs?: boolean;
  disableActions?: boolean;
  allowDynamicTextSizing?: boolean;
  allowHeadingAnchorLinks?: boolean;
  maxHeight?: number;
  fadeOutHeight?: number;
  truncated?: boolean;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  allowColumnSorting?: boolean;
  shouldOpenMediaViewer?: boolean;
  allowAltTextOnImages?: boolean;
  allowAnnotations?: boolean;
  stickyHeaders?: StickyHeaderConfig;
  media?: {
    allowLinking?: boolean;
  };
}
export class Renderer extends PureComponent<Props> {
  private providerFactory: ProviderFactory;
  private serializer: ReactSerializer;
  private rafID?: number;
  private editorRef?: React.RefObject<HTMLElement>;
  private annotationProvider?: AnnotationProviders<AnnotationMarkStates> | null;

  constructor(props: Props) {
    super(props);
    this.providerFactory = props.dataProviders || new ProviderFactory();
    this.serializer = new ReactSerializer(this.deriveSerializerProps(props));
    this.annotationProvider = props.annotationProvider;
    startMeasure('Renderer Render Time');
  }

  private anchorLinkAnalytics() {
    const hash =
      window.location.hash && decodeURIComponent(window.location.hash.slice(1));

    if (
      !this.props.disableHeadingIDs &&
      hash &&
      this.editorRef &&
      this.editorRef instanceof HTMLElement
    ) {
      const anchorLinkElement = document.getElementById(hash);
      // We are not use this.editorRef.querySelector here, instead we have this.editorRef.contains
      // because querySelector might fail if there are special characters in hash, and CSS.escape is still experimental.
      if (anchorLinkElement && this.editorRef.contains(anchorLinkElement)) {
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
      stopMeasure('Renderer Render Time', duration => {
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
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      });
      this.anchorLinkAnalytics();
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const nextMedia = nextProps.media || {};
    const media = this.props.media || {};

    if (
      nextProps.portal !== this.props.portal ||
      nextProps.appearance !== this.props.appearance ||
      nextProps.stickyHeaders !== this.props.stickyHeaders ||
      nextMedia.allowLinking !== media.allowLinking
    ) {
      this.serializer = new ReactSerializer(
        this.deriveSerializerProps(nextProps),
      );
    }
  }

  private deriveSerializerProps(props: Props): ReactSerializerInit {
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
      stickyHeaders: props.stickyHeaders,
      allowMediaLinking: props.media && props.media.allowLinking,
      allowAnnotations: props.allowAnnotations,
      getAnnotationPromise: (id: AnnotationId) =>
        getAnnotationDeferred(id).promise,
    };
  }

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

  private loadAnnotations = (schema: Schema, pmDocument: PMNode) => {
    if (
      !this.annotationProvider ||
      !this.annotationProvider[AnnotationTypes.INLINE_COMMENT]
    ) {
      return;
    }

    const annotationIdsByType = getAllAnnotationMarks(schema, pmDocument);
    const inlineCommentProvider = this.annotationProvider[
      AnnotationTypes.INLINE_COMMENT
    ];
    inlineCommentProvider
      .getState(annotationIdsByType[AnnotationTypes.INLINE_COMMENT])
      .then(resolveAnnotationPromises);
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
      allowAnnotations,
    } = this.props;

    try {
      const schema = this.getSchema();
      const { result, stat, pmDoc } = renderDocument(
        document,
        this.serializer,
        schema,
        adfStage,
      );

      if (onComplete) {
        onComplete(stat);
      }

      if (allowAnnotations && pmDoc && schema) {
        this.loadAnnotations(schema, pmDoc);
      }

      const rendererOutput = (
        <CopyTextProvider>
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
                  wrapperRef={ref => {
                    this.editorRef = ref;
                  }}
                >
                  {enableSsrInlineScripts ? (
                    <BreakoutSSRInlineScript
                      allowDynamicTextSizing={!!allowDynamicTextSizing}
                    />
                  ) : null}
                  <RendererActionsInternalUpdater doc={pmDoc} schema={schema}>
                    {result}
                  </RendererActionsInternalUpdater>
                </RendererWrapper>
              </SmartCardStorageProvider>
            </AnalyticsContext.Provider>
          </IntlProvider>
        </CopyTextProvider>
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

const RendererWithAnalytics = (props: Props) => (
  <FabricEditorAnalyticsContext
    data={{
      appearance: getAnalyticsAppearance(props.appearance),
      packageName: name,
      packageVersion: version,
      componentName: 'editorCore',
    }}
  >
    <WithCreateAnalyticsEvent
      render={createAnalyticsEvent => (
        <Renderer {...props} createAnalyticsEvent={createAnalyticsEvent} />
      )}
    />
  </FabricEditorAnalyticsContext>
);

export default RendererWithAnalytics;

type RendererWrapperProps = {
  appearance: RendererAppearance;
  dynamicTextSizing: boolean;
  wrapperRef?: (instance: React.RefObject<HTMLElement>) => void;
} & { children?: React.ReactNode };

const RendererWithIframeFallbackWrapper = React.memo(
  (props: RendererWrapperProps & { subscribe: Function | null }) => {
    const {
      dynamicTextSizing,
      wrapperRef,
      appearance,
      children,
      subscribe,
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
          <Wrapper innerRef={wrapperRef} appearance={appearance}>
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
}: {
  doc?: PMNode;
  schema: Schema;
  children: JSX.Element | null;
}) {
  const actions = useContext(ActionsContext);
  const rendererRef = useRef(null);
  useEffect(() => {
    if (doc) {
      actions._privateRegisterRenderer(rendererRef, doc, schema);
    } else {
      actions._privateUnregisterRenderer();
    }

    return () => actions._privateUnregisterRenderer();
  }, [actions, schema, doc]);

  return children;
}
