import React from 'react';
import { type BrowserProps } from './browser';
import { type WithMediaClientConfigProps } from '@atlaskit/media-client-react';
import { type BrowserConfig } from '../../types';

type BrowserWithMediaClientConfigProps = WithMediaClientConfigProps<
	// BrowserBase defines config default value, which modifies final shape of BrowserBase component.
	// Specifically this changes one of the props - config, it makes it an optional property.
	// We want BrowserWithMediaClientConfigProps to match this modified props of BrowserBase here.
	Omit<BrowserProps, 'config'> & {
		config?: BrowserConfig;
	}
>;

type BrowserWithMediaClientConfigComponent = React.ComponentType<BrowserWithMediaClientConfigProps>;

type State = {
	Browser?: BrowserWithMediaClientConfigComponent;
};

export class BrowserLoader extends React.PureComponent<BrowserWithMediaClientConfigProps, State> {
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
					/* webpackChunkName: "@atlaskit-internal_media-client-react" */ '@atlaskit/media-client-react'
				),
				import(/* webpackChunkName: "@atlaskit-internal_media-browser" */ './browser'),
			]);

			// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
			BrowserLoader.Browser = mediaClient.withMediaClient(browserModule.Browser);

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
