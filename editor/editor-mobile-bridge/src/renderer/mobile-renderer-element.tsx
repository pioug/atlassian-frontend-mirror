/* eslint-disable no-console */
import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import {
  ProviderFactory,
  WithCreateAnalyticsEvent,
  AnnotationProviders,
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
} from '@atlaskit/editor-common';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { MentionProvider } from '@atlaskit/mention/types';
import { MediaProvider as MediaProviderType } from '@atlaskit/editor-common/provider-factory';
import {
  AnnotationMarkStates,
  AnnotationTypes,
  AnnotationId,
} from '@atlaskit/adf-schema';
import {
  ReactRenderer,
  RendererProps,
  AnnotationContext,
} from '@atlaskit/renderer';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import {
  GasPurePayload,
  GasPureScreenEventPayload,
} from '@atlaskit/analytics-gas-types';

import { AnnotationStatePayload } from './native-to-web/bridge';
import RendererBridgeImpl from './native-to-web/implementation';
import {
  toNativeBridge,
  nativeBridgeAPI,
} from './web-to-native/implementation';
import {
  Provider as SmartCardProvider,
  Client as CardClient,
} from '@atlaskit/smart-card';
import { eventDispatcher } from './dispatcher';
import { EmojiResource } from '@atlaskit/emoji/resource';
import { ObjectKey, TaskState } from '@atlaskit/task-decision';
import { analyticsBridgeClient } from '../analytics-client';
import { createTaskDecisionProvider } from '../providers';
import {
  getDisableActionsValue,
  getDisableMediaLinkingValue,
} from '../query-param-reader';

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
  providerFactory: ProviderFactory;
  allowAnnotations: boolean;
  objectAri: string;
  containerAri: string;
  document: object;
};

interface WithCreateAnalyticsEventProps extends BasicRendererProps {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
  annotationProvider: AnnotationProviders<AnnotationMarkStates> | null;
}

const BasicRenderer: React.FC<WithCreateAnalyticsEventProps> = ({
  objectAri,
  containerAri,
  createAnalyticsEvent,
  annotationProvider,
  providerFactory,
  allowAnnotations,
  document,
}: WithCreateAnalyticsEventProps) => {
  const disableActions = getDisableActionsValue();
  const disableMediaLinking = getDisableMediaLinkingValue();
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
      rendererContext={{
        // These will need to come from the native side.
        objectAri,
        containerAri,
      }}
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
  );
};

const useUpdateEmitter = () =>
  React.useMemo(() => new AnnotationUpdateEmitter(), []);

const useAnnotationProvider = (updateEmitter: AnnotationUpdateEmitter) => {
  return React.useMemo(
    () => ({
      getState: async (annotationIds: AnnotationId[]) => {
        nativeBridgeAPI.fetchAnnotationStates([
          {
            annotationIds,
            annotationType: AnnotationTypes.INLINE_COMMENT,
          },
        ]);

        return annotationIds.map(id => {
          return {
            id,
            annotationType: AnnotationTypes.INLINE_COMMENT,
            state: null,
          };
        });
      },
      updateSubscriber: updateEmitter,
    }),
    [updateEmitter],
  );
};

const withAnnotations = <P extends BasicRendererProps>(
  Component: React.ComponentType<P>,
): React.FC<P> => (props: P) => {
  const { allowAnnotations } = props;

  if (!allowAnnotations) {
    return <Component {...(props as P)} />;
  }
  const updateEmitter = useUpdateEmitter();
  const annotationProvider = {
    inlineComment: useAnnotationProvider(updateEmitter),
  };
  const onAnnotationClick = useCallback((ids?: AnnotationId[]) => {
    const obj = ids
      ? [
          {
            annotationIds: ids,
            annotationType: AnnotationTypes.INLINE_COMMENT,
          },
        ]
      : undefined;
    nativeBridgeAPI.onAnnotationClick(obj);
  }, []);

  useEffect(() => {
    const setAnnotationStateCallback = (payload: AnnotationStatePayload[]) => {
      const data = payload.reduce<{
        [AnnotationId: string]: AnnotationMarkStates;
      }>((acc, value) => {
        acc[value.annotationId] = value.annotationState;

        return acc;
      }, {});

      updateEmitter.emit(AnnotationUpdateEvent.SET_ANNOTATION_STATE, data);
    };
    const setAnnotationFocusCallback = (payload: {
      annotationId: AnnotationId;
    }) => {
      updateEmitter.emit(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, payload);
    };
    const removeAnnotationFocusCallback = () => {
      updateEmitter.emit(AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS);
    };

    eventDispatcher.on(
      AnnotationUpdateEvent.SET_ANNOTATION_STATE,
      setAnnotationStateCallback,
    );
    eventDispatcher.on(
      AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
      setAnnotationFocusCallback,
    );
    eventDispatcher.on(
      AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
      removeAnnotationFocusCallback,
    );

    return () => {
      eventDispatcher.off(
        AnnotationUpdateEvent.SET_ANNOTATION_STATE,
        setAnnotationStateCallback,
      );
      eventDispatcher.off(
        AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
        setAnnotationFocusCallback,
      );
      eventDispatcher.off(
        AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
        removeAnnotationFocusCallback,
      );
    };
  }, [updateEmitter]);

  return (
    <AnnotationContext.Provider
      value={{
        onAnnotationClick,
        enableAutoHighlight: false,
        updateSubscriber: updateEmitter,
      }}
    >
      <Component {...(props as P)} annotationProvider={annotationProvider} />
    </AnnotationContext.Provider>
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

const withFabricAnalytics = <P extends BasicRendererProps>(
  Component: React.ComponentType<P>,
): React.FC<BasicRendererProps> => (props: BasicRendererProps) => {
  return (
    <FabricAnalyticsListeners client={analyticsClient}>
      <Component {...(props as P)} />
    </FabricAnalyticsListeners>
  );
};

const withMobileBridge = (
  Component: React.ComponentType<BasicRendererProps>,
): React.FC<MobileRendererProps> => (props: MobileRendererProps) => {
  const [document, setDocument] = React.useState(() => {
    try {
      return JSON.parse(props.document);
    } catch (e) {}
  });

  const receiveDocumentFromBridge = useCallback(({ content }: any) => {
    if (typeof content === 'string') {
      try {
        setDocument(JSON.parse(content));
      } catch (e) {
        console.error(e);
      }
    } else {
      setDocument(content);
    }
  }, []);

  useLayoutEffect(() => {
    eventDispatcher.on('setRendererContent', receiveDocumentFromBridge);

    return () => {
      eventDispatcher.off('setRendererContent', receiveDocumentFromBridge);
    };
  }, [receiveDocumentFromBridge]);
  const handleToggleTask = useCallback((key: ObjectKey, state: TaskState) => {
    toNativeBridge.call('taskDecisionBridge', 'updateTask', {
      taskId: key.localId,
      state,
    });
  }, []);

  const taskDecisionProvider = createTaskDecisionProvider(handleToggleTask);
  const providerFactory = ProviderFactory.create({
    mediaProvider: props.mediaProvider,
    mentionProvider: props.mentionProvider,
    taskDecisionProvider: Promise.resolve(taskDecisionProvider),
    emojiProvider: props.emojiProvider,
  });
  const allowAnnotations = Boolean(props.allowAnnotations);
  const cardClient = props.cardClient;
  const containerAri = 'MOCK-containerAri';
  const objectAri = 'MOCK-objectAri';

  rendererBridge.containerAri = containerAri;
  rendererBridge.objectAri = objectAri;
  rendererBridge.taskDecisionProvider = taskDecisionProvider;

  if (!document) {
    return null;
  }

  const params = {
    providerFactory,
    allowAnnotations,
    objectAri,
    containerAri,
    document,
    cardClient,
  };

  return <Component {...params} />;
};

const MobileRenderer = withMobileBridge(
  withFabricAnalytics(withSmartCard(withAnnotations(BasicRenderer))),
);

export default MobileRenderer;
