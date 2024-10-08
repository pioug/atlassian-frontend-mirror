import type { PropsWithChildren, ReactNode } from 'react';

import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type EngagementPlatformPlugin = NextEditorPlugin<
	'engagementPlatform',
	{
		pluginConfiguration: EngagementPlatformPluginOptions;
		dependencies: [];
		sharedState: EngagementPlatformPluginState;
	}
>;

export interface CoordinationClient {
	start(messageId: string, variationId?: string): Promise<boolean>;
	stop(messageId: string): Promise<boolean>;
}

export type EngagementPlatformPluginOptions = {
	epComponents: EpComponents;
	epHooks: EpHooks;
	coordinationClient: CoordinationClient;
};

export type EpComponents = {
	EngagementProvider: React.ComponentType<PropsWithChildren<{}>>;
	EngagementSpotlight: React.ComponentType<{ engagementId: string }>;
	EngagementInlineDialog: React.ComponentType<PropsWithChildren<{ engagementId: string }>>;
	Coordination: React.ComponentType<
		PropsWithChildren<{ client: CoordinationClient; messageId: string; fallback: ReactNode }>
	>;
};

export type EpHooks = {
	useCoordination: (
		client: CoordinationClient,
		messageId: string,
	) => [boolean, (force?: boolean) => Promise<void>];
};

export type EngagementPlatformPluginState =
	| {
			epComponents: EpComponents;
			epHooks: EpHooks;
			coordinationClient: CoordinationClient;
	  }
	| undefined;
