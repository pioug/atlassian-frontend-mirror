import React, { useContext, useMemo } from 'react';

import { type MediaClient, type MediaClientConfig } from '@atlaskit/media-client';

import { getMediaClient } from './getMediaClient';
import { MediaClientContext } from './MediaClientProvider';
import { MediaContext } from './MediaProvider';
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

/**
 * Injects a MediaProvider as a partent of the supplied component, regardless of whether MediaProvider or MediaClientProvider is found in the tree.
 * It also conciliates the passed mediaClientConfig and mediaSettings with the Provider settings, giving priority to the passed props.
 */
export const withMediaClientAndSettings: WithMediaClientAndParsedSettingsFunction =
	<P extends WithMediaClientAndParsedSettings>(Component: React.ComponentType<P>) =>
	({
		mediaClientConfig,
		mediaSettings,
		...otherProps
	}: WithMediaClientConfigAndSettingsProps<P>) => {
		const parsedSettings: MediaParsedSettings = useMediaParsedSettings(mediaSettings);
		const mediaProviderValue = useContext(MediaContext);
		const mediaClientValue = useContext(MediaClientContext);

		const mediaContext: {
			mediaClient: MediaClient;
			settings: MediaParsedSettings;
		} = useMemo(
			() => ({
				mediaClient:
					mediaProviderValue?.mediaClient ?? mediaClientValue ?? getMediaClient(mediaClientConfig),
				settings: {
					...mediaProviderValue?.settings,
					...parsedSettings,
				},
			}),
			[
				mediaProviderValue?.settings,
				mediaProviderValue?.mediaClient,
				parsedSettings,
				mediaClientConfig,
				mediaClientValue,
			],
		);
		return (
			<MediaContext.Provider value={mediaContext}>
				<Component
					{...(otherProps as any)}
					mediaClient={mediaContext.mediaClient}
					mediaSettings={mediaContext.settings}
				/>
			</MediaContext.Provider>
		);
	};
