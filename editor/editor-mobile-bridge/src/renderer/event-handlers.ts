import { RendererProps } from '@atlaskit/renderer';
import { toNativeBridge } from './web-to-native/implementation';

const onLinkClick = (
  event: React.SyntheticEvent<HTMLElement>,
  url?: string,
) => {
  // Prevent redirection within the WebView
  event.preventDefault();

  if (!url) {
    return;
  }
  // Relay the URL through the bridge for handling
  toNativeBridge.call('linkBridge', 'onLinkClick', { url });
};

const onMediaClick = (result: any, analyticsEvent?: any) => {
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
};

const onMentionClick = (profileId: string, alias: string) => {
  toNativeBridge.call('mentionBridge', 'onMentionClick', {
    profileId,
  });
};

export const eventHandlers: RendererProps['eventHandlers'] = {
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
};
