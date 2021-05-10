import React from 'react';
import { BrowserProps } from './browser';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';
import { BrowserConfig } from '../../types';

type BrowserWithMediaClientConfigProps = WithMediaClientConfigProps<
  // BrowserBase defines config default value, which modifies final shape of BrowserBase component.
  // Specifically this changes one of the props - config, it makes it an optional property.
  // We want BrowserWithMediaClientConfigProps to match this modified props of BrowserBase here.
  Omit<BrowserProps, 'config'> & {
    config?: BrowserConfig;
  }
>;

type BrowserWithMediaClientConfigComponent = React.ComponentType<
  BrowserWithMediaClientConfigProps
>;

type State = {
  Browser?: BrowserWithMediaClientConfigComponent;
};

export class BrowserLoader extends React.PureComponent<
  BrowserWithMediaClientConfigProps,
  State
> {
  private mounted: boolean = false;
  static displayName = 'AsyncBrowser';
  static Browser?: BrowserWithMediaClientConfigComponent;

  state = {
    Browser: BrowserLoader.Browser,
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async UNSAFE_componentWillMount() {
    if (!this.state.Browser) {
      const [mediaClient, browserModule] = await Promise.all([
        import(
          /* webpackChunkName: "@atlaskit-internal_media-client" */ '@atlaskit/media-client'
        ),
        import(
          /* webpackChunkName: "@atlaskit-internal_media-browser" */ './browser'
        ),
      ]);

      BrowserLoader.Browser = mediaClient.withMediaClient(
        browserModule.Browser,
        this.props.featureFlags,
      );

      if (this.mounted) {
        this.setState({
          Browser: BrowserLoader.Browser,
        });
      }
    }
  }

  render() {
    if (!this.state.Browser) {
      return null;
    }

    return <this.state.Browser {...this.props} />;
  }
}
