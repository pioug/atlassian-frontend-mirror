/* eslint-disable no-console */
import React, { useCallback, useEffect, useRef } from 'react';
import type { AnnotationProviders } from '@atlaskit/editor-common/types';
import type {
  ExtensionHandlers,
  ExtensionProvider,
} from '@atlaskit/editor-common/extensions';
import { WithCreateAnalyticsEvent } from '@atlaskit/editor-common/ui';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { MentionProvider } from '@atlaskit/mention/types';
import type { MediaProvider as MediaProviderType } from '@atlaskit/editor-common/provider-factory';
import type { RendererProps } from '@atlaskit/renderer';
import { ReactRenderer } from '@atlaskit/renderer';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
import { toNativeBridge } from './web-to-native/implementation';
import type { CardClient } from '@atlaskit/link-provider';
import { SmartCardProvider } from '@atlaskit/link-provider';
import type { EmojiResource } from '@atlaskit/emoji/resource';
import {
  getEnableLightDarkTheming,
  getAllowCaptions,
  getEnableTokenThemes,
} from '../query-param-reader';
import { rendererAnalyticsClient } from './renderer-analytics-client';
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

import { withIntlProvider } from '../i18n/with-intl-provider';
import type { IntlShape } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import { geti18NMessages } from './renderer-localisation-provider';
import { withSystemTheme } from '../WithSystemTheme';
import type RendererBridgeImplementation from './native-to-web/implementation';
import type { DocNode } from '@atlaskit/adf-schema';
import { setGlobalTheme } from '@atlaskit/tokens';

export interface MobileRendererProps extends RendererProps {
  cardClient: CardClient;
  disableMediaLinking?: boolean;
  document: DocNode;
  emojiProvider: Promise<EmojiResource>;
  intl: IntlShape;
  mediaProvider: Promise<MediaProviderType>;
  mentionProvider: Promise<MentionProvider>;
  extensionProvider?: Promise<ExtensionProvider>;
  rendererBridge: RendererBridgeImplementation;
}

type WithSmartCardClientProps = {
  cardClient: CardClient;
};

type BasicRendererProps = {
  allowAnnotations: boolean;
  allowHeadingAnchorLinks: boolean;
  containerAri: string;
  disableMediaLinking: boolean;
  disableActions: boolean;
  document: DocNode;
  emojiProvider: Promise<EmojiResource>;
  extensionHandlers: ExtensionHandlers;
  intl: IntlShape;
  mediaProvider: Promise<MediaProviderType>;
  mentionProvider: Promise<MentionProvider>;
  extensionProvider?: Promise<ExtensionProvider>;
  objectAri: string;
  rendererBridge: RendererBridgeImplementation;
  allowCustomPanels: boolean;
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
  allowAnnotations,
  allowHeadingAnchorLinks,
  createAnalyticsEvent,
  disableActions,
  disableMediaLinking,
  document: initialDocument,
  emojiProvider,
  mediaProvider,
  mentionProvider,
  extensionProvider,
  rendererBridge,
  allowCustomPanels,
}: WithCreateAnalyticsEventProps) => {
  const document = useRendererContent(initialDocument);
  let providers = {
    mentionProvider,
    emojiProvider,
    mediaProvider,
    extensionProvider,
  };
  const providerFactory = useCreateProviderFactory(providers, rendererBridge);
  const rendererContext = useRendererContext(rendererBridge);
  const headingAnchorLinksConfig = useHeadingLinks(allowHeadingAnchorLinks);
  const annotationProvider = useAnnotation(allowAnnotations);
  const innerRef = useRef<HTMLDivElement>(null);

  useRendererReady(innerRef);
  useRendererDestroyed();
  useRendererReflowDetected(rendererBridge);

  useEffect(() => {
    const setTheme = async () => await setGlobalTheme({ colorMode: 'auto' });
    if (getEnableTokenThemes()) {
      setTheme();
    }
  }, []);

  return (
    <ReactRenderer
      innerRef={innerRef}
      adfStage="stage0"
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
        allowCaptions: getAllowCaptions(),
      }}
      allowHeadingAnchorLinks={headingAnchorLinksConfig}
      rendererContext={rendererContext}
      eventHandlers={eventHandlers}
      useSpecBasedValidator={true}
      allowCustomPanels={allowCustomPanels}
    />
  );
};

const withSmartCard =
  <P extends BasicRendererProps>(
    Component: React.ComponentType<P>,
  ): React.FC<P & WithSmartCardClientProps> =>
  ({ cardClient: smartCardClient, ...props }: WithSmartCardClientProps) => {
    // Temporarily opting out of the default oauth2 flow for phase 1 of Smart Links
    // See https://product-fabric.atlassian.net/browse/FM-2149 for details.
    const authFlow = 'disabled';
    const renderCallback = useCallback(
      (createAnalyticsEvent) => (
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

const withFabricAnalytics =
  <P extends MobileRendererProps>(
    Component: React.ComponentType<P>,
  ): React.FC<MobileRendererProps> =>
  (props: MobileRendererProps) => {
    return (
      <FabricAnalyticsListeners client={rendererAnalyticsClient}>
        <Component {...(props as P)} />
      </FabricAnalyticsListeners>
    );
  };

const ThemedBasicRenderer = getEnableTokenThemes()
  ? BasicRenderer
  : withSystemTheme(BasicRenderer, getEnableLightDarkTheming());

const MobileRenderer = withFabricAnalytics(withSmartCard(ThemedBasicRenderer));

export { MobileRenderer };

export default withIntlProvider(injectIntl(MobileRenderer), geti18NMessages);
