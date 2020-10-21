/* eslint-disable no-console */
import React, { useCallback, useRef } from 'react';
import {
  WithCreateAnalyticsEvent,
  AnnotationProviders,
} from '@atlaskit/editor-common';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { MentionProvider } from '@atlaskit/mention/types';
import { MediaProvider as MediaProviderType } from '@atlaskit/editor-common/provider-factory';
import { ReactRenderer, RendererProps } from '@atlaskit/renderer';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import {
  GasPurePayload,
  GasPureScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import RendererBridgeImpl from './native-to-web/implementation';
import { toNativeBridge } from './web-to-native/implementation';
import {
  Provider as SmartCardProvider,
  Client as CardClient,
} from '@atlaskit/smart-card';
import { EmojiResource } from '@atlaskit/emoji/resource';
import { analyticsBridgeClient } from '../analytics-client';
import {
  getDisableActionsValue,
  getDisableMediaLinkingValue,
} from '../query-param-reader';
import { useRendererContent } from './hooks/use-set-renderer-content';
import { useCreateProviderFactory } from './hooks/use-create-provider-factory';
import { useRendererContext } from './hooks/use-renderer-context';
import { useHeadingLinks } from './hooks/use-heading-links';
import { useAnnotation } from './annotations/use-annotation';
import { useRendererReady } from './hooks/use-renderer-ready';
import { useRendererDestroyed } from './hooks/use-renderer-destroyed';
import { eventHandlers } from './event-handlers';
import { isApple } from '../utils/is-apple';
import { useRendererReflowDetected } from './hooks/use-renderer-reflow-detected';

export interface MobileRendererProps extends RendererProps {
  cardClient: CardClient;
  document: string;
  mediaProvider: Promise<MediaProviderType>;
  mentionProvider: Promise<MentionProvider>;
  emojiProvider: Promise<EmojiResource>;
}

const rendererBridge = (window.rendererBridge = new RendererBridgeImpl());

const handleAnalyticsEvent = (
  event: GasPurePayload | GasPureScreenEventPayload,
) => {
  toNativeBridge.call('analyticsBridge', 'trackEvent', {
    event: JSON.stringify(event),
  });
};

const analyticsClient: AnalyticsWebClient = analyticsBridgeClient(
  handleAnalyticsEvent,
);

type WithSmartCardClientProps = {
  cardClient: CardClient;
};

type BasicRendererProps = {
  mediaProvider: Promise<MediaProviderType>;
  mentionProvider: Promise<MentionProvider>;
  emojiProvider: Promise<EmojiResource>;
  allowAnnotations: boolean;
  allowHeadingAnchorLinks: boolean;
  objectAri: string;
  containerAri: string;
  document: string;
};

interface WithCreateAnalyticsEventProps extends BasicRendererProps {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
  annotationProvider: AnnotationProviders | null;
}

const handleRendererContentLoadedBridge = () => {
  if (
    !isApple(window) && // don't fire on iOS
    window.requestAnimationFrame
  ) {
    window.requestAnimationFrame(() =>
      toNativeBridge.call('renderBridge', 'onContentRendered'),
    );
  }
};

const BasicRenderer: React.FC<WithCreateAnalyticsEventProps> = ({
  createAnalyticsEvent,
  allowAnnotations,
  allowHeadingAnchorLinks,
  emojiProvider,
  mediaProvider,
  mentionProvider,
  document: initialDocument,
}: WithCreateAnalyticsEventProps) => {
  const document = useRendererContent(initialDocument);
  const providerFactory = useCreateProviderFactory(
    {
      mentionProvider,
      emojiProvider,
      mediaProvider,
    },
    rendererBridge,
  );
  const rendererContext = useRendererContext(rendererBridge);
  const headingAnchorLinksConfig = useHeadingLinks(allowHeadingAnchorLinks);
  const disableActions = getDisableActionsValue();
  const disableMediaLinking = getDisableMediaLinkingValue();
  const annotationProvider = useAnnotation(allowAnnotations);
  const innerRef = useRef<HTMLDivElement>(null);

  useRendererReady(innerRef);
  useRendererDestroyed();
  useRendererReflowDetected(rendererBridge);

  return (
    <ReactRenderer
      innerRef={innerRef}
      document={document}
      annotationProvider={annotationProvider}
      allowAnnotations={allowAnnotations}
      dataProviders={providerFactory}
      onError={handleRendererContentLoadedBridge}
      onComplete={handleRendererContentLoadedBridge}
      appearance="mobile"
      disableActions={disableActions}
      createAnalyticsEvent={createAnalyticsEvent}
      allowAltTextOnImages
      media={{ allowLinking: !disableMediaLinking }}
      allowHeadingAnchorLinks={headingAnchorLinksConfig}
      rendererContext={rendererContext}
      eventHandlers={eventHandlers}
    />
  );
};

const withSmartCard = <P extends BasicRendererProps>(
  Component: React.ComponentType<P>,
): React.FC<P & WithSmartCardClientProps> => ({
  cardClient: smartCardClient,
  ...props
}: WithSmartCardClientProps) => {
  // Temporarily opting out of the default oauth2 flow for phase 1 of Smart Links
  // See https://product-fabric.atlassian.net/browse/FM-2149 for details.
  const authFlow = 'disabled';
  const renderCallback = useCallback(
    createAnalyticsEvent => (
      <SmartCardProvider client={smartCardClient} authFlow={authFlow}>
        <Component
          createAnalyticsEvent={createAnalyticsEvent}
          {...(props as P)}
        />
      </SmartCardProvider>
    ),
    [props, smartCardClient],
  );

  return <WithCreateAnalyticsEvent render={renderCallback} />;
};

const withFabricAnalytics = <P extends MobileRendererProps>(
  Component: React.ComponentType<P>,
): React.FC<MobileRendererProps> => (props: MobileRendererProps) => {
  return (
    <FabricAnalyticsListeners client={analyticsClient}>
      <Component {...(props as P)} />
    </FabricAnalyticsListeners>
  );
};

const MobileRenderer = withFabricAnalytics(withSmartCard(BasicRenderer));

export default MobileRenderer;
