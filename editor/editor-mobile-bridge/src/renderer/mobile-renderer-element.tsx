/* eslint-disable no-console */
import React from 'react';
import {
  ProviderFactory,
  WithCreateAnalyticsEvent,
} from '@atlaskit/editor-common';
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
import { eventDispatcher } from './dispatcher';
import { EmojiResource } from '@atlaskit/emoji/resource';
import { ObjectKey, TaskState } from '@atlaskit/task-decision';
import { analyticsBridgeClient } from '../analytics-client';
import { createTaskDecisionProvider } from '../providers';

export interface MobileRendererProps extends RendererProps {
  cardClient: CardClient;
  document: string;
  mediaProvider: Promise<MediaProviderType>;
  mentionProvider: Promise<MentionProvider>;
  emojiProvider: Promise<EmojiResource>;
}

export interface MobileRendererState {
  /** as defined in the renderer */
  document: any;
}

const rendererBridge = ((window as any).rendererBridge = new RendererBridgeImpl());

const handleAnalyticsEvent = (
  event: GasPurePayload | GasPureScreenEventPayload,
) => {
  toNativeBridge.call('analyticsBridge', 'trackEvent', {
    event: JSON.stringify(event),
  });
};

export default class MobileRenderer extends React.Component<
  MobileRendererProps,
  MobileRendererState
> {
  private providerFactory: ProviderFactory;
  // TODO get these from native;
  private objectAri: string;
  private containerAri: string;

  private analyticsClient: AnalyticsWebClient = analyticsBridgeClient(
    handleAnalyticsEvent,
  );

  constructor(props: MobileRendererProps) {
    super(props);

    let document: any = null;
    if (props.document) {
      try {
        document = JSON.parse(props.document);
      } catch (e) {}
    }
    this.state = { document };

    const taskDecisionProvider = createTaskDecisionProvider(
      this.handleToggleTask,
    );

    this.providerFactory = ProviderFactory.create({
      mediaProvider: props.mediaProvider,
      mentionProvider: props.mentionProvider,
      taskDecisionProvider: Promise.resolve(taskDecisionProvider),
      emojiProvider: props.emojiProvider,
    });

    this.containerAri = 'MOCK-containerAri';
    this.objectAri = 'MOCK-objectAri';

    rendererBridge.containerAri = this.containerAri;
    rendererBridge.objectAri = this.objectAri;
    rendererBridge.taskDecisionProvider = taskDecisionProvider;
  }

  private handleRendererContentLoaded() {
    if (
      window &&
      !window.webkit && // don't fire on iOS
      window.requestAnimationFrame
    ) {
      window.requestAnimationFrame(() =>
        toNativeBridge.call('renderBridge', 'onContentRendered'),
      );
    }
  }

  private handleToggleTask = (key: ObjectKey, state: TaskState) => {
    toNativeBridge.call('taskDecisionBridge', 'updateTask', {
      taskId: key.localId,
      state,
    });
  };

  private onLinkClick(event: React.SyntheticEvent<HTMLElement>, url?: string) {
    // Prevent redirection within the WebView
    event.preventDefault();

    if (!url) {
      return;
    }
    // Relay the URL through the bridge for handling
    toNativeBridge.call('linkBridge', 'onLinkClick', { url });
  }

  componentDidMount() {
    eventDispatcher.on('setRendererContent', ({ content }: any) => {
      this.setState({
        document: content,
      });
    });
  }

  render() {
    try {
      // If we haven't received a document yet, don't pass null.
      // We'll get a flash of 'unsupported content'.
      // Could add a loader here if needed.
      if (!this.state.document) {
        return null;
      }
      // Temporarily opting out of the default oauth2 flow for phase 1 of Smart Links
      // See https://product-fabric.atlassian.net/browse/FM-2149 for details.
      const authFlow = 'disabled';
      const smartCardClient = this.props.cardClient;
      return (
        <FabricAnalyticsListeners client={this.analyticsClient}>
          <WithCreateAnalyticsEvent
            render={createAnalyticsEvent => (
              <SmartCardProvider client={smartCardClient} authFlow={authFlow}>
                <ReactRenderer
                  onComplete={this.handleRendererContentLoaded}
                  onError={this.handleRendererContentLoaded}
                  dataProviders={this.providerFactory}
                  appearance="mobile"
                  document={this.state.document}
                  createAnalyticsEvent={createAnalyticsEvent}
                  allowAltTextOnImages
                  rendererContext={{
                    // These will need to come from the native side.
                    objectAri: this.objectAri,
                    containerAri: this.containerAri,
                  }}
                  eventHandlers={{
                    link: {
                      onClick: this.onLinkClick,
                    },
                    media: {
                      onClick: (result: any, analyticsEvent?: any) => {
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
                      },
                    },
                    mention: {
                      onClick: (profileId: string, alias: string) => {
                        toNativeBridge.call('mentionBridge', 'onMentionClick', {
                          profileId,
                        });
                      },
                    },
                    smartCard: {
                      onClick: this.onLinkClick,
                    },
                  }}
                />
              </SmartCardProvider>
            )}
          />
        </FabricAnalyticsListeners>
      );
    } catch (ex) {
      return <pre>Invalid document</pre>;
    }
  }
}
