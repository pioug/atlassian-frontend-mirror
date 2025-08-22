import type { ComponentType, PropsWithChildren, ReactNode } from 'react';

import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { EngagementPlatformPmPluginState } from './pm-plugins/engagementPlatformPmPlugin/types';

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
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		pluginConfiguration: EngagementPlatformPluginOptions;
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
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	start(messageId: string, variationId?: string): Promise<boolean>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	stop(messageId: string): Promise<boolean>;
}

export type EngagementPlatformPluginOptions = {
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
	epComponents: EpComponents;
	epHooks: EpHooks;
};

/**
 * @private
 * @deprecated Use {@link EngagementPlatformPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type EngagementPlatformPluginConfig = EngagementPlatformPluginOptions;

export type EpComponents = {
	Coordination: ComponentType<{
		children: JSX.Element;
		client: CoordinationClient;
		fallback: ReactNode;
		messageId: string;
	}>;
	EngagementInlineDialog: ComponentType<PropsWithChildren<{ engagementId: string }>>;
	EngagementSpotlight: ComponentType<{ engagementId: string }>;
};

export type EpHooks = {
	useCoordination: (
		client: CoordinationClient,
		messageId: string,
	) => [boolean, (force?: boolean) => Promise<void>];
};

/** Shared state of the Engagement Platform plugin. */
export type EngagementPlatformPluginState = EngagementPlatformPmPluginState | undefined;
