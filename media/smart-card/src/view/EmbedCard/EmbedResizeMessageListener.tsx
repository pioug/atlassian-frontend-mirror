import React from 'react';

import { embedHeaderHeight } from '@atlaskit/media-ui/embeds';

interface Props {
  embedIframeRef: React.RefObject<HTMLIFrameElement>;
  onHeightUpdate: (height: number) => void;
}

interface State {}

export class EmbedResizeMessageListener extends React.Component<Props, State> {
  componentDidMount() {
    window.addEventListener('message', this.messageCallback);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageCallback);
  }

  private messageCallback = (event: MessageEvent) => {
    const { embedIframeRef } = this.props;

    const isFromExpectedIframe =
      embedIframeRef.current &&
      event.source === embedIframeRef.current.contentWindow;
    const isStringData = typeof event.data === 'string';

    if (isFromExpectedIframe && isStringData) {
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
