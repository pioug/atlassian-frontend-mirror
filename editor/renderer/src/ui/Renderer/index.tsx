import React from 'react';
import { PureComponent } from 'react';
import { IntlProvider } from 'react-intl';
import { Schema } from 'prosemirror-model';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema';
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
  IframeWidthObserverFallbackWrapper,
  IframeWrapperConsumer,
} from '@atlaskit/editor-common';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { ReactSerializer, renderDocument, RendererContext } from '../../';
import { RenderOutputStat } from '../../render-document';
import { Wrapper } from './style';
import { TruncatedWrapper } from './truncated-wrapper';
import { RendererAppearance } from './types';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics/enums';
import { AnalyticsEventPayload, PLATFORM, MODE } from '../../analytics/events';
import AnalyticsContext from '../../analytics/analyticsContext';
import { CopyTextProvider } from '../../react/nodes/copy-text-provider';
import { Provider as SmartCardStorageProvider } from '../SmartCardStorage';
import { name, version } from '../../version.json';

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
  onComplete?: (stat: RenderOutputStat) => void;
  onError?: (error: any) => void;
  portal?: HTMLElement;
  rendererContext?: RendererContext;
  schema?: Schema;
  appearance?: RendererAppearance;
  adfStage?: ADFStage;
  disableHeadingIDs?: boolean;
  allowDynamicTextSizing?: boolean;
  allowHeadingAnchorLinks?: boolean;
  maxHeight?: number;
  fadeOutHeight?: number;
  truncated?: boolean;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  allowColumnSorting?: boolean;
  shouldOpenMediaViewer?: boolean;
  allowAltTextOnImages?: boolean;
}

export class Renderer extends PureComponent<Props, {}> {
  private providerFactory: ProviderFactory;
  private serializer?: ReactSerializer;
  private rafID?: number;
  private editorRef?: React.RefObject<HTMLElement>;

  constructor(props: Props) {
    super(props);
    this.providerFactory = props.dataProviders || new ProviderFactory();
    this.updateSerializer(props);
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
    if (
      nextProps.portal !== this.props.portal ||
      nextProps.appearance !== this.props.appearance
    ) {
      this.updateSerializer(nextProps);
    }
  }

  private updateSerializer(props: Props) {
    const {
      eventHandlers,
      portal,
      rendererContext,
      document,
      extensionHandlers,
      schema,
      appearance,
      disableHeadingIDs,
      allowDynamicTextSizing,
      allowHeadingAnchorLinks,
      allowColumnSorting,
      shouldOpenMediaViewer,
      allowAltTextOnImages,
    } = props;

    this.serializer = new ReactSerializer({
      providers: this.providerFactory,
      eventHandlers,
      extensionHandlers,
      portal,
      objectContext: {
        adDoc: document,
        schema,
        ...rendererContext,
      } as RendererContext,
      appearance,
      disableHeadingIDs,
      allowDynamicTextSizing,
      allowHeadingAnchorLinks,
      allowColumnSorting,
      fireAnalyticsEvent: this.fireAnalyticsEvent,
      shouldOpenMediaViewer,
      allowAltTextOnImages,
    });
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
    } = this.props;

    try {
      const { result, stat } = renderDocument(
        document,
        this.serializer!,
        this.getSchema(),
        adfStage,
      );

      if (onComplete) {
        onComplete(stat);
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
                  {result}
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
      <WidthProvider>
        <BaseTheme dynamicTextSizing={dynamicTextSizing}>
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
