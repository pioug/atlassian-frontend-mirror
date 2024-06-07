import React from 'react';

import { type Identifier, type MediaClient, type MediaClientConfig } from '@atlaskit/media-client';

import { MediaClientContext, MediaClientProvider } from './MediaClientProvider';

export interface WithMediaClientConfig {
	mediaClientConfig: MediaClientConfig;
}

export interface WithMediaClient {
	mediaClient: MediaClient;
	identifier?: Identifier;
}

export type WithMediaClientConfigProps<P extends WithMediaClient> = Omit<P, 'mediaClient'> &
	WithMediaClientConfig;

export type WithMediaClientFunction = <P extends WithMediaClient>(
	Component: React.ComponentType<P>,
) => React.ComponentType<WithMediaClientConfigProps<P>>;

export const withMediaClient: WithMediaClientFunction =
	<P extends WithMediaClient>(Component: React.ComponentType<P>) =>
	({ mediaClientConfig, ...otherProps }: WithMediaClientConfigProps<P>) => (
		<MediaClientContext.Consumer>
			{(value) =>
				value ? (
					<Component {...(otherProps as any)} mediaClient={value} />
				) : (
					<MediaClientProvider clientConfig={mediaClientConfig}>
						<MediaClientContext.Consumer>
							{(client) => <Component {...(otherProps as any)} mediaClient={client} />}
						</MediaClientContext.Consumer>
					</MediaClientProvider>
				)
			}
		</MediaClientContext.Consumer>
	);
