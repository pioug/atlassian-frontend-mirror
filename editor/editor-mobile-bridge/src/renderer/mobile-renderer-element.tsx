/* eslint-disable no-console */
import React, { useCallback } from 'react';
import {
  WithCreateAnalyticsEvent,
  AnnotationProviders,
} from '@atlaskit/editor-common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { MentionProvider } from '@atlaskit/mention/types';
import { MediaProvider as MediaProviderType } from '@atlaskit/editor-common/provider-factory';
import { AnnotationMarkStates } from '@atlaskit/adf-schema';
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
import { AnnotationContextProviderWrapper } from './annotations/annotation-context-provider-wrapper';
import { useAnnotation } from './annotations/use-annotation';

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
  document: string;
};

interface WithCreateAnalyticsEventProps extends BasicRendererProps {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
  annotationProvider: AnnotationProviders<AnnotationMarkStates> | null;
}

const BasicRenderer: React.FC<WithCreateAnalyticsEventProps> = ({
  createAnalyticsEvent,
  allowAnnotations,
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
  const disableActions = getDisableActionsValue();
  const disableMediaLinking = getDisableMediaLinkingValue();
  const [annotationProvider, annotationContext] = useAnnotation(
    allowAnnotations,
  );
  const handleRendererContentLoaded = useCallback(() => {
    if (
      window &&
      !window.webkit && // don't fire on iOS
      window.requestAnimationFrame
    ) {
      window.requestAnimationFrame(() =>
        toNativeBridge.call('renderBridge', 'onContentRendered'),
      );
    }
  }, []);

  const onLinkClick = useCallback(
    (event: React.SyntheticEvent<HTMLElement>, url?: string) => {
      // Prevent redirection within the WebView
      event.preventDefault();

      if (!url) {
        return;
      }
      // Relay the URL through the bridge for handling
      toNativeBridge.call('linkBridge', 'onLinkClick', { url });
    },
    [],
  );

  const onMediaClick = useCallback((result: any, analyticsEvent?: any) => {
    const { mediaItemDetails } = result;
    // Media details only exist once resolved. Not available during loading/pending state.
    if (mediaItemDetails) {
      const mediaId = mediaItemDetails.id;
      // We don't have access to the occurrence key at this point so native will default to the first instance for now.
      // https://product-fabric.atlassian.net/browse/FM-1984
      const occurrenceKey: string | null = null;
      toNativeBridge.call('mediaBridge', 'onMediaClick', {
        mediaId,
        occurrenceKey,
      });
    }
  }, []);

  const onMentionClick = useCallback((profileId: string, alias: string) => {
    toNativeBridge.call('mentionBridge', 'onMentionClick', {
      profileId,
    });
  }, []);

  return (
    <AnnotationContextProviderWrapper value={annotationContext}>
      <ReactRenderer
        document={document}
        annotationProvider={annotationProvider}
        allowAnnotations={allowAnnotations}
        dataProviders={providerFactory}
        onError={handleRendererContentLoaded}
        onComplete={handleRendererContentLoaded}
        appearance="mobile"
        disableActions={disableActions}
        createAnalyticsEvent={createAnalyticsEvent}
        allowAltTextOnImages
        media={{ allowLinking: !disableMediaLinking }}
        rendererContext={rendererContext}
        eventHandlers={{
          link: {
            onClick: onLinkClick,
          },
          media: {
            onClick: onMediaClick,
          },
          mention: {
            onClick: onMentionClick,
          },
          smartCard: {
            onClick: onLinkClick,
          },
        }}
      />
    </AnnotationContextProviderWrapper>
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
