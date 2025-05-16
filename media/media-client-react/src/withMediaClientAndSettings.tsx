import React from 'react';

import { type MediaClient, type MediaClientConfig } from '@atlaskit/media-client';

import { MediaClientContext } from './MediaClientProvider';
import { MediaContext, MediaProvider } from './MediaProvider';
import {
	type MediaParsedSettings,
	type MediaSettings,
	useMediaParsedSettings,
} from './mediaSettings';

export interface WithMediaClientConfigAndSettings {
	mediaClientConfig: MediaClientConfig;
	mediaSettings?: MediaSettings;
}

export interface WithMediaClientAndParsedSettings {
	mediaClient: MediaClient;
	mediaSettings?: MediaParsedSettings;
}

export type WithMediaClientConfigAndSettingsProps<P extends WithMediaClientAndParsedSettings> =
	Omit<P, 'mediaClient'> & WithMediaClientConfigAndSettings;

export type WithMediaClientAndParsedSettingsFunction = <P extends WithMediaClientAndParsedSettings>(
	Component: React.ComponentType<P>,
) => React.ComponentType<WithMediaClientConfigAndSettingsProps<P>>;

interface MediaContextConsumerProps<P extends WithMediaClientAndParsedSettings> {
	Component: React.ComponentType<P>;
	otherProps: any;
	mediaSettings?: MediaParsedSettings;
}

const MediaContextConsumer = <P extends WithMediaClientAndParsedSettings>({
	Component,
	otherProps,
}: MediaContextConsumerProps<P>) => (
	<MediaContext.Consumer>
		{(mediaProviderValue) => (
			<Component
				{...otherProps}
				mediaClient={mediaProviderValue?.mediaClient}
				mediaSettings={mediaProviderValue?.settings}
			/>
		)}
	</MediaContext.Consumer>
);

/**
 * Injects a MediaProvider as a partent of the supplied component, if no MediaProvider or MediaClientProvider is found in the tree.
 * It also conciliates the passed mediaClientConfig and mediaSettings with the Provider settings, giving priority to the passed props.
 */
export const withMediaClientAndSettings: WithMediaClientAndParsedSettingsFunction =
	<P extends WithMediaClientAndParsedSettings>(Component: React.ComponentType<P>) =>
	({
		mediaClientConfig,
		mediaSettings,
		...otherProps
	}: WithMediaClientConfigAndSettingsProps<P>) => {
		const parsedSettings = useMediaParsedSettings(mediaSettings);

		return (
			<MediaContext.Consumer>
				{(outterMediaProviderValue) => {
					// If there is a MediaProvider up in the tree, use the top mediaClient and merge settings
					if (outterMediaProviderValue) {
						const mergedParsedSettings = {
							...outterMediaProviderValue.settings,
							...parsedSettings,
						};
						return (
							<MediaContext.Provider
								value={{
									mediaClient: outterMediaProviderValue.mediaClient,
									settings: mergedParsedSettings,
								}}
							>
								<MediaContextConsumer Component={Component} otherProps={otherProps} />
							</MediaContext.Provider>
						);
					}
					// Otherwise, check if there is a MediaClientProvider up in the tree
					return (
						<MediaClientContext.Consumer>
							{(mediaClientProviderValue) =>
								// If there is a MediaClientProvider, we reinject the mediaClient and mediaSettings into a new MediaProvider
								mediaClientProviderValue ? (
									<MediaContext.Provider
										value={{
											mediaClient: mediaClientProviderValue,
											settings: parsedSettings,
										}}
									>
										<MediaContextConsumer Component={Component} otherProps={otherProps} />
									</MediaContext.Provider>
								) : (
									// If no poviders found, we mount a MediaProvider and inject the given props mediaClientConfig and mediaSettings
									<MediaProvider
										mediaClientConfig={mediaClientConfig}
										mediaSettings={mediaSettings}
									>
										<MediaContextConsumer Component={Component} otherProps={otherProps} />
									</MediaProvider>
								)
							}
						</MediaClientContext.Consumer>
					);
				}}
			</MediaContext.Consumer>
		);
	};
