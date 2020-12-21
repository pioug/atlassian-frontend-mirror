import React from 'react';

import { embedHeaderHeight } from '@atlaskit/media-ui/embeds';

const EMBED_ALLOWED_DOMAINS = [
  'http://cdn.iframe.ly',
  'https://cdn.iframe.ly',
  // Our CDN domain names
  'https://iframely.staging.atl-paas.net',
  'https://iframely.prod.atl-paas.net',
];

interface Props {
  embedIframeRef: React.RefObject<HTMLIFrameElement>;
  onHeightUpdate: (height: number) => void;
}

interface State {}

export class IframelyResizeMessageListener extends React.Component<
  Props,
  State
> {
  componentDidMount() {
    window.addEventListener('message', this.messageCallback);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageCallback);
  }

  private messageCallback = (event: MessageEvent) => {
    const { embedIframeRef } = this.props;

    // Security: we should only listen to messages from specific domains.
    // See https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage.
    const isFromAllowedDomain = EMBED_ALLOWED_DOMAINS.includes(event.origin);
    // This is needed for WD/VR tests to work properly, where we load example as iframe src
    const isFromSameDomain = event.origin === window.origin;
    const isFromExpectedIframe =
      embedIframeRef.current &&
      event.source === embedIframeRef.current.contentWindow;
    const isStringData = typeof event.data === 'string';

    if (
      (isFromAllowedDomain || isFromSameDomain) &&
      isFromExpectedIframe &&
      isStringData
    ) {
      try {
        const data = JSON.parse(event.data);
        if (data.method === 'resize' && typeof data.height === 'number') {
          this.onEmbedHeightChange({
            height: data.height,
          });
        }
      } catch (e) {}
    }
  };

  private onEmbedHeightChange = (data: { height: number }) => {
    const { onHeightUpdate } = this.props;

    const height = data.height + embedHeaderHeight;

    onHeightUpdate(height);
  };

  render() {
    return this.props.children;
  }
}
