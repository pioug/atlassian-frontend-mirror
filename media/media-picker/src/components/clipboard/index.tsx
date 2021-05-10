import React from 'react';
import { ClipboardProps } from './clipboard';
import { ClipboardConfig } from '../../types';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';

type ClipboardWithMediaClientConfigProps = WithMediaClientConfigProps<
  // ClipboardBase defines config default value, which modifies final shape of ClipboardBase component.
  // Specifically this changes one of the props - config, it makes it an optional property.
  // We want ClipboardWithMediaClientConfigProps to match this modified props of ClipboardBase here.
  Omit<ClipboardProps, 'config'> & {
    config?: ClipboardConfig;
  }
>;
type ClipboardWithMediaClientConfigComponent = React.ComponentType<
  ClipboardWithMediaClientConfigProps
>;

type State = {
  Clipboard?: ClipboardWithMediaClientConfigComponent;
};

export class ClipboardLoader extends React.PureComponent<
  ClipboardWithMediaClientConfigProps,
  State
> {
  static displayName = 'AsyncClipboard';
  static Clipboard?: ClipboardWithMediaClientConfigComponent;

  state = {
    Clipboard: ClipboardLoader.Clipboard,
  };

  async UNSAFE_componentWillMount() {
    if (!this.state.Clipboard) {
      const [mediaClient, clipboardModule] = await Promise.all([
        import(
          /* webpackChunkName: "@atlaskit-internal_media-client" */ '@atlaskit/media-client'
        ),
        import(
          /* webpackChunkName: "@atlaskit-internal_media-clipboard" */ './clipboard'
        ),
      ]);

      ClipboardLoader.Clipboard = mediaClient.withMediaClient(
        clipboardModule.Clipboard,
        this.props.featureFlags,
      );

      this.setState({
        Clipboard: ClipboardLoader.Clipboard,
      });
    }
  }

  render() {
    if (!this.state.Clipboard) {
      return null;
    }

    return <this.state.Clipboard {...this.props} />;
  }
}
