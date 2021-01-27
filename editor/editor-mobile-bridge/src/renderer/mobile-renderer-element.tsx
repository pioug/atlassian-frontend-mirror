/* eslint-disable no-console */
import React, { useCallback, useRef } from 'react';
import {
  WithCreateAnalyticsEvent,
  AnnotationProviders,
  ExtensionHandlers,
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
import { toNativeBridge } from './web-to-native/implementation';
import {
  Provider as SmartCardProvider,
  Client as CardClient,
} from '@atlaskit/smart-card';
import { EmojiResource } from '@atlaskit/emoji/resource';
import { analyticsBridgeClient } from '../analytics-client';
import { createPromise } from '../cross-platform-promise';
import { eventDispatcher } from './dispatcher';
import {
  getDisableActionsValue,
  getDisableMediaLinkingValue,
  getEnableLightDarkTheming,
  getEnableLegacyMobileMacros,
  getAllowCaptions,
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
import { withLegacyMobileMacros } from '@atlaskit/legacy-mobile-macros';

import { withIntlProvider } from '../i18n/with-intl-provider';
import { injectIntl, InjectedIntl } from 'react-intl';
import { geti18NMessages } from './renderer-localisation-provider';
import { withSystemTheme } from '../WithSystemTheme';
import RendererBridgeImplementation from './native-to-web/implementation';
import useRendererConfiguration from './hooks/use-renderer-configuration';

export interface MobileRendererProps extends RendererProps {
  cardClient: CardClient;
  document: string;
  mediaProvider: Promise<MediaProviderType>;
  mentionProvider: Promise<MentionProvider>;
  emojiProvider: Promise<EmojiResource>;
  intl: InjectedIntl;
  rendererBridge: RendererBridgeImplementation;
}

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
  intl: InjectedIntl;
  extensionHandlers: ExtensionHandlers;
  rendererBridge: RendererBridgeImplementation;
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
  rendererBridge,
  document: initialDocument,
  extensionHandlers,
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
  useRendererConfiguration(rendererBridge);
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
      media={{
        allowLinking: !disableMediaLinking,
        featureFlags: {
          captions: getAllowCaptions(),
        },
      }}
      allowHeadingAnchorLinks={headingAnchorLinksConfig}
      rendererContext={rendererContext}
      eventHandlers={eventHandlers}
      useSpecBasedValidator={true}
      extensionHandlers={extensionHandlers}
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

const ThemedBasicRenderer = withSystemTheme(
  BasicRenderer,
  getEnableLightDarkTheming(),
);

const MobileRenderer = withLegacyMobileMacros<
  MobileRendererProps,
  typeof createPromise,
  typeof eventDispatcher
>(
  withFabricAnalytics(withSmartCard(ThemedBasicRenderer)),
  createPromise,
  eventDispatcher,
  getEnableLegacyMobileMacros(),
);

export { MobileRenderer };

export default withIntlProvider(injectIntl(MobileRenderer), geti18NMessages);
