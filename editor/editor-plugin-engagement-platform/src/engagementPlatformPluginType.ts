import type { ComponentType, PropsWithChildren, ReactNode } from 'react';

import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { EngagementPlatformPmPluginState } from './pmPlugins/engagementPlatformPmPlugin/types';

export type EngagementPlatformPlugin = NextEditorPlugin<
	'engagementPlatform',
	{
		actions: {
			/**
			 * Start an Engagement Platform external message with given ID and optional variation ID.
			 *
			 * This API action requires the `coordinationClient` to be provided in the plugin configuration.
			 *
			 * WARNING: Don't forget to STOP
			 *
			 * You must call {@link stopMessage} when your message has finished being displayed to a user.
			 * If you do not call {@link stopMessage}, your message will prevent the user from seeing any other
			 * messages until the Expiry time for the message is reached.
			 *
			 * @see https://developer.atlassian.com/platform/personalization/engagement/guides/external/create-external-message/#using-the-lower-level-react-class-directly---coordinationclient
			 */
			startMessage: (messageId: string, variationId?: string) => Promise<boolean>;
			/**
			 * Stop an Engagement Platform external message with given ID.
			 *
			 * This API action requires the `coordinationClient` to be provided in the plugin configuration.
			 *
			 * @see https://developer.atlassian.com/platform/personalization/engagement/guides/external/create-external-message/#using-the-lower-level-react-class-directly---coordinationclient
			 */
			stopMessage: (messageId: string) => Promise<boolean>;
		};
		pluginConfiguration: EngagementPlatformPluginConfig;
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		sharedState: EngagementPlatformPluginState;
	}
>;

/**
 * Engagement Platform coordination client.
 *
 * This type should be the same as the `CoordinationClientType`
 * from the `@atlassiansox/engagekit-ts` package.
 */
export interface CoordinationClient {
	start(messageId: string, variationId?: string): Promise<boolean>;
	stop(messageId: string): Promise<boolean>;
}

export type EngagementPlatformPluginConfig = {
	epComponents: EpComponents;
	epHooks: EpHooks;
	/**
	 * Engagement Platform API client.
	 *
	 * This client is used to start and stop external messages in the Engagement Platform.
	 * It should be provided by a product.
	 *
	 * Without this client the next Engagement Platform plugin api calls will not work:
	 * - `startMessage`
	 * - `stopMessage`
	 * - `getMessageActivities`
	 * - `isMessageActive`
	 *
	 * The client lives in the `@atlassiansox/engagekit-ts` package.
	 */
	coordinationClient: CoordinationClient;
};

export type EpComponents = {
	EngagementProvider: ComponentType<PropsWithChildren<{}>>;
	EngagementSpotlight: ComponentType<{ engagementId: string }>;
	EngagementInlineDialog: ComponentType<PropsWithChildren<{ engagementId: string }>>;
	Coordination: ComponentType<
		PropsWithChildren<{ client: CoordinationClient; messageId: string; fallback: ReactNode }>
	>;
};

export type EpHooks = {
	useCoordination: (
		client: CoordinationClient,
		messageId: string,
	) => [boolean, (force?: boolean) => Promise<void>];
};

/** Shared state of the Engagement Platform plugin. */
export type EngagementPlatformPluginState = EngagementPlatformPmPluginState | undefined;
