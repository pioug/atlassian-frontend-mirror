import React, { useContext, useMemo } from 'react';

import { type Identifier, type MediaClient, type MediaClientConfig } from '@atlaskit/media-client';
import { fg } from '@atlaskit/platform-feature-flags';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';

import { getMediaClient } from './getMediaClient';
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

export const withMediaClient: WithMediaClientFunction = <P extends WithMediaClient>(
	Component: React.ComponentType<P>,
) =>
	componentWithCondition(
		() => fg('media-perf-uplift-mutation-fix'),
		({ mediaClientConfig, ...otherProps }: WithMediaClientConfigProps<P>) => {
			const existingMediaClient = useContext(MediaClientContext);
			const mediaClient = useMemo(
				() => existingMediaClient ?? getMediaClient(mediaClientConfig),
				[mediaClientConfig, existingMediaClient],
			);
			return (
				<MediaClientContext.Provider value={mediaClient}>
					<Component {...(otherProps as any)} mediaClient={mediaClient} />
				</MediaClientContext.Provider>
			);
		},
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
		),
	) as unknown as React.ComponentType<WithMediaClientConfigProps<P>>;
